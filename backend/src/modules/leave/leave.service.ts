import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudentLeaveRequest } from '../../database/entities/student/student-leave-request.entity';
import { LeaveStatus } from '../../common/enums/status.enum';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { StudentEnrollment } from '../../database/entities/student/student-enrollment.entity';
import { StudentAttendance } from '../../database/entities/student/student-attendance.entity';
import { StudentSchedule } from '../../database/entities/student/student-schedule.entity';
import { TeacherClassSession } from '../../database/entities/teacher/teacher-class-session.entity';
import { TeacherCourseOffering } from '../../database/entities/teacher/teacher-course-offering.entity';
import { CalendarService } from '../student/calendar/calendar.service';
import { EventType } from '../../common/enums/event-type.enum';
import { AttendanceStatus, EnrollmentStatus } from '../../common/enums/status.enum';
import {
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  QueryLeaveRequestDto,
} from './dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(StudentLeaveRequest)
    private leaveRequestRepo: Repository<StudentLeaveRequest>,
    @InjectRepository(StudentUser)
    private studentRepo: Repository<StudentUser>,
    @InjectRepository(StudentEnrollment)
    private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(StudentAttendance)
    private attendanceRepo: Repository<StudentAttendance>,
    @InjectRepository(StudentSchedule)
    private scheduleRepo: Repository<StudentSchedule>,
    @InjectRepository(TeacherClassSession)
    private sessionRepo: Repository<TeacherClassSession>,
    @InjectRepository(TeacherCourseOffering)
    private courseOfferingRepo: Repository<TeacherCourseOffering>,
    private calendarService: CalendarService,
  ) {}

  async createLeaveRequest(dto: CreateLeaveRequestDto): Promise<StudentLeaveRequest> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be greater than or equal to start date');
    }

    if (startDate < today) {
      throw new BadRequestException('Leave start date cannot be in the past');
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      throw new BadRequestException('Leave duration cannot exceed 30 days');
    }

    const student = await this.studentRepo.findOne({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    if (dto.courseOfferingId) {
      const enrollment = await this.enrollmentRepo.findOne({
        where: {
          studentId: dto.studentId,
          courseOfferingId: dto.courseOfferingId,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      if (!enrollment) {
        throw new BadRequestException(
          'Student is not enrolled in the specified course',
        );
      }
    }

    const leaveRequest = this.leaveRequestRepo.create({
      ...dto,
      startDate,
      endDate,
      status: LeaveStatus.PENDING,
    });

    return this.leaveRequestRepo.save(leaveRequest);
  }

  async getStudentLeaveRequests(
    studentId: number,
    query: QueryLeaveRequestDto,
  ): Promise<StudentLeaveRequest[]> {
    const queryBuilder = this.leaveRequestRepo
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.reviewer', 'reviewer')
      .where('leave.studentId = :studentId', { studentId });

    if (query.status) {
      queryBuilder.andWhere('leave.status = :status', { status: query.status });
    }

    queryBuilder.orderBy('leave.createdAt', 'DESC');

    if (query.limit) {
      queryBuilder.take(query.limit);
    }

    if (query.offset) {
      queryBuilder.skip(query.offset);
    }

    return queryBuilder.getMany();
  }

  async cancelLeaveRequest(leaveId: number, studentId: number): Promise<StudentLeaveRequest> {
    const leaveRequest = await this.leaveRequestRepo.findOne({
      where: { id: leaveId },
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${leaveId} not found`);
    }

    if (leaveRequest.studentId !== studentId) {
      throw new ForbiddenException('You can only cancel your own leave requests');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be cancelled');
    }

    leaveRequest.status = LeaveStatus.CANCELLED;
    return this.leaveRequestRepo.save(leaveRequest);
  }

  async getTeacherPendingLeaveRequests(
    teacherId: number,
    courseOfferingId?: number,
  ): Promise<any[]> {
    let courseOfferingIds: number[] = [];

    if (courseOfferingId) {
      const offering = await this.courseOfferingRepo.findOne({
        where: { id: courseOfferingId },
      });

      if (!offering || Number(offering.teacherId) !== teacherId) {
        throw new ForbiddenException('You can only view leave requests for your own courses');
      }

      courseOfferingIds = [courseOfferingId];
    } else {
      const offerings = await this.courseOfferingRepo.find({
        where: { teacherId },
      });

      courseOfferingIds = offerings.map(o => o.id);
    }

    if (courseOfferingIds.length === 0) {
      return [];
    }

    const leaveRequests = await this.leaveRequestRepo
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.student', 'student')
      .where('leave.status = :status', { status: LeaveStatus.PENDING })
      .andWhere('leave.courseOfferingId IN (:...offeringIds)', {
        offeringIds: courseOfferingIds,
      })
      .orderBy('leave.createdAt', 'ASC')
      .getMany();

    return leaveRequests.map(leave => ({
      id: leave.id,
      studentId: leave.studentId,
      studentName: `${leave.student.firstName} ${leave.student.lastName}`,
      admissionNo: leave.student.admissionNo,
      email: leave.student.email,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      supportingDocument: leave.supportingDocument,
      createdAt: leave.createdAt,
    }));
  }

  async reviewLeaveRequest(
    leaveId: number,
    dto: ReviewLeaveRequestDto,
    teacherId: number,
  ): Promise<StudentLeaveRequest> {
    const leaveRequest = await this.leaveRequestRepo.findOne({
      where: { id: leaveId },
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${leaveId} not found`);
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave requests can be reviewed');
    }

    if (leaveRequest.courseOfferingId) {
      const offering = await this.courseOfferingRepo.findOne({
        where: { id: leaveRequest.courseOfferingId },
      });

      if (!offering || Number(offering.teacherId) !== teacherId) {
        throw new ForbiddenException(
          'You can only review leave requests for your own courses',
        );
      }
    }

    leaveRequest.status = dto.status;
    leaveRequest.reviewedBy = teacherId;
    leaveRequest.reviewedAt = new Date();
    leaveRequest.reviewRemarks = dto.reviewRemarks || null;

    const savedLeaveRequest = await this.leaveRequestRepo.save(leaveRequest);

    if (dto.status === LeaveStatus.APPROVED) {
      await this.applyApprovedLeaveToAttendance(savedLeaveRequest);
    }

    return savedLeaveRequest;
  }

  private async applyApprovedLeaveToAttendance(
    leaveRequest: StudentLeaveRequest,
  ): Promise<void> {
    const startDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);

    let sessionQuery = this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.classSession', 'session')
      .where('schedule.studentId = :studentId', { studentId: leaveRequest.studentId })
      .andWhere('schedule.sessionDate BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

    if (leaveRequest.courseOfferingId) {
      sessionQuery = sessionQuery.andWhere('session.courseOfferingId = :offeringId', {
        offeringId: leaveRequest.courseOfferingId,
      });
    }

    if (leaveRequest.classSessionId) {
      sessionQuery = sessionQuery.andWhere('session.id = :sessionId', {
        sessionId: leaveRequest.classSessionId,
      });
    }

    const schedules = await sessionQuery.getMany();

    for (const schedule of schedules) {
      const existing = await this.attendanceRepo.findOne({
        where: {
          studentId: leaveRequest.studentId,
          classSessionId: schedule.classSessionId,
        },
      });

      if (existing) {
        existing.status = AttendanceStatus.EXCUSED;
        existing.remarks = `Approved leave: ${leaveRequest.leaveType}`;
        existing.markedBy = leaveRequest.reviewedBy;
        await this.attendanceRepo.save(existing);
      } else {
        const attendance = this.attendanceRepo.create({
          studentId: leaveRequest.studentId,
          classSessionId: schedule.classSessionId,
          attendanceDate: schedule.sessionDate,
          status: AttendanceStatus.EXCUSED,
          remarks: `Approved leave: ${leaveRequest.leaveType}`,
          markedBy: leaveRequest.reviewedBy,
        });
        await this.attendanceRepo.save(attendance);
      }
    }

    try {
      await this.calendarService.create({
        studentId: leaveRequest.studentId,
        title: `Leave: ${leaveRequest.leaveType}`,
        eventType: EventType.LEAVE,
        eventDate: leaveRequest.startDate.toISOString().split('T')[0],
        description: leaveRequest.reason,
        color: '#6B8EFF',
      });
    } catch (error) {
      console.error('Error creating calendar event for leave:', error);
    }
  }
}
