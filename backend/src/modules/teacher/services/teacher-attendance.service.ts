import { Injectable } from '@nestjs/common';
import { AttendanceService } from '../../attendance/attendance.service';
import {
  AttendanceRosterResponseDto,
  AttendanceStudentDto,
  AttendanceStatisticsDto,
  MarkAttendanceDto,
} from '../dto/attendance-roster-response.dto';
import { AttendanceStatus } from '../../../common/enums/status.enum';

@Injectable()
export class TeacherAttendanceService {
  constructor(private readonly attendanceService: AttendanceService) {}

  async getAttendanceRoster(
    sessionId: number,
    teacherId: number,
  ): Promise<AttendanceRosterResponseDto> {
    // Call existing attendance service
    const result = await this.attendanceService.getEnrolledStudentsForSession(
      sessionId,
      teacherId,
    );

    // Transform to frontend format
    const students: AttendanceStudentDto[] = result.students.map((s) => ({
      studentId: s.id,
      admissionNo: s.admissionNo,
      firstName: s.firstName,
      lastName: s.lastName,
      status: s.attendance?.status?.toLowerCase(),
      remarks: s.attendance?.remarks ?? undefined,
    }));

    // Calculate real-time statistics
    const statistics: AttendanceStatisticsDto = {
      present: students.filter((s) => s.status === 'present').length,
      absent: students.filter((s) => s.status === 'absent').length,
      late: students.filter((s) => s.status === 'late').length,
      excused: students.filter((s) => s.status === 'excused').length,
      total: students.length,
    };

    return {
      session: {
        id: result.session.id,
        courseTitle: result.session.courseName, // Map courseName → courseTitle
        courseCode: result.session.courseCode,
        sessionDate:
          typeof result.session.sessionDate === 'string'
            ? result.session.sessionDate
            : result.session.sessionDate.toISOString().split('T')[0],
        startTime: result.session.startTime,
        room: result.session.room || '',
      },
      students,
      statistics,
    };
  }

  async markSessionAttendance(
    sessionId: number,
    dto: MarkAttendanceDto,
    teacherId: number,
  ) {
    // Transform to BulkMarkAttendanceDto
    const bulkDto = {
      classSessionId: sessionId,
      attendanceRecords: dto.attendanceRecords.map((r) => ({
        studentId: r.studentId,
        status: r.status.toLowerCase() as AttendanceStatus,
        remarks: r.remarks,
      })),
    };

    return this.attendanceService.bulkMarkAttendance(bulkDto, teacherId);
  }
}
