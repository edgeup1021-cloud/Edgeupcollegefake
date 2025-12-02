// Student entity from the database
export interface Student {
  id: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  program: string | null;
  batch: string | null;
  campusId: number | null;
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn';
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Data required to create a new student
export interface CreateStudentInput {
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  program?: string;
  batch?: string;
  profileImage?: string;
}

// Data for updating an existing student (all fields optional)
export interface UpdateStudentInput {
  admissionNo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  program?: string;
  batch?: string;
  profileImage?: string;
  status?: 'active' | 'suspended' | 'graduated' | 'withdrawn';
}

// Dashboard overview statistics
export interface StudentOverview {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  graduatedStudents: number;
}

// API error response structure
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Student Dashboard Types
export interface StudentDashboardProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  program: string | null;
  batch: string | null;
  college: string | null;
  profileImage: string | null;
}

export interface StudentDashboardAttendance {
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
}

export interface StudentDashboardDailyGoal {
  current: number;
  target: number;
}

export interface StudentDashboardTestsToday {
  completed: number;
  total: number;
}

export interface StudentDashboardStats {
  attendance: StudentDashboardAttendance;
  gpa: number | null;
  completedCourses: number;
  totalCredits: number;
  dailyGoal: StudentDashboardDailyGoal;
  testsToday: StudentDashboardTestsToday;
  dayStreak: number;
}

export interface StudentDashboardScheduleItem {
  id: number;
  time: string;
  period: 'AM' | 'PM';
  title: string;
  type: string;
  duration: string;
  room: string | null;
}

export interface StudentDashboardDeadline {
  id: number;
  title: string;
  type: string;
  dueDate: string;
  description: string | null;
  daysLeft: number;
  courseName: string;
}

export interface StudentDashboardNotification {
  id: number;
  title: string;
  type: string;
  createdAt: string;
}

export interface StudentDashboardNotifications {
  unreadCount: number;
  recent: StudentDashboardNotification[];
}

export interface StudentDashboard {
  profile: StudentDashboardProfile;
  stats: StudentDashboardStats;
  schedule: StudentDashboardScheduleItem[];
  deadlines: StudentDashboardDeadline[];
  notifications: StudentDashboardNotifications;
}
