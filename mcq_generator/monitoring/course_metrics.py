"""
Course-specific metrics tracking.
Tracks success rates, errors, and performance per course.
"""

import logging
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Optional, Any
import json

logger = logging.getLogger(__name__)


class CourseMetrics:
    """Track metrics per course for monitoring and debugging."""

    def __init__(self):
        self.errors = defaultdict(list)
        self.successes = defaultdict(list)
        self.generation_times = defaultdict(list)
        self.validation_failures = defaultdict(list)

    def record_success(self, course: str, subject: str, topic: str,
                      num_questions: int, generation_time: float,
                      validation_passed: bool = True):
        """Record successful question generation."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "subject": subject,
            "topic": topic,
            "num_questions": num_questions,
            "generation_time": generation_time,
            "validation_passed": validation_passed
        }
        self.successes[course].append(entry)
        self.generation_times[course].append(generation_time)

        logger.info(f"[COURSE:{course}] Success: {num_questions} questions generated for {subject}/{topic} in {generation_time:.2f}s")

    def record_error(self, course: str, subject: str, topic: str,
                    error: Exception, context: Optional[Dict] = None):
        """Record error during question generation."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "subject": subject,
            "topic": topic,
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {}
        }
        self.errors[course].append(entry)

        logger.error(f"[COURSE:{course}] Error in {subject}/{topic}: {type(error).__name__}: {str(error)}")

    def record_validation_failure(self, course: str, subject: str, topic: str,
                                  reason: str, questions_attempted: int):
        """Record validation failure."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "subject": subject,
            "topic": topic,
            "reason": reason,
            "questions_attempted": questions_attempted
        }
        self.validation_failures[course].append(entry)

        logger.warning(f"[COURSE:{course}] Validation failed for {subject}/{topic}: {reason}")

    def get_course_summary(self, course: str) -> Dict[str, Any]:
        """Get summary statistics for a course."""
        total_successes = len(self.successes[course])
        total_errors = len(self.errors[course])
        total_validation_failures = len(self.validation_failures[course])

        avg_time = (sum(self.generation_times[course]) / len(self.generation_times[course])
                   if self.generation_times[course] else 0)

        return {
            "course": course,
            "total_requests": total_successes + total_errors,
            "successes": total_successes,
            "errors": total_errors,
            "validation_failures": total_validation_failures,
            "success_rate": (total_successes / (total_successes + total_errors) * 100
                           if (total_successes + total_errors) > 0 else 0),
            "average_generation_time": round(avg_time, 2),
            "recent_errors": self.errors[course][-5:] if self.errors[course] else []
        }

    def get_error_report(self, course: str, limit: int = 10) -> Dict[str, Any]:
        """Get detailed error report for a course."""
        errors = self.errors[course]

        # Count errors by type
        error_types = defaultdict(int)
        for error in errors:
            error_types[error["error_type"]] += 1

        return {
            "course": course,
            "total_errors": len(errors),
            "errors_by_type": dict(error_types),
            "recent_errors": errors[-limit:] if errors else []
        }

    def export_metrics(self, filepath: str):
        """Export all metrics to JSON file."""
        data = {
            "exported_at": datetime.now().isoformat(),
            "courses": {}
        }

        all_courses = set(list(self.errors.keys()) + list(self.successes.keys()))
        for course in all_courses:
            data["courses"][course] = self.get_course_summary(course)

        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

        logger.info(f"Metrics exported to {filepath}")


# Global metrics instance
course_metrics = CourseMetrics()
