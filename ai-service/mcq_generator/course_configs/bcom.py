"""BCom (Bachelor of Commerce) course configuration."""

CONFIG = {
    "course_code": "bcom",
    "display_name": "Bachelor of Commerce",
    "education_level": "undergraduate",
    "default_difficulty": "MEDIUM",

    # Subjects available for BCom (Updated to match actual data)
    "subjects": [
        {
            "name": "Accounting For Public Sector",
            "topics": [
                "Introduction to Public Sector Accounting",
                "Fund Accounting",
                "Budgetary Control",
                "Government Accounting Standards",
                "Financial Reporting in Public Sector"
            ],
            "allowed_question_types": ["mcq", "descriptive"],
            "default_question_type": "descriptive",
            "marks_distribution": {
                "very_short": 2,
                "short": 5,
                "long_essay": 15
            }
        },
        {
            "name": "Financial Accounting",
            "topics": [
                "Journal Entries",
                "Ledger",
                "Trial Balance",
                "Financial Statements",
                "Cash Flow Statement"
            ],
            "allowed_question_types": ["mcq", "descriptive"],
            "default_question_type": "descriptive"
        },
        {
            "name": "Cost Accounting",
            "topics": [
                "Material Costing",
                "Labour Costing",
                "Overhead Costing",
                "Process Costing",
                "Job Costing"
            ],
            "allowed_question_types": ["mcq", "descriptive"],
            "default_question_type": "descriptive"
        },
        {
            "name": "Business Economics",
            "topics": [
                "Demand and Supply",
                "Market Structure",
                "Price Theory",
                "National Income",
                "Economic Development"
            ],
            "allowed_question_types": ["mcq", "descriptive"],
            "default_question_type": "descriptive"
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
