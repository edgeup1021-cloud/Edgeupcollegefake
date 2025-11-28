export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  GRADUATED = 'graduated',
  WITHDRAWN = 'withdrawn',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
}

export enum GradeType {
  ASSIGNMENT = 'Assignment',
  ASSESSMENT = 'Assessment',
  FINAL = 'Final',
}

export enum AssignmentType {
  ASSIGNMENT = 'Assignment',
  PROJECT = 'Project',
  HOMEWORK = 'Homework',
  LAB = 'Lab',
}

export enum AssessmentType {
  QUIZ = 'Quiz',
  MIDTERM = 'Midterm',
  FINAL = 'Final',
  VIVA = 'Viva',
  LAB_EXAM = 'LabExam',
}

export enum SessionType {
  LECTURE = 'Lecture',
  LAB = 'Lab',
  TUTORIAL = 'Tutorial',
}

export enum Semester {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  FALL = 'Fall',
  WINTER = 'Winter',
}

export enum AdminRole {
  PRINCIPAL = 'Principal',
  DEAN = 'Dean',
  HOD = 'HOD',
  FINANCE = 'Finance',
  ADMIN = 'Admin',
  VIEWER = 'Viewer',
}
