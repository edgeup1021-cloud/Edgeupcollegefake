from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .services.services import generate_mcqs_service
from .services.college_question_generator import CollegeQuestionGeneratorService
from .utils.loggers import setup_logger
from .serializers import MCQGenerationSerializer, CollegeQuestionGenerationSerializer

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
