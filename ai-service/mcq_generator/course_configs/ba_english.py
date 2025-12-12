"""BA English (Bachelor of Arts in English) course configuration."""

CONFIG = {
    "course_code": "ba_english",
    "display_name": "Bachelor of Arts in English",
    "education_level": "undergraduate",
    "default_difficulty": "MEDIUM",

    # Subjects available for BA English
    "subjects": [
        {
            "name": "Literature",
            "topics": [
                "Shakespeare",
                "Romantic Poetry",
                "Victorian Literature",
                "Modern Drama",
                "American Literature",
                "Indian Writing in English"
            ],
            "allowed_question_types": ["mcq", "descriptive"],  # Both types allowed for Literature
            "default_question_type": "descriptive",  # Prefer descriptive for literary analysis
            "marks_distribution": {
                "very_short": 2,
                "short": 5,
                "long_essay": 15
            }
        },
        {
            "name": "Grammar",
            "topics": [
                "Syntax",
                "Semantics",
                "Morphology",
                "Phonetics",
                "Pragmatics"
            ],
            "allowed_question_types": ["mcq", "descriptive"],  # Both types allowed
            "default_question_type": "mcq"  # MCQs better for grammar rules
        },
        {
            "name": "Linguistics",
            "topics": [
                "Sociolinguistics",
                "Psycholinguistics",
                "Historical Linguistics",
                "Applied Linguistics"
            ],
            "allowed_question_types": ["mcq", "descriptive"],  # Both types allowed
            "default_question_type": "mcq"  # MCQs for concepts
        }
    ],

    # Custom prompt instructions for BA English
    "custom_prompts": {
        "focus_instruction": "Focus on literary analysis, critical thinking, textual interpretation, and understanding of literary movements and techniques.",
        "explanation_style": "Include references to specific texts, quotes, literary devices, thematic analysis, and historical/cultural context.",
        "question_style": "Use academic literary terminology. Emphasize critical analysis and interpretation over factual recall."
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
        "max_chunks": 25,  # More context needed for literary analysis
        "similarity_threshold": 0.65,  # Slightly lower for broader context
        "prefer_recent": False
    }
}
