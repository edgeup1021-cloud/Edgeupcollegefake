import { api } from './api.client';
import type { JobApplication, ApplicationStats, ApplicationStatus } from '../types/application.types';

/**
 * DTOs matching backend validation
 */
export interface CreateJobApplicationDto {
  companyName: string;
  companyLogo?: string;
  position: string;
  applicationDate: string; // ISO date string (YYYY-MM-DD)
  status: ApplicationStatus;
  jobType?: string;
  location?: string;
  salary?: string;
  description?: string;
  jobUrl?: string;
  notes?: string;
  interviewDate?: string; // ISO datetime string
  offerDeadline?: string; // ISO date string
  rejectionReason?: string;
}

export interface UpdateJobApplicationDto {
  companyName?: string;
  companyLogo?: string;
  position?: string;
  applicationDate?: string;
  status?: ApplicationStatus;
  jobType?: string;
  location?: string;
  salary?: string;
  description?: string;
  jobUrl?: string;
  notes?: string;
  interviewDate?: string;
  offerDeadline?: string;
  rejectionReason?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
}

/**
 * Get all job applications for the authenticated student
 */
export async function getAllApplications(): Promise<JobApplication[]> {
  return api.get<JobApplication[]>('/career/applications');
}

/**
 * Get a single job application by ID
 */
export async function getApplication(id: number): Promise<JobApplication> {
  return api.get<JobApplication>(`/career/applications/${id}`);
}

/**
 * Create a new job application
 */
export async function createApplication(data: CreateJobApplicationDto): Promise<JobApplication> {
  return api.post<JobApplication>('/career/applications', data);
}

/**
 * Update an existing job application (full update)
 */
export async function updateApplication(
  id: number,
  data: UpdateJobApplicationDto,
): Promise<JobApplication> {
  return api.put<JobApplication>(`/career/applications/${id}`, data);
}

/**
 * Update only the status of an application (for drag-and-drop)
 */
export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
): Promise<JobApplication> {
  return api.patch<JobApplication>(`/career/applications/${id}/status`, { status });
}

/**
 * Delete a job application
 */
export async function deleteApplication(id: number): Promise<void> {
  return api.delete<void>(`/career/applications/${id}`);
}

/**
 * Get application statistics
 */
export async function getApplicationStats(): Promise<ApplicationStats> {
  return api.get<ApplicationStats>('/career/applications/stats');
}
