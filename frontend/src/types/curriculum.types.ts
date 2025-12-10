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
