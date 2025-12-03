import {
  IsEnum,
  IsDateString,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { LeaveType } from '../../../common/enums/status.enum';

export class CreateLeaveRequestDto {
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  courseOfferingId?: number;

  @IsOptional()
  @IsNumber()
  classSessionId?: number;

  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @MinLength(20, { message: 'Reason must be at least 20 characters' })
  @MaxLength(2000)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  supportingDocument?: string;
}
