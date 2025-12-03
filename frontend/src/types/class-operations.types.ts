export interface CourseOffering {
  id: number;
  course: {
    id: number;
    code: string;
    title: string;
  };
  semester: string;
  year: number;
  section: string;
  maxStudents: number;
  enrolledCount: number;
  sessionDays: string[];
  room: string;
  startTime: string;
  nextSession?: {
    id: number;
    date: string;
    time: string;
  };
}

export interface AttendanceStudent {
  studentId: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  status?: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRosterResponse {
  session: {
    id: number;
    courseTitle: string;
    courseCode: string;
    sessionDate: string;
    startTime: string;
    room: string;
  };
  students: AttendanceStudent[];
  statistics: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
}

export interface CreateCourseOfferingInput {
  subCode: string;
  subTitle: string;
  semester: string;
  year: number;
  department: string;
  section: string;
  batch: string;
  sessionDays: string[];
  startTime: string;
  endTime: string;
  room: string;
  sessionType: string;
  semesterStartDate: string;
  semesterEndDate: string;
}

export interface Student {
  id: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
}
