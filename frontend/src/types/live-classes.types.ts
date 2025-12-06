/**
 * live-classes.types.ts - Live Classes Types
 */

export interface LiveClass {
  id: number;
  teacherId: number;
  teacherName?: string;
  title: string;
  description: string;
  subject: string;
  meetLink: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  program: string;
  batch: string;
  section: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLiveClassInput {
  title: string;
  description: string;
  subject: string;
  meetLink: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  program: string;
  batch: string;
  section: string;
}

export interface UpdateLiveClassInput extends Partial<CreateLiveClassInput> {
  status?: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface QueryLiveClassesParams {
  status?: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  program?: string;
  batch?: string;
  section?: string;
  date?: string;
}

export interface LiveClassAttendance {
  id: number;
  liveClassId: number;
  studentId: number;
  studentName: string;
  joinedAt: string;
  leftAt: string | null;
  duration: number; // in minutes
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}
