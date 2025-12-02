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
} as const;

/**
 * Get the base route for a given user role
 */
export function getRoleBaseRoute(role: 'student' | 'teacher' | 'admin'): string {
  switch (role) {
    case 'student':
      return ROUTES.STUDENT.OVERVIEW;
    case 'teacher':
      return ROUTES.TEACHER.OVERVIEW;
    case 'admin':
      return ROUTES.MANAGEMENT.FINANCIAL;
    default:
      return ROUTES.AUTH.LOGIN;
  }
}
