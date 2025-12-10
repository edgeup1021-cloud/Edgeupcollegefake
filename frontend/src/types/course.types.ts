// Course Management Types

export interface University {
  id?: number;
  name: string;
  code: string;
  stateRegion: string;
  establishedYear: number | null;
  description: string | null;
}

export interface Program {
  id?: number;
  universityId?: number;
  name: string;
  code: string;
  durationYears: number;
  degreeType: string;
  description: string | null;
}

export interface ProgramDepartment {
  id?: number;
  programId?: number;
  name: string;
  code: string;
  description: string | null;
}

export interface ProgramSemester {
  id?: number;
  programId?: number;
  semesterNumber: number;
  academicYear: string | null;
  description: string | null;
}

export interface CourseType {
  id?: number;
  name: string;
  code: string;
  description: string | null;
}

export interface CourseSubject {
  id?: number;
  semesterId?: number;
  typeId?: number;
  code: string;
  name: string;
  credits: number;
  description: string | null;
}

export interface CourseTopic {
  id?: number;
  subjectId?: number;
  name: string;
  orderIndex: number;
  description: string | null;
}

export interface CourseSubtopic {
  id?: number;
  topicId?: number;
  name: string;
  orderIndex: number;
  content: string | null;
  durationMinutes: number | null;
}

// Wizard State
export interface CourseWizardState {
  currentStep: number;
  university: University | null;
  programs: Program[];
  departments: Record<number, ProgramDepartment[]>; // programId -> departments
  semesters: Record<number, ProgramSemester[]>; // programId -> semesters
  types: CourseType[];
  subjects: CourseSubject[];
  topics: Record<number, CourseTopic[]>; // subjectId -> topics
  subtopics: Record<number, CourseSubtopic[]>; // topicId -> subtopics
}

// Form Data for each step
export interface UniversityFormData {
  name: string;
  code: string;
  stateRegion: string;
  establishedYear: string;
  description: string;
}

export interface ProgramFormData {
  name: string;
  code: string;
  durationYears: string;
  degreeType: string;
  description: string;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
}

export interface TypeFormData {
  name: string;
  code: string;
  description: string;
}

export interface SubjectFormData {
  programId: string;
  semesterId: string;
  typeId: string;
  code: string;
  name: string;
  credits: string;
  description: string;
}

export interface TopicFormData {
  subjectId: string;
  name: string;
  orderIndex: string;
  description: string;
}

export interface SubtopicFormData {
  topicId: string;
  name: string;
  orderIndex: string;
  content: string;
  durationMinutes: string;
}
