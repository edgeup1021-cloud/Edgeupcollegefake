import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  DiscussionPostType,
  DiscussionCategory,
  DiscussionPostStatus,
} from '../../../common/enums/status.enum';

export class QueryDiscussionPostsDto {
  @IsOptional()
  @IsEnum(DiscussionPostType)
  type?: DiscussionPostType;

  @IsOptional()
  @IsEnum(DiscussionCategory)
  category?: DiscussionCategory;

  @IsOptional()
  @IsEnum(DiscussionPostStatus)
  status?: DiscussionPostStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tags?: string; // Comma-separated list

  @IsOptional()
  @Type(() => Number)
  studentId?: number;

  @IsOptional()
  @Type(() => Number)
  currentStudentId?: number; // For checking upvote status

  @IsOptional()
  @IsString()
  sortBy?: 'recent' | 'popular' | 'most_commented';

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @Type(() => Boolean)
  solvedOnly?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  unsolvedOnly?: boolean;
}
