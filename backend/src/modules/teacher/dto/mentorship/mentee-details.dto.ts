export interface MenteeAcademicStats {
  currentCGPA: number | null;
  attendancePercentage: number;
  totalCoursesEnrolled: number;
  completedAssignments: number;
  pendingAssignments: number;
  upcomingExams: number;
}

export interface MenteeRecentPerformance {
  recentGrades: {
    courseCode: string;
    courseTitle: string;
    grade: number;
    maxMarks: number;
    percentage: number;
    gradeType: string;
    gradeLetter: string | null;
    gradePoints: number | null;
    date: string;
  }[];
  recentAttendance: {
    date: string;
    courseCode: string;
    courseTitle: string;
    status: string;
  }[];
}

export interface MenteeDetailsDto {
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
  recentPerformance: MenteeRecentPerformance;
}
