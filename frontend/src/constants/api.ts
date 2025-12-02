/**
 * api.ts - API Constants
 *
 * API endpoint paths and configuration constants.
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Student endpoints
  STUDENT: {
    BASE: '/student',
    OVERVIEW: '/student/overview',
    PROFILE: '/student/profile',
    COURSES: '/student/courses',
    SCHEDULE: '/student/schedule',
    GRADES: '/student/grades',
    ATTENDANCE: '/student/attendance',
    NOTIFICATIONS: '/student/notifications',
  },

  // Teacher endpoints
  TEACHER: {
    BASE: '/teacher',
    OVERVIEW: '/teacher/overview',
    PROFILE: '/teacher/profile',
    COURSES: '/teacher/courses',
    SCHEDULE: '/teacher/schedule',
    ASSIGNMENTS: '/teacher/assignments',
    STUDENTS: '/teacher/students',
  },

  // Management endpoints
  MANAGEMENT: {
    OVERVIEW: '/management/overview',
    CAMPUSES: '/management/campuses',
    DEPARTMENTS: '/management/departments',
    PROGRAMS: '/management/programs',
    FINANCIAL: '/management/financial',
    ANALYTICS: '/management/analytics',
  },
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
