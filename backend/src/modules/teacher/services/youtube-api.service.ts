import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseSource, CourseLevel } from '../../../common/enums/status.enum';
import { TeacherUser } from '../../../database/entities/teacher/teacher-user.entity';
import { Department } from '../../../database/entities/management/department.entity';

export interface YouTubeCourse {
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

export interface YouTubeSearchParams {
  query?: string;
  category?: string;
  maxResults?: number;
  channelId?: string;
}

@Injectable()
export class YouTubeApiService {
  private readonly logger = new Logger(YouTubeApiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  // Educational channels
  private readonly educationalChannels = {
    'Khan Academy': 'UC4a-Gbdw7vOaccHmFo40b9g',
    'MIT OpenCourseWare': 'UCEBb1b_L6zDS3xTUrIALZOw',
    'TED-Ed': 'UCsooa4yRKGN_zEE8iknghZA',
    'Coursera': 'UCZ50rYSkYQG31YDEJm9Di_g',
  };

  constructor(
    private configService: ConfigService,
    @InjectRepository(TeacherUser)
    private teacherRepo: Repository<TeacherUser>,
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY') || '';

    if (!this.apiKey) {
      this.logger.warn('YOUTUBE_API_KEY not configured. YouTube API service will not work.');
    }
  }

  /**
   * Search for educational videos on YouTube
   */
  async searchEducationalVideos(params: YouTubeSearchParams): Promise<YouTubeCourse[]> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        maxResults: String(params.maxResults || 20),
        order: 'relevance',
        videoDefinition: 'high',
        key: this.apiKey,
      });

      // Add channel filter if provided
      if (params.channelId) {
        searchParams.append('channelId', params.channelId);
        // Add educational query if no query provided
        if (!params.query) {
          searchParams.append('q', 'tutorial lesson course');
        } else {
          searchParams.append('q', params.query);
        }
      } else if (params.category) {
        // Use category to select channel
        const channelId = this.educationalChannels[params.category as keyof typeof this.educationalChannels];
        if (channelId) {
          searchParams.append('channelId', channelId);

          // Add channel-specific educational queries if no query provided
          if (!params.query) {
            const channelQueries: Record<string, string> = {
              'Khan Academy': 'tutorial lesson',
              'MIT OpenCourseWare': 'lecture course',
              'TED-Ed': 'education lesson',
              'Coursera': 'course tutorial',
            };
            const query = channelQueries[params.category] || 'tutorial lesson';
            searchParams.append('q', query);
          } else {
            searchParams.append('q', params.query);
          }
        }
      } else if (params.query) {
        // No channel filter, just query
        searchParams.append('q', params.query);
      }

      const searchResponse = await fetch(`${this.baseUrl}/search?${searchParams}`);

      if (!searchResponse.ok) {
        if (searchResponse.status === 403) {
          throw new Error('YouTube API quota exceeded. Please try again later.');
        }
        throw new Error(`YouTube API error: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Get video IDs
      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .filter((id: string) => id)
        .join(',');

      if (!videoIds) {
        return [];
      }

      // Fetch detailed video information
      const videos = await this.getVideoDetails(videoIds);

      return videos;
    } catch (error) {
      this.logger.error(`Failed to search YouTube videos: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get detailed information for videos
   */
  private async getVideoDetails(videoIds: string): Promise<YouTubeCourse[]> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoIds,
      key: this.apiKey,
    });

    const response = await fetch(`${this.baseUrl}/videos?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((item: any) => this.transformToYouTubeCourse(item));
  }

  /**
   * Transform YouTube API response to our course format
   */
  private transformToYouTubeCourse(item: any): YouTubeCourse {
    const durationHours = this.parseISO8601Duration(item.contentDetails.duration);
    const level = this.estimateLevel(item.snippet.description, item.snippet.title);

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
      courseUrl: `https://www.youtube.com/watch?v=${item.id}`,
      instructorName: item.snippet.channelTitle,
      durationHours,
      source: CourseSource.YOUTUBE,
      level,
      category: this.extractCategory(item.snippet.channelTitle),
      viewCount: parseInt(item.statistics.viewCount || '0'),
      publishedAt: item.snippet.publishedAt,
    };
  }

  /**
   * Parse ISO 8601 duration format (PT15M30S) to hours
   */
  private parseISO8601Duration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) {
      return 0;
    }

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours + minutes / 60 + seconds / 3600;
  }

  /**
   * Estimate course level based on title and description
   */
  private estimateLevel(description: string, title: string): CourseLevel {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('beginner') || text.includes('introduction') || text.includes('basics') || text.includes('101')) {
      return CourseLevel.BEGINNER;
    }

    if (text.includes('advanced') || text.includes('expert') || text.includes('master')) {
      return CourseLevel.ADVANCED;
    }

    if (text.includes('intermediate')) {
      return CourseLevel.INTERMEDIATE;
    }

    return CourseLevel.ALL_LEVELS;
  }

  /**
   * Extract category from channel name
   */
  private extractCategory(channelTitle: string): string {
    if (channelTitle.toLowerCase().includes('khan')) {
      return 'Khan Academy';
    }
    if (channelTitle.toLowerCase().includes('mit')) {
      return 'Computer Science';
    }
    if (channelTitle.toLowerCase().includes('ted')) {
      return 'Educational Talks';
    }
    if (channelTitle.toLowerCase().includes('coursera')) {
      return 'Professional Courses';
    }
    return 'Education';
  }

  /**
   * Get all available educational channels
   */
  getEducationalChannels(): { name: string; channelId: string }[] {
    return Object.entries(this.educationalChannels).map(([name, channelId]) => ({
      name,
      channelId,
    }));
  }

  /**
   * Get personalized course recommendations for a teacher
   * Uses a 3-tier priority system:
   * 1. subjects_taught (most specific)
   * 2. department (medium specific)
   * 3. generic fallback (no personalization data)
   */
  async getPersonalizedCourses(teacherId: number): Promise<YouTubeCourse[]> {
    try {
      // Get teacher
      const teacher = await this.teacherRepo.findOne({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      // Build smart query based on available data
      let query = '';

      // Priority 1: Use subjects they teach (most specific)
      if (teacher.subjectsTaught && teacher.subjectsTaught.trim()) {
        query = `${teacher.subjectsTaught} tutorial`;
        this.logger.log(`Personalized by subjects for teacher ${teacherId}: "${query}"`);
      }
      // Priority 2: Use department (medium specificity)
      else if (teacher.departmentId) {
        const department = await this.departmentRepo.findOne({
          where: { id: teacher.departmentId },
        });
        if (department?.name) {
          query = `${department.name} teaching tutorial`;
          this.logger.log(`Personalized by department for teacher ${teacherId}: "${query}"`);
        }
      }

      // Priority 3: Fallback to generic (no personalization data)
      if (!query) {
        query = 'education tutorial';
        this.logger.log(`Generic search for teacher ${teacherId} (no personalization data)`);
      }

      // Search YouTube with personalized query
      return this.searchEducationalVideos({
        query,
        maxResults: 20
      });
    } catch (error) {
      this.logger.error(`Failed to get personalized courses: ${error.message}`, error.stack);
      // Fallback to generic search
      return this.searchEducationalVideos({
        query: 'education tutorial',
        maxResults: 20
      });
    }
  }
}
