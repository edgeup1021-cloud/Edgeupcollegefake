/**
 * teacher.service.ts - Teacher API Service
 *
 * Handles all teacher-related API calls.
 */

import { api, ApiClientError } from './api.client';
import type {
  Teacher,
  TeacherOverview,
  TeacherCourse,
  TeacherSchedule,
} from '../types/teacher.types';

export { ApiClientError as TeacherApiError };

/**
 * Fetch teacher overview/dashboard data
 */
export async function getTeacherOverview(): Promise<TeacherOverview> {
  return api.get<TeacherOverview>('/teacher/overview');
}

/**
 * Get teacher profile
 */
export async function getTeacherProfile(): Promise<Teacher> {
  return api.get<Teacher>('/teacher/profile');
}

/**
 * Get teacher's courses
 */
export async function getTeacherCourses(): Promise<TeacherCourse[]> {
  return api.get<TeacherCourse[]>('/teacher/courses');
}

/**
 * Get teacher's schedule
 */
export async function getTeacherSchedule(): Promise<TeacherSchedule[]> {
  return api.get<TeacherSchedule[]>('/teacher/schedule');
}

/**
 * Update teacher profile
 */
export async function updateTeacherProfile(data: Partial<Teacher>): Promise<Teacher> {
  return api.patch<Teacher>('/teacher/profile', data);
}
