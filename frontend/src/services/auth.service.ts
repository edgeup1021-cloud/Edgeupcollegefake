/**
 * auth.service.ts - Authentication API Service
 *
 * Handles all authentication-related API calls.
 */

import { api, ApiClientError } from './api.client';
import type { LoginCredentials, RegisterData, AuthResponse, User, PortalType } from '../types/auth.types';

export { ApiClientError as AuthApiError };

/**
 * Get portal-specific token keys
 */
function getTokenKeys(portalType: PortalType) {
  return {
    accessToken: `${portalType}_accessToken`,
    refreshToken: `${portalType}_refreshToken`,
    currentPortal: 'currentPortal',
  };
}

/**
 * Set cookie for middleware access
 */
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Delete cookie
 */
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Login with email and password
 * @returns Access token, refresh token, and user data
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  // Store tokens with portal prefix in both localStorage and cookies
  if (typeof window !== 'undefined') {
    const keys = getTokenKeys(credentials.portalType);
    localStorage.setItem(keys.accessToken, response.accessToken);
    localStorage.setItem(keys.refreshToken, response.refreshToken);
    localStorage.setItem(keys.currentPortal, credentials.portalType);
    
    // Also set cookies for middleware access
    setCookie(keys.accessToken, response.accessToken, 7);
    setCookie(keys.currentPortal, credentials.portalType, 7);
  }

  return response;
}

/**
 * Register a new user
 * @returns Access token, refresh token, and user data
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);

  // Store tokens with portal prefix (derived from user role) in both localStorage and cookies
  if (typeof window !== 'undefined' && response.user.portalType) {
    const keys = getTokenKeys(response.user.portalType);
    localStorage.setItem(keys.accessToken, response.accessToken);
    localStorage.setItem(keys.refreshToken, response.refreshToken);
    localStorage.setItem(keys.currentPortal, response.user.portalType);
    
    // Also set cookies for middleware access
    setCookie(keys.accessToken, response.accessToken, 7);
    setCookie(keys.currentPortal, response.user.portalType, 7);
  }

  return response;
}

/**
 * Get current portal from localStorage
 */
export function getCurrentPortal(): PortalType | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentPortal') as PortalType | null;
}

/**
 * Get current user profile for the active portal
 */
export async function getProfile(): Promise<User> {
  return api.get<User>('/auth/me');
}

/**
 * Refresh access token for specific portal
 */
export async function refreshToken(portalType?: PortalType): Promise<AuthResponse> {
  const portal = portalType || getCurrentPortal();
  if (!portal) {
    throw new Error('No active portal session');
  }

  const keys = getTokenKeys(portal);
  const refreshToken = typeof window !== 'undefined'
    ? localStorage.getItem(keys.refreshToken)
    : null;

  const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });

  // Update stored tokens in both localStorage and cookies
  if (typeof window !== 'undefined') {
    localStorage.setItem(keys.accessToken, response.accessToken);
    localStorage.setItem(keys.refreshToken, response.refreshToken);
    
    // Update cookies
    setCookie(keys.accessToken, response.accessToken, 7);
  }

  return response;
}

/**
 * Logout - clears stored tokens for specific portal or all portals
 */
export function logout(portalType?: PortalType): void {
  if (typeof window !== 'undefined') {
    if (portalType) {
      // Clear specific portal tokens from both localStorage and cookies
      const keys = getTokenKeys(portalType);
      localStorage.removeItem(keys.accessToken);
      localStorage.removeItem(keys.refreshToken);
      deleteCookie(keys.accessToken);
      if (getCurrentPortal() === portalType) {
        localStorage.removeItem('currentPortal');
        deleteCookie('currentPortal');
      }
    } else {
      // Clear all portal tokens from both localStorage and cookies
      const portals: PortalType[] = ['student', 'teacher', 'management'];
      portals.forEach(portal => {
        const keys = getTokenKeys(portal);
        localStorage.removeItem(keys.accessToken);
        localStorage.removeItem(keys.refreshToken);
        deleteCookie(keys.accessToken);
      });
      localStorage.removeItem('currentPortal');
      deleteCookie('currentPortal');
    }
  }
}

/**
 * Check if user is authenticated for specific portal
 */
export function isAuthenticated(portalType?: PortalType): boolean {
  if (typeof window === 'undefined') return false;
  const portal = portalType || getCurrentPortal();
  if (!portal) return false;
  const keys = getTokenKeys(portal);
  return !!localStorage.getItem(keys.accessToken);
}

/**
 * Get access token for specific portal
 */
export function getAccessToken(portalType?: PortalType): string | null {
  if (typeof window === 'undefined') return null;
  const portal = portalType || getCurrentPortal();
  if (!portal) return null;
  const keys = getTokenKeys(portal);
  return localStorage.getItem(keys.accessToken);
}
