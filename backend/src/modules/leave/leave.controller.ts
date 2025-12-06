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
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import {
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  QueryLeaveRequestDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ForbiddenException } from '@nestjs/common';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('apply')
  @Roles(UserRole.STUDENT)
  async applyForLeave(@Body() dto: CreateLeaveRequestDto) {
    return this.leaveService.createLeaveRequest(dto);
  }

  @Get('student/:studentId/requests')
  async getStudentLeaveRequests(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: QueryLeaveRequestDto,
    @CurrentUser() user: any,
  ) {
    if (user.role !== UserRole.ADMIN && user.id !== studentId) {
      throw new ForbiddenException('You can only view your own leave requests');
    }
    return this.leaveService.getStudentLeaveRequests(studentId, query);
  }

  @Patch(':leaveId/cancel')
  @Roles(UserRole.STUDENT)
  async cancelLeaveRequest(
    @Param('leaveId', ParseIntPipe) leaveId: number,
    @CurrentUser() user: any,
  ) {
    return this.leaveService.cancelLeaveRequest(leaveId, user.id);
  }

  @Get('teacher/:teacherId/pending')
  @Roles(UserRole.TEACHER)
  async getTeacherPendingRequests(
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query('courseOfferingId', ParseIntPipe) courseOfferingId: number | undefined,
    @CurrentUser() user: any,
  ) {
    if (user.id !== teacherId) {
      throw new ForbiddenException('You can only view leave requests for your own courses');
    }
    return this.leaveService.getTeacherPendingLeaveRequests(teacherId, courseOfferingId);
  }

  @Patch(':leaveId/review')
  @Roles(UserRole.TEACHER)
  async reviewLeaveRequest(
    @Param('leaveId', ParseIntPipe) leaveId: number,
    @Body() dto: ReviewLeaveRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.leaveService.reviewLeaveRequest(leaveId, dto, user.id);
  }

  // ========== FRONTEND-COMPATIBLE ALIASES ==========

  @Get('student/:studentId/applications')
  @Public() // Allow access without authentication for development
  async getStudentLeaveApplications(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: QueryLeaveRequestDto,
    @CurrentUser() user?: any, // Optional user for future auth implementation
  ) {
    // TODO: Enable when JWT authentication is properly configured
    // if (user && user.role !== UserRole.ADMIN && user.id !== studentId) {
    //   throw new ForbiddenException('Access denied');
    // }

    const requests = await this.leaveService.getStudentLeaveRequests(
      studentId,
      query,
    );

    // Transform to frontend format
    return requests.map((leave) => ({
      id: leave.id,
      leaveType: this.mapLeaveType(leave.leaveType),
      startDate: leave.startDate instanceof Date
        ? leave.startDate.toISOString().split('T')[0]
        : leave.startDate,
      endDate: leave.endDate instanceof Date
        ? leave.endDate.toISOString().split('T')[0]
        : leave.endDate,
      reason: leave.reason,
      supportingDocuments: leave.supportingDocument
        ? [leave.supportingDocument]
        : undefined,
      status: leave.status.toLowerCase(),
      appliedOn: leave.createdAt instanceof Date
        ? leave.createdAt.toISOString().split('T')[0]
        : leave.createdAt,
      reviewedBy: leave.reviewer
        ? `${leave.reviewer.firstName} ${leave.reviewer.lastName}`
        : undefined,
      reviewedOn: leave.reviewedAt instanceof Date
        ? leave.reviewedAt.toISOString().split('T')[0]
        : leave.reviewedAt || undefined,
      reviewComments: leave.reviewRemarks,
    }));
  }

  @Post('student/:studentId/applications')
  @Roles(UserRole.STUDENT)
  async createLeaveApplication(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() dto: CreateLeaveRequestDto,
    @CurrentUser() user: any,
  ) {
    if (user.id !== studentId) {
      throw new ForbiddenException('Access denied');
    }

    // Note: File upload handling would go here if needed
    const request = await this.leaveService.createLeaveRequest({
      ...dto,
      studentId,
    });

    // Transform and return
    return {
      id: request.id,
      leaveType: this.mapLeaveType(request.leaveType),
      startDate: request.startDate instanceof Date
        ? request.startDate.toISOString().split('T')[0]
        : request.startDate,
      endDate: request.endDate instanceof Date
        ? request.endDate.toISOString().split('T')[0]
        : request.endDate,
      reason: request.reason,
      supportingDocuments: request.supportingDocument
        ? [request.supportingDocument]
        : undefined,
      status: request.status.toLowerCase(),
      appliedOn: request.createdAt instanceof Date
        ? request.createdAt.toISOString().split('T')[0]
        : request.createdAt,
    };
  }

  private mapLeaveType(backendType: string): string {
    const map: { [key: string]: string } = {
      'Sick Leave': 'sick',
      'Personal Leave': 'casual',
      'Family Emergency': 'emergency',
      'Medical Leave': 'sick',
      'Other': 'other',
    };
    return map[backendType] || 'other';
  }
}
