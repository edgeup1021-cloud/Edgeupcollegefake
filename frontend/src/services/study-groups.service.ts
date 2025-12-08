import { api } from './api.client';
import type {
  StudyGroup,
  CreateStudyGroupInput,
  JoinStudyGroupInput,
  StudyGroupMessage,
} from '../types/study-groups.types';

export async function getStudentStudyGroups(
  studentId: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<StudyGroup[]> {
  const qs = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) return acc;
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      ).toString()
    : '';
  return api.get<StudyGroup[]>(`/student/${studentId}/study-groups${qs}`);
}

export async function createStudyGroup(studentId: number, data: CreateStudyGroupInput): Promise<StudyGroup> {
  return api.post<StudyGroup>(`/student/${studentId}/study-groups`, data);
}

export async function joinStudyGroup(studentId: number, groupId: number, data?: JoinStudyGroupInput) {
  return api.post(`/student/${studentId}/study-groups/${groupId}/join`, data || {});
}

export async function leaveStudyGroup(studentId: number, groupId: number) {
  return api.post(`/student/${studentId}/study-groups/${groupId}/leave`, {});
}

export async function deleteStudyGroup(studentId: number, groupId: number) {
  return api.delete(`/student/${studentId}/study-groups/${groupId}`);
}

export async function getStudyGroupMessages(
  studentId: number,
  groupId: number,
  params?: { limit?: number; cursor?: number },
): Promise<StudyGroupMessage[]> {
  const qs = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) return acc;
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      ).toString()
    : '';
  return api.get<StudyGroupMessage[]>(`/student/${studentId}/study-groups/${groupId}/messages${qs}`);
}

export async function postStudyGroupMessage(
  studentId: number,
  groupId: number,
  content: string,
): Promise<StudyGroupMessage> {
  return api.post<StudyGroupMessage>(`/student/${studentId}/study-groups/${groupId}/messages`, {
    content,
  });
}
