import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CurriculumCourse } from '../../database/entities/teacher/curriculum-course.entity';

const MACRO_PLAN_SYSTEM_PROMPT = `You are an expert curriculum designer for engineering and bachelor's degree programs with 20+ years of experience at top universities. You specialize in creating well-structured, pedagogically sound course plans that maximize student learning and engagement.

Your expertise includes:
- Bloom's taxonomy and learning progression
- Cognitive load management
- Spaced repetition and interleaving
- Active learning methodologies
- Assessment alignment with learning outcomes
- Engineering education best practices

RULES:
1. Always respond with valid JSON only - no markdown, no explanations
2. Follow the exact schema provided
3. Be specific and actionable in all recommendations
4. Sequence topics from foundational to advanced
5. Never place assessments before content is taught
6. Include buffer weeks before major exams
7. Balance difficulty across the semester (no more than 2 consecutive high-difficulty weeks)
8. Consider prerequisite dependencies between topics
9. Align everything with stated learning outcomes`;

const SESSION_BLUEPRINT_SYSTEM_PROMPT = `You are a master instructional designer who creates engaging, minute-by-minute lesson plans for engineering courses. You understand cognitive science, attention spans, and how to maintain engagement in technical subjects.

Your session designs always include:
- Compelling hooks that create curiosity
- Content chunked into 15-20 minute segments
- Regular interaction points
- Real-world engineering applications
- Checkpoint questions that reveal understanding
- Emergency plans for time management

RULES:
1. Always respond with valid JSON only
2. Follow the exact schema provided
3. Total section durations must equal session duration
4. Every session must start with a hook and end with a preview
5. Include at least one interactive activity per session
6. Provide specific, usable teacher scripts
7. Include common misconceptions for the topic
8. Be specific about materials needed`;

const ENGAGEMENT_TOOLKIT_SYSTEM_PROMPT = `You are a master teacher known for making complex engineering concepts accessible and memorable. You have a vast repertoire of analogies, demonstrations, stories, and activities.

Your toolkits help teachers:
- Explain difficult concepts using relatable analogies
- Connect theory to real-world engineering practice
- Create "aha moments" through demonstrations
- Facilitate meaningful discussions
- Address and prevent common misconceptions

RULES:
1. Always respond with valid JSON only
2. Be creative and specific - no generic suggestions
3. Tailor everything to engineering students
4. Include specific examples, not vague descriptions
5. Provide multiple options for different teaching styles`;

export interface MacroPlanWeek {
  weekNumber: number;
  theme: string;
  topics: string[];
  learningObjectives: string[];
  difficultyLevel: 'low' | 'medium' | 'high';
  sessionCount: number;
  totalHours: number;
  hasAssessment: boolean;
  assessmentType?: string;
  assessmentDetails?: string;
  prerequisites: string[];
  keyConceptsIntroduced: string[];
  teacherNotes: string;
  isBufferWeek: boolean;
  labComponent?: {
    title: string;
    duration: number;
    description: string;
  };
}

export interface MacroPlan {
  courseName: string;
  totalWeeks: number;
  courseOverview: string;
  teachingPhilosophy: string;
  weeks: MacroPlanWeek[];
  assessmentStrategy: {
    quizCount: number;
    assignmentCount: number;
    midtermCount: number;
    projectCount: number;
    finalExam: boolean;
    weightages: Record<string, number>;
  };
  prerequisiteMap: Record<string, string[]>;
  suggestedResources: string[];
}

export interface SessionSection {
  type: 'hook' | 'core' | 'activity' | 'application' | 'checkpoint' | 'close';
  title: string;
  duration: number;
  content: string;
  teacherScript: string;
  materials: string[];
  interactionType: string;
  tips: string[];
}

export interface SessionBlueprint {
  sessionTitle: string;
  weekNumber: number;
  sessionNumber: number;
  duration: number;
  difficulty: 'low' | 'medium' | 'high';
  overview: string;
  sections: SessionSection[];
  keyConceptsCovered: string[];
  checkpointQuestion: {
    question: string;
    correctAnswer: string;
    commonWrongAnswers: string[];
    whyStudentsGetItWrong: string;
  };
  commonMisconceptions: {
    misconception: string;
    correction: string;
    howToPrevent: string;
  }[];
  realWorldConnections: string[];
  nextSessionPreview: string;
  emergencyPlan: {
    ifRunningBehind: string;
    ifRunningAhead: string;
    ifStudentsStruggling: string;
  };
  preparationChecklist: string[];
  boardWork: string;
  technologyNeeded: string[];
}

export interface EngagementToolkit {
  topic: string;
  analogies: {
    analogy: string;
    howToPresent: string;
    whenToUse: string;
    targetMisconception?: string;
  }[];
  realWorldExamples: {
    example: string;
    industry: string;
    company?: string;
    explanation: string;
  }[];
  demonstrations: {
    title: string;
    description: string;
    materialsNeeded: string[];
    duration: number;
    safetyNotes?: string;
    expectedOutcome: string;
  }[];
  discussionQuestions: {
    question: string;
    purpose: string;
    expectedResponses: string[];
    followUp: string;
  }[];
  quickActivities: {
    name: string;
    duration: number;
    description: string;
    groupSize: string;
    learningOutcome: string;
  }[];
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    howToFix: string;
    preventionStrategy: string;
  }[];
  visualAids: {
    type: string;
    description: string;
    suggestedSource?: string;
  }[];
  memoryHooks: {
    hook: string;
    whatItHelpsRemember: string;
  }[];
  industryConnections: {
    company: string;
    howTheyUseThis: string;
    interestingFact: string;
  }[];
}

@Injectable()
export class CurriculumAIService {
  private readonly logger = new Logger(CurriculumAIService.name);
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not configured');
    }
    this.openai = new OpenAI({ apiKey });
    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o';
  }

  async generateMacroPlan(course: CurriculumCourse): Promise<MacroPlan> {
    const userPrompt = this.buildMacroPlanPrompt(course);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: MACRO_PLAN_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return JSON.parse(content) as MacroPlan;
    } catch (error) {
      this.logger.error('Error generating macro plan:', error);
      throw error;
    }
  }

  async generateSessionBlueprint(
    course: CurriculumCourse,
    macroPlan: MacroPlan,
    weekNumber: number,
    sessionNumber: number,
  ): Promise<SessionBlueprint> {
    const week = macroPlan.weeks.find((w) => w.weekNumber === weekNumber);
    if (!week) {
      throw new Error(`Week ${weekNumber} not found in macro plan`);
    }

    const userPrompt = this.buildSessionPrompt(course, week, sessionNumber);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: SESSION_BLUEPRINT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return JSON.parse(content) as SessionBlueprint;
    } catch (error) {
      this.logger.error('Error generating session blueprint:', error);
      throw error;
    }
  }

  async generateEngagementToolkit(
    course: CurriculumCourse,
    sessionBlueprint: SessionBlueprint,
  ): Promise<EngagementToolkit> {
    const userPrompt = this.buildToolkitPrompt(course, sessionBlueprint);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: ENGAGEMENT_TOOLKIT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return JSON.parse(content) as EngagementToolkit;
    } catch (error) {
      this.logger.error('Error generating engagement toolkit:', error);
      throw error;
    }
  }

  async generateAdaptationSuggestion(
    course: CurriculumCourse,
    macroPlan: MacroPlan,
    triggerType: string,
    triggerData: Record<string, any>,
  ): Promise<{ suggestion: Record<string, any>; reasoning: string }> {
    const userPrompt = `
Based on the following curriculum and trigger, suggest adaptations:

COURSE: ${course.courseName}
SUBJECT: ${course.subject}
CURRENT PLAN: ${JSON.stringify(macroPlan, null, 2)}

ADAPTATION TRIGGER: ${triggerType}
TRIGGER DATA: ${JSON.stringify(triggerData, null, 2)}

Provide JSON with:
{
  "suggestion": {
    "affectedWeeks": [list of week numbers to modify],
    "proposedChanges": [
      {
        "weekNumber": number,
        "changeType": "add_content" | "remove_content" | "slow_pacing" | "add_review" | "reschedule",
        "description": "what to change",
        "details": {}
      }
    ],
    "schedulingImpact": "how this affects the overall schedule"
  },
  "reasoning": "detailed explanation of why these changes are recommended"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a curriculum adaptation specialist. Suggest minimal, effective changes to help students succeed. Always respond with valid JSON only.',
          },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Error generating adaptation suggestion:', error);
      throw error;
    }
  }

  private buildMacroPlanPrompt(course: CurriculumCourse): string {
    return `Generate a complete ${course.totalWeeks}-week curriculum macro plan for the following course:

COURSE DETAILS:
- Course Name: ${course.courseName}
- Course Code: ${course.courseCode || 'N/A'}
- Subject: ${course.subject}
- Department: ${course.department || 'N/A'}
- Student Level: ${course.studentLevel}

SCHEDULE:
- Total Weeks: ${course.totalWeeks}
- Hours per Week: ${course.hoursPerWeek}
- Session Duration: ${course.sessionDuration} minutes
- Sessions per Week: ${course.sessionsPerWeek}
- Session Type: ${course.sessionType}

CLASS CONTEXT:
- Class Size: ${course.classSize} students
- Class Vibe: ${course.classVibe}
- Primary Challenge: ${course.primaryChallenge || 'None specified'}
- Additional Notes: ${course.additionalNotes || 'None'}

LEARNING OUTCOMES:
${course.outcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Generate a JSON response with this exact structure:
{
  "courseName": "${course.courseName}",
  "totalWeeks": ${course.totalWeeks},
  "courseOverview": "2-3 paragraph overview of the course",
  "teachingPhilosophy": "1-2 paragraphs about the pedagogical approach",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Theme for this week",
      "topics": ["topic1", "topic2"],
      "learningObjectives": ["objective1", "objective2"],
      "difficultyLevel": "low" | "medium" | "high",
      "sessionCount": ${course.sessionsPerWeek},
      "totalHours": ${course.hoursPerWeek},
      "hasAssessment": true/false,
      "assessmentType": "quiz" | "assignment" | "project" | "midterm" | "final" (if hasAssessment),
      "assessmentDetails": "details about the assessment" (if hasAssessment),
      "prerequisites": ["concepts students should know"],
      "keyConceptsIntroduced": ["new concepts introduced this week"],
      "teacherNotes": "specific tips for this week",
      "isBufferWeek": false,
      "labComponent": { "title": "", "duration": 0, "description": "" } (if applicable)
    }
  ],
  "assessmentStrategy": {
    "quizCount": number,
    "assignmentCount": number,
    "midtermCount": number,
    "projectCount": number,
    "finalExam": true/false,
    "weightages": { "quizzes": 20, "assignments": 30, ... }
  },
  "prerequisiteMap": {
    "concept": ["prerequisite concepts"]
  },
  "suggestedResources": ["resource1", "resource2"]
}`;
  }

  private buildSessionPrompt(
    course: CurriculumCourse,
    week: MacroPlanWeek,
    sessionNumber: number,
  ): string {
    return `Generate a detailed session blueprint for:

COURSE: ${course.courseName} (${course.subject})
WEEK ${week.weekNumber}: ${week.theme}
SESSION ${sessionNumber} of ${week.sessionCount}
DURATION: ${course.sessionDuration} minutes
CLASS SIZE: ${course.classSize} students
CLASS VIBE: ${course.classVibe}

WEEK'S TOPICS: ${week.topics.join(', ')}
WEEK'S OBJECTIVES: ${week.learningObjectives.join('; ')}

Generate a JSON response with this exact structure:
{
  "sessionTitle": "Descriptive title for this session",
  "weekNumber": ${week.weekNumber},
  "sessionNumber": ${sessionNumber},
  "duration": ${course.sessionDuration},
  "difficulty": "${week.difficultyLevel}",
  "overview": "2-3 sentence overview of this session",
  "sections": [
    {
      "type": "hook" | "core" | "activity" | "application" | "checkpoint" | "close",
      "title": "Section title",
      "duration": number (minutes),
      "content": "What to teach/do",
      "teacherScript": "Exact words the teacher can say",
      "materials": ["material1", "material2"],
      "interactionType": "lecture" | "discussion" | "pair-work" | "group-work" | "individual",
      "tips": ["tip1", "tip2"]
    }
  ],
  "keyConceptsCovered": ["concept1", "concept2"],
  "checkpointQuestion": {
    "question": "Question to check understanding",
    "correctAnswer": "The correct answer",
    "commonWrongAnswers": ["wrong1", "wrong2"],
    "whyStudentsGetItWrong": "Explanation of common confusion"
  },
  "commonMisconceptions": [
    {
      "misconception": "What students often think incorrectly",
      "correction": "The correct understanding",
      "howToPrevent": "How to prevent this misconception"
    }
  ],
  "realWorldConnections": ["connection1", "connection2"],
  "nextSessionPreview": "What's coming next",
  "emergencyPlan": {
    "ifRunningBehind": "What to cut/compress",
    "ifRunningAhead": "What to add/expand",
    "ifStudentsStruggling": "How to provide extra support"
  },
  "preparationChecklist": ["item1", "item2"],
  "boardWork": "What to write on the board",
  "technologyNeeded": ["tech1", "tech2"]
}

IMPORTANT: Ensure total section durations equal ${course.sessionDuration} minutes.`;
  }

  private buildToolkitPrompt(
    course: CurriculumCourse,
    session: SessionBlueprint,
  ): string {
    return `Generate an engagement toolkit for:

COURSE: ${course.courseName} (${course.subject})
SESSION: ${session.sessionTitle}
KEY CONCEPTS: ${session.keyConceptsCovered.join(', ')}
STUDENT LEVEL: ${course.studentLevel}
CLASS VIBE: ${course.classVibe}

Generate a JSON response with this exact structure:
{
  "topic": "${session.sessionTitle}",
  "analogies": [
    {
      "analogy": "The analogy description",
      "howToPresent": "How to introduce and explain it",
      "whenToUse": "Best moment to use this",
      "targetMisconception": "Which misconception this addresses"
    }
  ],
  "realWorldExamples": [
    {
      "example": "Real-world application",
      "industry": "Which industry",
      "company": "Specific company if applicable",
      "explanation": "How it connects to the topic"
    }
  ],
  "demonstrations": [
    {
      "title": "Demo title",
      "description": "What to demonstrate",
      "materialsNeeded": ["material1"],
      "duration": number (minutes),
      "safetyNotes": "Safety considerations if any",
      "expectedOutcome": "What students should observe/learn"
    }
  ],
  "discussionQuestions": [
    {
      "question": "Thought-provoking question",
      "purpose": "Why ask this",
      "expectedResponses": ["possible response 1"],
      "followUp": "How to follow up"
    }
  ],
  "quickActivities": [
    {
      "name": "Activity name",
      "duration": number (minutes),
      "description": "What students do",
      "groupSize": "individual" | "pairs" | "small groups" | "whole class",
      "learningOutcome": "What they learn"
    }
  ],
  "commonMistakes": [
    {
      "mistake": "Common error",
      "whyItHappens": "Root cause",
      "howToFix": "Correction approach",
      "preventionStrategy": "How to prevent"
    }
  ],
  "visualAids": [
    {
      "type": "diagram" | "chart" | "animation" | "video",
      "description": "What it shows",
      "suggestedSource": "Where to find it"
    }
  ],
  "memoryHooks": [
    {
      "hook": "Mnemonic or memorable phrase",
      "whatItHelpsRemember": "The concept it aids"
    }
  ],
  "industryConnections": [
    {
      "company": "Company name",
      "howTheyUseThis": "Application",
      "interestingFact": "Engaging fact"
    }
  ]
}

Provide at least 3 items for analogies, realWorldExamples, and quickActivities.`;
  }

  /**
   * Generate optimized search queries for finding teaching resources
   */
  async generateResourceSearchQueries(
    sessionBlueprint: SessionBlueprint,
    course: CurriculumCourse,
  ): Promise<{
    youtubeQueries: string[];
    articleQueries: string[];
    pdfQueries: string[];
    presentationQueries: string[];
    interactiveQueries: string[];
  }> {
    const prompt = `Generate optimized search queries to find educational resources for this session:

SESSION: "${sessionBlueprint.sessionTitle}"
COURSE: ${course.courseName} (${course.subject})
STUDENT LEVEL: ${course.studentLevel}
KEY CONCEPTS: ${sessionBlueprint.keyConceptsCovered.join(', ')}

Generate specific, targeted search queries that will find high-quality educational content.

Return JSON with this exact structure:
{
  "youtubeQueries": [
    "3 specific queries for finding tutorial/explainer videos on YouTube"
  ],
  "articleQueries": [
    "3 queries for finding articles, tutorials, or blog posts"
  ],
  "pdfQueries": [
    "2 queries for finding lecture notes or academic PDFs"
  ],
  "presentationQueries": [
    "2 queries for finding PowerPoint presentations, slides, or lecture decks"
  ],
  "interactiveQueries": [
    "2 queries for finding interactive simulations or tools"
  ]
}

Make queries specific and educational-focused. Include:
- The subject area and specific topic
- Level indicators (introductory, undergraduate, etc.)
- Words like "tutorial", "explained", "course", "lecture", "slides", "presentation"`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a search optimization expert for educational content. Generate precise, targeted search queries. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Error generating search queries:', error);
      // Return default queries as fallback
      const topic = sessionBlueprint.keyConceptsCovered[0] || sessionBlueprint.sessionTitle;
      return {
        youtubeQueries: [`${topic} tutorial ${course.subject}`, `${topic} explained for students`],
        articleQueries: [`${topic} tutorial guide`, `${topic} introduction ${course.subject}`],
        pdfQueries: [`${topic} lecture notes pdf`, `${topic} course materials`],
        presentationQueries: [`${topic} lecture slides ppt`, `${topic} presentation ${course.subject}`],
        interactiveQueries: [`${topic} interactive simulation`, `${topic} online tool`],
      };
    }
  }

  /**
   * Filter and rank resources by relevance using AI
   */
  async filterAndRankResources(
    rawResources: Array<{
      type: string;
      title: string;
      url: string;
      description?: string;
      thumbnailUrl?: string;
      channelTitle?: string;
      sourceDomain?: string;
      duration?: string;
    }>,
    sessionBlueprint: SessionBlueprint,
    course: CurriculumCourse,
  ): Promise<
    Array<{
      resourceType: string;
      title: string;
      url: string;
      description: string;
      thumbnailUrl?: string;
      sourceName?: string;
      duration?: string;
      relevanceScore: number;
      aiReasoning: string;
      sectionType?: string;
      isFree: boolean;
    }>
  > {
    if (rawResources.length === 0) {
      return [];
    }

    const prompt = `Evaluate and rank these resources for teaching "${sessionBlueprint.sessionTitle}":

RESOURCES TO EVALUATE:
${JSON.stringify(rawResources.slice(0, 20), null, 2)}

SESSION CONTEXT:
- Topic: ${sessionBlueprint.sessionTitle}
- Key Concepts: ${sessionBlueprint.keyConceptsCovered.join(', ')}
- Student Level: ${course.studentLevel}
- Session Sections: ${sessionBlueprint.sections.map((s) => s.type).join(', ')}
- Duration: ${sessionBlueprint.duration} minutes

For EACH resource, evaluate and provide:
1. relevanceScore (0.0-1.0): How relevant and useful is this for teaching this session?
2. sectionType: Which session section would benefit most? ("hook", "core", "activity", "application", "checkpoint", "close")
3. aiReasoning: Brief explanation (1-2 sentences) of why this resource is useful or not
4. isFree: Is this resource freely accessible? (true/false)

Return JSON array with filtered results (only include resources with relevanceScore >= 0.4):
{
  "resources": [
    {
      "title": "original title",
      "url": "original url",
      "description": "original or improved description",
      "thumbnailUrl": "original if exists",
      "sourceName": "channel name or domain",
      "duration": "original if exists",
      "resourceType": "YOUTUBE_VIDEO" | "ARTICLE" | "PDF" | "PRESENTATION" | "INTERACTIVE_TOOL",
      "relevanceScore": 0.85,
      "aiReasoning": "This video clearly explains X concept with animations...",
      "sectionType": "core",
      "isFree": true
    }
  ]
}

Sort by relevanceScore descending. Maximum 10 resources.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an educational resource curator. Evaluate resources for pedagogical value and relevance. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      const parsed = JSON.parse(content);
      return parsed.resources || [];
    } catch (error) {
      this.logger.error('Error filtering resources:', error);
      // Return unfiltered resources with default scores as fallback
      return rawResources.slice(0, 10).map((r) => ({
        resourceType: r.type,
        title: r.title,
        url: r.url,
        description: r.description || '',
        thumbnailUrl: r.thumbnailUrl,
        sourceName: r.channelTitle || r.sourceDomain,
        duration: r.duration,
        relevanceScore: 0.5,
        aiReasoning: 'Auto-suggested based on search query',
        sectionType: 'core',
        isFree: true,
      }));
    }
  }
}
