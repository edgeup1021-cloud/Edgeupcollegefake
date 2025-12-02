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

export interface TeacherAssignment {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxMarks: number;
  createdAt: string;
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
