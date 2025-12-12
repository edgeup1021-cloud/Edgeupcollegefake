import { api } from "./api.client";
import type {
  Publication,
  CreatePublicationInput,
  UpdatePublicationInput,
  PublicationFilters,
  PublicationStats,
} from "@/types/publication.types";

const BASE_PATH = "/teacher/publications";

// Helper function to build query strings
function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString();
}

/**
 * Get all publications for a teacher
 */
export async function getPublications(
  teacherId: number,
  filters?: PublicationFilters
): Promise<Publication[]> {
  try {
    const queryParams: Record<string, any> = {
      teacherId,
      ...filters,
    };

    const queryString = buildQueryString(queryParams);
    const data = await api.get<Publication[]>(`${BASE_PATH}?${queryString}`);

    return data;
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    throw error;
  }
}

/**
 * Get a single publication by ID
 */
export async function getPublicationById(
  id: number,
  teacherId: number
): Promise<Publication> {
  try {
    const data = await api.get<Publication>(`${BASE_PATH}/${id}?teacherId=${teacherId}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch publication ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new publication
 */
export async function createPublication(
  data: CreatePublicationInput,
  teacherId: number
): Promise<Publication> {
  console.log("=== Creating Publication ===");
  console.log("URL:", `${BASE_PATH}?teacherId=${teacherId}`);
  console.log("Data:", data);

  try {
    const result = await api.post<Publication>(`${BASE_PATH}?teacherId=${teacherId}`, data);
    console.log("Response:", result);
    return result;
  } catch (error: any) {
    console.error("Failed to create publication:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
}

/**
 * Update an existing publication
 */
export async function updatePublication(
  id: number,
  data: UpdatePublicationInput,
  teacherId: number
): Promise<Publication> {
  try {
    const result = await api.patch<Publication>(`${BASE_PATH}/${id}?teacherId=${teacherId}`, data);
    return result;
  } catch (error) {
    console.error(`Failed to update publication ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a publication
 */
export async function deletePublication(
  id: number,
  teacherId: number
): Promise<void> {
  try {
    await api.delete(`${BASE_PATH}/${id}?teacherId=${teacherId}`);
  } catch (error) {
    console.error(`Failed to delete publication ${id}:`, error);
    throw error;
  }
}

/**
 * Get publication statistics for a teacher
 */
export async function getPublicationStats(
  teacherId: number
): Promise<PublicationStats> {
  try {
    const data = await api.get<PublicationStats>(`${BASE_PATH}/stats?teacherId=${teacherId}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch publication statistics:", error);
    throw error;
  }
}
