export type ResourceType = "book" | "paper" | "video" | "article" | "presentation" | "document";
export type ResourceCategory = "Computer Science" | "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Engineering" | "Business" | "Arts" | "Other";

export interface Resource {
  id: number;
  title: string;
  description: string;
  author: string;
  type: ResourceType;
  category: ResourceCategory;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  pages?: number;
  duration?: string; // For videos
  publishedDate: string;
  addedDate: string;
  views: number;
  downloads: number;
  isBookmarked?: boolean;
  isDownloaded?: boolean;
}

export interface LibraryStatistics {
  totalResources: number;
  bookmarks: number;
  downloads: number;
  recentlyAccessed: number;
}

export interface RecentlyAccessedResource extends Resource {
  accessedAt: string;
}

export interface LibraryFilters {
  search?: string;
  type?: ResourceType;
  category?: ResourceCategory;
  sortBy?: "title" | "date" | "views" | "downloads";
  sortOrder?: "asc" | "desc";
}

export interface BookmarkResource {
  resourceId: number;
  resource: Resource;
  bookmarkedAt: string;
}

export interface DownloadedResource {
  resourceId: number;
  resource: Resource;
  downloadedAt: string;
  localPath?: string;
}
