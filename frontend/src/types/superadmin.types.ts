/**
 * superadmin.types.ts - Superadmin Types
 */

export interface SuperadminProfile {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  profileImage: string | null;
}

export interface SuperadminStats {
  totalStudents: { label: string; value: number; total: number };
  totalTeachers: { label: string; value: number; total: number };
  totalInstitutes: { label: string; value: number; total: number };
  totalCourses: { label: string; value: number; total: number };
}

export interface SuperadminRecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

export interface SuperadminDashboard {
  profile: SuperadminProfile;
  stats: SuperadminStats;
  recentActivity: SuperadminRecentActivity[];
}

export interface SuperadminOverview {
  profile: SuperadminProfile;
  stats: SuperadminStats;
}
