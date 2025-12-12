"""
Course-specific configuration system.
Each course has its own configuration file defining:
- Education level
- Subjects and topics
- Custom prompt settings
- Validation settings
"""

from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class CourseConfig:
    """Base configuration class for course settings."""
    course_code: str
    education_level: str  # undergraduate, postgraduate, diploma
    default_difficulty: str  # EASY, MEDIUM, HARD
    subjects: List[Dict[str, any]]
    custom_prompts: Dict[str, str]
    validation_settings: Dict[str, any]
    retrieval_settings: Dict[str, any]


def load_all_configs() -> Dict[str, CourseConfig]:
    """Load all course configurations."""
    from . import bcom, ba_english, base

    configs = {
        "bcom": bcom.CONFIG,
        "ba_english": ba_english.CONFIG,
        "default": base.DEFAULT_CONFIG
    }
    return configs
