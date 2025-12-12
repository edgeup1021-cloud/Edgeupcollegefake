export type DiscussionType = 'question' | 'discussion';

export type DiscussionCategory =
  | 'Mathematics'
  | 'Computer Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Engineering'
  | 'Business'
  | 'General Academic'
  | 'Study Tips'
  | 'Career Guidance';

export type DiscussionStatus = 'active' | 'archived' | 'flagged';

export type SortBy = 'recent' | 'popular' | 'most_commented';

export interface DiscussionPost {
  id: number;
  studentId: number;
  type: DiscussionType;
  title: string;
  description: string;
  category: DiscussionCategory;
  tags: string[] | null;
  status: DiscussionStatus;
  upvoteCount: number;
  commentCount: number;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    admissionNo?: string;
  };
  hasUpvoted?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  studentId: number;
  content: string;
  isSolution: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateDiscussionInput {
  type: DiscussionType;
  title: string;
  description: string;
  category: DiscussionCategory;
  tags?: string[];
}

export interface UpdateDiscussionInput {
  type?: DiscussionType;
  title?: string;
  description?: string;
  category?: DiscussionCategory;
  tags?: string[];
  status?: DiscussionStatus;
}

export interface SearchFilters {
  type?: DiscussionType;
  category?: DiscussionCategory;
  status?: DiscussionStatus;
  search?: string;
  tags?: string;
  studentId?: number;
  sortBy?: SortBy;
  limit?: number;
  offset?: number;
  solvedOnly?: boolean;
  unsolvedOnly?: boolean;
}

export interface CreateCommentInput {
  content: string;
}
