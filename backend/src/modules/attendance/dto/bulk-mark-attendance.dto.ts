import { Type } from 'class-transformer';
import {
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AttendanceStatus } from '../../../common/enums/status.enum';

export class AttendanceRecordDto {
  @IsNumber()
  studentId: number;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string; // Format: "HH:MM:SS"
}

export class BulkMarkAttendanceDto {
  @IsNumber()
  classSessionId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  attendanceRecords: AttendanceRecordDto[];
}
