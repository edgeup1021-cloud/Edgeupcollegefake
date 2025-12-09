export type IdeaType = 'idea' | 'question';

export type IdeaCategory =
  | 'Pedagogical Strategies'
  | 'Assessment Methods'
  | 'Technology Integration'
  | 'Classroom Management';

export type IdeaStatus = 'active' | 'archived' | 'flagged';

export type SortBy = 'recent' | 'popular' | 'most_commented';

export interface Idea {
  id: number;
  teacherId: number;
  type: IdeaType;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[] | null;
  status: IdeaStatus;
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  hasUpvoted?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  teacherId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateIdeaInput {
  type: IdeaType;
  title: string;
  description: string;
  category: IdeaCategory;
  tags?: string[];
}

export interface UpdateIdeaInput {
  type?: IdeaType;
  title?: string;
  description?: string;
  category?: IdeaCategory;
  tags?: string[];
  status?: IdeaStatus;
}

export interface SearchFilters {
  type?: IdeaType;
  category?: IdeaCategory;
  status?: IdeaStatus;
  search?: string;
  tags?: string;
  teacherId?: number;
  sortBy?: SortBy;
  limit?: number;
  offset?: number;
}

export interface CreateCommentInput {
  content: string;
}
