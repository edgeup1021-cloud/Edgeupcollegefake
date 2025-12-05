import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource, IsNull } from 'typeorm';
import { LiveClass, LiveClassStatus } from '../../database/entities/teacher/teacher-live-class.entity';
import {
  LiveClassAttendance,
  LiveClassAttendanceStatus,
} from '../../database/entities/student/student-live-class-attendance.entity';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { TeacherUser } from '../../database/entities/teacher/teacher-user.entity';
import {
  CreateLiveClassDto,
  UpdateLiveClassDto,
  QueryLiveClassDto,
} from './dto';

@Injectable()
export class LiveClassesService {
  constructor(
    @InjectRepository(LiveClass)
    private liveClassRepo: Repository<LiveClass>,
    @InjectRepository(LiveClassAttendance)
    private attendanceRepo: Repository<LiveClassAttendance>,
    @InjectRepository(StudentUser)
    private studentRepo: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private teacherRepo: Repository<TeacherUser>,
    private dataSource: DataSource,
  ) {}

  // Teacher Methods
  async createLiveClass(teacherId: number, dto: CreateLiveClassDto): Promise<LiveClass> {
    const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const liveClass = this.liveClassRepo.create({
      teacherId,
      ...dto,
      status: LiveClassStatus.SCHEDULED,
    });

    return await this.liveClassRepo.save(liveClass);
  }

  async getTeacherLiveClasses(teacherId: number, query?: QueryLiveClassDto): Promise<any[]> {
    const where: any = { teacherId };

    if (query) {
      if (query.status) where.status = query.status;
      if (query.program) where.program = query.program;
      if (query.batch) where.batch = query.batch;
      if (query.section) where.section = query.section;
      if (query.date) where.scheduledDate = query.date;
    }

    const classes = await this.liveClassRepo.find({
      where,
      relations: ['teacher'],
      order: { scheduledDate: 'DESC', scheduledTime: 'DESC' },
    });

    return classes.map(cls => ({
      ...cls,
      teacherName: cls.teacher ? `${cls.teacher.firstName} ${cls.teacher.lastName}` : undefined,
    }));
  }

  async getLiveClassById(id: number, teacherId?: number): Promise<any> {
    const liveClass = await this.liveClassRepo.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!liveClass) {
      throw new NotFoundException(`Live class with ID ${id} not found`);
    }

    if (teacherId && liveClass.teacherId !== teacherId) {
      throw new ForbiddenException('You can only view your own live classes');
    }

    return {
      ...liveClass,
      teacherName: liveClass.teacher ? `${liveClass.teacher.firstName} ${liveClass.teacher.lastName}` : undefined,
    };
  }

  async updateLiveClass(
    id: number,
    teacherId: number,
    dto: UpdateLiveClassDto,
  ): Promise<LiveClass> {
    const liveClass = await this.getLiveClassById(id, teacherId);

    // Prevent updating completed or cancelled classes
    if (liveClass.status === LiveClassStatus.COMPLETED || liveClass.status === LiveClassStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a completed or cancelled class');
    }

    Object.assign(liveClass, dto);
    return await this.liveClassRepo.save(liveClass);
  }

  async deleteLiveClass(id: number, teacherId: number): Promise<void> {
    const liveClass = await this.getLiveClassById(id, teacherId);

    // Prevent deleting live classes
    if (liveClass.status === LiveClassStatus.LIVE) {
      throw new BadRequestException('Cannot delete a live class. Please end it first.');
    }

    await this.liveClassRepo.remove(liveClass);
  }

  async startLiveClass(id: number, teacherId: number): Promise<LiveClass> {
    const liveClass = await this.getLiveClassById(id, teacherId);

    if (liveClass.status === LiveClassStatus.LIVE) {
      throw new BadRequestException('Class is already live');
    }

    if (liveClass.status === LiveClassStatus.COMPLETED || liveClass.status === LiveClassStatus.CANCELLED) {
      throw new BadRequestException('Cannot start a completed or cancelled class');
    }

    liveClass.status = LiveClassStatus.LIVE;
    liveClass.startedAt = new Date();

    return await this.liveClassRepo.save(liveClass);
  }

  async endLiveClass(id: number, teacherId: number): Promise<LiveClass> {
    const liveClass = await this.getLiveClassById(id, teacherId);

    if (liveClass.status !== LiveClassStatus.LIVE) {
      throw new BadRequestException('Only live classes can be ended');
    }

    liveClass.status = LiveClassStatus.COMPLETED;
    liveClass.endedAt = new Date();

    // Update all attendance records that are still active (no leftAt)
    const activeAttendances = await this.attendanceRepo.find({
      where: { liveClassId: id, leftAt: IsNull() },
    });

    for (const attendance of activeAttendances) {
      attendance.leftAt = new Date();
      if (attendance.joinedAt) {
        const duration = Math.floor(
          (attendance.leftAt.getTime() - attendance.joinedAt.getTime()) / 60000
        );
        attendance.duration = duration;
      }
      await this.attendanceRepo.save(attendance);
    }

    return await this.liveClassRepo.save(liveClass);
  }

  async getLiveClassAttendance(liveClassId: number, teacherId: number) {
    const liveClass = await this.getLiveClassById(liveClassId, teacherId);

    const attendances = await this.attendanceRepo.find({
      where: { liveClassId },
      relations: ['student'],
      order: { joinedAt: 'DESC' },
    });

    return attendances.map(att => ({
      id: att.id,
      liveClassId: att.liveClassId,
      studentId: att.studentId,
      studentName: att.student ? `${att.student.firstName} ${att.student.lastName}` : 'Unknown',
      joinedAt: att.joinedAt,
      leftAt: att.leftAt,
      duration: att.duration,
      status: att.status,
    }));
  }

  // Student Methods
  async getStudentLiveClasses(studentId: number, query?: QueryLiveClassDto): Promise<any[]> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const where: any = {
      program: student.program,
      batch: student.batch,
      section: student.section,
    };

    if (query) {
      if (query.status) where.status = query.status;
      if (query.date) where.scheduledDate = query.date;
    }

    const classes = await this.liveClassRepo.find({
      where,
      relations: ['teacher'],
      order: { scheduledDate: 'DESC', scheduledTime: 'DESC' },
    });

    return classes.map(cls => ({
      ...cls,
      teacherName: cls.teacher ? `${cls.teacher.firstName} ${cls.teacher.lastName}` : undefined,
    }));
  }

  async joinLiveClass(liveClassId: number, studentId: number): Promise<void> {
    const liveClass = await this.liveClassRepo.findOne({ where: { id: liveClassId } });
    if (!liveClass) {
      throw new NotFoundException(`Live class with ID ${liveClassId} not found`);
    }

    if (liveClass.status !== LiveClassStatus.LIVE) {
      throw new BadRequestException('This class is not currently live');
    }

    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Check if student is in the same program/batch/section
    if (
      student.program !== liveClass.program ||
      student.batch !== liveClass.batch ||
      student.section !== liveClass.section
    ) {
      throw new ForbiddenException('You are not enrolled in this class');
    }

    // Check if student already has an attendance record
    let attendance = await this.attendanceRepo.findOne({
      where: { liveClassId, studentId },
    });

    if (attendance) {
      // Student rejoining
      if (attendance.leftAt) {
        attendance.leftAt = null;
        attendance.joinedAt = new Date();
      }
    } else {
      // New attendance record
      attendance = this.attendanceRepo.create({
        liveClassId,
        studentId,
        joinedAt: new Date(),
        status: LiveClassAttendanceStatus.PRESENT,
      });
    }

    await this.attendanceRepo.save(attendance);
  }

  async leaveLiveClass(liveClassId: number, studentId: number): Promise<void> {
    const attendance = await this.attendanceRepo.findOne({
      where: { liveClassId, studentId },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    if (attendance.leftAt) {
      throw new BadRequestException('You have already left this class');
    }

    attendance.leftAt = new Date();

    // Calculate duration
    if (attendance.joinedAt) {
      const duration = Math.floor(
        (attendance.leftAt.getTime() - attendance.joinedAt.getTime()) / 60000
      );
      attendance.duration = duration;
    }

    await this.attendanceRepo.save(attendance);
  }
}
