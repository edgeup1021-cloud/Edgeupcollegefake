import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { LeaveStatus } from '../../../common/enums/status.enum';

export class ReviewLeaveRequestDto {
  @IsEnum([LeaveStatus.APPROVED, LeaveStatus.REJECTED])
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewRemarks?: string;
}
