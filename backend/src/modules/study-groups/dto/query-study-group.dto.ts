import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudyGroupJoinType, StudyGroupStatus } from '../../../database/entities/study-groups/study-group.entity';

export class QueryStudyGroupDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  joinedOnly?: boolean;

  @IsOptional()
  @IsInt()
  courseOfferingId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  program?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  batch?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  section?: string;

  @IsOptional()
  @IsEnum(StudyGroupJoinType)
  joinType?: StudyGroupJoinType;

  @IsOptional()
  @IsEnum(StudyGroupStatus)
  status?: StudyGroupStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
