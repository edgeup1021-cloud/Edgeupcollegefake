import { api } from './api.client';
import type {
  AttendanceOverview,
  AttendanceHistory,
  LeaveApplication,
  CreateLeaveApplicationInput,
  AttendanceCalendar,
  AttendanceDay,
  AttendanceStatus,
  LeaveStatus,
} from '@/types/student-attendance.types';

// Feature flag for mock data
const USE_MOCK_DATA = true;

// Generate mock attendance data for the current month
function generateMockAttendanceCalendar(): AttendanceCalendar {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  const daysInMonth = new Date(year, month, 0).getDate();
  const days: AttendanceDay[] = [];

  const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];
  const sessions = [
    { title: 'Data Structures', time: '09:00 AM' },
    { title: 'Web Development', time: '11:00 AM' },
    { title: 'Database Systems', time: '02:00 PM' },
    { title: 'Software Engineering', time: '04:00 PM' },
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Only add attendance for past and current days
    if (date <= now) {
      const randomSession = sessions[Math.floor(Math.random() * sessions.length)];

      // 80% present, 10% absent, 5% late, 5% excused
      const rand = Math.random();
      let status: AttendanceStatus;
      if (rand < 0.80) status = 'present';
      else if (rand < 0.90) status = 'absent';
      else if (rand < 0.95) status = 'late';
      else status = 'excused';

      days.push({
        date: date.toISOString().split('T')[0],
        status,
        sessionTitle: randomSession.title,
        sessionTime: randomSession.time,
        markedBy: 'Dr. Smith',
      });
    }
  }

  return { month, year, days };
}

// Generate mock recent attendance history
function generateMockRecentAttendance(): AttendanceHistory[] {
  const calendar = generateMockAttendanceCalendar();

  return calendar.days
    .slice(-10) // Last 10 days
    .reverse()
    .map(day => {
      const date = new Date(day.date);
      return {
        date: day.date,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        status: day.status,
        sessionTitle: day.sessionTitle!,
        sessionTime: day.sessionTime!,
        markedBy: day.markedBy!,
        remarks: day.status === 'absent' ? 'Not marked' : undefined,
      };
    });
}

// Calculate statistics from calendar
function calculateStatistics(calendar: AttendanceCalendar) {
  const stats = {
    daysPresent: 0,
    daysAbsent: 0,
    daysLate: 0,
    daysExcused: 0,
    totalDays: calendar.days.length,
    attendancePercentage: 0,
  };

  calendar.days.forEach(day => {
    if (day.status === 'present') stats.daysPresent++;
    else if (day.status === 'absent') stats.daysAbsent++;
    else if (day.status === 'late') stats.daysLate++;
    else if (day.status === 'excused') stats.daysExcused++;
  });

  stats.attendancePercentage = stats.totalDays > 0
    ? Math.round(((stats.daysPresent + stats.daysLate + stats.daysExcused) / stats.totalDays) * 100)
    : 0;

  return stats;
}

// Mock leave applications
let mockLeaveApplications: LeaveApplication[] = [
  {
    id: 1,
    leaveType: 'sick',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    reason: 'Seasonal flu with fever',
    supportingDocuments: ['medical-certificate.pdf'],
    status: 'approved',
    appliedOn: '2025-11-19',
    reviewedBy: 'Dr. Anderson',
    reviewedOn: '2025-11-19',
    reviewComments: 'Approved. Take care.',
  },
  {
    id: 2,
    leaveType: 'casual',
    startDate: '2025-12-15',
    endDate: '2025-12-16',
    reason: 'Family function',
    status: 'pending',
    appliedOn: '2025-12-01',
  },
  {
    id: 3,
    leaveType: 'emergency',
    startDate: '2025-10-10',
    endDate: '2025-10-10',
    reason: 'Medical emergency in family',
    supportingDocuments: ['hospital-receipt.pdf'],
    status: 'approved',
    appliedOn: '2025-10-09',
    reviewedBy: 'Dr. Martinez',
    reviewedOn: '2025-10-10',
    reviewComments: 'Approved. Hope everything is fine.',
  },
];

let mockLeaveIdCounter = 4;

/**
 * Get attendance overview (calendar, recent attendance, statistics)
 */
export async function getAttendanceOverview(studentId: number): Promise<AttendanceOverview> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const calendar = generateMockAttendanceCalendar();
    const recentAttendance = generateMockRecentAttendance();
    const statistics = calculateStatistics(calendar);

    return {
      calendar,
      recentAttendance,
      statistics,
    };
  }

  return api.get(`/student/${studentId}/attendance/overview`);
}

/**
 * Get attendance history with filters
 */
export async function getAttendanceHistory(
  studentId: number,
  month: number,
  year: number
): Promise<AttendanceHistory[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate calendar for the specified month/year
    const daysInMonth = new Date(year, month, 0).getDate();
    const history: AttendanceHistory[] = [];

    const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];
    const sessions = [
      { title: 'Data Structures', time: '09:00 AM' },
      { title: 'Web Development', time: '11:00 AM' },
      { title: 'Database Systems', time: '02:00 PM' },
      { title: 'Software Engineering', time: '04:00 PM' },
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const randomSession = sessions[Math.floor(Math.random() * sessions.length)];

      // 80% present, 10% absent, 5% late, 5% excused
      const rand = Math.random();
      let status: AttendanceStatus;
      if (rand < 0.80) status = 'present';
      else if (rand < 0.90) status = 'absent';
      else if (rand < 0.95) status = 'late';
      else status = 'excused';

      history.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        status,
        sessionTitle: randomSession.title,
        sessionTime: randomSession.time,
        markedBy: 'Dr. Smith',
        remarks: status === 'absent' ? 'Not marked' : undefined,
      });
    }

    return history.reverse(); // Most recent first
  }

  return api.get(`/student/${studentId}/attendance/history?month=${month}&year=${year}`);
}

/**
 * Get all leave applications
 */
export async function getLeaveApplications(studentId: number): Promise<LeaveApplication[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockLeaveApplications].reverse(); // Most recent first
  }

  return api.get(`/student/${studentId}/leave-applications`);
}

/**
 * Create a new leave application
 */
export async function createLeaveApplication(
  studentId: number,
  data: CreateLeaveApplicationInput
): Promise<LeaveApplication> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newApplication: LeaveApplication = {
      id: mockLeaveIdCounter++,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      supportingDocuments: data.supportingDocuments?.map((_, i) => `document-${i + 1}.pdf`),
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    mockLeaveApplications.push(newApplication);
    return newApplication;
  }

  const formData = new FormData();
  formData.append('leaveType', data.leaveType);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('reason', data.reason);

  if (data.supportingDocuments) {
    data.supportingDocuments.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
  }

  return api.post(`/student/${studentId}/leave-applications`, formData);
}
