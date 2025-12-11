from typing import Dict, List, Optional, Tuple, Any
from sentence_transformers import SentenceTransformer, util
from ..config import Config
from ..models.question_management import QuestionGenerationRequests
from django.utils import timezone
from django.db import transaction
import requests
import io
from PyPDF2 import PdfReader
from ..models.assessment_models import LiveDescriptiveQuestions, LiveMcqQuestions, QuestionComprehensions
from ..serializers import ProcessingContext, QuestionMetadata
import uuid
from ..services.services import plag_check
from django.core.cache import cache
from ..services.orchester import orchestration
from .loggers import setup_logger
import json
SIMILAR_MODEL = Config.SIMILAR_MODEL
model = SentenceTransformer(SIMILAR_MODEL)
SIMILARITY_THRESHOLD = Config.SIMILARITY_THRESHOLD
REDIS_TIMEOUT = Config.REDIS_TIMEOUT

logger = setup_logger("django_logger")
def encode(text: str | List[str]) -> Any:
    """Encode text using the sentence transformer model."""
    return model.encode(text)

def get_current_timestamp():
    """Get current timestamp for consistent usage."""
    return timezone.now()

def update_request_status(request: QuestionGenerationRequests, status: str):
    """Update request status with timestamp."""
    with transaction.atomic():
        request.status = status
        request.updated_at = get_current_timestamp()
        request.save()

def log_error_and_update_status(request: QuestionGenerationRequests, error: str, status: str = "ERROR"):
    """Log error and update request status."""
    logger.error(f"Error in request {request.id}: {error}")
    if "Invalid \\escape: line" in error:
        status = "PENDING"
    update_request_status(request, status)

def extract_pdf_text(pdf_url: str, start_page: Optional[int] = None, end_page: Optional[int] = None) -> str:
    """Extract text from PDF with optional page range."""
    try:
        if pdf_url!="":
            response = requests.get(pdf_url, stream=True, timeout=30)
            response.raise_for_status()
            
            pdf_file = io.BytesIO(response.content)
            reader = PdfReader(pdf_file)
            pages = len(reader.pages)
            
            extracted_text = []
            for i in range(pages):
                if start_page is not None and end_page is not None:
                    if i < start_page or i > end_page:
                        continue
                extracted = reader.pages[i].extract_text()
                if extracted:
                    extracted_text.append(extracted)
            
            return "\n".join(extracted_text).strip()
        else:
            logger.info("No pdf provided")
            return ""
    except Exception as e:
        logger.error(f"Error extracting PDF text: {str(e)}")
        return ""

def determine_source_type(source_kb: bool) -> str:
    """Determine source type based on KB availability."""
    if source_kb:
        return "Offline"
    else:
        return "None"



def check_similarity(question: str, subject_id: str, exam_id: str, topic_id: str, 
                    request_id: str, question_type: str) -> bool:
    """Check if a question is similar to existing questions."""
    # Determine which model to query based on question type
    model_class = LiveMcqQuestions if question_type == "mcq" else LiveDescriptiveQuestions
    
    existing_questions = list(model_class.objects.filter(
        subject_id=subject_id,
        topic_id=topic_id,
        live_exam_id=exam_id,
        question_status="team_lead_approved"
    ).values_list('question', flat=True))

    if not existing_questions:
        return False

    logger.info(f"Checking similarity against {len(existing_questions)} existing questions")
    
    # Batch encode for better performance
    db_embeddings = encode(existing_questions)
    new_embedding = encode(question)

    # Vectorized similarity check
    similarities = util.cos_sim(new_embedding, db_embeddings)
    return (similarities > SIMILARITY_THRESHOLD).any().item()

def get_common_question_data(question: Dict, question_id: str, context: ProcessingContext,
                           metadata: QuestionMetadata) -> Dict:
    """Get common question data for college system."""
    # Extract college hierarchy from metadata if available
    college_hierarchy = metadata.college_hierarchy if metadata.college_hierarchy else None

    # Map question type to database format (max 5 chars)
    question_type_map = {
        "mcq": "mcq",
        "descriptive": "desc"
    }
    db_question_type = question_type_map.get(metadata.type.lower(), "mcq")

    return {
        "id": question_id,
        "question": question["question"],
        "status": "active",
        "question_status": "PENDING",
        "created_at": get_current_timestamp(),
        "updated_at": get_current_timestamp(),
        "question_generate_type": "AI",
        "question_type": db_question_type,
        # Subject/Topic/Subtopic Names
        "subject_name": metadata.subject_name,
        "topic_name": metadata.topic,
        "subtopic_name": metadata.subtopic if hasattr(metadata, 'subtopic') else None,
        # College hierarchy fields
        "university": college_hierarchy.university if college_hierarchy else None,
        "course": college_hierarchy.course if college_hierarchy else None,
        "department": college_hierarchy.department if college_hierarchy else None,
        "semester": college_hierarchy.semester if college_hierarchy else None,
        "paper_type": college_hierarchy.paper_type if college_hierarchy else None,
        "source_pdf": college_hierarchy.source_pdf if college_hierarchy else None,
        "page_range": college_hierarchy.page_range if college_hierarchy else None,
    }

def store_in_db(question: Dict, metadata: QuestionMetadata, context: ProcessingContext,
                request_id: str, question_type: str) -> bool:
    """Store question in database for college system."""

    # Get comprehension_id if this is a comprehension-based question
    comprehension_id = question.get("metadata", {}).get("passage_id", None)

    question_id = str(uuid.uuid4())
    common_data = get_common_question_data(question, question_id, context, metadata)

    try:
        if question_type == "mcq":
            # Get MCQ-specific data from question metadata
            mcq_data = {
                **common_data,
                "options": question.get("options", []),
                "statements": question.get("statements", []),
                "instructions": question.get("instruction", ""),
                "correct_option": question.get("correct_answer", ""),
                "explanation": question.get("explanation", ""),
                "comprehension_id": comprehension_id,
                "question_generation_request_id": request_id,
                "difficult_level": question.get("metadata", {}).get("difficult_level", "medium"),
            }
            LiveMcqQuestions.objects.create(**mcq_data)

        elif question_type == "descriptive":
            # Get descriptive-specific data
            descriptive_data = {
                **common_data,
                "correct_percentage": 60,
                "question_generation_request_id": request_id,
                "keywords": question.get("metadata", {}).get("ai_answer_keywords", []),
                "comprehension_id": comprehension_id,
                "difficult_level": question.get("metadata", {}).get("difficult_level", "medium"),
                "explanation": question.get("explanation", ""),
            }
            LiveDescriptiveQuestions.objects.create(**descriptive_data)

        logger.info(f"Successfully stored {question_type} question with ID: {question_id}")
        return True

    except Exception as e:
        logger.error(f"Error storing {question_type} question: {str(e)}")
        return False

def similarity_check(request_id: str, total_questions: int, question_type: str, 
                    metadata: QuestionMetadata, context: ProcessingContext, 
                    request: QuestionGenerationRequests) -> None:
    """Check similarity and store questions."""
    cached_data = cache.get(request_id)
    if not cached_data or not cached_data.get("questions"):
        return

    logger.info(f"Processing {len(cached_data['questions'])} questions for similarity check")
    # combined_chunk removed - no longer needed after explanation_prompt removal

    stored_count = 0
    for question in cached_data["questions"]:
        is_similar = check_similarity(
            question["question"]+"".join(question.get("statements", []))+"".join(question.get("instruction", [])),
            cached_data["subject_id"],
            cached_data["live_exam_id"],
            question["metadata"]["topic_id"],
            request_id,
            question_type=question_type
        )

        if not is_similar:
            # is_plag = plag_check(question["question"])
            # if not is_plag:
                if store_in_db(question, metadata, context, request_id, question_type):
                    stored_count += 1
                    with transaction.atomic():
                        request.generated_question_count += 1
                        request.updated_at = get_current_timestamp()
                        request.save()

    logger.info(f"Stored {stored_count} new questions. Total: {request.generated_question_count}")

    # Generate more questions if needed
    if request.generated_question_count < total_questions:
        remaining = total_questions - request.generated_question_count
        # Image question generation removed - college system doesn't support image-based questions
        # if metadata.type == "image":
        #     new_questions = generate_image_based_questions(
        #         question_type=question_type,
        #         metadata=metadata.__dict__,
        #         total_questions=remaining
        #     )
        # else:
        new_questions = orchestration(
            question_type=question_type,
            total_questions=remaining,
            metadata=metadata.__dict__,
            request_id=request_id
        )

        formatted_questions = format_questions_as_html(new_questions)
        result = {
            "questions": formatted_questions,
            "subject_name": metadata.subject_name,
            "live_exam_id": metadata.live_exam_id,
            "subject_id": metadata.subject_id,
        }
        cache.set(context.request_id, result, timeout=REDIS_TIMEOUT)

        # Recursive call for remaining questions
        similarity_check(
            request_id=context.request_id,
            total_questions=remaining,
            question_type=question_type,
            metadata=metadata,
            context=context,
            request=request
        )

def build_metadata_from_payload(payload: Dict) -> QuestionMetadata:
    """Build metadata object from payload."""
    exam_params = payload["exam_params"]
    subtopic = exam_params.get("subtopic")

    if subtopic is None:
        subtopic = []
    elif isinstance(subtopic, str):
        # Split on commas and strip whitespace
        subtopic = [s.strip() for s in subtopic.split(",") if s.strip()]
    elif isinstance(subtopic, list):
        # Ensure all items are strings and strip whitespace
        subtopic = [str(s).strip() for s in subtopic if str(s).strip()]
    else:
        # Fallback in case of unexpected type
        subtopic = [str(subtopic).strip()]
    return QuestionMetadata(
        type=exam_params["type"].lower(),
        subject_name=exam_params["subject_name"].lower(),
        subject_id=exam_params["subject_id"].lower(),
        mcq_type=str(exam_params.get("mcq_type", "")),
        user_prompt=exam_params["user_prompt"],
        topic=exam_params.get("topic", "").lower(),
        topic_id=exam_params.get("topic_id"),
        subtopic=subtopic,
        limit_source=exam_params.get("limit_source"),
        image_type=exam_params.get("image_type", ""),
        current_affairs=exam_params.get("current_affairs"),
        tag_id=exam_params.get("tag_id")
    )

def build_context_from_request(request: QuestionGenerationRequests, payload: Dict) -> ProcessingContext:
    """Build simplified processing context without role tracking."""
    return ProcessingContext(
        request_id=request.id,
        batch_id=payload['exam_params'].get("batch_id")
    )


def format_questions_as_html(batch_questions):
    for q in batch_questions:

        # Question Text in <h2>
        if "question" in q and q["question"]:
            q["question"] = f"<p>{q['question']}</p>"
        
        if "image_url" in q and q["image_url"]:
            q["question"] += f'<img src="{q["image_url"]}" alt="Question Image" style="max-width: 100%; height: auto;">'

        # Instructions in <h2>
        if "instruction" in q and q["instruction"]:
            q["instruction"] = f"<p>{q['instruction']}</p>"

        # Statements in <p>
        if "statements" in q and q["statements"]:
            for i in range(len(q["statements"])):
                q["statements"][i] = f"<p>{q['statements'][i]}</p>"
        # Join and append the question block
     

    return batch_questions