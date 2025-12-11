from .generation_service import QuestionGeneratorService
from ..config import Config
from ..apps import Models
from .services import extract_json_from_response
from ..agents.selector_agent import selector_agent

def orchestration(question_type, metadata, total_questions,request_id):
    # UPSC/TNPSC specific generation removed - now using college system
    # if metadata["exam_type"].lower() == "upsc":
    #     questions = generate_and_store_upsc_questions_flexible(...)
    # elif "tnpsc" in metadata["exam_type"].lower():
    #     questions = generate_and_store_tnpsc_questions_flexible(...)
    # else:

    # Default college/general question generation
    if True:  # Always use the general generation path now
     
        # Prepare focus instructions
        if metadata["subtopic"]:
            focus_instruction = f"specifically focused on '{metadata['subtopic']}'"
            subtopic_context = f"Focus questions specifically on '{metadata['subtopic']}' concepts and details within '{metadata['topic']}'."
            question_focus = f"about {metadata['subtopic']}"
            explanation_context = f"relating to {metadata['subtopic']}"
        else:
            focus_instruction = f"covering the broad topic of '{metadata['topic']}'"
            subtopic_context = f"Cover various aspects and concepts within the topic '{metadata['topic']}'."
            question_focus = f"about {metadata['topic']}"
            explanation_context = f"relating to {metadata['topic']}"

        # Map exam_type to education_level for backward compatibility
        education_level = metadata.get("education_level", "undergraduate")
        if not education_level and "exam_type" in metadata:
            education_map = {
                "college": "undergraduate",
                "upsc": "undergraduate",  # Treat old UPSC as undergrad
                "tnpsc": "undergraduate"
            }
            education_level = education_map.get(metadata["exam_type"].lower(), "undergraduate")

        if question_type == "mcq":
            base_prompt = Config.mcq_prompt.format(
                        User_prompt=metadata["user_prompt"] or "",
                        num_questions=total_questions,
                        subject=metadata["subject_name"],
                        education_level=education_level,
                        topic=metadata["topic"],
                        subtopic=metadata["current_subtopic"],
                        focus_instruction=focus_instruction,
                        question_focus=question_focus,
                        explanation_context=explanation_context,
                        combined_content=metadata["pdf_content"] or "",
                        subtopic_context=subtopic_context,
                        topic_id=metadata["topic_id"] or "",
                        question_type=question_type,
                        mcq_type='general'
                    )
        elif question_type == "descriptive":
            base_prompt = Config.descriptive_prompt.format(
                        User_prompt=metadata["user_prompt"] or "",
                        num_questions=total_questions,
                        subject=metadata["subject_name"],
                        education_level=education_level,
                        topic=metadata["topic"],
                        subtopic=metadata["current_subtopic"],
                        focus_instruction=focus_instruction,
                        question_focus=question_focus,
                        explanation_context=explanation_context,
                        combined_content=metadata["pdf_content"] or "",
                        subtopic_context=subtopic_context,
                        topic_id=metadata["topic_id"] or "",
                        question_type=question_type
                    )
        response = Models.model.generate_content(base_prompt)
        response_text = response.text.strip()
        questions = extract_json_from_response(response_text)
        if questions:
            # Apply reflection and selection
            #reflection_result = reflection_agent(questions, params.topic)
            selection_result = selector_agent(questions, total_questions)
            return questions