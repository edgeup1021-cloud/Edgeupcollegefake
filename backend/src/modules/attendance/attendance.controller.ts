import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  BulkMarkAttendanceDto,
  QueryAttendanceDto,
  UpdateAttendanceDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('sessions/:sessionId/students')
  @Roles(UserRole.TEACHER)
  async getEnrolledStudents(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.getEnrolledStudentsForSession(sessionId, user.id);
  }

  @Post('bulk')
  @Roles(UserRole.TEACHER)
  async bulkMarkAttendance(
    @Body() dto: BulkMarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.bulkMarkAttendance(dto, user.id);
  }

  @Patch(':attendanceId')
  @Roles(UserRole.TEACHER)
  async updateAttendance(
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Body() dto: UpdateAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.updateAttendance(attendanceId, dto, user.id);
  }

  @Get('sessions/:sessionId/report')
  @Roles(UserRole.TEACHER)
  async getClassReport(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.getClassAttendanceReport(sessionId, user.id);
  }

  @Get('courses/:courseOfferingId/stats')
  @Roles(UserRole.TEACHER)
  async getCourseStats(
    @Param('courseOfferingId', ParseIntPipe) courseOfferingId: number,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.getCourseAttendanceStats(courseOfferingId, user.id);
  }

  // ========== STUDENT ENDPOINTS ==========

  @Get('student/:studentId/overview')
  @Public() // Allow access without authentication for development
  async getStudentAttendanceOverview(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @CurrentUser() user?: any, // Optional user for future auth implementation
  ) {
    // TODO: Enable when JWT authentication is properly configured
    // For now, allow access to any student's data for testing
    // if (user && user.role === UserRole.STUDENT && user.id !== studentId) {
    //   throw new ForbiddenException('Access denied');
    // }

    let targetMonth: number;
    let targetYear: number;

    // If month/year not provided, find the latest attendance record and use that month
    if (!month || !year) {
      const latestRecord = await this.attendanceService.getLatestAttendanceRecord(studentId);
      if (latestRecord && latestRecord.attendanceDate) {
        const latestDate = new Date(latestRecord.attendanceDate);
        targetMonth = latestDate.getMonth() + 1;
        targetYear = latestDate.getFullYear();
      } else {
        // No attendance records, default to current month
        const now = new Date();
        targetMonth = now.getMonth() + 1;
        targetYear = now.getFullYear();
      }
    } else {
      targetMonth = parseInt(month, 10);
      targetYear = parseInt(year, 10);
    }

    // Fetch data in parallel
    const [calendarData, history, summary] = await Promise.all([
      this.attendanceService.getStudentAttendanceCalendar(studentId, targetMonth, targetYear),
      this.attendanceService.getStudentAttendanceHistory(studentId, { month: targetMonth, year: targetYear }),
      this.attendanceService.getStudentAttendanceSummary(studentId, targetMonth, targetYear),
    ]);

    // Transform calendar days
    const days = [];
    const historyMap = new Map(history.map((h) => [h.date, h]));

    for (const [date, status] of Object.entries(calendarData.dates)) {
      const record = historyMap.get(date);
      days.push({
        date,
        status: status.toLowerCase(),
        sessionTitle: record?.courseName,
        sessionTime: record?.checkInTime,
        markedBy: record?.markedBy,
      });
    }

    // Return overview
    return {
      calendar: {
        month: targetMonth,
        year: targetYear,
        days,
      },
      recentAttendance: history.slice(0, 10).map((r) => ({
        date: r.date,
        day: r.day,
        status: r.status.toLowerCase(),
        sessionTitle: r.courseName || 'Unknown',
        sessionTime: r.checkInTime || 'N/A',
        markedBy: r.markedBy || 'System',
        remarks: r.remarks,
      })),
      statistics: {
        daysPresent: summary.present,
        daysAbsent: summary.absent,
        daysLate: summary.late,
        daysExcused: summary.leave,
        totalDays: summary.workingDays,
        attendancePercentage: summary.percentage,
      },
    };
  }

  @Get('student/:studentId/history')
  @Public() // Allow access without authentication for development
  async getStudentHistory(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: QueryAttendanceDto,
    @CurrentUser() user?: any, // Optional user for future auth implementation
  ) {
    // TODO: Enable when JWT authentication is properly configured
    // For now, allow access to any student's data for testing
    // if (user && user.role === UserRole.STUDENT && user.id !== studentId) {
    //   throw new ForbiddenException('Access denied');
    // }

    const history = await this.attendanceService.getStudentAttendanceHistory(
      studentId,
      query,
    );

    return history.map((r) => ({
      date: r.date,
      day: r.day,
      status: r.status.toLowerCase(),
      sessionTitle: r.courseName || 'Unknown',
      sessionTime: r.checkInTime || 'N/A',
      markedBy: r.markedBy || 'System',
      remarks: r.remarks,
    }));
  }
}
