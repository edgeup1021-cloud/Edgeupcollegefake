/**
 * curriculum-planner.service.ts - Curriculum Plan Generator API Service
 *
 * Handles all API calls for the curriculum plan generator feature.
 */

import { api } from './api.client';
import type {
  CurriculumCourse,
  CreateCurriculumCourseInput,
  CurriculumPlan,
  CurriculumSession,
  CurriculumCalendarEvent,
  MacroPlan,
  SessionBlueprint,
  EngagementToolkit,
  CurriculumApiResponse,
  GenerateMacroPlanResponse,
  GenerateSessionResponse,
  GenerateAllSessionsResponse,
  SyncCalendarResponse,
  SyncCalendarInput,
  PlanStatus,
  CurriculumSessionStatus,
} from '@/types/curriculum.types';

// ==================== Course Management ====================

export async function createCurriculumCourse(
  data: CreateCurriculumCourseInput
): Promise<CurriculumCourse> {
  const response = await api.post<CurriculumApiResponse<CurriculumCourse>>(
    '/curriculum/courses',
    data
  );
  return response.data;
}

export async function getCurriculumCourses(): Promise<CurriculumCourse[]> {
  const response = await api.get<CurriculumApiResponse<CurriculumCourse[]>>(
    '/curriculum/courses'
  );
  return response.data;
}

export async function getCurriculumCourseById(
  courseId: number
): Promise<CurriculumCourse> {
  const response = await api.get<CurriculumApiResponse<CurriculumCourse>>(
    `/curriculum/courses/${courseId}`
  );
  return response.data;
}

// ==================== Macro Plan ====================

export async function generateMacroPlan(
  data: { courseId?: number; courseData?: CreateCurriculumCourseInput }
): Promise<GenerateMacroPlanResponse> {
  const response = await api.post<CurriculumApiResponse<GenerateMacroPlanResponse>>(
    '/curriculum/generate-macro',
    data
  );
  return response.data;
}

export async function getCurriculumPlans(): Promise<CurriculumPlan[]> {
  const response = await api.get<CurriculumApiResponse<CurriculumPlan[]>>(
    '/curriculum/plans'
  );
  return response.data;
}

export async function getCurriculumPlanById(
  planId: number
): Promise<CurriculumPlan> {
  const response = await api.get<CurriculumApiResponse<CurriculumPlan>>(
    `/curriculum/plans/${planId}`
  );
  return response.data;
}

export async function updatePlanStatus(
  planId: number,
  status: PlanStatus
): Promise<CurriculumPlan> {
  const response = await api.put<CurriculumApiResponse<CurriculumPlan>>(
    `/curriculum/plans/${planId}/status`,
    { status }
  );
  return response.data;
}

// ==================== Session Generation ====================

export async function generateSession(data: {
  curriculumPlanId: number;
  weekNumber: number;
  sessionNumber: number;
}): Promise<GenerateSessionResponse> {
  const response = await api.post<CurriculumApiResponse<GenerateSessionResponse>>(
    '/curriculum/generate-session',
    data
  );
  return response.data;
}

export async function generateAllSessions(
  curriculumPlanId: number
): Promise<GenerateAllSessionsResponse> {
  const response = await api.post<CurriculumApiResponse<GenerateAllSessionsResponse>>(
    '/curriculum/generate-all-sessions',
    { curriculumPlanId }
  );
  return response.data;
}

export async function getSessionsByPlan(
  planId: number
): Promise<CurriculumSession[]> {
  const response = await api.get<CurriculumApiResponse<CurriculumSession[]>>(
    `/curriculum/plans/${planId}/sessions`
  );
  return response.data;
}

export async function getSessionById(
  sessionId: number
): Promise<CurriculumSession> {
  const response = await api.get<CurriculumApiResponse<CurriculumSession>>(
    `/curriculum/sessions/${sessionId}`
  );
  return response.data;
}

export async function updateSessionStatus(
  sessionId: number,
  status: CurriculumSessionStatus,
  notes?: string
): Promise<CurriculumSession> {
  const response = await api.put<CurriculumApiResponse<CurriculumSession>>(
    `/curriculum/sessions/${sessionId}/status`,
    { status, notes }
  );
  return response.data;
}

// ==================== Engagement Toolkit ====================

export async function generateToolkit(
  sessionId: number
): Promise<{ sessionId: number; toolkit: EngagementToolkit }> {
  const response = await api.post<
    CurriculumApiResponse<{ sessionId: number; toolkit: EngagementToolkit }>
  >('/curriculum/generate-toolkit', { sessionId });
  return response.data;
}

// ==================== Calendar Sync ====================

export async function syncCalendar(
  data: SyncCalendarInput
): Promise<SyncCalendarResponse> {
  const response = await api.post<CurriculumApiResponse<SyncCalendarResponse>>(
    '/curriculum/sync-calendar',
    data
  );
  return response.data;
}

export async function getCalendarEvents(
  planId: number
): Promise<CurriculumCalendarEvent[]> {
  const response = await api.get<CurriculumApiResponse<CurriculumCalendarEvent[]>>(
    `/curriculum/plans/${planId}/calendar`
  );
  return response.data;
}

// ==================== Regeneration ====================

export async function regenerate(data: {
  type: 'macro' | 'session' | 'toolkit' | 'section';
  targetId: number;
  feedback?: string;
  preserveOverrides?: boolean;
}): Promise<{ success: boolean; data: unknown }> {
  const response = await api.post<
    CurriculumApiResponse<{ success: boolean; data: unknown }>
  >('/curriculum/regenerate', data);
  return response.data;
}

// ==================== Adaptation ====================

export async function createAdaptation(data: {
  curriculumPlanId: number;
  triggerType: string;
  triggerData: Record<string, unknown>;
}): Promise<unknown> {
  const response = await api.post<CurriculumApiResponse<unknown>>(
    '/curriculum/adapt',
    data
  );
  return response.data;
}

export async function respondToAdaptation(data: {
  adaptationId: number;
  response: 'ACCEPTED' | 'REJECTED' | 'PARTIALLY_ACCEPTED';
  customizations?: Record<string, unknown>;
}): Promise<unknown> {
  const response = await api.post<CurriculumApiResponse<unknown>>(
    '/curriculum/adaptations/respond',
    data
  );
  return response.data;
}

export async function getAdaptationsByPlan(planId: number): Promise<unknown[]> {
  const response = await api.get<CurriculumApiResponse<unknown[]>>(
    `/curriculum/plans/${planId}/adaptations`
  );
  return response.data;
}

// ==================== Session Resources ====================

import type { SessionResource, UpdateResourceInput } from '@/types/curriculum.types';

export async function getSessionResources(
  sessionId: number
): Promise<SessionResource[]> {
  const response = await api.get<CurriculumApiResponse<SessionResource[]>>(
    `/curriculum/sessions/${sessionId}/resources`
  );
  return response.data;
}

export async function generateSessionResources(
  sessionId: number
): Promise<SessionResource[]> {
  const response = await api.post<CurriculumApiResponse<SessionResource[]>>(
    `/curriculum/sessions/${sessionId}/resources/generate`
  );
  return response.data;
}

export async function refreshSessionResources(
  sessionId: number
): Promise<SessionResource[]> {
  const response = await api.post<CurriculumApiResponse<SessionResource[]>>(
    `/curriculum/sessions/${sessionId}/resources/refresh`
  );
  return response.data;
}

export async function updateSessionResource(
  resourceId: number,
  data: UpdateResourceInput
): Promise<SessionResource> {
  const response = await api.put<CurriculumApiResponse<SessionResource>>(
    `/curriculum/resources/${resourceId}`,
    data
  );
  return response.data;
}
