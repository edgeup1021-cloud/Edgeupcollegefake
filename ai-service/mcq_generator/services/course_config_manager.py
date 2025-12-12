"""
Course Configuration Manager
Manages loading and accessing course-specific configurations.
"""

import logging
from typing import Dict, List, Optional, Any
from mcq_generator.course_configs import load_all_configs

logger = logging.getLogger(__name__)


class CourseConfigManager:
    """Manages course-specific configurations."""

    _instance = None
    _configs = None

    def __new__(cls):
        """Singleton pattern to avoid reloading configs."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_configs()
        return cls._instance

    def _load_configs(self):
        """Load all course configurations."""
        try:
            self._configs = load_all_configs()
            logger.info(f"Loaded configurations for {len(self._configs)} courses: {list(self._configs.keys())}")
        except Exception as e:
            logger.error(f"Failed to load course configurations: {e}")
            self._configs = {}

    def get_config(self, course: str) -> Dict[str, Any]:
        """
        Get configuration for a specific course.
        Falls back to default config if course not found.
        """
        course_key = course.lower().replace(" ", "_") if course else "default"

        if course_key in self._configs:
            logger.debug(f"Using configuration for course: {course_key}")
            return self._configs[course_key]
        else:
            logger.warning(f"No configuration found for course: {course_key}, using default")
            return self._configs.get("default", {})

    def get_education_level(self, course: str) -> str:
        """Get education level for a course."""
        config = self.get_config(course)
        return config.get("education_level", "undergraduate")

    def get_custom_prompts(self, course: str) -> Dict[str, str]:
        """Get course-specific prompt customizations."""
        config = self.get_config(course)
        return config.get("custom_prompts", {})

    def get_validation_settings(self, course: str) -> Dict[str, Any]:
        """Get validation settings for a course."""
        config = self.get_config(course)
        return config.get("validation_settings", {})

    def get_retrieval_settings(self, course: str) -> Dict[str, Any]:
        """Get Qdrant retrieval settings for a course."""
        config = self.get_config(course)
        return config.get("retrieval_settings", {})

    def validate_subject_for_course(self, course: str, subject: str) -> bool:
        """
        Check if a subject is valid for the given course.
        Returns True if valid or if course has no subject restrictions.
        """
        config = self.get_config(course)
        subjects_list = config.get("subjects", [])

        # If no subjects defined, allow any subject
        if not subjects_list:
            return True

        # Check if subject exists in course's subject list
        valid_subjects = [s["name"] for s in subjects_list]
        return subject in valid_subjects

    def get_available_subjects(self, course: str) -> List[str]:
        """Get list of available subjects for a course."""
        config = self.get_config(course)
        subjects_list = config.get("subjects", [])
        return [s["name"] for s in subjects_list]

    def get_available_courses(self) -> List[str]:
        """Get list of all available course codes."""
        return [code for code in self._configs.keys() if code != "default"]

    def validate_question_type(self, course: str, subject: str, question_type: str) -> bool:
        """
        Check if a question type is allowed for the given course and subject.
        Returns True if allowed or if no restrictions defined.
        """
        config = self.get_config(course)
        subjects_list = config.get("subjects", [])

        # Find the subject
        for subj in subjects_list:
            if subj["name"] == subject:
                allowed_types = subj.get("allowed_question_types", [])
                # If no restrictions defined, allow all types
                if not allowed_types:
                    return True
                return question_type in allowed_types

        # If subject not found or no subjects list, allow all types
        return True

    def get_allowed_question_types(self, course: str, subject: str) -> List[str]:
        """Get list of allowed question types for a course and subject."""
        config = self.get_config(course)
        subjects_list = config.get("subjects", [])

        for subj in subjects_list:
            if subj["name"] == subject:
                return subj.get("allowed_question_types", ["mcq", "descriptive"])

        # Default to both if not found
        return ["mcq", "descriptive"]

    def get_default_question_type(self, course: str, subject: str) -> str:
        """Get the default/recommended question type for a course and subject."""
        config = self.get_config(course)
        subjects_list = config.get("subjects", [])

        for subj in subjects_list:
            if subj["name"] == subject:
                return subj.get("default_question_type", "mcq")

        return "mcq"

    def reload_configs(self):
        """Reload all configurations (useful for development)."""
        self._load_configs()


# Create singleton instance
course_config_manager = CourseConfigManager()
