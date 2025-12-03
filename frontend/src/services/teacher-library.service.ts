import { api } from './api.client';
import type { Resource, ResourceType, ResourceCategory } from '@/types/digital-library.types';

// Feature flag for mock data
const USE_MOCK_DATA = true;

// Mock teacher resources
let mockTeacherResources: Resource[] = [];
let mockResourceIdCounter = 1;

export interface CreateResourceInput {
  title: string;
  description: string;
  author: string;
  type: ResourceType;
  category: ResourceCategory;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  pages?: number;
  duration?: string;
}

/**
 * Get all resources added by teacher
 */
export async function getTeacherResources(teacherId: number): Promise<Resource[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTeacherResources].reverse(); // Most recent first
  }

  return api.get(`/teacher/${teacherId}/library/resources`);
}

/**
 * Add a new resource
 */
export async function addTeacherResource(
  teacherId: number,
  data: CreateResourceInput
): Promise<Resource> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newResource: Resource = {
      id: mockResourceIdCounter++,
      ...data,
      publishedDate: new Date().toISOString().split('T')[0],
      addedDate: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
    };

    mockTeacherResources.push(newResource);
    return newResource;
  }

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  return api.post(`/teacher/${teacherId}/library/resources`, formData);
}

/**
 * Delete a resource
 */
export async function deleteTeacherResource(
  teacherId: number,
  resourceId: number
): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockTeacherResources = mockTeacherResources.filter(r => r.id !== resourceId);
    return;
  }

  return api.delete(`/teacher/${teacherId}/library/resources/${resourceId}`);
}

/**
 * Update a resource
 */
export async function updateTeacherResource(
  teacherId: number,
  resourceId: number,
  data: Partial<CreateResourceInput>
): Promise<Resource> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockTeacherResources.findIndex(r => r.id === resourceId);
    if (index !== -1) {
      mockTeacherResources[index] = {
        ...mockTeacherResources[index],
        ...data,
      };
      return mockTeacherResources[index];
    }
    throw new Error('Resource not found');
  }

  return api.put(`/teacher/${teacherId}/library/resources/${resourceId}`, data);
}
