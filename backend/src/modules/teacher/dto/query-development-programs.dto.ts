import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDevelopmentProgramsDto {
  @IsOptional()
  @IsString()
  query?: string; // Search query

  @IsOptional()
  @IsString()
  category?: string; // Khan Academy, MIT OpenCourseWare, etc.

  @IsOptional()
  @IsString()
  channelId?: string; // Specific YouTube channel ID

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  maxResults?: number; // Max 50 results per request
}
