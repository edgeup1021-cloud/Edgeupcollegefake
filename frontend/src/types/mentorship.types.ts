export interface Mentee {
  id: number;
  studentId: number;
  firstName: string;
  lastName: string;
  admissionNo: string;
  email: string;
  program: string | null;
  batch: string | null;
  section: string | null;
  status: string;
  profileImage: string | null;
  mentorshipStatus: 'active' | 'inactive' | 'completed';
  assignedDate: string;
  notes: string | null;
  cgpa: number | null;
  attendancePercentage: number | null;
}

export interface AvailableStudent {
  id: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string | null;
  batch: string | null;
  section: string | null;
}

export interface MenteeAcademicStats {
  currentCGPA: number | null;
  attendancePercentage: number;
  totalCoursesEnrolled: number;
  completedAssignments: number;
  pendingAssignments: number;
  upcomingExams: number;
}

export interface RecentGrade {
  courseCode: string;
  courseTitle: string;
  grade: number;
  maxMarks: number;
  percentage: number;
  gradeType: string;
  gradeLetter: string | null;
  gradePoints: number | null;
  date: string;
}

export interface RecentAttendance {
  date: string;
  courseCode: string;
  courseTitle: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface MenteeDetails {
  studentInfo: {
    id: number;
    admissionNo: string;
    firstName: string;
    lastName: string;
    email: string;
    program: string | null;
    batch: string | null;
    section: string | null;
    status: string;
    profileImage: string | null;
  };
  mentorshipInfo: {
    id: number;
    assignedDate: string;
    status: string;
    notes: string | null;
  };
  academicStats: MenteeAcademicStats;
  recentPerformance: {
    recentGrades: RecentGrade[];
    recentAttendance: RecentAttendance[];
  };
}
