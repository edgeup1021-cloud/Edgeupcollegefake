/**
 * teacher.types.ts - Teacher Types
 */

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  designation: string | null;
  departmentId: number | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherOverview {
  totalCourses: number;
  totalStudents: number;
  upcomingClasses: number;
  pendingAssignments: number;
}

export interface TeacherCourse {
  id: number;
  courseId: number;
  code: string;
  title: string;
  semester: string;
  year: number;
  section: string | null;
  enrolledStudents: number;
  maxStudents: number;
}

export interface TeacherSchedule {
  id: number;
  courseTitle: string;
  sessionDate: string;
  startTime: string;
  durationMinutes: number;
  room: string | null;
  sessionType: 'lecture' | 'lab' | 'tutorial' | 'exam';
}

export enum AssignmentType {
  ASSIGNMENT = 'Assignment',
  PROJECT = 'Project',
  HOMEWORK = 'Homework',
  LAB = 'Lab',
}

export interface TeacherAssignment {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  dueDate: string;
  type: AssignmentType;
  subject: string | null;
  program: string | null;
  batch: string | null;
  section: string | null;
  weight: number;
  maxMarks: number;
  priority: string | null;
  fileUrl: string | null;
  createdBy: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentInput {
  courseOfferingId: number;
  title: string;
  description?: string;
  dueDate: string;
  type: AssignmentType;
  subject?: string;
  program?: string;
  batch?: string;
  section?: string;
  priority?: string;
  weight?: number;
  maxMarks?: number;
  fileUrl?: string;
}

export interface UpdateAssignmentInput extends Partial<CreateAssignmentInput> {}

export interface QueryAssignmentsParams {
  courseOfferingId?: number;
  teacherId?: number;
  type?: AssignmentType;
  status?: string;
  subject?: string;
  program?: string;
  batch?: string;
  section?: string;
}

// Dashboard-specific types
export interface TeacherDashboardProfile {
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  college: string;
}

export interface TeacherDashboardStat {
  value: number;
  total: number;
  label: string;
}

export interface TeacherDashboardStatWithUnit extends TeacherDashboardStat {
  unit: string;
}

export interface TeacherDashboardStats {
  classesToday: TeacherDashboardStat;
  totalStudents: TeacherDashboardStat;
  assignmentsToGrade: TeacherDashboardStat;
  attendanceRate: TeacherDashboardStatWithUnit;
}

export interface TeacherDashboardScheduleItem {
  time: string;
  period: 'AM' | 'PM';
  title: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  duration: string;
  room: string;
}

export interface TeacherDeadline {
  title: string;
  type: 'grading' | 'administrative' | 'exam' | 'meeting';
  dueDate: string;
  description: string;
  daysLeft: number;
}

export interface TeacherDashboardData {
  profile: TeacherDashboardProfile;
  stats: TeacherDashboardStats;
  schedule: TeacherDashboardScheduleItem[];
  deadlines: TeacherDeadline[];
}
