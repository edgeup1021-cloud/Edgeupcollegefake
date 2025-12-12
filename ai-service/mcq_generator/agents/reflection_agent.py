"""
Reflection Agent for College Question Generation System.

This agent validates that generated questions match the specified topics and subtopics.
Uses Gemini API to check topic relevance and identify mismatches.

Based on college-FEAT-pipeline agentic validation logic.
"""
import json
from typing import List, Dict, Optional, Any
from ..apps import Models
from ..utils.loggers import setup_logger

logger = setup_logger("reflection_agent")


def reflection_agent(questions: List[Dict[str, Any]],
                     topic_names: List[str],
                     subject_name: str) -> Dict[str, Any]:
    """
    Validates that generated questions match specified topics.

    Args:
        questions: List of generated question dictionaries
        topic_names: List of expected topic names
        subject_name: Subject name for context

    Returns:
        dict with:
            - is_valid: bool (True if all questions match topics)
            - mismatched_questions: list of question indices that don't match
            - suggestions: list of suggestions for mismatched questions
            - details: detailed validation results
    """
    logger.info(f"Reflection agent validating {len(questions)} questions for topics: {topic_names}")

    # Handle empty inputs
    if not questions:
        logger.warning("No questions provided for validation")
        return {
            "is_valid": False,
            "mismatched_questions": [],
            "suggestions": ["No questions to validate"],
            "details": []
        }

    if not topic_names:
        logger.warning("No topic names provided - skipping validation")
        return {
            "is_valid": True,
            "mismatched_questions": [],
            "suggestions": [],
            "details": []
        }

    # Special handling for "miscellaneous" topics
    # If topic is miscellaneous, skip strict validation
    miscellaneous_keywords = ["miscellaneous", "misc", "general", "others"]
    if any(keyword in topic.lower() for topic in topic_names for keyword in miscellaneous_keywords):
        logger.info("Miscellaneous topic detected - skipping strict validation")
        return {
            "is_valid": True,
            "mismatched_questions": [],
            "suggestions": ["Miscellaneous topic - broad validation applied"],
            "details": []
        }

    # Build validation prompt
    prompt = f"""You are an expert academic content validator for college examinations.

Your task is to validate that each generated question is relevant to the specified topics.

**Subject**: {subject_name}
**Expected Topics**: {', '.join(topic_names)}

**Generated Questions**:
{json.dumps(questions, indent=2)}

**Validation Criteria**:
1. Check if each question's content aligns with the specified topics
2. Identify questions that are off-topic or belong to different topics
3. Consider the subject context when validating relevance

**Output Format** (strict JSON):
{{
    "validation_results": [
        {{
            "question_index": 0,
            "is_relevant": true/false,
            "actual_topic": "topic the question belongs to",
            "reason": "explanation of relevance or mismatch",
            "suggestion": "suggestion if mismatched (empty string if relevant)"
        }},
        ...
    ]
}}

**Important**:
- Return ONLY valid JSON, no additional text
- Validate based on conceptual alignment, not exact keyword matching
- Consider that questions may test concepts indirectly related to the topic
"""

    try:
        logger.debug("Sending validation request to Gemini API")
        response = Models.model.generate_content(prompt)
        response_text = response.text.strip()

        logger.debug(f"Raw response: {response_text[:200]}...")

        # Extract JSON from response
        if '[' in response_text and ']' in response_text:
            json_start = response_text.index('[')
            json_end = response_text.rindex(']') + 1
            json_str = response_text[json_start:json_end]
            validation_data = json.loads(json_str)
        elif '{' in response_text:
            json_start = response_text.index('{')
            json_end = response_text.rindex('}') + 1
            json_str = response_text[json_start:json_end]
            validation_data = json.loads(json_str)
        else:
            raise ValueError("No JSON found in response")

        # Handle different response formats
        if isinstance(validation_data, list):
            results = validation_data
        elif isinstance(validation_data, dict) and 'validation_results' in validation_data:
            results = validation_data['validation_results']
        else:
            raise ValueError("Unexpected response format")

        # Process validation results
        mismatched_questions = []
        suggestions = []

        for result in results:
            if not result.get('is_relevant', True):
                question_idx = result.get('question_index', -1)
                mismatched_questions.append(question_idx)

                suggestion = result.get('suggestion', '')
                if suggestion:
                    suggestions.append(f"Q{question_idx + 1}: {suggestion}")

        is_valid = len(mismatched_questions) == 0

        logger.info(f"Validation complete: {'PASSED' if is_valid else 'FAILED'} "
                   f"({len(mismatched_questions)} mismatches)")

        return {
            "is_valid": is_valid,
            "mismatched_questions": mismatched_questions,
            "suggestions": suggestions,
            "details": results
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        logger.error(f"Response text: {response_text}")
        return {
            "is_valid": False,
            "mismatched_questions": [],
            "suggestions": ["Validation failed: Unable to parse Gemini response"],
            "details": [],
            "error": str(e)
        }

    except Exception as e:
        logger.error(f"Reflection agent error: {e}", exc_info=True)
        return {
            "is_valid": False,
            "mismatched_questions": [],
            "suggestions": [f"Validation failed: {str(e)}"],
            "details": [],
            "error": str(e)
        }
