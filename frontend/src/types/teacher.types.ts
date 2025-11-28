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
