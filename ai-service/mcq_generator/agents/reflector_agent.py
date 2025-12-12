from ..apps import Models
import json
from ..utils.loggers import setup_logger

logger = setup_logger("django_logger")

def reflection_agent(questions, topic_names):
    """
    Reflection Agent that validates if generated questions match the provided topics
    """
    logger.info(f"[Reflection Agent] Starting validation for topics: {topic_names}")
    
    try:
        # Configure Gemini API
    
        # Prepare the reflection prompt
        reflection_prompt = f'''
        Analyze the following questions and determine if they properly reflect the topics: {topic_names}
        
        Questions to analyze:
        {json.dumps(questions, indent=2)}
        
        For each question, evaluate:
        ** if topic is miscellaneous then you don't need to check that instead check if the question is related to the subject
        ** if topic is not miscellaneous then check if the question is related to the topic
        1. Does the question content directly relate to the specified topics?
        2. Are the concepts and subject matter aligned with the topics?
        3. Is the difficulty level appropriate for the topics?
        
        Return a JSON response in this format:
        {{
            "is_valid": true/false,
            "reason": "Detailed explanation of why the questions are valid or invalid",
            "mismatched_questions": [list of question indices that don't match the topics],
            "suggestions": "Suggestions for improvement if needed"
        }}
        '''
        
        logger.info("[Reflection Agent] Sending questions for validation")
        response = Models.model.generate_content(reflection_prompt)
        
        # Clean and parse the response
        response_text = response.text.strip()
        try:
            # Try to parse the whole response as a dict
            reflection_result = json.loads(response_text)
        except Exception:
            # Fallback: try to extract the first JSON object from the response
            import re
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                reflection_result = json.loads(match.group(0))
            else:
                raise ValueError("No valid JSON object found in reflection response.")

        logger.info(f"[Reflection Agent] Validation result: {reflection_result.get('is_valid')}")
        return reflection_result
        
    except Exception as e:
        logger.info(f"[Reflection Agent] Error during reflection: {str(e)}")
        return {
            "is_valid": False,
            "reason": f"Error during reflection: {str(e)}",
            "mismatched_questions": [],
            "suggestions": "Error occurred during reflection process"
        }
