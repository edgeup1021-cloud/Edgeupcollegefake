import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { AttendanceStatus } from '../../../common/enums/status.enum';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string; // Format: "HH:MM:SS"
}
