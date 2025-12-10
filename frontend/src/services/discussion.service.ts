import { api } from './api.client';
import type {
  DiscussionPost,
  Comment,
  CreateDiscussionInput,
  UpdateDiscussionInput,
  SearchFilters,
  CreateCommentInput,
} from '../types/discussion.types';

const BASE_PATH = '/discussion-forum';

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

export async function getPosts(
  filters?: SearchFilters,
  currentStudentId?: number
): Promise<DiscussionPost[]> {
  const params = {
    ...filters,
    currentStudentId,
  };
  const qs = buildQueryString(params);
  return api.get<DiscussionPost[]>(`${BASE_PATH}/posts${qs}`);
}

export async function getPostById(
  id: number,
  currentStudentId?: number
): Promise<DiscussionPost> {
  const qs = buildQueryString({ currentStudentId });
  return api.get<DiscussionPost>(`${BASE_PATH}/posts/${id}${qs}`);
}

export async function createPost(
  data: CreateDiscussionInput,
  studentId?: number
): Promise<DiscussionPost> {
  const qs = buildQueryString({ studentId });
  return api.post<DiscussionPost>(`${BASE_PATH}/posts${qs}`, data);
}

export async function updatePost(
  id: number,
  data: UpdateDiscussionInput,
  studentId?: number
): Promise<DiscussionPost> {
  const qs = buildQueryString({ studentId });
  return api.patch<DiscussionPost>(`${BASE_PATH}/posts/${id}${qs}`, data);
}

export async function deletePost(
  id: number,
  studentId?: number
): Promise<void> {
  const qs = buildQueryString({ studentId });
  return api.delete(`${BASE_PATH}/posts/${id}${qs}`);
}

export async function archivePost(
  id: number,
  archived: boolean,
  studentId?: number
): Promise<DiscussionPost> {
  const qs = buildQueryString({ studentId });
  return api.patch<DiscussionPost>(`${BASE_PATH}/posts/${id}/archive${qs}`, {
    archived,
  });
}

export async function markAsSolved(
  id: number,
  studentId?: number
): Promise<DiscussionPost> {
  const qs = buildQueryString({ studentId });
  return api.patch<DiscussionPost>(`${BASE_PATH}/posts/${id}/mark-solved${qs}`, {});
}

// ==================== Upvote Operations ====================

export async function toggleUpvote(
  postId: number,
  studentId?: number
): Promise<{ upvoted: boolean; upvoteCount: number }> {
  const qs = buildQueryString({ studentId });
  return api.post<{ upvoted: boolean; upvoteCount: number }>(
    `${BASE_PATH}/posts/${postId}/upvote${qs}`,
    {}
  );
}

export async function getUpvoters(postId: number): Promise<any[]> {
  return api.get<any[]>(`${BASE_PATH}/posts/${postId}/upvotes`);
}

// ==================== Comment Operations ====================

export async function getPostComments(
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
  studentId?: number
): Promise<Comment> {
  const qs = buildQueryString({ studentId });
  return api.post<Comment>(
    `${BASE_PATH}/posts/${postId}/comments${qs}`,
    data
  );
}

export async function updateComment(
  commentId: number,
  data: CreateCommentInput,
  studentId?: number
): Promise<Comment> {
  const qs = buildQueryString({ studentId });
  return api.patch<Comment>(`${BASE_PATH}/comments/${commentId}${qs}`, data);
}

export async function deleteComment(
  commentId: number,
  studentId?: number
): Promise<void> {
  const qs = buildQueryString({ studentId });
  return api.delete(`${BASE_PATH}/comments/${commentId}${qs}`);
}

export async function markCommentAsSolution(
  commentId: number,
  studentId?: number
): Promise<Comment> {
  const qs = buildQueryString({ studentId });
  return api.post<Comment>(`${BASE_PATH}/comments/${commentId}/mark-solution${qs}`, {});
}

// ==================== Student-Specific Operations ====================

export async function getMyPosts(
  studentId?: number,
  status?: string
): Promise<DiscussionPost[]> {
  const qs = buildQueryString({ studentId, status });
  return api.get<DiscussionPost[]>(`${BASE_PATH}/my-posts${qs}`);
}

export async function getMyUpvotedPosts(
  studentId?: number
): Promise<DiscussionPost[]> {
  const qs = buildQueryString({ studentId });
  return api.get<DiscussionPost[]>(`${BASE_PATH}/my-upvoted-posts${qs}`);
}
