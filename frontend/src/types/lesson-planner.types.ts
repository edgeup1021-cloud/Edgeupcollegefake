/**
 * lesson-planner.types.ts - Standalone Lesson Planner Types
 */

// Reuse types from curriculum
import type {
  SessionBlueprint,
  EngagementToolkit,
  SessionSection,
} from './curriculum.types';

export { SessionBlueprint, EngagementToolkit, SessionSection };

// ==================== Enums ====================

export enum LessonStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  REVIEWED = 'REVIEWED',
  TAUGHT = 'TAUGHT',
}

export enum LessonClassVibe {
  HIGH_ENGAGEMENT = 'HIGH_ENGAGEMENT',
  MIXED = 'MIXED',
  LOW_ENGAGEMENT = 'LOW_ENGAGEMENT',
  ADVANCED = 'ADVANCED',
  STRUGGLING = 'STRUGGLING',
}

export enum LessonResourceType {
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  ARTICLE = 'ARTICLE',
  PDF = 'PDF',
  PRESENTATION = 'PRESENTATION',
  INTERACTIVE_TOOL = 'INTERACTIVE_TOOL',
  WEBSITE = 'WEBSITE',
}

export enum LessonSectionType {
  HOOK = 'hook',
  CORE = 'core',
  ACTIVITY = 'activity',
  APPLICATION = 'application',
  CHECKPOINT = 'checkpoint',
  CLOSE = 'close',
}

// ==================== Main Types ====================

export interface StandaloneLesson {
  id: number;
  teacherId: number;
  curriculumSessionId: number | null;
  title: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  duration: number;
  classSize: number | null;
  classVibe: LessonClassVibe | null;
  learningObjectives: string[];
  prerequisites: string[] | null;
  additionalNotes: string | null;
  blueprint: SessionBlueprint | null;
  toolkit: EngagementToolkit | null;
  status: LessonStatus;
  isSubstituteLesson: boolean;
  scheduledDate: string | null;
  scheduledTime: string | null;
  generatedAt: string | null;
  taughtAt: string | null;
  teacherNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  id: number;
  lessonId: number;
  resourceType: LessonResourceType;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  sourceName: string | null;
  duration: string | null;
  relevanceScore: number | null;
  aiReasoning: string | null;
  sectionType: LessonSectionType | null;
  isFree: boolean;
  teacherRating: number | null;
  teacherNotes: string | null;
  isHidden: boolean;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Input Types ====================

export interface CreateLessonInput {
  title: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  duration: number;
  classSize?: number;
  classVibe?: LessonClassVibe;
  learningObjectives: string[];
  prerequisites?: string[];
  additionalNotes?: string;
  isSubstituteLesson?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface UpdateLessonInput {
  title?: string;
  subject?: string;
  topic?: string;
  gradeLevel?: string;
  duration?: number;
  classSize?: number;
  classVibe?: LessonClassVibe;
  learningObjectives?: string[];
  prerequisites?: string[];
  additionalNotes?: string;
  status?: LessonStatus;
  isSubstituteLesson?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  teacherNotes?: string;
}

export interface UpdateLessonResourceInput {
  teacherRating?: number;
  teacherNotes?: string;
  isHidden?: boolean;
}

export interface ImportFromCurriculumInput {
  curriculumSessionId: number;
  scheduledDate?: string;
  scheduledTime?: string;
  isSubstituteLesson?: boolean;
}

// ==================== API Response Types ====================

export interface LessonApiResponse<T> {
  success: boolean;
  data: T;
}

export interface GenerateBlueprintResponse {
  lessonId: number;
  blueprint: SessionBlueprint;
}

export interface GenerateToolkitResponse {
  lessonId: number;
  toolkit: EngagementToolkit;
}

// ==================== Wizard Types ====================

export interface LessonWizardStep {
  id: string;
  title: string;
  description: string;
}

export const LESSON_WIZARD_STEPS: LessonWizardStep[] = [
  {
    id: 'basics',
    title: 'Lesson Basics',
    description: 'Title, subject, topic, and duration',
  },
  {
    id: 'context',
    title: 'Class Context',
    description: 'Class size, vibe, and prerequisites',
  },
  {
    id: 'objectives',
    title: 'Learning Objectives',
    description: 'What students will learn',
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review and create your lesson',
  },
];

// ==================== Status Config ====================

export const LESSON_STATUS_CONFIG: Record<
  LessonStatus,
  { label: string; color: string; bgColor: string }
> = {
  [LessonStatus.DRAFT]: {
    label: 'Draft',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
  },
  [LessonStatus.GENERATED]: {
    label: 'Generated',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  [LessonStatus.REVIEWED]: {
    label: 'Reviewed',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  [LessonStatus.TAUGHT]: {
    label: 'Taught',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

export const CLASS_VIBE_OPTIONS = [
  { value: LessonClassVibe.HIGH_ENGAGEMENT, label: 'High Engagement', description: 'Active, participative students' },
  { value: LessonClassVibe.MIXED, label: 'Mixed', description: 'Typical classroom mix' },
  { value: LessonClassVibe.LOW_ENGAGEMENT, label: 'Low Engagement', description: 'Needs more motivation strategies' },
  { value: LessonClassVibe.ADVANCED, label: 'Advanced', description: 'High-performing students' },
  { value: LessonClassVibe.STRUGGLING, label: 'Struggling', description: 'Needs extra support' },
];

export const GRADE_LEVEL_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate',
  'Diploma',
];

export const COMMON_SUBJECTS = [
  'Mechanical Engineering',
  'Computer Science',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electronics Engineering',
  'Information Technology',
  'Data Science',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Business Administration',
  'Economics',
  'Finance',
  'Marketing',
  'Human Resources',
  'Psychology',
  'English Literature',
  'Communication Studies',
  'Law',
  'Medicine',
  'Pharmacy',
  'Architecture',
  'Other',
];
