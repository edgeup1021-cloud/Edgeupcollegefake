/**
 * management.service.ts - Management API Service
 *
 * Handles all management/admin-related API calls.
 */

import { api, ApiClientError } from './api.client';
import type {
  Campus,
  Department,
  ManagementOverview,
  FinancialSummary,
} from '../types/management.types';

export { ApiClientError as ManagementApiError };

/**
 * Fetch management overview/dashboard data
 */
export async function getManagementOverview(): Promise<ManagementOverview> {
  return api.get<ManagementOverview>('/management/overview');
}

/**
 * Get all campuses
 */
export async function getCampuses(): Promise<Campus[]> {
  return api.get<Campus[]>('/management/campuses');
}

/**
 * Get campus by ID
 */
export async function getCampus(id: number): Promise<Campus> {
  return api.get<Campus>(`/management/campuses/${id}`);
}

/**
 * Create a new campus
 */
export async function createCampus(data: Omit<Campus, 'id' | 'createdAt'>): Promise<Campus> {
  return api.post<Campus>('/management/campuses', data);
}

/**
 * Update campus
 */
export async function updateCampus(id: number, data: Partial<Campus>): Promise<Campus> {
  return api.patch<Campus>(`/management/campuses/${id}`, data);
}

/**
 * Get all departments
 */
export async function getDepartments(): Promise<Department[]> {
  return api.get<Department[]>('/management/departments');
}

/**
 * Get department by ID
 */
export async function getDepartment(id: number): Promise<Department> {
  return api.get<Department>(`/management/departments/${id}`);
}

/**
 * Create a new department
 */
export async function createDepartment(data: Omit<Department, 'id'>): Promise<Department> {
  return api.post<Department>('/management/departments', data);
}

/**
 * Update department
 */
export async function updateDepartment(id: number, data: Partial<Department>): Promise<Department> {
  return api.patch<Department>(`/management/departments/${id}`, data);
}

/**
 * Get financial summary
 */
export async function getFinancialSummary(): Promise<FinancialSummary> {
  return api.get<FinancialSummary>('/management/financial/summary');
}
