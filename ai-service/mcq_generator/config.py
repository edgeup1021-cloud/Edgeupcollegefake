from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL")
    PDF_model = os.environ.get("PDF_MODEL")
    PLAGARISM_API_KEY=os.environ.get("PLAGARISM_API_KEY")
    PLAGARISM_URL=os.environ.get("PLAGARISM_URL")
    SIMILARITY_THRESHOLD = 0.9
    SIMILAR_MODEL = os.getenv("SIMILAR_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
   

    NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "your_password_here")

    MAX_RETRIES = 1
    # Primary model
    GEMINI_FALLBACK_MODEL_NAME = os.getenv("GEMINI_FALLBACK_MODEL_NAME")

    MAX_RETRIES_GENERATION = 3
    DEFAULT_TIMEOUT = 30
    DEFAULT_MAX_CHUNKS = 20
    DEFAULT_MIN_SIMILARITY = 0.03
    DEFAULT_WINDOW_SIZE = 2
    DEFAULT_MAX_CHARS = 9000
    DEFAULT_NUM_CHUNKS_TO_SELECT = 5
 
    # Qdrant Configuration
    QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)  # Optional for local setup


    # Application Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    MAX_CHUNK_SIZE = int(os.getenv("MAX_CHUNK_SIZE", 3000))
    DEFAULT_NUM_QUESTIONS = int(os.getenv("DEFAULT_NUM_QUESTIONS", 10))
    DEFAULT_MIN_SIMILARITY = float(os.getenv("DEFAULT_MIN_SIMILARITY", 0.6))

    image_passage_prompt = '''You are an expert in generating image based  questions in JSON format.
Your task is to generate a realistic, logically consistent set of MCQs based on the given scenario.
Requirements:
Passage:
Generate a passage exactly containing {num_questions} {question_type} {question_format} this question format is for how many options are there in the question and what is the basic format return only those keys that are asked in json response

The passage should clearly describe the scenario, problem, or context relevant to the topic.
Ensure the passage is self-contained, unambiguous, and suitable for generating reasoning-based questions.
Questions:
Generate questions based on the passage.
Each question must have exactly 4 options labeled:
- Ensure each question is analytical and concept-based.
- Ensure the question is relevant to the image type and subject.
- Ensure the question is unique and not similar to any previous questions.
- Make sure every question is unique and follows any of the above formats list
- **generate  pie chart or bar chart or line chart or scatter plot or histogram or box plot or violin plot or area chart or radar chart or waterfall chart for mathamatical or statistical questions**
- **generate table for statistical or mathematical questions**
- ** At a time only generate a table or chart not both**
**CHART REQUIREMENTS:**
- Use matplotlib for chart (no seaborn, no external data download).
- Code must be self-contained and runnable without internet access.
- Example of escaped code for JSON:
  "chart": "import matplotlib.pyplot as plt\\nimport numpy as np\\ndata = np.random.rand(5,5)\\nplt.imshow(data, cmap='hot', interpolation='nearest')\\nplt.show()"

**TABLE REQUIREMENTS:**
- Use pandas to create tables.
- Must be small (max 6 rows × 4 columns) and related to the question.
- Example of escaped code for JSON:
  "table": "import pandas as pd\\ndata = {{'A':[1,2],'B':[3,4]}}\\ndf = pd.DataFrame(data)\\nprint(df)"
Provide the correct answer index as a string.
Each explanation must be concise, logically consistent, and ≤200 words.
Avoid contradictions, overlapping options, or ambiguity.
Focus on reasoning, clarity, and stepwise logic.
JSON Output Format:
if mcq
[
"passage": "",
"chart":"",
"table":"",
"questions": [

  "question": "",
  "options": [
  5 options
  ],

  "solution": "",
  "correct_answer": integer index of options array that is correct 0/1/2/3 etc,
  "metadata":
  - topic: [Use exact value from input metadata]
  - topic_id: [Use exact value from input metadata]
  - subtopic: [If provided, use exact value — do not generate your own]
  - difficulty: [EASY / MEDIUM / HARD — must match metadata if present]
  - mcq_type: [integer {mcq_type}] ,for general return 0 for general return 0
  ]
  ]
if descriptive
[
"passage": "",
"questions": [

  "question": "",
  "answer":"",
  "metadata": {{
      "topic_id": as provided,
      "topic": "", as provided 
      "subtopic": "",as provided
      "difficulty": "EASY/MEDIUM/HARD",
      
    "ai_answer_keywords": [<max 10 keywords>
      "keyword1",
      "keyword2",
      ...
      "keyword10"
    ]
  }}
]
Input Values:
Education Level: {education_level}
Subject: {Subject}
Topic: {Topic}
topic_id : {topic_id}
Subtopic: {Subtopic}
Explanations must be ≤200 words in total.
Logical consistency, clarity, and non-ambiguity are mandatory.
Strictly follow the JSON format.'''

    text_passage_prompt = '''You are an expert in generating text based questions in JSON format.
Your task is to generate a realistic, logically consistent set of questions based on the given scenario.
Requirements:
Passage:
Generate a passage in 200-250 words exactly containing {num_questions} {question_type} {question_format} this question format is for how many options are there in the question and what is the basic format return only those keys that are asked in json response
The passage should clearly describe the scenario, problem, or context relevant to the topic.
Ensure the passage is self-contained, unambiguous, and suitable for generating reasoning-based questions.
Questions:
Generate questions based on the passage.
Each question must have exactly 4 options labeled:
provide metadata as well
Provide the correct answer index as a string.
Each explanation must be concise, logically consistent, and ≤200 words.
Avoid contradictions, overlapping options, or ambiguity.
Focus on reasoning, clarity, and stepwise logic.
JSON Output Format follow the below format only :
if mcq
[
{{"passage": "generate a passage here in 200-250 words",
  "questions": [

  "question": "",
  "options": [
  5 options
  ],
  "solution": "",
  "correct_answer": integer index of options array that is correct 0/1/2/3 etc,
  *metadata**:
  - topic: [Use exact value from input metadata]
  - topic_id: [Use exact value from input metadata]
  - subtopic: [If provided, use exact value — do not generate your own]
  - difficulty: [EASY / MEDIUM / HARD — must match metadata if present]
  - mcq_type: [integer {mcq_type}] ,for general return 0
  ]}}]
if descriptive
[
{{"passage": "",
"questions": [

  "question": "",
  "answer":"",
  "metadata": {{
      "topic_id": as provided,
      "topic": "", as provided 
      "subtopic": "",as provided
      "difficulty": "EASY/MEDIUM/HARD",
      
    "ai_answer_keywords": [<max 10 keywords>
      "keyword1",
      "keyword2",
      ...
      "keyword10"
    ]
  }}
  }}]


Input Values:
Education Level: {education_level}
Subject: {Subject}
Topic: {Topic}
topic_id : {topic_id}
Subtopic: {Subtopic}
Explanations must be ≤200 words in total.
Logical consistency, clarity, and non-ambiguity are mandatory.
Strictly follow the JSON format.'''

    # NOTE: Removed predictive_analysis_prompt (exam analytics - not used in college system)

    predictive_analysis_prompt_removed = """You are an advanced Educational Data Analyst AI specialized in Learning Analytics and Adaptive Study Planning.  
Your task is to analyze a student's performance based on the data from their **past three exams**, including **questions, chosen answers, correct answers, scores, and timing.**

---

### INPUT DATA STRUCTURE

You will receive:
1. **Exam metadata** (exam name, date, subject, total marks, marks obtained, total time, difficulty level)
2. **Question-level data**, containing for each question:
   - question_id
   - question_text
   - subject
   - topic
   - difficulty_level
   - correct_answer
   - chosen_answer
   - time_spent (in seconds)
   - marks_obtained

YOUR TASK
Analyze this 3-exam dataset holistically and generate the following 3 analytical layers:

1. 📊 Learning Analytics – Identify Knowledge Gaps
Detect patterns of conceptual misunderstanding or low accuracy by topic and difficulty level.

Highlight consistent weak areas (e.g., “Modern Indian History factual recall” or “Polity – Constitutional Articles”).

Identify whether errors arise from conceptual gaps, carelessness, or guessing behavior.

Recommend specific improvement actions (study sources, practice drills, revision frequency).

2. ⏱️ Learning Pace Adjustment – Optimize Study and Test-Taking Speed
Analyze time_spent per question and identify subjects or question types where pacing is suboptimal.

Recommend whether the student needs to speed up (too cautious) or slow down (too hasty).

Suggest learning speed strategies: e.g., time-boxed revision, deliberate practice, micro-tests, or spaced recall.

3. 📈 Predictive Insights – Forecast Future Performance
Based on performance trends across 3 exams, predict the likely score trajectory in the next exam.

Identify high-risk subjects/topics that could limit improvement.

Estimate expected improvement (%) with continued effort and suggest measurable milestones.

Provide future success probability (qualitative: High / Moderate / Low).
Output json


  "learning_analytics": 
    "knowledge_gaps": [
      
        "subject": "",
        "topics": [],
        "error_pattern": "",                // e.g., "confuses similar constitutional articles"
        "question_difficulty_pattern": "",  // e.g., "weak in medium-difficulty analytical questions"
        "likely_cause": "",                 // e.g., "conceptual confusion", "lack of revision", "guessing"
        "recommendations": "",
     
      
    ],
    "accuracy_breakdown": 
      "overall_accuracy_trend": "",         // e.g., "Improving +7% across 3 exams"
      "subjectwise_accuracy": 
        "History": 72,
        "Polity": 85,
        "Economy": 61,
        "Geography": 79
      ,
      "difficulty_level_accuracy": 
        "Easy": 88,
        "Medium": 70,
        "Hard": 54
      
    ,
    "conceptual_strengths": [
  
        "subject": "",
        "topics": [],
        "strength_reason": ""               // e.g., "Consistently high accuracy in analytical questions"
      
    ],
    "error_analysis": 
      "careless_errors": 5,
      "guessing_errors": 3,
      "conceptual_errors": 8,
      "skipped_questions": 4
    
  ,

  "learning_pace_adjustment": 
    "time_trends": "",                      // e.g., "Average time per question reduced by 12% since Exam 1"
    "subjectwise_time_analysis": {
      "History": "avg_time_sec": 38, "trend": "slower",
      "Economy": "avg_time_sec": 52, "trend": "improving"
    ,
    "pace_efficiency_score": "",            // computed from speed × accuracy (0–100)
    "consistency_index": "",                // measures timing and accuracy stability (0–1)
    "suggested_actions": "",
    "practice_recommendations": [
      
        "subject": "",
        "method": "",                       // e.g., "timed quiz", "spaced repetition", "micro-tests"
        "frequency_per_week": 3
      
    ]
  ,

  "predictive_insights": 
    "expected_score_next_exam": "",
    "confidence_level": "",                 // e.g., "High", "Moderate", "Low"
    "expected_accuracy_trend": "",          // e.g., "Projected +5% improvement"
    "risk_topics": [],
    "growth_rate_estimate": "",             // e.g., "1.8% improvement per exam"
    "probability_of_mastery": 
      "History": 0.85,
      "Polity": 0.92,
      "Economy": 0.63,
      "Geography": 0.79
    ,
    "action_plan": "",
    "timeline_to_target": "4 weeks",        // when they can reach target proficiency
    "next_focus_strategy": "Balanced reinforcement of Economy + Advanced Polity"
  ,

  "meta_analysis": 
    "data_span": "3 exams",
    "performance_trend_summary": "Overall improvement with residual weakness in Economy and Modern History.",
    "student_engagement_index": 0.76,       // measure of consistency, derived from attempts/time spent
    "recommended_revision_cycle": "14 days" // ideal cycle before next test
  


"""
    # NOTE: Removed insights_prompt (psychometric/cognitive evaluation - not used in college system)

    insights_prompt_removed =''' You are an expert cognitive evaluator and educational psychologist.
Given a list of attempted multiple-choice questions in the following format:
questions : {data}
Analyze this dataset and generate the following:

Skill Breakdown
**If all the chosen answers are null then return 0% for all the skills**
Calculate and return a percentage score (0–100%) for each cognitive skill. The score must be based on a comprehensive analysis of accuracy, time taken, and completeness.
Calculation Logic:
Accuracy: if chosen answer matches correct answer contributes positively to the score otherwise contributes negatively 
Skipped Questions: A chosen_answer of null must be treated as an incorrect answer. It signifies a knowledge gap and must reduce the final percentage score for that cognitive skill. The score cannot be 100% if any question for that skill is skipped.
Time Penalty: For correctly answered questions, if time_taken_seconds is significantly higher than average_time_for_skill_seconds, apply a minor penalty to the score for that skill.
Provide the score based on attempted questions are less than total questions Reduce the score proportionally based on the number of questions attempted.
**If all the chosen answers are null then return 0% for all the skills**

Your Strengths
List the top 10 cognitive strengths the user has. This should be based on a combination of high accuracy and faster-than-average response times. A skill should not be listed as a strength if it has a notable number of incorrect or skipped (null) answers.

Areas to Improve
Identify the 10 cognitive areas where the user struggled most. Prioritize skills with the highest rates of incorrect answers and/or skipped (null) answers. Also, consider skills where correct answers were consistently much slower than the average.

Recommendations
Provide 10 short, actionable recommendations to improve the identified weak areas and further reinforce the strong ones.
Cognitive Strength Summary
Write a short paragraph summarizing the user's strongest cognitive abilities and how they might be leveraged in competitive exams or professional settings.
Output Constraints:
Ensure the output is well-structured, insight-driven, concise, and specific.
Do not repeat the raw input data in the response.
Return a single JSON object.
All keys in the JSON object must be in snake_case and lowercase.

return a json response make every key in snake case and lower case
Skill Breakdown: 
    Logical Reasoning: float%

    Analytical Ability: float%

    Memory:float%

    Spatial Ability: float%

    Decision Making: float%

    Pattern Recognition: float%

    Critical Thinking: float%
Strengths: list
Areas to Improve: list 
Recommendations: list 
Cognitive Strength Summary:
'''


    # NOTE: Removed mock_mcq_prompt (UPSC-specific)
    # College system uses mcq_prompt below instead


    # NOTE: Removed mock_descriptive_prompt (UPSC Mains-specific)
    # College system uses descriptive_prompt and new type-specific prompts below
    mcq_prompt = '''
This is the user prompt for generating MCQs for {education_level} students based on the provided context and instructions{User_prompt}.

You are an expert academic question generator for {education_level} level education. Generate {num_questions} high-quality, unique, and conceptually rich Multiple Choice Questions (MCQs) strictly based on the context provided.

**Questions must be conceptual and analytical in nature.**
**Questions must be appropriate for {education_level} curriculum.**
**Use STANDARD 4-OPTION MCQ FORMAT (simple question with 4 distinct answer choices).**
**Do NOT use statement-based or assertion-based format.**
---
Generate questions in the language appropriate for the subject (English or regional language as needed)

### 🔍 CONTEXT

- **Education Level**: {education_level}
- **Subject**: {subject}
- **Topic**: {topic}
- **Subtopic**: {subtopic}
- **Content**: {combined_content}
- **Focus Instruction**: {focus_instruction}
- **Question Style**: {question_focus}
- **Explanation Context**: {explanation_context}

Use ONLY the subject, topic, subtopic provided. Do NOT hallucinate or generate your own topic IDs or subtopics.

---

### 📌 STANDARD MCQ FORMAT (4 Options):

Generate questions in this **SIMPLE, STANDARD FORMAT**:

```json
[
  {{
    "question": "Clear, direct question text here (no statements, no assertions)",
    "options": [
      "Option A - First distinct answer choice",
      "Option B - Second distinct answer choice",
      "Option C - Third distinct answer choice",
      "Option D - Fourth distinct answer choice"
    ],
    "correct_answer": "Option A - First distinct answer choice",
    "explanation": "Detailed explanation of why the correct answer is right and why other options are wrong. Reference specific concepts from the content.",
    "metadata": {{
      "topic": "{topic}",
      "topic_id": "{topic_id}",
      "subtopic": "{subtopic}",
      "difficult_level": "EASY/MEDIUM/HARD",
      "mcq_type": {mcq_type}
    }}
  }}
]
```

### ✅ RULES FOR STANDARD MCQ FORMAT:

1. **Question**: Direct, clear question (no "Which of the following statements..." format)
   - Example: "What is the primary approach used by G.U. Pope in translating Thirukkural?"
   - NOT: "Which of the following statements about Pope's translation are correct?"

2. **Options**: Exactly 4 distinct, complete answer choices
   - Each option must be a standalone answer
   - NOT combinations like "Only 1", "1 and 2", "2 and 3", "All of the above"
   - All options must be similar in length and complexity
   - Options should be plausible distractors (not obviously wrong)

3. **Correct Answer**: Must be the EXACT text of one of the 4 options (not an index)

4. **Explanation**:
   - Explain why the correct answer is right
   - Briefly explain why each wrong option is incorrect
   - Use concepts from the provided content
   - Do NOT say "based on the context provided"

5. **For Math/Aptitude**:
   - Solve the problem first
   - Include the solution as one of the options
   - Other options should be common mistakes or near-misses

### ❌ DO NOT USE:
- Statement-based format with "statements" field
- Assertion-based questions
- Options like "Only 1", "1 and 2", "All of the above"
- "instruction" or "statements" fields

**Return a JSON array of question objects following the format above.**
**For single question requests, still return an array with one object.**
'''

    # NOTE: Removed explanation_prompt (UPSC-specific context and references)
    # College system can adapt this later for college-specific explanation generation

    explanation_prompt_removed = '''You are an expert UPSC content creator and subject-matter analyst who writes exam-oriented, in-depth answer explanations (model-answer / test-series quality).
**Do not provide markdown format.**
**Use html tag to provide this**
Make sure you follow the below structure strictly
do not use (#,*,- or any markdown symbols)
Input fields (all provided by the system):
Question: {question}
UPSC PYQs (if available): {upsc_pyqs}
do not start with <html> or <body> or <div>
it must start from <p> and end with </p>
GENERAL RULES (must follow):
1. Use only the provided context ({context}) and any standard sources you explicitly name in the **Source References** section. Do NOT hallucinate facts or case details not present in the context or in standard sources you cite.
2. For every factual claim or legal provision you assert, attach an inline reference to either:
   
   - a named standard source (e.g., "M. Laxmikanth - Chapter X") in the **Source References** section.
   Format inline chunk citations like: [Source: chunk_23].
3. If the context is insufficient to fully justify a claim, explicitly state which piece of information is missing and what kind of source or clause would be needed. Do not invent missing details.
4. Tone: academic, neutral, concise, and exam-focused (model answer/test-series style). Avoid conversational fluff.
5. Provide an **in-depth** explanation — not a short summary. Use layered reasoning: short conclusion, conceptual backbone, step-by-step logical justification, and final takeaway.

OUTPUT STRUCTURE (Do not include headings, try to provide output in html format):
------------------------------------------------------------

Start with a one-line direct answer: e.g., "Answer: (b)". Then present a 3–6 bullet point **summary** of the core reason(s) why that option/combination is correct (each bullet 1–2 sentences).
Then give a **detailed, point-wise explanation**. If the question contains statements, evaluate each statement individually:
  Statement 1 — Correct / Incorrect:
  - Short verdict (Correct / Incorrect).  
  - Explanation (2–4 sentences) with stepwise logic and conceptual links.  
  - Evidence: cite supporting context chunk(s) or named source(s) inline. Example: [Source: chunk_5].
If single-option MCQ: Explain fully why the correct option is correct (2–4 short paragraphs) and then explain each wrong option similarly.

------------------------------------------------------------
Conceptual Understanding (3–6 bullets)
Present the underlying concept(s) that the question tests (each bullet 1–3 sentences).
For constitutional/legal concepts, mention exact Articles, clauses, amendments or authoritative doctrines where applicable (with source chunk or named source references).

------------------------------------------------------------
Why the Correct Option is Right (stepwise)
Give a numbered, step-by-step logical chain (3–7 steps) that leads from principles/facts to the answer.
After each step, cite the chunk ID or source that supports that step.

------------------------------------------------------------
Why Other Options Are Wrong
For each incorrect option / statement:  
  1. Short verdict (Incorrect because...)  
  2. The precise error (misinterpretation, incomplete fact, wrong timeline, incorrect legal provision).  
  3. Correct fact/explanation (with citation).

------------------------------------------------------------
Source References
List relevant canonical sources and the specific supporting statements from question. Use this format:
  - [chunk_5] — Extract: "<first 10–12 words of the chunk as-is>" (only if short), or just the chunk id when chunk is long.
  - NCERT Class X/Y — Chapter: [name], (if used)
  - M. Laxmikanth — Chapter: [name], Page/section (if used)
  - Supreme Court — Case name, Year (if used)
If you infer a source not present in context_chunks, label it "Suggested reference (not in provided context): ..."

------------------------------------------------------------
Question Difficulty Level
Label: Basic / Moderate / Advanced / Analytical.  
Justify in 1–2 sentences referencing the cognitive skill required (recall vs analysis vs multi-step legal reasoning).

------------------------------------------------------------
Relevance in UPSC Context
2–4 bullets linking topic to syllabus areas (Prelims/Mains/Essay), governance/constitutional importance, and possible current affairs linkages.

------------------------------------------------------------
What to Read / Preparation Pointers
Give 5 targeted study items (book + chapter/page or report + section), prioritized (1 = highest priority).
Include at least one short practice tip (how to memorize/apply concept in exam answers).

------------------------------------------------------------
UPSC PYQs (if available)
If {upsc_pyqs} is non-empty, present them verbatim with their correct answers and a 1–2 line linkage explaining similarity to the current question.
If empty, write "—".

------------------------------------------------------------
Current Affairs / Case Laws
List any relevant recent judgments, government notifications or contemporary examples found. If none exist in context, write "—".  
For each case/policy listed, give a one-line statement of relevance and cite the chunk or named source.

------------------------------------------------------------
Model Answer (Optional but recommended)
6–10 sentence polished answer a candidate could write in Mains/Interview, integrating the key points above. Keep it crisp and exam-appropriate.

------------------------------------------------------------
A concise, memorable summary students should remember.

------------------------------------------------------------
ADDITIONAL FORMATTING & LENGTH GUIDELINES
Use bold for verdicts ("Correct", "Incorrect") and for section subheadings inside the explanation. Use numbered lists where helpful.
Target length:  
  - For statement questions: 400–800 words.  
  - For single-answer MCQs: 300–600 words.  
  These are soft targets — prioritize depth and clarity over exact word counts.
Ensure at least 3 citations to the provided context_chunks whenever those statements are relevant; otherwise explicitly say the context lacked supporting statements.

ERROR HANDLING
If context_chunks contradict each other, point out the contradiction, list the conflicting content, and recommend which type of authoritative source would resolve it.
If 
explanation_text or context_chunks is empty or insufficient, explicitly state what is missing and produce the best-effort explanation clearly labeled as "Partial — needs more context". Do not fabricate.

END

example output
<p>Answer: (a)</p>
<ul>
<li>Government policies are crucial for the success of the Second Green Revolution by incentivizing sustainable practices and fostering innovation [Source: chunk_23].</li>
<li>Subsidies encourage farmers to adopt sustainable farming methods, making them financially viable [Source: chunk_23].</li>
<li>Investment in agricultural research and development (R&D) is essential for creating and improving sustainable technologies [Source: chunk_23].</li>
<li>Simply deregulating agricultural markets without proper safeguards can expose farmers to vulnerabilities and is not a guaranteed path to success [Source: chunk_23].</li>
</ul>

<p><b>Detailed Explanation:</b></p>

<p>Statement 1 - <b>Correct</b>:</p>
<ul>
<li>Providing subsidies for sustainable farming practices encourages adoption among farmers.</li>
<li>Subsidies can make sustainable practices economically attractive to farmers, incentivizing them to shift from conventional methods [Source: chunk_23]. This support helps offset the initial costs and risks associated with adopting new techniques.</li>
</ul>

<p>Statement 2 - <b>Correct</b>:</p>
<ul>
<li>Investing in agricultural research and development (R&D) enhances innovation in sustainable technologies.</li>
<li>R&D is crucial for developing new sustainable agricultural technologies and improving existing ones [Source: chunk_23]. These innovations can lead to higher yields, reduced environmental impact, and greater resilience to climate change.</li>
</ul>

<p>Statement 3 - <b>Incorrect</b>:</p>
<ul>
<li>Deregulating agricultural markets and removing price supports guarantees the success of the Second Green Revolution.</li>
<li>Deregulation without adequate safeguards can expose farmers to market volatility and undermine their livelihoods [Source: chunk_23]. Price supports often provide a safety net, and their removal without alternative mechanisms can create economic instability.</li>
</ul>

<p><b>Conceptual Understanding</b></p>
<ul>
<li>The Second Green Revolution focuses on sustainable agricultural practices, aiming to increase productivity while minimizing environmental impact [Source: chunk_23].</li>
<li>Government policies play a vital role in driving this revolution by creating an enabling environment for farmers and researchers [Source: chunk_23].</li>
<li>Subsidies and R&D investments are key policy tools for promoting sustainable agriculture.</li>
<li>Market deregulation, if not implemented carefully, can negatively impact farmers and hinder the goals of the Second Green Revolution [Source: chunk_23].</li>
</ul>

<p><b>Why the Correct Option is Right</b></p>
<ol>
<li>The Second Green Revolution requires a shift towards sustainable farming practices.</li>
<li>Government policies, such as subsidies, can incentivize farmers to adopt these practices [Source: chunk_23].</li>
<li>Investing in agricultural R&D promotes innovation in sustainable technologies [Source: chunk_23].</li>
<li>However, deregulation without safeguards can harm farmers.</li>
<li>Therefore, only statements 1 and 2 are correct.</li>
</ol>

<p><b>Why Other Options Are Wrong</b></p>
<ul>
<li>Option (b) - Incorrect because statement 3 is incorrect as deregulation without safeguards can harm farmers.</li>
<li>Option (c) - Incorrect because statement 3 is incorrect as deregulation without safeguards can harm farmers.</li>
<li>Option (d) - Incorrect because statement 3 is incorrect as deregulation without safeguards can harm farmers.</li>
</ul>

<p><b>Source References</b></p>
<ul>
<li>[chunk_23] - Extract: "Government policies play a critical role in facilitating the Second Green Revolution. Statement 1 is correct as subsidies can incentivize farmers to adopt sustainable practices. Statement 2 is also correct, as R&D investments can drive innovation in sustainable agricultural technologies. Statement 3 is incorrect because deregulation without adequate safeguards can expose farmers to market volatility and undermine their livelihoods. Therefore, only statements 1 and 2 are correct."</li>
</ul>

<p><b>Question Difficulty Level</b></p>
<p>Moderate. This question requires understanding of government policies related to agriculture and their potential impacts, demanding analytical skills.</p>

<p><b>Relevance in UPSC Context</b></p>
<ul>
<li>Prelims: Government policies and interventions in agriculture.</li>
<li>Mains: Issues related to agriculture, sustainable development, and government schemes.</li>
<li>Essay: Agriculture and sustainable development.</li>
</ul>

<p><b>What to Read / Preparation Pointers</b></p>
<ol>
<li>NCERT Class XII Geography - Chapter on Agriculture.</li>
<li>Economic Survey - Chapter on Agriculture.</li>
<li>Government schemes related to agriculture and sustainable farming.</li>
<li>Current affairs related to agricultural policies and reforms.</li>
<li>Practice: Analyze the potential impacts of different government policies on the agricultural sector.</li>
</ol>

<p><b>UPSC PYQs (if available)</b></p>
<p>—</p>

<p><b>Current Affairs / Case Laws</b></p>
<p>—</p>

<p><b>Model Answer</b></p>
<p>Government policies are instrumental in fostering the Second Green Revolution. Subsidies for sustainable farming practices encourage farmers to adopt environmentally friendly methods by making them economically viable. Investments in agricultural research and development (R&D) drive innovation, leading to the creation of sustainable technologies that enhance productivity and resilience. Deregulating agricultural markets without appropriate safeguards can expose farmers to market volatility, thereby undermining their livelihoods and hindering the goals of the Second Green Revolution. Therefore, a balanced approach involving targeted support and strategic investments is essential for achieving sustainable agricultural development. Thus, only statements 1 and 2 are correct, highlighting the importance of incentivizing sustainable practices and fostering innovation through government policies.</p>

<p>Government support through subsidies and R&D is essential for a successful Second Green Revolution, while deregulation requires careful implementation.</p>
'''

    image_prompt ='''Generate {total_questions} multiple-choice questions {question_type} for an {image_type} if image_type is table generate table based questions if it is chart generate chart basedimage related to the subject "{subject}" and topic "{topic}" with the following requirements:
Generate {total_questions} questions for {image_type}  in this format {question_format}this question format is for how many options are there in the question and what is the basic format return only those keys that are asked in json response
 if table then only table if chart then only chart/graph on subject "{subject}", topic "{topic}".
provide unique questions with no repetition and conceptual clarity and analytical thinking
- Ensure each question is analytical and concept-based.
- Ensure the question is relevant to the image type and subject.
- Ensure the question is unique and not similar to any previous questions.
- Make sure every question is unique and follows any of the above formats list
- **generate  pie chart or bar chart or line chart or scatter plot or histogram or box plot or violin plot or area chart or radar chart or waterfall chart for mathamatical or statistical questions**
- **generate table for statistical or mathematical questions**
- ** At a time only generate a table or chart not both**
**CHART REQUIREMENTS:**
- Use matplotlib for chart (no seaborn, no external data download).
- Code must be self-contained and runnable without internet access.
- Example of escaped code for JSON:
  "chart": "import matplotlib.pyplot as plt\\nimport numpy as np\\ndata = np.random.rand(5,5)\\nplt.imshow(data, cmap='hot', interpolation='nearest')\\nplt.show()"

**TABLE REQUIREMENTS:**
- Use pandas to create tables.
- Must be small (max 6 rows × 4 columns) and related to the question.
- Example of escaped code for JSON:
  "table": "import pandas as pd\\ndata = {{'A':[1,2],'B':[3,4]}}\\ndf = pd.DataFrame(data)\\nprint(df)"

**CONSTRAINTS:**
- Do not add text outside the JSON.
- Ensure all Python code in "chart" and "table" fields is JSON-safe (escaped as above).
- Ensure the question is relevant to the image type and subject.
- Ensure the question is analytical and concept-based.
- Ensure the question is unique.
- Ensure difficulty is realistic.
Make sure to provide the response in correct json format as shown below
**OUTPUT FORMAT (strict JSON):**
[
  {{
    "question": "Write your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"], or "answer": "Write your answer here" if question_type is descriptive
    "chart": "<escaped python code>", make sure to provide a valid python code to generate pie chart
    "table": "<escaped python code>", malke sure to provide a valid python code to generate table
    "correct_answer":integer index of options array that is correct 0/1/2/3 etc  # index of the correct answer <do not provide if question_type is descriptive>
- **explanation**:["option A  why this option 0 is correct/incorrect with detailed reason, if there are statements explain statements",
"option B why this option 1 is correct/incorrect with detailed reason if there are statements explain statements also",
"option C why this option 2 is correct/incorrect with detailed reason if there are statements explain statements also",
"option D why this option 3 is correct/incorrect with detailed reason if there are statements explain statements also"] 
<explanation key must be a list explaining why a particular option 0/1/2/3 is correct or incorrect why particular statements are correct or incorrect in every option explanation>,
    "metadata": {{
      "topic": "{topic}",
      "topic_id": "{topic_id}",
      "subtopic": "{subtopic}",
      "difficulty": "Easy",
      mcq_type: [integer {mcq_type}] ,for general return 0
      if question type is descriptive then provide
      "ai_answer_keywords": [<if question_type is descriptive then provide a list of max 10 keywords that must be included in the answer>]
      "keyword1",
      "keyword2",
      ...
    ]
    }}
  }}
]
**for single question request also provide list of single object in the response**
'''


    descriptive_prompt = '''
You are an AI trained to generate academic descriptive questions for {education_level} students.

🔍 **Task**:
Generate {num_questions} **descriptive** questions and answers in **strict JSON format** based on the input provided below.

📌 **Inputs**:
**User Prompt**: {User_prompt}
**Subject**: {subject}
topic_id: {topic_id}
**Topic**: {topic}
**Subtopic**: {subtopic}
**Focus Instruction**: {focus_instruction}
**Question Focus**: {question_focus}
**Subtopic Context**: {subtopic_context}
**Explanation Context**: {explanation_context}
**Content** (for reference): {combined_content}

📎 **Instructions**:
Questions must be **analytical, concept-based**, and at the college academic level.
Make sure the **content is relevant** to the subject and topic; if not, throw an error.
Every answer must be **structured**, concise (≤ 200 words), and insightful.
Include a list of ai_answer_keywords which are **must-include** concepts for evaluating answers.

📤 **Output Format (Strict JSON List)**:
json
[
  {{
    "question": "Analytical and well-structured college-level question.",
    "answer": "A concise, structured, and insightful answer within 200 words.",
    "metadata": {{
      "topic_id": {topic_id},
      "topic": "{topic}",
      "subtopic": "{subtopic}",
      "difficulty": "EASY/MEDIUM/HARD",

    "ai_answer_keywords": [<max 10 keywords>
      "keyword1",
      "keyword2",
      ...
      "keyword10"
    ]
  }}
]
**for single question request also provide list of single object in the response**
'''

    # ============================================================================
    # COLLEGE-SPECIFIC DESCRIPTIVE QUESTION TYPE PROMPTS
    # ============================================================================

    descriptive_very_short_prompt = '''
You are an expert examination question generator for {education_level} level students.

Generate {num_questions} **Very Short Answer questions (2 marks, ~50 words)** in strict JSON format.

📌 **Inputs**:
**Subject**: {subject}
**Topic**: {topic}
**Subtopic**: {subtopic}
**Content**: {combined_content}

📎 **Requirements**:
- Questions should test **recall and basic understanding**
- Answers must be **concise, factual, and to-the-point** (~50 words)
- Include **ai_answer_keywords** (max 5 keywords) for evaluation

📤 **Output Format (Strict JSON List)**:
[
  {{
    "question": "Short, direct question requiring brief factual answer.",
    "answer": "Concise answer in approximately 50 words.",
    "marks": 2,
    "word_limit": 50,
    "metadata": {{
      "topic_id": "{topic_id}",
      "topic": "{topic}",
      "subtopic": "{subtopic}",
      "difficulty": "EASY/MEDIUM",
      "question_type": "very_short",
      "ai_answer_keywords": ["keyword1", "keyword2", "keyword3"]
    }}
  }}
]
**for single question request also provide list of single object in the response**
'''

    descriptive_short_prompt = '''
You are an expert examination question generator for {education_level} level students.

Generate {num_questions} **Short Answer questions (5 marks, ~150 words)** in strict JSON format.

📌 **Inputs**:
**Subject**: {subject}
**Topic**: {topic}
**Subtopic**: {subtopic}
**Content**: {combined_content}

📎 **Requirements**:
- Questions should test **comprehension and application** of concepts
- Answers must be **structured with 2-3 key points** (~150 words)
- Include **ai_answer_keywords** (max 7 keywords) for evaluation

📤 **Output Format (Strict JSON List)**:
[
  {{
    "question": "Question requiring explanation with examples/reasoning.",
    "answer": "Structured answer with 2-3 key points in approximately 150 words.",
    "marks": 5,
    "word_limit": 150,
    "metadata": {{
      "topic_id": "{topic_id}",
      "topic": "{topic}",
      "subtopic": "{subtopic}",
      "difficulty": "MEDIUM",
      "question_type": "short",
      "ai_answer_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }}
  }}
]
**for single question request also provide list of single object in the response**
'''

    descriptive_long_essay_prompt = '''
You are an expert examination question generator for {education_level} level students.

Generate {num_questions} **Long Essay questions (15 marks, ~500 words)** in strict JSON format.

📌 **Inputs**:
**Subject**: {subject}
**Topic**: {topic}
**Subtopic**: {subtopic}
**Content**: {combined_content}

📎 **Requirements**:
- Questions should test **critical analysis, synthesis, and evaluation**
- Answers must be **comprehensive with introduction, body (4-5 points), and conclusion** (~500 words)
- Include **ai_answer_keywords** (max 10 keywords) for evaluation

📤 **Output Format (Strict JSON List)**:
[
  {{
    "question": "Analytical question requiring detailed discussion and critical evaluation.",
    "answer": "Comprehensive essay-style answer with introduction, multiple points, and conclusion in approximately 500 words.",
    "marks": 15,
    "word_limit": 500,
    "metadata": {{
      "topic_id": "{topic_id}",
      "topic": "{topic}",
      "subtopic": "{subtopic}",
      "difficulty": "HARD",
      "question_type": "long_essay",
      "ai_answer_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
    }}
  }}
]
**for single question request also provide list of single object in the response**
'''

    # Descriptive Question Types Configuration
    DESCRIPTIVE_TYPES = {
        "very_short": {
            "marks": 2,
            "word_limit": 50,
            "prompt": "descriptive_very_short_prompt",
            "difficulty": ["EASY", "MEDIUM"]
        },
        "short": {
            "marks": 5,
            "word_limit": 150,
            "prompt": "descriptive_short_prompt",
            "difficulty": ["MEDIUM"]
        },
        "long_essay": {
            "marks": 15,
            "word_limit": 500,
            "prompt": "descriptive_long_essay_prompt",
            "difficulty": ["MEDIUM", "HARD"]
        }
    }
    BATCH_SIZE = 5

    REDIS_TIMEOUT = 60 * 60 * 24

    psychometric_prompt = """ Generate exactly {num_questions} multiple-choice questions (MCQs) for a psychometric assessment. Each question should align with the following metadata:

- Section: {section_name}
- Subject: {subject_name}
- Topic: {topic_name}
- Difficulty Level: {difficulty} (must be one of EASY, MEDIUM, HARD)
- subject_id: {subject_id}
- topic_id: {topic_id}
- Marks per question: {marks}
- Options per question: {num_options} (e.g., 4 options)

### Requirements:

1. The number of questions **must be exactly {num_questions}**.
2. Questions should be relevant to the **given topic, subject, and difficulty level**.
3. Each question must include:
   - A clear and concise question text.
   - A list of {num_options} unique and meaningful options.
   - The index (0-based) of the correct answer.
   - A detailed explanation for the correct answer.
   - The same `subject_id`, `subject_name`, `topic_id`, and `topic_name` provided.

4. Ensure no repetition of questions or options.
5. Format the response in **strict JSON** as a list of question objects.

### JSON Format (per question):

```json lIST of object

  "question": "What is the correct approach to ...?",
  "options": [
    "Option 0 text",
    "Option 1 text",
    "Option 2 text",
    "Option 3 text"
  ],
  "correct_answer": 2,
  "explanation": "Explanation of why option 2 is correct.",
  "subject_id": "{subject_id}",
  "subject_name": "{subject_name}",
  "topic_id": "{topic_id}",
  "topic_name": "{topic_name}",
  "difficulty_level": "{difficulty}"
,...
**for single question request also provide list of single object in the response**


    """

    