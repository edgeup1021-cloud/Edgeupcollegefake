import { api } from './api.client';
import type {
  QuestionGeneratorFormData,
  GenerateQuestionsResponse,
} from '../types/question-generator.types';

/**
 * Generate questions using AI service via backend proxy
 */
export async function generateQuestions(
  teacherId: number,
  payload: QuestionGeneratorFormData,
): Promise<GenerateQuestionsResponse> {
  return api.post<GenerateQuestionsResponse>(
    `/teacher/questions/generate?teacherId=${teacherId}`,
    payload,
  );
}

/**
 * Get subjects for a course
 */
export async function getSubjects(course: string): Promise<string[]> {
  return api.get<string[]>(`/teacher/questions/subjects?course=${encodeURIComponent(course)}`);
}

/**
 * Get topics for a subject
 */
export async function getTopics(course: string, subject: string): Promise<string[]> {
  return api.get<string[]>(
    `/teacher/questions/topics?course=${encodeURIComponent(course)}&subject=${encodeURIComponent(subject)}`,
  );
}

/**
 * Get subtopics for a topic
 */
export async function getSubtopics(
  course: string,
  subject: string,
  topic: string,
): Promise<string[]> {
  return api.get<string[]>(
    `/teacher/questions/subtopics?course=${encodeURIComponent(course)}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`,
  );
}

/**
 * Get departments for a course
 */
export async function getDepartments(course: string): Promise<string[]> {
  return api.get<string[]>(`/teacher/questions/departments?course=${encodeURIComponent(course)}`);
}
