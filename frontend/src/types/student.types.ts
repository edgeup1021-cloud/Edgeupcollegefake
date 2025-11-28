// Student entity from the database
export interface Student {
  id: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string | null;
  program: string | null;
  batch: string | null;
  campusId: number | null;
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn';
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Data required to create a new student
export interface CreateStudentInput {
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  program?: string;
  batch?: string;
  profileImage?: string;
}

// Data for updating an existing student (all fields optional)
export interface UpdateStudentInput {
  admissionNo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  program?: string;
  batch?: string;
  profileImage?: string;
  status?: 'active' | 'suspended' | 'graduated' | 'withdrawn';
}

// Dashboard overview statistics
export interface StudentOverview {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  graduatedStudents: number;
}

// API error response structure
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
