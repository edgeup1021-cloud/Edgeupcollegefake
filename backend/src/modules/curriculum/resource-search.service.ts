import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  viewCount?: string | null;
  url: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  thumbnailUrl?: string;
  fileFormat?: string | null;
  sourceDomain: string;
}

@Injectable()
export class ResourceSearchService {
  private readonly logger = new Logger(ResourceSearchService.name);
  private readonly youtube: youtube_v3.Youtube;
  private readonly customSearch: ReturnType<typeof google.customsearch>;
  private readonly apiKey: string;
  private readonly searchEngineId: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_API_KEY') || '';
    this.searchEngineId = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID') || '';

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.apiKey,
    });

    this.customSearch = google.customsearch({
      version: 'v1',
      auth: this.apiKey,
    });
  }

  /**
   * Check if Google APIs are configured
   */
  isConfigured(): { youtube: boolean; webSearch: boolean } {
    const hasApiKey = Boolean(this.apiKey && !this.apiKey.includes('your-'));
    const hasSearchEngineId = Boolean(this.searchEngineId && !this.searchEngineId.includes('your-'));
    return {
      youtube: hasApiKey,
      webSearch: hasApiKey && hasSearchEngineId,
    };
  }

  /**
   * Search YouTube for educational videos
   */
  async searchYouTube(
    query: string,
    options: {
      maxResults?: number;
      videoDuration?: 'short' | 'medium' | 'long';
    } = {},
  ): Promise<YouTubeSearchResult[]> {
    const { maxResults = 5, videoDuration = 'medium' } = options;

    if (!this.apiKey) {
      this.logger.warn('GOOGLE_API_KEY not configured, skipping YouTube search');
      return [];
    }

    try {
      // Step 1: Search for videos
      const searchResponse = await this.youtube.search.list({
        part: ['snippet'],
        q: `${query} tutorial educational`,
        type: ['video'],
        maxResults,
        videoDuration,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
        relevanceLanguage: 'en',
      });

      const videoIds = searchResponse.data.items
        ?.map((item) => item.id?.videoId)
        .filter(Boolean) as string[];

      if (!videoIds?.length) return [];

      // Step 2: Get video details (for duration and stats)
      const videoDetails = await this.youtube.videos.list({
        part: ['contentDetails', 'statistics'],
        id: videoIds,
      });

      // Step 3: Combine and return results
      return (
        searchResponse.data.items?.map((item, index) => ({
          videoId: item.id?.videoId || '',
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
          channelTitle: item.snippet?.channelTitle || '',
          duration: this.formatDuration(
            videoDetails.data.items?.[index]?.contentDetails?.duration,
          ),
          publishedAt: item.snippet?.publishedAt || '',
          viewCount: videoDetails.data.items?.[index]?.statistics?.viewCount,
          url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        })) || []
      );
    } catch (error) {
      this.logger.error('YouTube search failed:', error);
      return [];
    }
  }

  /**
   * Search the web for articles and general resources
   */
  async searchWeb(
    query: string,
    options: {
      maxResults?: number;
      fileType?: 'pdf' | 'any';
      siteRestrict?: string[];
    } = {},
  ): Promise<WebSearchResult[]> {
    const { maxResults = 10, fileType, siteRestrict } = options;

    if (!this.apiKey || !this.searchEngineId) {
      this.logger.warn(
        'GOOGLE_API_KEY or GOOGLE_SEARCH_ENGINE_ID not configured, skipping web search',
      );
      return [];
    }

    try {
      let searchQuery = query;
      if (fileType === 'pdf') {
        searchQuery += ' filetype:pdf';
      }
      if (siteRestrict?.length) {
        searchQuery += ` (${siteRestrict.map((s) => `site:${s}`).join(' OR ')})`;
      }

      const response = await this.customSearch.cse.list({
        cx: this.searchEngineId,
        q: searchQuery,
        num: maxResults,
        safe: 'active',
      });

      return (
        response.data.items?.map((item) => ({
          title: item.title || '',
          url: item.link || '',
          snippet: item.snippet || '',
          thumbnailUrl: (item.pagemap as any)?.cse_thumbnail?.[0]?.src,
          fileFormat: item.fileFormat,
          sourceDomain: this.extractDomain(item.link || ''),
        })) || []
      );
    } catch (error) {
      this.logger.error('Web search failed:', error);
      return [];
    }
  }

  /**
   * Search for PDFs from educational sources
   */
  async searchPDFs(query: string, maxResults = 5): Promise<WebSearchResult[]> {
    const educationalSites = [
      'mit.edu',
      'stanford.edu',
      'harvard.edu',
      'berkeley.edu',
      'arxiv.org',
      'researchgate.net',
      'academia.edu',
      'coursera.org',
      'edx.org',
      'ocw.mit.edu',
      'openlearning.mit.edu',
    ];

    return this.searchWeb(query, {
      maxResults,
      fileType: 'pdf',
      siteRestrict: educationalSites,
    });
  }

  /**
   * Search for PowerPoint presentations and slides
   */
  async searchPresentations(query: string, maxResults = 5): Promise<WebSearchResult[]> {
    // Search for slideshare specifically (most common source)
    const slideshareResults = await this.searchWeb(`site:slideshare.net ${query}`, {
      maxResults: Math.ceil(maxResults / 2),
    });

    // Search for PPT/PPTX files across the web
    const pptResults = await this.searchWeb(`${query} filetype:pptx OR filetype:ppt lecture`, {
      maxResults: Math.ceil(maxResults / 2),
    });

    // General slides search
    const generalResults = await this.searchWeb(`${query} slides presentation lecture notes`, {
      maxResults: Math.ceil(maxResults / 2),
    });

    // Combine and dedupe by URL
    const allResults = [...slideshareResults, ...pptResults, ...generalResults];
    const seen = new Set<string>();
    return allResults.filter(r => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    }).slice(0, maxResults);
  }

  /**
   * Search for interactive educational tools
   */
  async searchInteractiveTools(
    query: string,
    maxResults = 5,
  ): Promise<WebSearchResult[]> {
    const interactiveSites = [
      'phet.colorado.edu',
      'geogebra.org',
      'desmos.com',
      'scratch.mit.edu',
      'codecademy.com',
      'brilliant.org',
      'khanacademy.org',
    ];

    return this.searchWeb(`${query} interactive simulation`, {
      maxResults,
      siteRestrict: interactiveSites,
    });
  }

  /**
   * Search for articles from trusted educational sources
   */
  async searchArticles(query: string, maxResults = 5): Promise<WebSearchResult[]> {
    const articleSites = [
      'medium.com',
      'dev.to',
      'freecodecamp.org',
      'geeksforgeeks.org',
      'tutorialspoint.com',
      'w3schools.com',
      'khanacademy.org',
      'coursera.org',
    ];

    return this.searchWeb(`${query} tutorial guide explanation`, {
      maxResults,
      siteRestrict: articleSites,
    });
  }

  /**
   * Format ISO 8601 duration (PT1H2M3S) to human readable (1:02:03)
   */
  private formatDuration(isoDuration?: string | null): string {
    if (!isoDuration) return '';

    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  }
}
