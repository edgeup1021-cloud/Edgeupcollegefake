import { api } from './api.client';
import type {
  Mentee,
  AvailableStudent,
  MenteeDetails,
} from '@/types/mentorship.types';

const BASE_URL = '/teacher';

export async function getMentees(
  teacherId: number,
  status?: 'active' | 'inactive' | 'completed'
): Promise<Mentee[]> {
  const queryParams = new URLSearchParams({ teacherId: teacherId.toString() });
  if (status) queryParams.append('status', status);

  const mentees = await api.get<any[]>(`${BASE_URL}/mentees?${queryParams.toString()}`);

  // Transform string IDs to numbers (MySQL bigint serializes as string)
  return mentees.map(mentee => ({
    ...mentee,
    id: typeof mentee.id === 'string' ? parseInt(mentee.id, 10) : mentee.id,
    studentId: typeof mentee.studentId === 'string' ? parseInt(mentee.studentId, 10) : mentee.studentId,
  }));
}

export async function getAvailableStudents(
  teacherId: number
): Promise<AvailableStudent[]> {
  const students = await api.get<any[]>(
    `${BASE_URL}/mentees/available?teacherId=${teacherId}`
  );

  // Transform string IDs to numbers (MySQL bigint serializes as string)
  return students.map(student => ({
    ...student,
    id: typeof student.id === 'string' ? parseInt(student.id, 10) : student.id,
  }));
}

export async function assignMentee(
  teacherId: number,
  studentId: number,
  notes?: string
): Promise<any> {
  return api.post(
    `${BASE_URL}/mentees?teacherId=${teacherId}`,
    { studentId, notes }
  );
}

export async function bulkAssignMentees(
  teacherId: number,
  studentIds: number[],
  notes?: string
): Promise<{ assigned: number; skipped: number; total: number }> {
  return api.post(
    `${BASE_URL}/mentees/bulk-assign?teacherId=${teacherId}`,
    { studentIds, notes }
  );
}

export async function getMenteeDetails(
  menteeId: number,
  teacherId: number
): Promise<MenteeDetails> {
  const details = await api.get<any>(
    `${BASE_URL}/mentees/${menteeId}?teacherId=${teacherId}`
  );

  // Transform string IDs to numbers (MySQL bigint serializes as string)
  return {
    ...details,
    studentInfo: {
      ...details.studentInfo,
      id: typeof details.studentInfo?.id === 'string' ? parseInt(details.studentInfo.id, 10) : details.studentInfo?.id,
    },
    mentorshipInfo: {
      ...details.mentorshipInfo,
      id: typeof details.mentorshipInfo?.id === 'string' ? parseInt(details.mentorshipInfo.id, 10) : details.mentorshipInfo?.id,
    },
  };
}

export async function updateMentorship(
  menteeId: number,
  teacherId: number,
  updates: { status?: string; notes?: string; endDate?: string }
): Promise<any> {
  return api.patch(
    `${BASE_URL}/mentees/${menteeId}?teacherId=${teacherId}`,
    updates
  );
}

export async function removeMentee(
  menteeId: number,
  teacherId: number
): Promise<{ message: string }> {
  return api.delete(
    `${BASE_URL}/mentees/${menteeId}?teacherId=${teacherId}`
  );
}
