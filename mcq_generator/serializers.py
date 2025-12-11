# mcq_generator/serializers.py
"""
Serializers for college-focused question generation system.
All exam-specific code has been removed.
"""
from rest_framework import serializers
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


class QuestionGenerationSerializer(serializers.Serializer):
    """Serializer for basic question generation requests."""
    exam_params = serializers.JSONField()
    tags = serializers.ListField()
    topic_distribution = serializers.ListField()


class MCQGenerationSerializer(serializers.Serializer):
    """Serializer for MCQ generation from PDFs."""
    pdf_document_id = serializers.IntegerField(required=False)
    meta_data = serializers.JSONField()
    configuration = serializers.JSONField()
    path = serializers.CharField(required=False, allow_null=True, default=None)


@dataclass
class CollegeHierarchy:
    """
    Data class for college hierarchy information.
    Replaces exam-specific metadata.
    """
    university: Optional[str] = None
    course: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    paper_type: Optional[str] = None  # Core/Elective
    source_pdf: Optional[str] = None
    page_range: Optional[str] = None


@dataclass
class QuestionMetadata:
    """
    Data class for question metadata.
    Cleaned version with exam-specific fields removed.
    """
    # Question Type
    type: str  # mcq or descriptive

    # Academic Information
    subject_name: str
    subject_id: str
    topic: str
    topic_id: Optional[str]
    subtopic: Optional[str]

    # Generation Settings
    mcq_type: Optional[int] = None  # For MCQ variations
    user_prompt: Optional[str] = None
    education_level: str = "undergraduate"  # NEW: undergraduate, postgraduate, diploma

    # Content Source
    source_type: Optional[str] = None  # offline, online, web
    pdf_content: str = ""
    limit_source: Optional[str] = None

    # College Hierarchy (NEW)
    college_hierarchy: Optional[CollegeHierarchy] = None

    # Advanced Features (Optional)
    image_type: Optional[str] = None
    current_affairs: Optional[bool] = False
    tag_id: Optional[str] = None


@dataclass
class QuestionGenerationParams:
    """
    Data class for question generation parameters.
    College-focused version.
    """
    # Required Academic Fields
    subject: str
    topic: str

    # Optional Fields
    subtopic: Optional[str] = None
    num_questions: int = 3
    question_type: str = "mcq"  # mcq or descriptive
    mcq_type: Optional[int] = None
    user_prompt: Optional[str] = None

    # IDs for database linking
    subject_id: Optional[str] = None
    topic_id: Optional[str] = None

    # Content Source
    pdf_content: Optional[str] = None
    current_affairs: bool = False

    # College Hierarchy (NEW - replaces vendor/exam_type/priority/vlp)
    university: Optional[str] = None
    course: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    paper_type: Optional[str] = None
    source_pdf: Optional[str] = None
    page_range: Optional[str] = None


@dataclass
class SourceConfig:
    """Data class for source configuration."""
    source_type: str  # offline, online, web
    route_id: Optional[str] = None
    limit_source: bool = False
    pdf_content: str = ""


@dataclass
class QuestionResponse:
    """
    Data class for question generation response.
    Standardized format for API responses.
    """
    success: bool
    questions: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    errors: Optional[List[str]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "success": self.success,
            "questions": self.questions,
            "metadata": self.metadata,
            "errors": self.errors or []
        }


@dataclass
class ProcessingContext:
    """
    Processing context for question generation requests.
    Role tracking fields removed - not needed for college system.
    """
    request_id: str
    batch_id: Optional[str] = None


class CollegeQuestionGenerationSerializer(serializers.Serializer):
    """
    Serializer for college question generation requests.
    Supports college hierarchy, MCQ and descriptive questions.
    """
    # Required fields
    subject = serializers.CharField(required=True, max_length=200)
    topic = serializers.CharField(required=True, max_length=200)

    # Optional fields
    subtopic = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    num_questions = serializers.IntegerField(required=False, default=3, min_value=1, max_value=20)
    question_type = serializers.ChoiceField(
        choices=['mcq', 'descriptive'],
        required=False,
        default='mcq'
    )
    descriptive_type = serializers.ChoiceField(
        choices=['very_short', 'short', 'long_essay'],
        required=False,
        allow_null=True
    )

    # College hierarchy fields
    university = serializers.CharField(required=False, allow_null=True, max_length=255)
    course = serializers.CharField(required=False, allow_null=True, max_length=100)
    department = serializers.CharField(required=False, allow_null=True, max_length=255)
    semester = serializers.IntegerField(required=False, allow_null=True, min_value=1, max_value=8)
    paper_type = serializers.ChoiceField(
        choices=['Core', 'Elective'],
        required=False,
        allow_null=True
    )

    # Generation settings
    difficulty = serializers.ChoiceField(
        choices=['EASY', 'MEDIUM', 'HARD'],
        required=False,
        default='MEDIUM'
    )
    use_validation = serializers.BooleanField(required=False, default=True)
    save_to_db = serializers.BooleanField(
        required=False,
        default=True,
        help_text="Whether to save generated questions to MySQL database"
    )

    def validate(self, data):
        """Validate that descriptive_type is provided for descriptive questions."""
        if data.get('question_type') == 'descriptive':
            if not data.get('descriptive_type'):
                raise serializers.ValidationError({
                    "descriptive_type": "Required for descriptive questions (very_short, short, or long_essay)"
                })
        return data
