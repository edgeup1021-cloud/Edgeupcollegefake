import { api } from './api.client';
import type {
  TeacherAssignment,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  QueryAssignmentsParams,
} from '../types/teacher.types';

// Teacher APIs
export async function createAssignment(data: CreateAssignmentInput, teacherId: number): Promise<TeacherAssignment> {
  return api.post<TeacherAssignment>(`/teacher/assignments?teacherId=${teacherId}`, data);
}

export async function getAssignments(params?: QueryAssignmentsParams): Promise<TeacherAssignment[]> {
  const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
  return api.get<TeacherAssignment[]>(`/teacher/assignments${queryString}`);
}

export async function getAssignment(id: number): Promise<TeacherAssignment> {
  return api.get<TeacherAssignment>(`/teacher/assignments/${id}`);
}

export async function updateAssignment(id: number, data: UpdateAssignmentInput): Promise<TeacherAssignment> {
  return api.patch<TeacherAssignment>(`/teacher/assignments/${id}`, data);
}

export async function deleteAssignment(id: number): Promise<void> {
  return api.delete<void>(`/teacher/assignments/${id}`);
}

export async function getAssignmentSubmissions(assignmentId: number): Promise<any[]> {
  return api.get<any[]>(`/teacher/assignments/${assignmentId}/submissions`);
}

// Student APIs
export async function getStudentAssignments(studentId: number): Promise<any[]> {
  return api.get<any[]>(`/student/${studentId}/assignments`);
}

export async function submitAssignment(studentId: number, data: any): Promise<any> {
  return api.post<any>(`/student/${studentId}/assignments/submit`, data);
}
