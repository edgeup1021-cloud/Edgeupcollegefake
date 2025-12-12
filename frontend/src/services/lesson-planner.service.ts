/**
 * lesson-planner.service.ts - Lesson Planner API Service
 */

import { api } from './api.client';
import type {
  StandaloneLesson,
  LessonResource,
  CreateLessonInput,
  UpdateLessonInput,
  UpdateLessonResourceInput,
  ImportFromCurriculumInput,
  LessonApiResponse,
  GenerateBlueprintResponse,
  GenerateToolkitResponse,
} from '@/types/lesson-planner.types';
import type { CurriculumSession } from '@/types/curriculum.types';

// ==================== Lesson CRUD ====================

export async function createLesson(
  data: CreateLessonInput
): Promise<StandaloneLesson> {
  const response = await api.post<LessonApiResponse<StandaloneLesson>>(
    '/lesson-planner/lessons',
    data
  );
  return response.data;
}

export async function getLessons(): Promise<StandaloneLesson[]> {
  const response = await api.get<LessonApiResponse<StandaloneLesson[]>>(
    '/lesson-planner/lessons'
  );
  return response.data;
}

export async function getLessonById(
  lessonId: number
): Promise<StandaloneLesson> {
  const response = await api.get<LessonApiResponse<StandaloneLesson>>(
    `/lesson-planner/lessons/${lessonId}`
  );
  return response.data;
}

export async function updateLesson(
  lessonId: number,
  data: UpdateLessonInput
): Promise<StandaloneLesson> {
  const response = await api.put<LessonApiResponse<StandaloneLesson>>(
    `/lesson-planner/lessons/${lessonId}`,
    data
  );
  return response.data;
}

export async function deleteLesson(lessonId: number): Promise<void> {
  await api.delete<LessonApiResponse<{ message: string }>>(
    `/lesson-planner/lessons/${lessonId}`
  );
}

// ==================== Generation ====================

export async function generateBlueprint(
  lessonId: number
): Promise<GenerateBlueprintResponse> {
  const response = await api.post<LessonApiResponse<GenerateBlueprintResponse>>(
    `/lesson-planner/lessons/${lessonId}/generate-blueprint`
  );
  return response.data;
}

export async function generateToolkit(
  lessonId: number
): Promise<GenerateToolkitResponse> {
  const response = await api.post<LessonApiResponse<GenerateToolkitResponse>>(
    `/lesson-planner/lessons/${lessonId}/generate-toolkit`
  );
  return response.data;
}

// ==================== Resources ====================

export async function getLessonResources(
  lessonId: number
): Promise<LessonResource[]> {
  const response = await api.get<LessonApiResponse<LessonResource[]>>(
    `/lesson-planner/lessons/${lessonId}/resources`
  );
  return response.data;
}

export async function generateLessonResources(
  lessonId: number
): Promise<LessonResource[]> {
  const response = await api.post<LessonApiResponse<LessonResource[]>>(
    `/lesson-planner/lessons/${lessonId}/resources/generate`
  );
  return response.data;
}

export async function refreshLessonResources(
  lessonId: number
): Promise<LessonResource[]> {
  const response = await api.post<LessonApiResponse<LessonResource[]>>(
    `/lesson-planner/lessons/${lessonId}/resources/refresh`
  );
  return response.data;
}

export async function updateLessonResource(
  resourceId: number,
  data: UpdateLessonResourceInput
): Promise<LessonResource> {
  const response = await api.put<LessonApiResponse<LessonResource>>(
    `/lesson-planner/resources/${resourceId}`,
    data
  );
  return response.data;
}

// ==================== Import from Curriculum ====================

export async function getAvailableCurriculumSessions(): Promise<CurriculumSession[]> {
  const response = await api.get<LessonApiResponse<CurriculumSession[]>>(
    '/lesson-planner/curriculum-sessions'
  );
  return response.data;
}

export async function importFromCurriculum(
  data: ImportFromCurriculumInput
): Promise<StandaloneLesson> {
  const response = await api.post<LessonApiResponse<StandaloneLesson>>(
    '/lesson-planner/import-from-curriculum',
    data
  );
  return response.data;
}
