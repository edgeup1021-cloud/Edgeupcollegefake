import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IdeaSandboxPostType,
  IdeaSandboxCategory,
  IdeaSandboxPostStatus,
} from '../../../../common/enums/status.enum';

export class QueryIdeaSandboxPostsDto {
  @IsOptional()
  @IsEnum(IdeaSandboxPostType)
  type?: IdeaSandboxPostType;

  @IsOptional()
  @IsEnum(IdeaSandboxCategory)
  category?: IdeaSandboxCategory;

  @IsOptional()
  @IsEnum(IdeaSandboxPostStatus)
  status?: IdeaSandboxPostStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tags?: string; // Comma-separated list

  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @Type(() => Number)
  currentTeacherId?: number; // For checking upvote status

  @IsOptional()
  @IsString()
  sortBy?: 'recent' | 'popular' | 'most_commented';

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
