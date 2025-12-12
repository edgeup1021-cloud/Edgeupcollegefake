"""
Selector Agent for College Question Generation System.

This agent validates that the correct number of questions were generated.
Checks for duplicates, incomplete questions, and count mismatches.

Based on college-FEAT-pipeline agentic validation logic.
"""
from typing import List, Dict, Any
from ..utils.loggers import setup_logger

logger = setup_logger("selector_agent")


def selector_agent(questions: List[Dict[str, Any]],
                   expected_count: int) -> Dict[str, Any]:
    """
    Validates that the correct number of questions were generated.

    Args:
        questions: List of generated question dictionaries
        expected_count: Expected number of questions

    Returns:
        dict with:
            - is_valid: bool (True if count matches and questions are valid)
            - actual_count: int (actual number of questions received)
            - expected_count: int (requested number of questions)
            - reason: str (explanation of validation result)
            - issues: list of specific issues found
    """
    logger.info(f"Selector agent validating question count: expected={expected_count}, received={len(questions)}")

    # Initialize response
    issues = []
    actual_count = len(questions)

    # Check if list is empty
    if actual_count == 0:
        logger.warning("No questions received")
        return {
            "is_valid": False,
            "actual_count": 0,
            "expected_count": expected_count,
            "reason": "No questions were generated",
            "issues": ["No questions in response"]
        }

    # Check count mismatch
    if actual_count != expected_count:
        difference = actual_count - expected_count
        if difference > 0:
            issue = f"Generated {difference} extra question(s)"
        else:
            issue = f"Missing {abs(difference)} question(s)"
        issues.append(issue)
        logger.warning(f"Count mismatch: {issue}")

    # Check for duplicate questions
    seen_questions = set()
    duplicates = []

    for idx, q in enumerate(questions):
        question_text = q.get('question', '').strip().lower()

        if not question_text:
            issues.append(f"Question {idx + 1} has empty question text")
            logger.warning(f"Empty question at index {idx}")
            continue

        if question_text in seen_questions:
            duplicates.append(idx + 1)
            issues.append(f"Question {idx + 1} is a duplicate")
            logger.warning(f"Duplicate question at index {idx}")
        else:
            seen_questions.add(question_text)

    # Check for incomplete questions (missing required fields)
    for idx, q in enumerate(questions):
        # Check for MCQ questions
        if 'options' in q:
            if not q.get('options') or len(q.get('options', [])) < 2:
                issues.append(f"Question {idx + 1} has insufficient options")
                logger.warning(f"Insufficient options at index {idx}")

            if 'correct_answer' not in q:
                issues.append(f"Question {idx + 1} missing correct_answer")
                logger.warning(f"Missing correct_answer at index {idx}")

        # Check for descriptive questions
        elif 'answer' in q:
            if not q.get('answer', '').strip():
                issues.append(f"Question {idx + 1} has empty answer")
                logger.warning(f"Empty answer at index {idx}")

        # Check metadata
        if 'metadata' not in q:
            issues.append(f"Question {idx + 1} missing metadata")
            logger.warning(f"Missing metadata at index {idx}")

    # Determine if validation passed
    is_valid = (actual_count == expected_count) and (len(issues) == 0)

    # Build reason message
    if is_valid:
        reason = f"Validation passed: {actual_count} valid questions generated"
    else:
        reason = f"Validation failed: {len(issues)} issue(s) found"

    logger.info(f"Selector validation: {'PASSED' if is_valid else 'FAILED'} - {reason}")

    return {
        "is_valid": is_valid,
        "actual_count": actual_count,
        "expected_count": expected_count,
        "reason": reason,
        "issues": issues,
        "duplicates_found": len(duplicates),
        "duplicate_indices": duplicates
    }


def validate_question_quality(questions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Additional quality validation for questions.

    Checks:
    - Minimum question length
    - Answer/explanation presence and length
    - Metadata completeness

    Args:
        questions: List of question dictionaries

    Returns:
        dict with quality validation results
    """
    logger.info(f"Running quality validation on {len(questions)} questions")

    quality_issues = []

    for idx, q in enumerate(questions):
        question_text = q.get('question', '').strip()

        # Check minimum question length
        if len(question_text) < 10:
            quality_issues.append({
                "index": idx + 1,
                "type": "short_question",
                "message": "Question text is too short"
            })

        # Check for MCQ quality
        if 'options' in q:
            options = q.get('options', [])

            # Check option count
            if len(options) < 2:
                quality_issues.append({
                    "index": idx + 1,
                    "type": "insufficient_options",
                    "message": f"Only {len(options)} option(s) provided"
                })

            # Check for empty options
            for opt_idx, opt in enumerate(options):
                if not str(opt).strip():
                    quality_issues.append({
                        "index": idx + 1,
                        "type": "empty_option",
                        "message": f"Option {opt_idx} is empty"
                    })

        # Check for descriptive answer quality
        if 'answer' in q:
            answer = q.get('answer', '').strip()
            if len(answer) < 20:
                quality_issues.append({
                    "index": idx + 1,
                    "type": "short_answer",
                    "message": "Answer is too short"
                })

        # Check metadata completeness
        metadata = q.get('metadata', {})
        required_fields = ['topic', 'difficulty']

        for field in required_fields:
            if field not in metadata or not metadata.get(field):
                quality_issues.append({
                    "index": idx + 1,
                    "type": "missing_metadata",
                    "message": f"Missing metadata field: {field}"
                })

    is_high_quality = len(quality_issues) == 0

    logger.info(f"Quality validation: {'PASSED' if is_high_quality else 'ISSUES FOUND'} "
               f"({len(quality_issues)} issues)")

    return {
        "is_high_quality": is_high_quality,
        "quality_score": max(0, 100 - (len(quality_issues) * 10)),
        "issues": quality_issues,
        "issue_count": len(quality_issues)
    }