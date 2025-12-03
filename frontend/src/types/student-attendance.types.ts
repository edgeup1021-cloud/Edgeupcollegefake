export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceDay {
  date: string; // ISO date string
  status: AttendanceStatus;
  sessionTitle?: string;
  sessionTime?: string;
  markedBy?: string;
}

export interface AttendanceCalendar {
  month: number; // 1-12
  year: number;
  days: AttendanceDay[];
}

export interface AttendanceStatistics {
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  daysExcused: number;
  totalDays: number;
  attendancePercentage: number;
}

export interface AttendanceHistory {
  date: string;
  day: string; // Monday, Tuesday, etc.
  status: AttendanceStatus;
  sessionTitle: string;
  sessionTime: string;
  markedBy: string;
  remarks?: string;
}

export type LeaveType = "sick" | "casual" | "emergency" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveApplication {
  id: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  supportingDocuments?: string[];
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  reviewComments?: string;
}

export interface CreateLeaveApplicationInput {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  supportingDocuments?: File[];
}

export interface AttendanceOverview {
  calendar: AttendanceCalendar;
  recentAttendance: AttendanceHistory[];
  statistics: AttendanceStatistics;
}

export interface AttendanceHistoryFilters {
  month: number;
  year: number;
}
