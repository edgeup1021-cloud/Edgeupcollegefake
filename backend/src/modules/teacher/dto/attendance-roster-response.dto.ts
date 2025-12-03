import { IsArray, IsString, IsInt, IsOptional } from 'class-validator';

export class AttendanceStudentDto {
  studentId: number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  status?: string;
  remarks?: string;
}

export class AttendanceSessionInfoDto {
  id: number;
  courseTitle: string;
  courseCode: string;
  sessionDate: string;
  startTime: string;
  room: string;
}

export class AttendanceStatisticsDto {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

export class AttendanceRosterResponseDto {
  session: AttendanceSessionInfoDto;
  students: AttendanceStudentDto[];
  statistics: AttendanceStatisticsDto;
}

export class MarkAttendanceDto {
  @IsArray()
  attendanceRecords: {
    studentId: number;
    status: string;
    remarks?: string;
  }[];

  @IsOptional()
  @IsString()
  sessionDate?: string;
}
