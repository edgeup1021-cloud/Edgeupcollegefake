import { api, ApiClientError } from './api.client';
import type { ResumeData, ResumeAnalysisResult } from '@/types/resume.types';

export interface StudentResume {
  id: number;
  studentId: number;
  resumeData: ResumeData;
  templateUsed: string;
  isSubmitted: boolean;
  submittedAt: string | null;
  version: number;
  atsScore: number | null;
  createdAt: string;
  updatedAt: string;
}

class ResumeService {
  // Save resume to database (auto-save)
  async saveResume(resumeData: ResumeData, templateUsed: string = 'modern'): Promise<StudentResume> {
    return api.post<StudentResume>('/career/resume', {
      resumeData,
      templateUsed,
    });
  }

  // Update resume in database
  async updateResume(resumeData: ResumeData, templateUsed?: string): Promise<StudentResume> {
    return api.put<StudentResume>('/career/resume', {
      resumeData,
      templateUsed,
    });
  }

  // Get student's resume from database
  async getResume(): Promise<StudentResume | null> {
    try {
      return await api.get<StudentResume>('/career/resume');
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 404) {
        return null; // No resume found
      }
      throw error;
    }
  }

  // Submit resume (first time or re-submit)
  async submitResume(): Promise<StudentResume> {
    return api.post<StudentResume>('/career/resume/submit');
  }

  // Analyze resume from database
  async analyzeStoredResume(jobDescription?: string): Promise<ResumeAnalysisResult> {
    return api.post<ResumeAnalysisResult>('/career/resume/analyze', {
      jobDescription,
    });
  }
}

export const resumeService = new ResumeService();
export default resumeService;
