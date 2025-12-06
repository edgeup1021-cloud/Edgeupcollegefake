import { api } from './api.client';
import type {
  CourseOffering,
  CreateCourseOfferingInput,
  AttendanceRosterResponse,
  Student,
  AttendanceStatus,
} from '@/types/class-operations.types';

// Feature flag for mock data
const USE_MOCK_DATA = false;

// Mock data store (in-memory)
let mockOfferings: CourseOffering[] = [];
let mockOfferingIdCounter = 1;

const mockStudents: Student[] = [
  { id: 1, admissionNo: "CS001", firstName: "John", lastName: "Doe" },
  { id: 2, admissionNo: "CS002", firstName: "Jane", lastName: "Smith" },
  { id: 3, admissionNo: "CS003", firstName: "Mike", lastName: "Johnson" },
  { id: 4, admissionNo: "CS004", firstName: "Sarah", lastName: "Williams" },
  { id: 5, admissionNo: "CS005", firstName: "David", lastName: "Brown" },
  { id: 6, admissionNo: "CS006", firstName: "Emily", lastName: "Davis" },
  { id: 7, admissionNo: "CS007", firstName: "James", lastName: "Miller" },
  { id: 8, admissionNo: "CS008", firstName: "Lisa", lastName: "Wilson" },
  { id: 9, admissionNo: "CS009", firstName: "Robert", lastName: "Anderson" },
  { id: 10, admissionNo: "CS010", firstName: "Maria", lastName: "Garcia" },
];

export async function createCourseOffering(data: CreateCourseOfferingInput, teacherId: number): Promise<CourseOffering> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate duration from start and end time
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

    const newOffering: CourseOffering = {
      id: mockOfferingIdCounter++,
      course: {
        id: mockOfferingIdCounter,
        code: data.subCode,
        title: data.subTitle,
      },
      semester: data.semester,
      year: data.year,
      section: data.section,
      maxStudents: 0, // Not used anymore
      enrolledCount: 0, // Not used anymore
      sessionDays: data.sessionDays,
      room: data.room,
      startTime: data.startTime,
      nextSession: {
        id: mockOfferingIdCounter,
        date: "2025-12-08",
        time: data.startTime,
      },
    };

    mockOfferings.push(newOffering);
    return newOffering;
  }

  return api.post<CourseOffering>(`/teacher/course-offerings?teacherId=${teacherId}`, data);
}

export async function getCourseOfferings(teacherId: number): Promise<CourseOffering[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOfferings;
  }

  return api.get<CourseOffering[]>(`/teacher/course-offerings?teacherId=${teacherId}`);
}

export async function getAttendanceRoster(sessionId: number, teacherId: number): Promise<AttendanceRosterResponse> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find the corresponding offering to get course details
    const offering = mockOfferings[0]; // For demo, use first offering or default

    return {
      session: {
        id: sessionId,
        courseTitle: offering?.course.title || "Introduction to Programming",
        courseCode: offering?.course.code || "CS101",
        sessionDate: "2025-12-08",
        startTime: offering?.startTime || "09:00",
        room: offering?.room || "Room 201",
      },
      students: mockStudents.slice(0, offering?.enrolledCount || 5).map(s => ({
        studentId: s.id,
        admissionNo: s.admissionNo,
        firstName: s.firstName,
        lastName: s.lastName,
      })),
      statistics: {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: offering?.enrolledCount || 5,
      },
    };
  }

  return api.get<AttendanceRosterResponse>(`/teacher/class-sessions/${sessionId}/attendance-roster?teacherId=${teacherId}`);
}

export async function markAttendance(sessionId: number, teacherId: number, records: Array<{studentId: number; status: AttendanceStatus; remarks?: string}>): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock: Attendance marked for session', sessionId, records);
    return;
  }

  console.log('[markAttendance] Sending request:', {
    sessionId,
    teacherId,
    recordCount: records.length,
    url: `/teacher/class-sessions/${sessionId}/attendance?teacherId=${teacherId}`,
    payload: {
      attendanceRecords: records,
      sessionDate: new Date().toISOString().split('T')[0]
    }
  });

  try {
    const result = await api.post<any>(`/teacher/class-sessions/${sessionId}/attendance?teacherId=${teacherId}`, {
      attendanceRecords: records,
      sessionDate: new Date().toISOString().split('T')[0]
    });
    console.log('[markAttendance] Response:', result);

    // Check if there were any errors in the response
    if (result && result.errors && result.errors.length > 0) {
      console.error('[markAttendance] Backend returned errors:', result.errors);
      throw new Error(`Failed to mark attendance: ${JSON.stringify(result.errors)}`);
    }

    if (result && result.success === 0) {
      console.error('[markAttendance] No records were saved successfully');
      throw new Error('No attendance records were saved. Please check the data and try again.');
    }

    return result;
  } catch (error) {
    console.error('[markAttendance] Error:', error);
    throw error;
  }
}

export async function searchStudents(term: string): Promise<Student[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (!term) return mockStudents;

    const lowerTerm = term.toLowerCase();
    return mockStudents.filter(s =>
      s.firstName.toLowerCase().includes(lowerTerm) ||
      s.lastName.toLowerCase().includes(lowerTerm) ||
      s.admissionNo.toLowerCase().includes(lowerTerm)
    );
  }

  return api.get<Student[]>(`/student?search=${term}`);
}
