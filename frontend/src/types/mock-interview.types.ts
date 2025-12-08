// Re-exports from lib
export * from '@/lib/mock-interview/codingTypes';
export * from '@/lib/mock-interview/reportTypes';

// API types
export interface InterviewApiResponse {
  content: string;
  tool_call: {
    name: string;
    challenge?: CodingChallenge;
    assessment?: InterviewAssessment;
  } | null;
}

export interface InterviewSession {
  id: number;
  studentId: number;
  messages: object[];
  status: 'active' | 'completed' | 'abandoned';
  selectedLanguage: string | null;
  challengesAttempted: number;
  challengesPassed: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Import types for re-export
import { CodingChallenge } from '@/lib/mock-interview/codingTypes';
import { InterviewAssessment } from '@/lib/mock-interview/reportTypes';
