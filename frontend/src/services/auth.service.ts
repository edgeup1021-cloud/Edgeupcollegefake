/**
 * auth.service.ts - Authentication API Service
 *
 * Handles all authentication-related API calls.
 */

import { api, ApiClientError } from './api.client';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth.types';

export { ApiClientError as AuthApiError };

/**
 * Login with email and password
 * @returns Access token, refresh token, and user data
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  // Store tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
}

/**
 * Register a new user
 * @returns Access token, refresh token, and user data
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);

  // Store tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  return api.get<User>('/auth/me');
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = typeof window !== 'undefined'
    ? localStorage.getItem('refreshToken')
    : null;

  const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });

  // Update stored tokens
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
}

/**
 * Logout - clears stored tokens
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}
