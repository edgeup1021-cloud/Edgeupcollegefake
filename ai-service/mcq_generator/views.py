from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .services.services import generate_mcqs_service
from .services.college_question_generator import CollegeQuestionGeneratorService
from .utils.loggers import setup_logger
from .serializers import MCQGenerationSerializer, CollegeQuestionGenerationSerializer
from .models.assessment_models import LiveMcqQuestions, LiveDescriptiveQuestions
from .course_configs import load_all_configs
from .connections.qdrant_client import QdrantService

logger = setup_logger("django_logger")

async def healthcheck(request):
    return JsonResponse({"message":"API is working fine"})



@csrf_exempt
async def generate(request):
    if request.method == "POST":
        logger.info("Received request for MCQ generation")
        try:
            data = json.loads(request.body)
            logger.info(f"Received payload: {json.dumps(data)}")

            if data["meta_data"]["question_type"].lower() not in ["mcq","descriptive"]:
                return JsonResponse({"error":"Invalid Question type"},status=400)

            serializer = MCQGenerationSerializer(data=data)

            if serializer.is_valid():
                logger.info("Payload is serialized successfully")
                data = serializer.validated_data
                mcqs = await generate_mcqs_service(data)
                logger.info(f"Generated questions {mcqs}")
                return JsonResponse({"response": mcqs}, status=200)
            else:
                logger.warning("Invalid payload received")
                return JsonResponse({"error": "Invalid payload"}, status=400)
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}", exc_info=True)
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
async def generate_college_questions(request):
    """
    College question generation endpoint with validation.

    Supports:
    - MCQ questions (4-option format)
    - Descriptive questions (very_short, short, long_essay)
    - College hierarchy filtering
    - Validation agents (reflection + selector)
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    logger.info("Received college question generation request")

    try:
        # Parse and validate request
        data = json.loads(request.body)
        logger.info(f"Request payload: {json.dumps(data, indent=2)}")

        serializer = CollegeQuestionGenerationSerializer(data=data)

        if not serializer.is_valid():
            logger.warning(f"Invalid payload: {serializer.errors}")
            return JsonResponse({
                "error": "Invalid payload",
                "details": serializer.errors
            }, status=400)

        validated_data = serializer.validated_data
        logger.info("Payload validated successfully")

        # Initialize service and generate questions
        service = CollegeQuestionGeneratorService()

        result = await service.generate_questions_flexible(
            subject=validated_data['subject'],
            topic=validated_data['topic'],
            subtopic=validated_data.get('subtopic'),
            num_questions=validated_data.get('num_questions', 3),
            question_type=validated_data.get('question_type', 'mcq'),
            descriptive_type=validated_data.get('descriptive_type'),
            university=validated_data.get('university'),
            course=validated_data.get('course'),
            department=validated_data.get('department'),
            semester=validated_data.get('semester'),
            paper_type=validated_data.get('paper_type'),
            difficulty=validated_data.get('difficulty', 'MEDIUM'),
            use_validation=validated_data.get('use_validation', True),
            save_to_db=validated_data.get('save_to_db', True)
        )

        logger.info(f"Successfully generated {len(result.get('questions', []))} questions")

        return JsonResponse(result, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return JsonResponse({
            "error": "Invalid JSON format",
            "details": str(e)
        }, status=400)

    except Exception as e:
        logger.error(f"Question generation error: {str(e)}", exc_info=True)
        return JsonResponse({
            "error": "Question generation failed",
            "details": str(e)
        }, status=500)


# ==================== Dropdown Data Endpoints ====================

@csrf_exempt
def get_subjects(request):
    """Get distinct subjects for a course from Qdrant collections."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course = request.GET.get('course', '')

        if not course:
            return JsonResponse({"error": "Course parameter is required"}, status=400)

        # Map display names to course codes (case-insensitive)
        course_map = {
            'b.com': 'bcom',
            'ba english literature': 'ba_english_literature'
        }

        course_code = course_map.get(course.lower(), course.lower().replace(' ', '_'))

        # Query Qdrant to get actual subjects
        try:
            qdrant = QdrantService()
            collections = qdrant.list_collections()

            subjects_set = set()
            prefix = f"{course_code}_"

            # Parse collection names to extract subjects
            for coll in collections:
                coll_name = coll['name']
                if coll_name.startswith(prefix):
                    # Format: {course}_{subject}_{topic}
                    parts = coll_name[len(prefix):].split('_')
                    if len(parts) >= 2:
                        # Extract subject (everything before the last underscore which is topic)
                        # Join all parts except last as subject
                        subject_parts = parts[:-1]
                        subject = ' '.join(subject_parts).title()
                        subjects_set.add(subject)

            subjects = sorted(list(subjects_set))
            logger.info(f"Retrieved {len(subjects)} subjects from Qdrant for course: {course}")

            # If no subjects found in Qdrant, fallback to config
            if not subjects:
                logger.warning(f"No subjects found in Qdrant for {course}, using config fallback")
                # Map ba_english_literature to ba_english for config lookup
                course_code_config = 'ba_english' if course_code == 'ba_english_literature' else course_code
                configs = load_all_configs()
                config = configs.get(course_code_config, configs.get('default'))
                if config and 'subjects' in config:
                    subjects = [subj['name'] for subj in config['subjects']]

            return JsonResponse(subjects, safe=False, status=200)

        except Exception as qdrant_error:
            logger.error(f"Qdrant query failed: {str(qdrant_error)}, falling back to config")
            # Fallback to config if Qdrant fails
            course_code_config = 'ba_english' if course_code == 'ba_english_literature' else course_code
            configs = load_all_configs()
            config = configs.get(course_code_config, configs.get('default'))
            subjects = []
            if config and 'subjects' in config:
                subjects = [subj['name'] for subj in config['subjects']]
            return JsonResponse(subjects, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching subjects: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_topics(request):
    """Get distinct topics for a course and subject from course config."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course = request.GET.get('course', '')
        subject = request.GET.get('subject', '')

        if not course or not subject:
            return JsonResponse({"error": "Course and subject parameters are required"}, status=400)

        # Map display names to course codes (case-insensitive)
        course_map = {
            'b.com': 'bcom',
            'ba english literature': 'ba_english_literature'
        }

        course_code = course_map.get(course.lower(), course.lower().replace(' ', '_'))
        subject_normalized = subject.lower().replace(' ', '_')

        # Query Qdrant to get actual topics
        try:
            qdrant = QdrantService()
            collections = qdrant.list_collections()

            topics_set = set()
            prefix = f"{course_code}_{subject_normalized}_"

            # Parse collection names to extract topics
            for coll in collections:
                coll_name = coll['name']
                if coll_name.startswith(prefix):
                    # Format: {course}_{subject}_{topic}
                    topic_part = coll_name[len(prefix):]
                    # Convert back to readable format
                    topic = topic_part.replace('_', ' ').title()
                    topics_set.add(topic)

            topics = sorted(list(topics_set))
            logger.info(f"Retrieved {len(topics)} topics from Qdrant for course: {course}, subject: {subject}")

            # If no topics found in Qdrant, fallback to config
            if not topics:
                logger.warning(f"No topics found in Qdrant for {course}/{subject}, using config fallback")
                # Fallback to config
                course_code_config = 'ba_english' if course_code == 'ba_english_literature' else course_code
                configs = load_all_configs()
                config = configs.get(course_code_config, configs.get('default'))
                if config and 'subjects' in config:
                    for subj in config['subjects']:
                        if subj['name'] == subject:
                            topics = subj.get('topics', [])
                            break

            return JsonResponse(topics, safe=False, status=200)

        except Exception as qdrant_error:
            logger.error(f"Qdrant query failed: {str(qdrant_error)}, falling back to config")
            # Fallback to config if Qdrant fails
            course_code_config = 'ba_english' if course_code == 'ba_english_literature' else course_code
            configs = load_all_configs()
            config = configs.get(course_code_config, configs.get('default'))
            topics = []
            if config and 'subjects' in config:
                for subj in config['subjects']:
                    if subj['name'] == subject:
                        topics = subj.get('topics', [])
                        break
            return JsonResponse(topics, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching topics: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_subtopics(request):
    """Get distinct subtopics for a course, subject, and topic from database."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course = request.GET.get('course', '')
        subject = request.GET.get('subject', '')
        topic = request.GET.get('topic', '')

        if not course or not subject or not topic:
            return JsonResponse({"error": "Course, subject, and topic parameters are required"}, status=400)

        # Query database for unique subtopics
        mcq_subtopics = LiveMcqQuestions.objects.filter(
            course__iexact=course,
            subject_name__iexact=subject,
            topic_name__iexact=topic,
            subtopic_name__isnull=False
        ).values_list('subtopic_name', flat=True).distinct()

        desc_subtopics = LiveDescriptiveQuestions.objects.filter(
            course__iexact=course,
            subject_name__iexact=subject,
            topic_name__iexact=topic,
            subtopic_name__isnull=False
        ).values_list('subtopic_name', flat=True).distinct()

        # Combine and remove duplicates
        subtopics = list(set(list(mcq_subtopics) + list(desc_subtopics)))
        subtopics.sort()

        logger.info(f"Retrieved {len(subtopics)} subtopics for course: {course}, subject: {subject}, topic: {topic}")
        return JsonResponse(subtopics, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching subtopics: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_departments(request):
    """Get distinct departments for a course from database."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course = request.GET.get('course', '')

        if not course:
            return JsonResponse({"error": "Course parameter is required"}, status=400)

        # Query database for unique departments
        mcq_depts = LiveMcqQuestions.objects.filter(
            course__iexact=course,
            department__isnull=False
        ).values_list('department', flat=True).distinct()

        desc_depts = LiveDescriptiveQuestions.objects.filter(
            course__iexact=course,
            department__isnull=False
        ).values_list('department', flat=True).distinct()

        # Combine and remove duplicates
        departments = list(set(list(mcq_depts) + list(desc_depts)))
        departments.sort()

        # If no data in database or empty, return default departments based on course
        if not departments or len(departments) == 0:
            default_depts = {
                'b.com': ['Accounting & Finance'],
                'ba english literature': ['English']
            }
            departments = default_depts.get(course.lower(), ['Accounting & Finance' if 'com' in course.lower() else 'English'])

        logger.info(f"Retrieved {len(departments)} departments for course: {course}")
        return JsonResponse(departments, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching departments: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_universities(request):
    """Get distinct universities from database."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        # Query database for unique universities
        mcq_univs = LiveMcqQuestions.objects.filter(
            university__isnull=False
        ).values_list('university', flat=True).distinct()

        desc_univs = LiveDescriptiveQuestions.objects.filter(
            university__isnull=False
        ).values_list('university', flat=True).distinct()

        # Combine and remove duplicates
        universities = list(set(list(mcq_univs) + list(desc_univs)))
        universities.sort()

        # If no data in database, return default universities
        if not universities:
            universities = ['Bharathiyar University', 'University of Madras']

        logger.info(f"Retrieved {len(universities)} universities")
        return JsonResponse(universities, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching universities: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_courses(request):
    """Get distinct courses from database."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        # Query database for unique courses
        mcq_courses = LiveMcqQuestions.objects.filter(
            course__isnull=False
        ).values_list('course', flat=True).distinct()

        desc_courses = LiveDescriptiveQuestions.objects.filter(
            course__isnull=False
        ).values_list('course', flat=True).distinct()

        # Combine and remove duplicates
        courses = list(set(list(mcq_courses) + list(desc_courses)))
        courses.sort()

        # If no data in database, return default courses (matching Gradio)
        if not courses or len(courses) == 0:
            courses = ['B.Com', 'Ba English Literature']

        logger.info(f"Retrieved {len(courses)} courses")
        return JsonResponse(courses, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_semesters(request):
    """Get distinct semesters for a course from database."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course = request.GET.get('course', '')

        if not course:
            return JsonResponse({"error": "Course parameter is required"}, status=400)

        # Query database for unique semesters
        mcq_sems = LiveMcqQuestions.objects.filter(
            course__iexact=course,
            semester__isnull=False
        ).values_list('semester', flat=True).distinct()

        desc_sems = LiveDescriptiveQuestions.objects.filter(
            course__iexact=course,
            semester__isnull=False
        ).values_list('semester', flat=True).distinct()

        # Combine, remove duplicates, and sort
        semesters = sorted(list(set(list(mcq_sems) + list(desc_sems))))

        logger.info(f"Retrieved {len(semesters)} semesters for course: {course}")
        return JsonResponse(semesters, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error fetching semesters: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def list_qdrant_collections(request):
    """List all Qdrant collections for debugging - shows what's available."""
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        course_filter = request.GET.get('course', '')

        qdrant = QdrantService()
        collections = qdrant.list_collections()

        result = []
        for coll in collections:
            if course_filter:
                # Filter by course
                course_normalized = course_filter.lower().replace(' ', '_')
                if course_normalized == 'ba_english_literature':
                    course_normalized = 'ba_english_literature'

                if coll['name'].startswith(course_normalized):
                    result.append(coll)
            else:
                result.append(coll)

        logger.info(f"Found {len(result)} collections" + (f" for course {course_filter}" if course_filter else ""))
        return JsonResponse(result, safe=False, status=200)

    except Exception as e:
        logger.error(f"Error listing Qdrant collections: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)
