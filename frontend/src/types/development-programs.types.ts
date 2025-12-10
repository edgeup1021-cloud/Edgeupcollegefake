export type CourseSource = 'YouTube' | 'Khan Academy' | 'Udemy' | 'Coursera' | 'Company';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface DevelopmentCourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  courseUrl: string;
  instructorName: string;
  durationHours: number;
  source: CourseSource;
  level: CourseLevel;
  category: string;
  viewCount: number;
  publishedAt: string;
}

export interface CourseSearchFilters {
  query?: string;
  category?: string;
  channelId?: string;
  maxResults?: number;
}

export interface EducationalChannel {
  name: string;
  channelId: string;
}
