import { IsOptional, IsNumber, IsEnum, IsString } from 'class-validator';
import { AssignmentType } from '../../../../common/enums/status.enum';
import { Type } from 'class-transformer';

export class QueryAssignmentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  courseOfferingId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teacherId?: number;

  @IsOptional()
  @IsEnum(AssignmentType)
  type?: AssignmentType;

  @IsOptional()
  @IsString()
  status?: string;
}
