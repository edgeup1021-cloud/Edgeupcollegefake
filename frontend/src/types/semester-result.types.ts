export interface SubjectResult {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
  status: 'pass' | 'fail';
}

export interface SemesterResult {
  id: number;
  semester: string;
  session: string;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number | null;
  cgpa: number | null;
  subjects: SubjectResult[];
  resultDate: string | null;
}

export interface CGPAHistoryItem {
  semester: string;
  session: string;
  sgpa: number | null;
  cgpa: number | null;
}
