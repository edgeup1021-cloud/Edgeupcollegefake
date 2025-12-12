from celery import shared_task
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from .models.user_management import Admins, AiErrorLogs
from .models.question_management import QuestionGenerationRequests
from .models.assessment_models import LiveMcqQuestions, LiveDescriptiveQuestions
from .services.knowledge_update import KnowledgeUpdateService
import requests
from .services.image_questions import generate_image_based_questions
from .config import Config
from .services.services import plag_check
from .utils.loggers import setup_logger
from django.core.cache import cache
from .utils.helpers import *
import uuid
import os
from django.db import connection
import redis
from .services.passage_based import generate_image_passage,generate_text_passage
import io
from PyPDF2 import PdfReader
from .serializers import  QuestionMetadata, ProcessingContext
from django.db import transaction
from .services.orchester import orchestration


REDIS_TIMEOUT = Config.REDIS_TIMEOUT
BATCH_SIZE = Config.BATCH_SIZE

logger = setup_logger("django_logger")


@shared_task
def health_check():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            if cursor.fetchone()[0] == 1:
                logger.info(" DB connection successful.")
    except Exception as e:
        logger.error(f"DB connection failed: {e}")

    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        r = redis.Redis.from_url(redis_url)
        if r.ping():
            logger.info("Redis connection successful.")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

@shared_task
def fetch_payload():
    """Main task for processing question generation requests."""
    request = None
    try:
        # Get pending request
        with transaction.atomic():
            request = (
                QuestionGenerationRequests.objects.select_for_update(skip_locked=True)
                .filter(status="pending")
                .first()
            )
            if not request:
                return

            request.status = "processing"
            request.updated_at = get_current_timestamp()
            request.save()

        payload = request.backend_request
        logger.info(f"Processing request: {request.id}")

        # Build context and metadata
        context = build_context_from_request(request, payload)
        metadata = build_metadata_from_payload(payload)

        # Process PDF if provided
        source = payload["exam_params"].get("source")
        if source:
            pdf_text = extract_pdf_text(
                source.get("link",""), 
                source.get("start_page"), 
                source.get("end_page")
            )
            metadata.pdf_content = pdf_text

        # Get routing information
        routing_info = VectorRouting.objects.filter(
            subject_id=metadata.subject_id
            # priority and vlp_tag filters removed - not needed for college system
        ).values_list("source_kb", "route_id").first()

        if routing_info:
            source_kb, route_id = routing_info
            metadata.source_type = determine_source_type(source_kb)
            metadata.route_id = route_id

        logger.info(f"Metadata prepared: {metadata}")
        is_passage_based = False


        question_type = payload["exam_params"]["question_type"].lower()
        total_questions = payload["exam_params"]["number_of_questions"] - request.generated_question_count
        subtopics = metadata.subtopic or [""]

        if question_type == "mcq":
            details = VQuestionTypes.objects.get(type=int(metadata.mcq_type)).details
            if "passage" in details:
                is_passage_based = True

        # ✅ Even split with remainder distribution
        base = total_questions // len(subtopics)
        remainder = total_questions % len(subtopics)

        logger.info(
            f"Splitting {total_questions} questions across {len(subtopics)} subtopics "
            f"({base} each, plus {remainder} remainder)"
        )

        for idx, subtopic in enumerate(subtopics):
            # Give an extra question to the first `remainder` subtopics
            subtopic_target = base + (1 if idx < remainder else 0)

            logger.info(f"Processing subtopic: {subtopic or '(none)'} with target {subtopic_target}")
            subtopic_remaining = subtopic_target

            while subtopic_remaining > 0:
                batch_size = min(BATCH_SIZE, subtopic_remaining)
                logger.info(f"➡ Generating {batch_size} questions for subtopic '{subtopic}'")

                metadata.current_subtopic = None if subtopic == "" else subtopic
                if is_passage_based:
                    if metadata.type == "image":
                       batch_questions = generate_image_passage(question_type=question_type,
                            metadata=metadata.__dict__,
                            total_questions=batch_size)
                       
                    elif metadata.type == "text":
                        batch_questions = generate_text_passage(question_type=question_type,
                            metadata=metadata.__dict__,
                            total_questions=batch_size)
                else:

                    if metadata.type == "image":
                        batch_questions = generate_image_based_questions(
                            question_type=question_type,
                            metadata=metadata.__dict__,
                            total_questions=batch_size
                        )
                    else:
                        batch_questions = orchestration(
                            question_type=question_type,
                            metadata=metadata.__dict__,
                            total_questions=batch_size,
                            request_id=request.id
                        )

                formatted_questions = format_questions_as_html(batch_questions)

                cache.set(
                    context.request_id,
                    {
                        "questions": formatted_questions,
                        "subject_name": metadata.subject_name,
                        "live_exam_id": metadata.live_exam_id,
                        "subject_id": metadata.subject_id,
                        "subtopic": subtopic,
                    },
                    timeout=REDIS_TIMEOUT,
                )

                similarity_check(
                    request_id=context.request_id,
                    total_questions=batch_size,
                    question_type=question_type,
                    metadata=metadata,
                    context=context,
                    request=request,
                )

                subtopic_remaining -= batch_size
                logger.info(
                    f"Generated {batch_size} questions for subtopic '{subtopic}'. "
                    f"Remaining: {subtopic_remaining}"
                )

        # Final status update
        final_status = "COMPLETED" if request.generated_question_count >= total_questions else "PENDING"
        update_request_status(request, final_status)
        logger.info(f"Request {request.id} completed with {request.generated_question_count} questions")

    except Exception as e:
        error_msg = f"Error generating questions: {str(e)}"
        logger.error(error_msg)
        
        if request:
            log_error_and_update_status(request, error_msg)
            
            # Log error details
            AiErrorLogs.objects.create(
                id=uuid.uuid4(),
                request_id=request.id if request else None,
                type="MCQ_QUESTIONS" if 'question_type' in locals() and question_type == "mcq" else "DESCRIPTIVE_QUESTIONS",
                response=str(e),
                created_at=get_current_timestamp(),
                updated_at=get_current_timestamp()
            )

@shared_task
def create_knowledge_base():
    """Task for creating knowledge base from learning content."""
    request = None
    try:
        # Get pending learning content
        with transaction.atomic():
            request = LearningContent.objects.select_for_update(skip_locked=True).filter(
                process_status="pending",
                file_mime_type='application/pdf'
            ).first()
            if not request:
                return

            request.process_status = "processing"
            request.save()

        # Get related data
        subject = Subjects.objects.filter(id=request.subject_id).first()
        if not subject:
            raise ValueError(f"Subject with id {request.subject_id} not found.")

        course = Exams.objects.filter(id=request.course_id).first()
         

        logger.info(f"Processing knowledge base for subject: {subject.name}")

        # Process PDF
        service = KnowledgeUpdateService()
        results = service.process_pdf(
            pdf_file=request.file_path,
            subject_id=request.subject_id,
            subject=subject.name.upper(),
            Course_type=course.name if course else "college"
            # Vendor and VLP/priority flags removed - not needed for college system
        )

        if results:
            update_request_status(request, "completed")
            logger.info(f"Knowledge base created successfully for subject {subject.name}")
        else:
            update_request_status(request, "pending")
            logger.error(f"Failed to create knowledge base for subject {subject.name}")

    except Exception as e:
        error_msg = f"Error creating knowledge base: {str(e)}"
        logger.error(error_msg)
        
        if request:
            log_error_and_update_status(request, error_msg)

