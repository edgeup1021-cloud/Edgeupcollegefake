import { IsOptional, IsEnum, IsString } from 'class-validator';
import { AssignmentType } from '../../../../common/enums/status.enum';
import { Transform, Type } from 'class-transformer';

export class QueryAssignmentsDto {
  @IsOptional()
  @Type(() => Number)
  courseOfferingId?: number;

  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsEnum(AssignmentType)
  type?: AssignmentType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsString()
  section?: string;
}
