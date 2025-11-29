/**
 * student.service.ts - Student API Service
 *
 * Handles all student-related API calls.
 */

import { api, ApiClientError } from './api.client';
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentOverview,
  StudentDashboard,
} from '../types/student.types';

export { ApiClientError as StudentApiError };

/**
 * Fetch all students from the API
 * Returns students ordered by creation date (newest first)
 */
export async function getStudents(): Promise<Student[]> {
  return api.get<Student[]>('/student');
}

/**
 * Fetch a single student by ID
 * @param id - Student's unique identifier
 * @throws StudentApiError if student not found (404)
 */
export async function getStudent(id: number): Promise<Student> {
  return api.get<Student>(`/student/${id}`);
}

/**
 * Create a new student record
 * @param input - Student data to create
 * @returns The created student with generated ID
 * @throws StudentApiError if email already exists (409) or validation fails (400)
 */
export async function createStudent(input: CreateStudentInput): Promise<Student> {
  return api.post<Student>('/student', input);
}

/**
 * Update an existing student's information
 * @param id - Student's ID
 * @param input - Fields to update
 * @returns The updated student record
 * @throws StudentApiError if student not found (404) or email conflict (409)
 */
export async function updateStudent(id: number, input: UpdateStudentInput): Promise<Student> {
  return api.patch<Student>(`/student/${id}`, input);
}

/**
 * Delete a student from the database
 * @param id - Student's ID
 * @returns The deleted student record
 * @throws StudentApiError if student not found (404)
 */
export async function deleteStudent(id: number): Promise<Student> {
  return api.delete<Student>(`/student/${id}`);
}

/**
 * Fetch dashboard overview statistics
 * Returns total counts, averages, and aggregated metrics
 */
export async function getStudentOverview(): Promise<StudentOverview> {
  return api.get<StudentOverview>('/student/overview');
}

/**
 * Fetch student dashboard data
 * Returns profile, stats, schedule, deadlines, and notifications
 * @param studentId - Student's unique identifier
 * @throws StudentApiError if student not found (404) or unauthorized (403)
 */
export async function getStudentDashboard(studentId: number): Promise<StudentDashboard> {
  return api.get<StudentDashboard>(`/student/${studentId}/dashboard`);
}
