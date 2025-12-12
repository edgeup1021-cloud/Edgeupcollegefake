"""Default configuration for courses without specific config."""

DEFAULT_CONFIG = {
    "course_code": "general",
    "display_name": "General Course",
    "education_level": "undergraduate",
    "default_difficulty": "MEDIUM",

    "subjects": [],

    "custom_prompts": {
        "focus_instruction": "Focus on conceptual understanding and analytical thinking.",
        "explanation_style": "Provide clear, structured explanations suitable for undergraduate students.",
        "question_style": "Use clear, unambiguous language appropriate for academic assessment."
    },

    "validation_settings": {
        "use_reflection": True,
        "use_selector": True,
        "max_retries": 2,
        "strict_topic_matching": False
    },

    "retrieval_settings": {
        "max_chunks": 20,
        "similarity_threshold": 0.7,
        "prefer_recent": False
    }
}
