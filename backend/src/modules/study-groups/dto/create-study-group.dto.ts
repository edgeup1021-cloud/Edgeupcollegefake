import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { StudyGroupJoinType } from '../../../database/entities/study-groups/study-group.entity';

export class CreateStudyGroupDto {
  @IsString()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  subject?: string;

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
  joinType: StudyGroupJoinType = StudyGroupJoinType.OPEN;

  @ValidateIf((o) => o.joinType === StudyGroupJoinType.CODE)
  @IsNotEmpty()
  @IsString()
  @Length(4, 64)
  inviteCode?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(500)
  maxMembers?: number;
}
