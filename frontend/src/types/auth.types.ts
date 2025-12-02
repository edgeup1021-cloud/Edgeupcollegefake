/**
 * auth.types.ts - Authentication Types
 */

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  // Student-specific
  admissionNo?: string;
  program?: string;
  batch?: string;
  // Teacher-specific
  designation?: string;
  departmentId?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
