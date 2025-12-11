import { api } from './api.client';
import type {
  SemesterResult,
  CGPAHistoryItem,
} from '@/types/semester-result.types';

const BASE_URL = '/student';

export async function getSemesterResults(
  studentId: number
): Promise<SemesterResult[]> {
  return api.get<SemesterResult[]>(
    `${BASE_URL}/${studentId}/semester-results`
  );
}

export async function getSemesterResult(id: number): Promise<SemesterResult> {
  return api.get<SemesterResult>(`${BASE_URL}/semester-results/${id}`);
}

export async function getCGPAHistory(
  studentId: number
): Promise<CGPAHistoryItem[]> {
  return api.get<CGPAHistoryItem[]>(`${BASE_URL}/${studentId}/cgpa-history`);
}
