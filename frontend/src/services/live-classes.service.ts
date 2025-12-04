import { api } from './api.client';
import type {
  LiveClass,
  CreateLiveClassInput,
  UpdateLiveClassInput,
  QueryLiveClassesParams,
  LiveClassAttendance,
} from '../types/live-classes.types';

// Teacher APIs
export async function createLiveClass(data: CreateLiveClassInput): Promise<LiveClass> {
  return api.post<LiveClass>('/teacher/live-classes', data);
}

export async function getTeacherLiveClasses(params?: QueryLiveClassesParams): Promise<LiveClass[]> {
  const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
  return api.get<LiveClass[]>(`/teacher/live-classes${queryString}`);
}

export async function getLiveClass(id: number): Promise<LiveClass> {
  return api.get<LiveClass>(`/teacher/live-classes/${id}`);
}

export async function updateLiveClass(id: number, data: UpdateLiveClassInput): Promise<LiveClass> {
  return api.patch<LiveClass>(`/teacher/live-classes/${id}`, data);
}

export async function deleteLiveClass(id: number): Promise<void> {
  return api.delete<void>(`/teacher/live-classes/${id}`);
}

export async function startLiveClass(id: number): Promise<LiveClass> {
  return api.patch<LiveClass>(`/teacher/live-classes/${id}/start`, {});
}

export async function endLiveClass(id: number): Promise<LiveClass> {
  return api.patch<LiveClass>(`/teacher/live-classes/${id}/end`, {});
}

export async function getLiveClassAttendance(liveClassId: number): Promise<LiveClassAttendance[]> {
  return api.get<LiveClassAttendance[]>(`/teacher/live-classes/${liveClassId}/attendance`);
}

// Student APIs
export async function getStudentLiveClasses(studentId: number, params?: QueryLiveClassesParams): Promise<LiveClass[]> {
  const queryString = params ? '&' + new URLSearchParams(params as any).toString() : '';
  return api.get<LiveClass[]>(`/student/${studentId}/live-classes?${queryString}`);
}

export async function joinLiveClass(liveClassId: number, studentId: number): Promise<void> {
  return api.post<void>(`/student/${studentId}/live-classes/${liveClassId}/join`, {});
}

export async function leaveLiveClass(liveClassId: number, studentId: number): Promise<void> {
  return api.post<void>(`/student/${studentId}/live-classes/${liveClassId}/leave`, {});
}
