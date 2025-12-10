import { api } from './api.client';
import type {
  Idea,
  Comment,
  CreateIdeaInput,
  UpdateIdeaInput,
  SearchFilters,
  CreateCommentInput,
} from '../types/idea-sandbox.types';

const BASE_PATH = '/teacher/idea-sandbox';

// Helper to build query string
function buildQueryString(
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return '';

  const qs = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return qs ? `?${qs}` : '';
}

// ==================== Post Operations ====================

export async function getIdeas(
  filters?: SearchFilters,
  currentTeacherId?: number
): Promise<Idea[]> {
  const params = {
    ...filters,
    currentTeacherId,
  };
  const qs = buildQueryString(params);
  return api.get<Idea[]>(`${BASE_PATH}/posts${qs}`);
}

export async function getIdeaById(
  id: number,
  currentTeacherId?: number
): Promise<Idea> {
  const qs = buildQueryString({ currentTeacherId });
  return api.get<Idea>(`${BASE_PATH}/posts/${id}${qs}`);
}

export async function createIdea(
  data: CreateIdeaInput,
  teacherId?: number
): Promise<Idea> {
  const qs = buildQueryString({ teacherId });
  return api.post<Idea>(`${BASE_PATH}/posts${qs}`, data);
}

export async function updateIdea(
  id: number,
  data: UpdateIdeaInput,
  teacherId?: number
): Promise<Idea> {
  const qs = buildQueryString({ teacherId });
  return api.patch<Idea>(`${BASE_PATH}/posts/${id}${qs}`, data);
}

export async function deleteIdea(
  id: number,
  teacherId?: number
): Promise<void> {
  const qs = buildQueryString({ teacherId });
  return api.delete(`${BASE_PATH}/posts/${id}${qs}`);
}

export async function archiveIdea(
  id: number,
  archived: boolean,
  teacherId?: number
): Promise<Idea> {
  const qs = buildQueryString({ teacherId });
  return api.patch<Idea>(`${BASE_PATH}/posts/${id}/archive${qs}`, {
    archived,
  });
}

// ==================== Upvote Operations ====================

export async function toggleUpvote(
  postId: number,
  teacherId?: number
): Promise<{ upvoted: boolean; upvoteCount: number }> {
  const qs = buildQueryString({ teacherId });
  return api.post<{ upvoted: boolean; upvoteCount: number }>(
    `${BASE_PATH}/posts/${postId}/upvote${qs}`,
    {}
  );
}

export async function getUpvoters(postId: number): Promise<any[]> {
  return api.get<any[]>(`${BASE_PATH}/posts/${postId}/upvotes`);
}

// ==================== Comment Operations ====================

export async function getIdeaComments(
  postId: number,
  limit = 20,
  offset = 0
): Promise<Comment[]> {
  const qs = buildQueryString({ limit, offset });
  return api.get<Comment[]>(`${BASE_PATH}/posts/${postId}/comments${qs}`);
}

export async function createComment(
  postId: number,
  data: CreateCommentInput,
  teacherId?: number
): Promise<Comment> {
  const qs = buildQueryString({ teacherId });
  return api.post<Comment>(
    `${BASE_PATH}/posts/${postId}/comments${qs}`,
    data
  );
}

export async function updateComment(
  commentId: number,
  data: CreateCommentInput,
  teacherId?: number
): Promise<Comment> {
  const qs = buildQueryString({ teacherId });
  return api.patch<Comment>(`${BASE_PATH}/comments/${commentId}${qs}`, data);
}

export async function deleteComment(
  commentId: number,
  teacherId?: number
): Promise<void> {
  const qs = buildQueryString({ teacherId });
  return api.delete(`${BASE_PATH}/comments/${commentId}${qs}`);
}

// ==================== Teacher-Specific Operations ====================

export async function getMyPosts(
  teacherId?: number,
  status?: string
): Promise<Idea[]> {
  const qs = buildQueryString({ teacherId, status });
  return api.get<Idea[]>(`${BASE_PATH}/my-posts${qs}`);
}

export async function getMyUpvotedPosts(
  teacherId?: number
): Promise<Idea[]> {
  const qs = buildQueryString({ teacherId });
  return api.get<Idea[]>(`${BASE_PATH}/my-upvoted-posts${qs}`);
}
