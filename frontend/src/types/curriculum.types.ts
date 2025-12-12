/**
 * curriculum.types.ts - New Simplified Curriculum Management Types
 *
 * Structure: Course → Subject → Topic → Subtopic
 * Focus: Content library for question generation
 */

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Computed counts from relations
  _count?: {
    subjects: number;
    topics: number;
  };
}

export interface Subject {
  id: number;
  courseId: number;
  name: string;
  code: string;
  credits: number;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Computed counts from relations
  _count?: {
    topics: number;
    subtopics: number;
  };
  // Optional relation
  course?: Course;
}

export interface Topic {
  id: number;
  subjectId: number;
  name: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optional relations
  subtopics?: Subtopic[];
  subject?: Subject;
  _count?: {
    subtopics: number;
  };
}

export interface Subtopic {
  id: number;
  topicId: number;
  name: string;
  content: string | null;
  examples: string | null;
  durationMinutes: number | null;
  difficultyLevel: 'easy' | 'medium' | 'hard' | null;
  learningObjectives: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optional relation
  topic?: Topic;
}

// Form data types (for create/edit forms)
export interface CourseFormData {
  name: string;
  code: string;
  description: string;
  iconUrl: string;
}

export interface SubjectFormData {
  name: string;
  code: string;
  credits: number;
  description: string;
}

export interface TopicFormData {
  name: string;
  description: string;
}

export interface SubtopicFormData {
  name: string;
  content: string;
  examples: string;
  durationMinutes: number | null;
  difficultyLevel: 'easy' | 'medium' | 'hard' | null;
  learningObjectives: string;
}

// View/Display types
export interface CourseWithCounts extends Course {
  subjectCount: number;
  topicCount: number;
}

export interface SubjectWithCounts extends Subject {
  topicCount: number;
  subtopicCount: number;
}

export interface TopicWithSubtopics extends Topic {
  subtopics: Subtopic[];
}

// Filter/Search types
export interface CurriculumFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// ==========================================
// CURRICULUM PLAN GENERATOR TYPES
// ==========================================

// Enums for Curriculum Planner
export enum CurriculumSessionType {
  LECTURE = 'LECTURE',
  LAB = 'LAB',
  TUTORIAL = 'TUTORIAL',
  SEMINAR = 'SEMINAR',
  HYBRID = 'HYBRID',
  WORKSHOP = 'WORKSHOP',
}

export enum ClassVibe {
  HIGH_ENGAGEMENT = 'HIGH_ENGAGEMENT',
  MIXED = 'MIXED',
  LOW_ENGAGEMENT = 'LOW_ENGAGEMENT',
  ADVANCED = 'ADVANCED',
  STRUGGLING = 'STRUGGLING',
}

export enum TeacherChallenge {
  STUDENTS_DISENGAGED = 'STUDENTS_DISENGAGED',
  TOO_MUCH_CONTENT = 'TOO_MUCH_CONTENT',
  WEAK_FUNDAMENTALS = 'WEAK_FUNDAMENTALS',
  MIXED_SKILL_LEVELS = 'MIXED_SKILL_LEVELS',
  TIME_MANAGEMENT = 'TIME_MANAGEMENT',
  ASSESSMENT_ALIGNMENT = 'ASSESSMENT_ALIGNMENT',
  PRACTICAL_APPLICATION = 'PRACTICAL_APPLICATION',
}

export enum PlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED',
}

export enum CurriculumSessionStatus {
  GENERATED = 'GENERATED',
  REVIEWED = 'REVIEWED',
  SCHEDULED = 'SCHEDULED',
  TAUGHT = 'TAUGHT',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

export enum CalendarEventType {
  SESSION = 'SESSION',
  QUIZ = 'QUIZ',
  ASSIGNMENT_DUE = 'ASSIGNMENT_DUE',
  MIDTERM = 'MIDTERM',
  FINAL_EXAM = 'FINAL_EXAM',
  PROJECT_DUE = 'PROJECT_DUE',
  BUFFER = 'BUFFER',
  REVIEW_SESSION = 'REVIEW_SESSION',
}

// Curriculum Course
export interface CurriculumCourse {
  id: number;
  teacherId: number;
  courseName: string;
  courseCode: string | null;
  subject: string;
  department: string | null;
  totalWeeks: number;
  hoursPerWeek: number;
  sessionDuration: number;
  sessionsPerWeek: number;
  sessionType: CurriculumSessionType;
  classSize: number;
  classVibe: ClassVibe;
  studentLevel: string;
  outcomes: string[];
  primaryChallenge: TeacherChallenge | null;
  additionalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumCourseInput {
  courseName: string;
  courseCode?: string;
  subject: string;
  department?: string;
  totalWeeks: number;
  hoursPerWeek: number;
  sessionDuration: number;
  sessionsPerWeek: number;
  sessionType: CurriculumSessionType;
  classSize: number;
  classVibe: ClassVibe;
  studentLevel?: string;
  outcomes: string[];
  primaryChallenge?: TeacherChallenge;
  additionalNotes?: string;
}

// Macro Plan
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

// Curriculum Plan
export interface CurriculumPlan {
  id: number;
  courseId: number;
  version: number;
  status: PlanStatus;
  macroplan: MacroPlan;
  teacherOverrides: Record<string, unknown> | null;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
  course?: CurriculumCourse;
  sessions?: CurriculumSession[];
}

// Session Blueprint
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

// Curriculum Session
export interface CurriculumSession {
  id: number;
  curriculumPlanId: number;
  weekNumber: number;
  sessionNumber: number;
  blueprint: SessionBlueprint;
  toolkit: EngagementToolkit | null;
  status: CurriculumSessionStatus;
  teacherOverrides: Record<string, unknown> | null;
  generatedAt: string;
  taughtAt: string | null;
  studentFeedback: Record<string, unknown> | null;
  checkpointResults: Record<string, unknown> | null;
  teacherNotes: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations (populated when loaded with joins)
  curriculumPlan?: {
    id: number;
    courseId: number;
    course?: CurriculumCourse;
  };
  course?: CurriculumCourse; // Shorthand for curriculumPlan.course
}

// Engagement Toolkit
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

// Calendar Event
export interface CurriculumCalendarEvent {
  id: number;
  curriculumPlanId: number;
  sessionId: number | null;
  title: string;
  description: string | null;
  eventType: CalendarEventType;
  startDateTime: string;
  endDateTime: string;
  synced: boolean;
  externalEventId: string | null;
  weekNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface CurriculumApiResponse<T> {
  success: boolean;
  data: T;
}

export interface GenerateMacroPlanResponse {
  curriculumPlanId: number;
  macroplan: MacroPlan;
}

export interface GenerateSessionResponse {
  sessionId: number;
  blueprint: SessionBlueprint;
}

export interface GenerateAllSessionsResponse {
  totalGenerated: number;
  sessions: {
    weekNumber: number;
    sessionNumber: number;
    sessionId: number;
  }[];
}

export interface SyncCalendarResponse {
  eventsCreated: number;
  events: CurriculumCalendarEvent[];
}

// Calendar Sync Input
export interface ClassScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface SyncCalendarInput {
  curriculumPlanId: number;
  startDate: string;
  skipDates?: string[];
  classSchedule: ClassScheduleSlot[];
}

// Form step for wizard
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

// ==================== Session Resources ====================

export enum ResourceType {
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  ARTICLE = 'ARTICLE',
  PDF = 'PDF',
  PRESENTATION = 'PRESENTATION',
  INTERACTIVE_TOOL = 'INTERACTIVE_TOOL',
  WEBSITE = 'WEBSITE',
}

export enum SectionType {
  HOOK = 'hook',
  CORE = 'core',
  ACTIVITY = 'activity',
  APPLICATION = 'application',
  CHECKPOINT = 'checkpoint',
  CLOSE = 'close',
}

export interface SessionResource {
  id: number;
  sessionId: number;
  resourceType: ResourceType;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  sourceName: string | null;
  duration: string | null;
  relevanceScore: number | null;
  aiReasoning: string | null;
  sectionType: SectionType | null;
  isFree: boolean;
  teacherRating: number | null;
  teacherNotes: string | null;
  isHidden: boolean;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateResourceInput {
  teacherRating?: number;
  teacherNotes?: string;
  isHidden?: boolean;
}
