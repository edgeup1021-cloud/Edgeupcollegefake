import { api } from './api.client';
import {
  InterviewApiResponse,
  CodeOutput,
  InterviewReport,
  SupportedLanguage,
  InterviewSession,
} from '@/types/mock-interview.types';

export const interviewService = {
  async chat(
    messages: Array<{ role: string; content: string }>,
    disableTools = false,
  ): Promise<InterviewApiResponse> {
    return api.post<InterviewApiResponse>('/career/mock-interview/chat', {
      messages,
      disableTools,
    });
  },

  async executeCode(
    code: string,
    language: SupportedLanguage,
    functionSignature: string,
    testCases: Array<{ input: string; output: string }>,
  ): Promise<CodeOutput> {
    return api.post<CodeOutput>('/career/mock-interview/execute-code', {
      code,
      language,
      functionSignature,
      testCases,
    });
  },

  async generateReport(
    messages: Array<{ role: string; content: string }>,
    assessment: any,
    language: string,
    startTime: string,
  ): Promise<InterviewReport> {
    return api.post<InterviewReport>('/career/mock-interview/generate-report', {
      messages,
      assessment,
      language,
      startTime,
    });
  },

  async getSessions(): Promise<InterviewSession[]> {
    return api.get('/career/mock-interview/sessions');
  },

  async getReports(): Promise<InterviewReport[]> {
    return api.get('/career/mock-interview/reports');
  },

  async getReportById(id: number): Promise<InterviewReport> {
    return api.get(`/career/mock-interview/reports/${id}`);
  },
};
