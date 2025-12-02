/**
 * students.ts - Student API Client
 *
 * This module provides functions to interact with the Student REST API.
 * All functions handle errors consistently and return typed responses.
 */

import {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentOverview,
  ApiError,
} from './types';

// Backend API base URL - configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Custom error class for API errors
 * Includes status code and structured error data
 */
export class StudentApiError extends Error {
  constructor(
    public statusCode: number,
    public data: ApiError,
  ) {
    super(Array.isArray(data.message) ? data.message.join(', ') : data.message);
    this.name = 'StudentApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 * Automatically parses JSON responses and throws on non-2xx status codes
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new StudentApiError(response.status, data as ApiError);
  }

  return data as T;
}

/**
 * Fetch all students from the API
 * Returns students ordered by creation date (newest first)
 */
export async function getStudents(): Promise<Student[]> {
  return apiFetch<Student[]>('/student');
}

/**
 * Fetch a single student by ID
 * @param id - Student's unique identifier
 * @throws StudentApiError if student not found (404)
 */
export async function getStudent(id: number): Promise<Student> {
  return apiFetch<Student>(`/student/${id}`);
}

/**
 * Create a new student record
 * @param input - Student data to create
 * @returns The created student with generated ID
 * @throws StudentApiError if email already exists (409) or validation fails (400)
 */
export async function createStudent(input: CreateStudentInput): Promise<Student> {
  return apiFetch<Student>('/student', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Update an existing student's information
 * @param id - Student's ID
 * @param input - Fields to update
 * @returns The updated student record
 * @throws StudentApiError if student not found (404) or email conflict (409)
 */
export async function updateStudent(
  id: number,
  input: UpdateStudentInput,
): Promise<Student> {
  return apiFetch<Student>(`/student/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

/**
 * Delete a student from the database
 * @param id - Student's ID
 * @returns The deleted student record
 * @throws StudentApiError if student not found (404)
 */
export async function deleteStudent(id: number): Promise<Student> {
  return apiFetch<Student>(`/student/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch dashboard overview statistics
 * Returns total counts, averages, and aggregated metrics
 */
export async function getStudentOverview(): Promise<StudentOverview> {
  return apiFetch<StudentOverview>('/student/overview');
}
