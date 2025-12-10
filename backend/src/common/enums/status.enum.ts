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

// Attendance status for student_attendance table
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

// Assessment status for student_assessments table
export enum StudentAssessmentStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  MISSED = 'missed',
}

// Assessment types for student_assessments table
export enum StudentAssessmentType {
  QUIZ = 'Quiz',
  TEST = 'Test',
  MIDTERM = 'Midterm',
  FINAL = 'Final',
  VIVA = 'Viva',
}

// Activity types for student_activity_logs table
export enum ActivityType {
  LOGIN = 'login',
  STUDY = 'study',
  SUBMISSION = 'submission',
  ATTENDANCE = 'attendance',
}

// Leave types for student_leave_requests table
export enum LeaveType {
  SICK = 'Sick Leave',
  PERSONAL = 'Personal Leave',
  FAMILY = 'Family Emergency',
  MEDICAL = 'Medical Leave',
  OTHER = 'Other',
}

// Leave status for student_leave_requests table
export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// Library resource categories for teacher_library_resources table
export enum LibraryResourceCategory {
  LECTURE_NOTES = 'Lecture Notes',
  TEXTBOOKS = 'Textbooks',
  RESEARCH_PAPERS = 'Research Papers',
  LAB_MANUALS = 'Lab Manuals',
  PAST_PAPERS = 'Past Papers',
  REFERENCE_MATERIALS = 'Reference Materials',
  STUDY_GUIDES = 'Study Guides',
  OTHER = 'Other',
}

// Idea Sandbox post types
export enum IdeaSandboxPostType {
  IDEA = 'idea',
  QUESTION = 'question',
}

// Idea Sandbox categories
export enum IdeaSandboxCategory {
  PEDAGOGICAL_STRATEGIES = 'Pedagogical Strategies',
  ASSESSMENT_METHODS = 'Assessment Methods',
  TECHNOLOGY_INTEGRATION = 'Technology Integration',
  CLASSROOM_MANAGEMENT = 'Classroom Management',
}

// Idea Sandbox post status
export enum IdeaSandboxPostStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  FLAGGED = 'flagged',
}

// Job application status for student_job_applications table
export enum ApplicationStatus {
  APPLIED = 'applied',
  IN_PROGRESS = 'in-progress',
  OFFER_RECEIVED = 'offer-received',
  INTERVIEW_SCHEDULED = 'interview-scheduled',
  REJECTED = 'rejected',
  NOT_APPLIED = 'not-applied',
}
