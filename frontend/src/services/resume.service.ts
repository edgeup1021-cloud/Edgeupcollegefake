import { api } from './api.client';
import type { ResumeData } from '@/types/resume.types';

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
    const response = await api.post('/career/resume', {
      resumeData,
      templateUsed,
    });
    return response.data;
  }

  // Update resume in database
  async updateResume(resumeData: ResumeData, templateUsed?: string): Promise<StudentResume> {
    const response = await api.put('/career/resume', {
      resumeData,
      templateUsed,
    });
    return response.data;
  }

  // Get student's resume from database
  async getResume(): Promise<StudentResume | null> {
    try {
      const response = await api.get('/career/resume');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No resume found
      }
      throw error;
    }
  }

  // Submit resume (first time or re-submit)
  async submitResume(): Promise<StudentResume> {
    const response = await api.post('/career/resume/submit');
    return response.data;
  }

  // Analyze resume from database
  async analyzeStoredResume(jobDescription?: string) {
    const response = await api.post('/career/resume/analyze', {
      jobDescription,
    });
    console.log('Resume service received:', response);
    return response;
  }
}

export const resumeService = new ResumeService();
export default resumeService;
