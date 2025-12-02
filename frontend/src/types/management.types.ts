/**
 * management.types.ts - Management/Admin Types
 */

export interface Campus {
  id: number;
  name: string;
  code: string;
  address: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  campusId: number | null;
}

export interface Program {
  id: number;
  name: string;
  code: string;
  departmentId: number | null;
  durationYears: number;
}

export interface ManagementOverview {
  totalStudents: number;
  totalTeachers: number;
  totalCampuses: number;
  totalDepartments: number;
  totalPrograms: number;
  activeEnrollments: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingFees: number;
  collectedFees: number;
  recentTransactions: FinancialTransaction[];
}

export interface FinancialTransaction {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  type: 'tuition' | 'fee' | 'fine' | 'other';
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  role: 'admin' | 'superadmin' | 'finance' | 'registrar';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}
