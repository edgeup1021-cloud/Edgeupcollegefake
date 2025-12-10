import { api } from './api.client';
import type {
  DevelopmentCourse,
  CourseSearchFilters,
  EducationalChannel,
} from '@/types/development-programs.types';

const BASE_PATH = '/teacher/development-programs';

/**
 * Build query string from filter parameters
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, String(value));
    }
  });

  return qs.toString() ? `?${qs.toString()}` : '';
}

/**
 * Search for development courses on YouTube
 */
export async function searchCourses(
  filters?: CourseSearchFilters
): Promise<DevelopmentCourse[]> {
  const qs = buildQueryString(filters);
  return api.get<DevelopmentCourse[]>(`${BASE_PATH}/search${qs}`);
}

/**
 * Get list of available educational channels
 */
export async function getEducationalChannels(): Promise<EducationalChannel[]> {
  return api.get<EducationalChannel[]>(`${BASE_PATH}/channels`);
}
