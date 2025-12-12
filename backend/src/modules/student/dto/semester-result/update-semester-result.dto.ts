import { IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { SemesterResultStatus } from '../../../../database/entities/student/student-semester-result.entity';

export class UpdateSemesterResultDto {
  @IsNumber()
  @IsOptional()
  sgpa?: number;

  @IsNumber()
  @IsOptional()
  cgpa?: number;

  @IsEnum(SemesterResultStatus)
  @IsOptional()
  status?: SemesterResultStatus;

  @IsDateString()
  @IsOptional()
  resultDate?: string;
}
