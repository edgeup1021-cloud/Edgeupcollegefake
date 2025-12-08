/**
 * routes.ts - Application Routes
 *
 * Centralized route definitions to avoid hardcoded strings.
 */

export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },

  // Student routes
  STUDENT: {
    ROOT: '/student',
    OVERVIEW: '/student/overview',
    STUDY_CENTER: '/student/study-center',
    SMART_ASSISTANT: '/student/smart-assistant',
    CAREER_PLACEMENT: '/student/career-placement-guide',
    JOB_MATCHER: '/student/job-matcher',
    MENTAL_HEALTH: '/student/mental-health-wellness',
  },

  // Teacher routes
  TEACHER: {
    ROOT: '/teacher',
    OVERVIEW: '/teacher/overview',
    CLASS_OPERATIONS: '/teacher/class-operations',
    CONTENT_CURRICULUM: '/teacher/content-curriculum',
    PROFESSIONAL_LEARNING: '/teacher/professional-learning',
    ASSESSMENT_SUITE: '/teacher/smart-assessment-suite',
    STUDENT_DEVELOPMENT: '/teacher/student-development',
  },

  // Management routes
  MANAGEMENT: {
    ROOT: '/management',
    FINANCIAL: '/management/financial-management',
    INSTITUTIONAL: '/management/institutional-health',
    PREDICTIVE: '/management/predictive-intelligence',
    RISK: '/management/risk-mitigation',
  },

  // Superadmin routes
  SUPERADMIN: {
    ROOT: '/superadmin',
    OVERVIEW: '/superadmin/overview',
    COURSE: '/superadmin/course',
    ROLE: '/superadmin/role',
    INSTITUTE: '/superadmin/institute',
    ADMIN_LOGS: '/superadmin/admin-logs',
  },
} as const;

/**
 * Get the base route for a given user role
 */
export function getRoleBaseRoute(role: 'student' | 'teacher' | 'admin' | 'superadmin'): string {
  switch (role) {
    case 'student':
      return ROUTES.STUDENT.OVERVIEW;
    case 'teacher':
      return ROUTES.TEACHER.OVERVIEW;
    case 'admin':
      return ROUTES.MANAGEMENT.FINANCIAL;
    case 'superadmin':
      return ROUTES.SUPERADMIN.OVERVIEW;
    default:
      return ROUTES.AUTH.LOGIN;
  }
}
