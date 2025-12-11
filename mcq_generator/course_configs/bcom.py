"""BCom (Bachelor of Commerce) course configuration."""

CONFIG = {
    "course_code": "bcom",
    "display_name": "Bachelor of Commerce",
    "education_level": "undergraduate",
    "default_difficulty": "MEDIUM",

    # Subjects available for BCom
    "subjects": [
        {
            "name": "Accounting",
            "topics": [
                "Financial Statements",
                "Cost Accounting",
                "Taxation",
                "Auditing",
                "Management Accounting"
            ],
            "allowed_question_types": ["descriptive"],  # Only descriptive for Accounting
            "default_question_type": "descriptive",
            "marks_distribution": {
                "very_short": 2,
                "short": 5,
                "long_essay": 15
            }
        },
        {
            "name": "Finance",
            "topics": [
                "Corporate Finance",
                "Financial Markets",
                "Investment Analysis",
                "Portfolio Management",
                "Risk Management"
            ],
            "allowed_question_types": ["descriptive"],  # Only descriptive for Finance
            "default_question_type": "descriptive"
        },
        {
            "name": "Economics",
            "topics": [
                "Microeconomics",
                "Macroeconomics",
                "International Trade",
                "Development Economics"
            ],
            "allowed_question_types": ["mcq", "descriptive"],  # Both types allowed for Economics
            "default_question_type": "mcq"
        }
    ],

    # Custom prompt instructions for BCom
    "custom_prompts": {
        "focus_instruction": "Focus on practical accounting and finance scenarios with real-world business applications. Include numerical examples where applicable.",
        "explanation_style": "Include journal entries, financial calculations, formulas, and step-by-step solutions. Reference accounting standards and principles.",
        "question_style": "Use business-oriented language with practical examples from Indian companies and markets."
    },

    # Validation settings
    "validation_settings": {
        "use_reflection": True,
        "use_selector": True,
        "max_retries": 2,
        "strict_topic_matching": True
    },

    # Qdrant retrieval settings
    "retrieval_settings": {
        "max_chunks": 20,
        "similarity_threshold": 0.7,
        "prefer_recent": False  # Don't prioritize recent content
    }
}
