export class SuperadminDashboardDto {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    profileImage: string | null;
  };

  stats: {
    totalStudents: { label: string; value: number; total: number };
    totalTeachers: { label: string; value: number; total: number };
    totalInstitutes: { label: string; value: number; total: number };
    totalCourses: { label: string; value: number; total: number };
  };

  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: Date;
    user: string;
  }>;
}
