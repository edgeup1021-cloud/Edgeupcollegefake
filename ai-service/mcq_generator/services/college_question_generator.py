"""
College Question Generator Service

Main service for generating college-focused academic questions with validation.
Orchestrates question generation, validation agents, and storage.

This replaces the exam-specific generation logic with college-focused workflows.
"""
import json
import asyncio
import time
import uuid
from typing import List, Dict, Optional, Any
from asgiref.sync import sync_to_async
from ..apps import Models
from ..config import Config
from ..connections.qdrant_client import QdrantService
from ..agents.reflection_agent import reflection_agent
from ..agents.selector_agent import selector_agent, validate_question_quality
from ..utils.loggers import setup_logger
from .course_config_manager import course_config_manager
from ..monitoring.course_metrics import course_metrics
from ..utils.helpers import store_in_db
from ..serializers import QuestionMetadata, ProcessingContext, CollegeHierarchy

logger = setup_logger("college_question_generator")


class CollegeQuestionGeneratorService:
    """
    Service for generating college academic questions.

    Features:
    - MCQ generation (standard 4-option format)
    - Descriptive questions (very_short, short, long_essay)
    - Content retrieval from Qdrant with college hierarchy filters
    - Validation using reflection and selector agents
    - College metadata tracking
    """

    def __init__(self):
        self.qdrant_service = QdrantService()
        logger.info("CollegeQuestionGeneratorService initialized")

    async def generate_questions_flexible(self,
                                         subject: str,
                                         topic: str,
                                         subtopic: Optional[str] = None,
                                         num_questions: int = 3,
                                         question_type: str = "mcq",
                                         descriptive_type: Optional[str] = None,
                                         university: Optional[str] = None,
                                         course: Optional[str] = None,
                                         department: Optional[str] = None,
                                         semester: Optional[int] = None,
                                         paper_type: Optional[str] = None,
                                         difficulty: str = "MEDIUM",
                                         use_validation: bool = True,
                                         max_retries: int = 2,
                                         save_to_db: bool = True) -> Dict[str, Any]:
        """
        Main flexible question generation method.

        Args:
            subject: Subject name (e.g., "Accounting", "English Literature")
            topic: Topic name (e.g., "Financial Statements", "Shakespeare")
            subtopic: Optional subtopic for focused questions
            num_questions: Number of questions to generate
            question_type: "mcq" or "descriptive"
            descriptive_type: If descriptive, one of: "very_short", "short", "long_essay"
            university: University name (for filtering)
            course: Course code (e.g., "bcom", "ba_english")
            department: Department name
            semester: Semester number (1-6)
            paper_type: "Core" or "Elective"
            difficulty: "EASY", "MEDIUM", or "HARD"
            use_validation: Whether to use validation agents
            max_retries: Maximum retry attempts if validation fails

        Returns:
            dict with:
                - questions: List of generated questions
                - validation: Validation results (if enabled)
                - metadata: Generation metadata
                - college_hierarchy: College metadata used
        """
        start_time = time.time()

        # Load course configuration
        config = course_config_manager.get_config(course or "default")

        # Enhanced logging with course tags
        logger.info(f"[COURSE:{course or 'default'}] [SUBJECT:{subject}] [TOPIC:{topic}] "
                   f"Starting generation of {num_questions} {question_type} questions")

        # Validate subject for course (optional - can be disabled for flexibility)
        if course and config.get("subjects"):
            if not course_config_manager.validate_subject_for_course(course, subject):
                available_subjects = course_config_manager.get_available_subjects(course)
                logger.warning(f"[COURSE:{course}] Subject '{subject}' not in configured subjects. "
                             f"Available: {available_subjects}")

        # Build college metadata
        college_metadata = {
            "university": university or "unknown",
            "course": course or "unknown",
            "department": department or "unknown",
            "semester": semester if semester is not None else 0,
            "paper_type": paper_type or "unknown"
        }

        # Validate question type for course and subject
        if not course_config_manager.validate_question_type(course, subject, question_type):
            allowed_types = course_config_manager.get_allowed_question_types(course, subject)
            logger.warning(f"[COURSE:{course or 'default'}] Question type '{question_type}' not allowed for {subject}")
            raise ValueError(
                f"Question type '{question_type}' is not allowed for course '{course}', subject '{subject}'. "
                f"Allowed types: {allowed_types}"
            )

        # Get course-specific settings
        custom_prompts = config.get("custom_prompts", {})
        validation_settings = config.get("validation_settings", {})
        retrieval_settings = config.get("retrieval_settings", {})

        # Override max_retries and use_validation from course config if not explicitly set
        if max_retries == 2:  # Default value
            max_retries = validation_settings.get("max_retries", 2)
        if use_validation:
            use_validation = validation_settings.get("use_reflection", True) or validation_settings.get("use_selector", True)

        # Retrieve content from Qdrant with college filters and course-specific settings
        content = await self._retrieve_content_from_qdrant(
            subject=subject,
            topic=topic,
            subtopic=subtopic,
            university=university,
            course=course,
            semester=semester,
            max_chunks=retrieval_settings.get("max_chunks", 20)
        )

        # Generate questions with retry logic
        questions = None
        validation_results = None
        attempts = 0

        while attempts <= max_retries:
            attempts += 1
            logger.info(f"Generation attempt {attempts}/{max_retries + 1}")

            try:
                # Generate questions
                if question_type == "mcq":
                    questions = await self._generate_mcq_questions(
                        subject=subject,
                        topic=topic,
                        subtopic=subtopic,
                        content=content,
                        num_questions=num_questions,
                        difficulty=difficulty,
                        course=course,
                        custom_prompts=custom_prompts
                    )
                elif question_type == "descriptive":
                    questions = await self._generate_descriptive_questions(
                        subject=subject,
                        topic=topic,
                        subtopic=subtopic,
                        content=content,
                        num_questions=num_questions,
                        descriptive_type=descriptive_type or "short",
                        difficulty=difficulty,
                        course=course,
                        custom_prompts=custom_prompts
                    )
                else:
                    raise ValueError(f"Invalid question_type: {question_type}")

                # Add question_type field to each question so frontend can display correctly
                if questions:
                    for question in questions:
                        question['question_type'] = question_type
                        if question_type == 'descriptive' and descriptive_type:
                            question['descriptive_type'] = descriptive_type

                if not questions:
                    raise ValueError("No questions generated")

                # Validate if enabled
                if use_validation:
                    validation_results = await self._validate_questions(
                        questions=questions,
                        topic_names=[topic],
                        subject_name=subject,
                        expected_count=num_questions
                    )

                    # Check if validation passed
                    if validation_results["selector"]["is_valid"] and validation_results["reflection"]["is_valid"]:
                        logger.info("Validation passed - questions are valid")
                        break
                    else:
                        logger.warning(f"[COURSE:{course or 'default'}] Validation failed on attempt {attempts}")

                        # Build failure reason
                        failure_reasons = []
                        if not validation_results["selector"]["is_valid"]:
                            failure_reasons.append(f"Selector: {validation_results['selector'].get('reason', 'Unknown')}")
                        if not validation_results["reflection"]["is_valid"]:
                            failure_reasons.append(f"Reflection: {validation_results['reflection'].get('reason', 'Unknown')}")

                        if attempts > max_retries:
                            logger.warning("Max retries reached - returning questions with validation issues")

                            # Record validation failure
                            course_metrics.record_validation_failure(
                                course=course or "default",
                                subject=subject,
                                topic=topic,
                                reason="; ".join(failure_reasons),
                                questions_attempted=len(questions) if questions else 0
                            )
                            break
                        else:
                            logger.info("Retrying question generation...")
                            continue
                else:
                    # No validation - accept questions
                    break

            except Exception as e:
                logger.error(f"[COURSE:{course or 'default'}] Error during generation attempt {attempts}: {e}", exc_info=True)

                # Record validation failure if it's the last attempt
                if attempts > max_retries:
                    course_metrics.record_error(
                        course=course or "default",
                        subject=subject,
                        topic=topic,
                        error=e,
                        context={
                            "attempts": attempts,
                            "question_type": question_type,
                            "num_questions": num_questions
                        }
                    )
                    raise
                continue

        # Add college metadata to each question
        if questions:
            for q in questions:
                if 'metadata' not in q:
                    q['metadata'] = {}
                q['metadata'].update({
                    'university': university,
                    'course': course,
                    'department': department,
                    'semester': semester,
                    'paper_type': paper_type
                })

        # Record metrics
        generation_time = time.time() - start_time
        if questions and len(questions) > 0:
            course_metrics.record_success(
                course=course or "default",
                subject=subject,
                topic=topic,
                num_questions=len(questions),
                generation_time=generation_time,
                validation_passed=(validation_results is None or
                                 (validation_results.get("selector", {}).get("is_valid", True) and
                                  validation_results.get("reflection", {}).get("is_valid", True)))
            )
            logger.info(f"[COURSE:{course or 'default'}] Successfully generated {len(questions)} questions in {generation_time:.2f}s")
        else:
            # Record as error if no questions generated
            course_metrics.record_error(
                course=course or "default",
                subject=subject,
                topic=topic,
                error=ValueError("No questions generated"),
                context={"attempts": attempts, "question_type": question_type}
            )
            logger.error(f"[COURSE:{course or 'default'}] Failed to generate questions after {attempts} attempts")

        # Save questions to database if requested
        request_id = None
        saved_count = 0
        if save_to_db and questions and len(questions) > 0:
            request_id = str(uuid.uuid4())
            logger.info(f"[COURSE:{course or 'default'}] Saving {len(questions)} questions to database with request_id: {request_id}")

            # Build metadata for database storage
            metadata = QuestionMetadata(
                type=question_type,
                subject_name=subject,
                subject_id="",  # Can be enhanced with actual subject_id lookup
                topic=topic,
                topic_id="",  # Can be enhanced with actual topic_id lookup
                subtopic=subtopic or "",
                education_level=config.get("education_level", "undergraduate"),
                mcq_type=0,  # Standard MCQ type
                source_type="Offline",
                pdf_content="",
                college_hierarchy=CollegeHierarchy(
                    university=university,
                    course=course,
                    department=department,
                    semester=semester,
                    paper_type=paper_type
                )
            )

            # Build context for database storage
            context = ProcessingContext(
                request_id=request_id,
                batch_id=""
            )

            # Save each question to database (wrap sync DB operations in sync_to_async)
            store_in_db_async = sync_to_async(store_in_db, thread_sensitive=True)
            for question in questions:
                try:
                    success = await store_in_db_async(
                        question=question,
                        metadata=metadata,
                        context=context,
                        request_id=request_id,
                        question_type=question_type
                    )
                    if success:
                        saved_count += 1
                        logger.info(f"[COURSE:{course or 'default'}] Saved question to database: {question.get('question', '')[:50]}...")
                except Exception as e:
                    logger.error(f"[COURSE:{course or 'default'}] Failed to save question to DB: {str(e)}")
                    # Don't fail the entire request if DB save fails - continue with next question

            logger.info(f"[COURSE:{course or 'default'}] Successfully saved {saved_count}/{len(questions)} questions to database")

        return {
            "questions": questions or [],
            "validation": validation_results if use_validation else None,
            "metadata": {
                "subject": subject,
                "topic": topic,
                "subtopic": subtopic,
                "question_type": question_type,
                "descriptive_type": descriptive_type,
                "num_questions": num_questions,
                "difficulty": difficulty,
                "attempts": attempts,
                "generation_time": round(generation_time, 2),
                "education_level": config.get("education_level", "undergraduate"),
                "saved_to_db": save_to_db,
                "request_id": request_id,
                "saved_count": saved_count
            },
            "college_hierarchy": college_metadata
        }

    async def _retrieve_content_from_qdrant(self,
                                           subject: str,
                                           topic: str,
                                           subtopic: Optional[str] = None,
                                           university: Optional[str] = None,
                                           course: Optional[str] = None,
                                           semester: Optional[int] = None,
                                           max_chunks: int = 20) -> str:
        """
        Retrieve relevant content from Qdrant vector database.

        Args:
            subject: Subject name
            topic: Topic name
            subtopic: Optional subtopic
            university: University filter
            course: Course filter
            semester: Semester filter
            max_chunks: Maximum number of chunks to retrieve

        Returns:
            Combined content string from retrieved chunks
        """
        logger.info(f"Retrieving content from Qdrant for {subject} - {topic}")

        try:
            # Build collection name (college format)
            collection_name = self._build_collection_name(course, subject, topic)

            # Retrieve chunks with college filters
            chunks = self.qdrant_service.get_chunks_by_topic(
                collection_name=collection_name,
                subject=subject,
                topic=topic,
                subtopic=subtopic,
                max_chunks=max_chunks,
                university=university,
                course=course,
                semester=semester
            )

            if not chunks:
                logger.warning(f"No chunks found in collection {collection_name}")
                return ""

            # Combine chunk content
            combined_content = "\n\n".join([
                chunk.get('content', '') for chunk in chunks
                if chunk.get('content')
            ])

            logger.info(f"Retrieved {len(chunks)} chunks, total length: {len(combined_content)} chars")
            return combined_content[:9000]  # Limit to 9000 chars

        except Exception as e:
            logger.error(f"Error retrieving content from Qdrant: {e}", exc_info=True)
            return ""

    async def _generate_mcq_questions(self,
                                     subject: str,
                                     topic: str,
                                     subtopic: Optional[str],
                                     content: str,
                                     num_questions: int,
                                     difficulty: str,
                                     course: Optional[str],
                                     custom_prompts: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """Generate MCQ questions using Gemini API with course-specific customization."""
        logger.info(f"Generating {num_questions} MCQ questions")

        # Map course to education_level
        education_level = course or "undergraduate"
        if education_level.lower() == "college":
            education_level = "undergraduate"

        # Get course-specific prompt customizations
        if custom_prompts is None:
            custom_prompts = {}

        focus_instruction = custom_prompts.get(
            "focus_instruction",
            f"Generate {difficulty} level questions"
        )
        explanation_context = custom_prompts.get(
            "explanation_style",
            f"relating to {topic}"
        )
        question_style = custom_prompts.get(
            "question_style",
            f"about {topic}"
        )

        # Build prompt with course-specific customization
        prompt = Config.mcq_prompt.format(
            education_level=education_level,
            User_prompt="",
            num_questions=num_questions,
            subject=subject,
            topic=topic,
            subtopic=subtopic or "",
            combined_content=content or "Generate questions based on general knowledge of the topic",
            subtopic_context="",
            focus_instruction=focus_instruction,
            question_focus=question_style,
            explanation_context=explanation_context,
            question_type="standard_mcq",
            topic_id="",
            mcq_type=0
        )

        try:
            # Generate using Gemini
            response = await asyncio.to_thread(Models.model.generate_content, prompt)
            response_text = response.text.strip()

            logger.debug(f"Raw MCQ response: {response_text[:200]}...")

            # Extract JSON
            questions = self._extract_json_from_response(response_text)

            if not questions:
                raise ValueError("Failed to extract questions from response")

            logger.info(f"Successfully generated {len(questions)} MCQ questions")
            return questions

        except Exception as e:
            logger.error(f"Error generating MCQ questions: {e}", exc_info=True)
            raise

    async def _generate_descriptive_questions(self,
                                             subject: str,
                                             topic: str,
                                             subtopic: Optional[str],
                                             content: str,
                                             num_questions: int,
                                             descriptive_type: str,
                                             difficulty: str,
                                             course: Optional[str],
                                             custom_prompts: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """Generate descriptive questions using Gemini API with course-specific customization."""
        logger.info(f"Generating {num_questions} {descriptive_type} descriptive questions")

        # Map course to education_level
        education_level = course or "undergraduate"
        if education_level.lower() == "college":
            education_level = "undergraduate"

        # Get course-specific prompt customizations
        if custom_prompts is None:
            custom_prompts = {}

        focus_instruction = custom_prompts.get(
            "focus_instruction",
            f"Generate {difficulty} level questions"
        )
        explanation_context = custom_prompts.get(
            "explanation_style",
            f"relating to {topic}"
        )
        question_style = custom_prompts.get(
            "question_style",
            f"about {topic}"
        )

        # Select appropriate prompt based on descriptive type
        if descriptive_type == "very_short":
            prompt_template = Config.descriptive_very_short_prompt
        elif descriptive_type == "short":
            prompt_template = Config.descriptive_short_prompt
        elif descriptive_type == "long_essay":
            prompt_template = Config.descriptive_long_essay_prompt
        else:
            logger.warning(f"Unknown descriptive type: {descriptive_type}, using default")
            prompt_template = Config.descriptive_prompt

        # Build prompt with course-specific customization
        prompt = prompt_template.format(
            education_level=education_level,
            User_prompt="",
            num_questions=num_questions,
            subject=subject,
            topic=topic,
            topic_id="",
            subtopic=subtopic or "",
            combined_content=content or "Generate questions based on general knowledge of the topic",
            focus_instruction=focus_instruction,
            question_focus=question_style,
            subtopic_context="",
            explanation_context=explanation_context
        )

        try:
            # Generate using Gemini
            response = await asyncio.to_thread(Models.model.generate_content, prompt)
            response_text = response.text.strip()

            logger.debug(f"Raw descriptive response: {response_text[:200]}...")

            # Extract JSON
            questions = self._extract_json_from_response(response_text)

            if not questions:
                raise ValueError("Failed to extract questions from response")

            logger.info(f"Successfully generated {len(questions)} descriptive questions")
            return questions

        except Exception as e:
            logger.error(f"Error generating descriptive questions: {e}", exc_info=True)
            raise

    async def _validate_questions(self,
                                 questions: List[Dict[str, Any]],
                                 topic_names: List[str],
                                 subject_name: str,
                                 expected_count: int) -> Dict[str, Any]:
        """
        Validate questions using reflection and selector agents.

        Args:
            questions: Generated questions
            topic_names: Expected topic names
            subject_name: Subject name
            expected_count: Expected number of questions

        Returns:
            dict with validation results from both agents
        """
        logger.info("Running validation agents")

        try:
            # Run reflection agent (topic relevance)
            reflection_result = reflection_agent(
                questions=questions,
                topic_names=topic_names,
                subject_name=subject_name
            )

            # Run selector agent (count and completeness)
            selector_result = selector_agent(
                questions=questions,
                expected_count=expected_count
            )

            # Optional: Run quality validation
            quality_result = validate_question_quality(questions)

            return {
                "reflection": reflection_result,
                "selector": selector_result,
                "quality": quality_result
            }

        except Exception as e:
            logger.error(f"Error during validation: {e}", exc_info=True)
            return {
                "reflection": {"is_valid": False, "error": str(e)},
                "selector": {"is_valid": False, "error": str(e)},
                "quality": {"is_high_quality": False, "error": str(e)}
            }

    def _build_collection_name(self, course: Optional[str], subject: str, topic: str) -> str:
        """
        Build Qdrant collection name using college naming convention.
        Uses same sanitization as Qdrant client to ensure collection names match.

        Format: {course}_{subject}_{topic}
        Example: bcom_accounting_for_public_sector_electricity_companies___accounting_standards
        """
        import re

        # Sanitize each component (same logic as qdrant_client.py)
        def sanitize(text: str) -> str:
            return re.sub(r'[^a-zA-Z0-9_-]', '_', text).lower()

        course_norm = sanitize(course or "general")
        subject_norm = sanitize(subject)
        topic_norm = sanitize(topic)

        collection_name = f"{course_norm}_{subject_norm}_{topic_norm}"
        logger.debug(f"Built collection name: {collection_name}")
        return collection_name

    def _extract_json_from_response(self, response: str) -> Optional[List[Dict]]:
        """
        Extract JSON array from Gemini response.

        Args:
            response: Raw response text from Gemini

        Returns:
            Parsed list of question dictionaries or None
        """
        try:
            # Try to find JSON array
            if '[' in response and ']' in response:
                start_idx = response.index('[')
                end_idx = response.rindex(']') + 1
                json_str = response[start_idx:end_idx]
                return json.loads(json_str)

            # Try to find JSON object
            elif '{' in response and '}' in response:
                start_idx = response.index('{')
                end_idx = response.rindex('}') + 1
                json_str = response[start_idx:end_idx]
                obj = json.loads(json_str)

                # If object contains questions array
                if isinstance(obj, dict) and 'questions' in obj:
                    return obj['questions']
                else:
                    return [obj]  # Wrap single object in array

            else:
                logger.error("No JSON found in response")
                return None

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.debug(f"Problematic response: {response}")
            return None
        except Exception as e:
            logger.error(f"Error extracting JSON: {e}")
            return None


# Convenience functions for backward compatibility
async def generate_college_questions(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function for generating college questions.

    Args:
        params: Dictionary with generation parameters

    Returns:
        Generation results
    """
    generator = CollegeQuestionGeneratorService()
    return await generator.generate_questions_flexible(**params)
