import { IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../../common/enums/status.enum';

export class QueryAttendanceDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  studentId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  courseOfferingId?: number;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
