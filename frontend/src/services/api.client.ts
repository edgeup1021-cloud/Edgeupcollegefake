/**
 * api.client.ts - Base API Client
 *
 * Central API client configuration and utilities.
 * All service modules should use this for API calls.
 */

// Backend API base URL - configured via environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API error response structure
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/**
 * Custom error class for API errors
 * Includes status code and structured error data
 */
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public data: ApiError,
  ) {
    const message = data?.message
      ? (Array.isArray(data.message) ? data.message.join(', ') : data.message)
      : `HTTP Error ${statusCode}`;
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Get current portal from localStorage
 */
function getCurrentPortal(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentPortal');
}

/**
 * Get auth token from localStorage for current portal
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const portal = getCurrentPortal();
  if (!portal) return null;
  return localStorage.getItem(`${portal}_accessToken`);
}

/**
 * Generic fetch wrapper with error handling
 * Automatically parses JSON responses and throws on non-2xx status codes
 * Includes auth token if available
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token && !options?.skipAuth) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Check if response has content before parsing JSON
  // DELETE operations often return 204 No Content with empty body
  const contentType = response.headers.get('content-type');
  const hasJsonContent = contentType?.includes('application/json');
  const isNoContent = response.status === 204;

  let data: any = null;

  // Only parse JSON if response has content and is JSON type
  if (!isNoContent && hasJsonContent) {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } else if (!isNoContent) {
    // Try to parse as JSON for non-204 responses
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // Response wasn't JSON, ignore
      }
    }
  }

  if (!response.ok) {
    const errorData: ApiError = data || {
      statusCode: response.status,
      message: `HTTP Error ${response.status}: ${response.statusText}`
    };
    throw new ApiClientError(response.status, errorData);
  }

  return data as T;
}

/**
 * HTTP method helpers
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
