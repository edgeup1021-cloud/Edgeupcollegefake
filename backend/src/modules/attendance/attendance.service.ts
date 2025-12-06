import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { StudentAttendance } from '../../database/entities/student/student-attendance.entity';
import { StudentEnrollment } from '../../database/entities/student/student-enrollment.entity';
import { StudentSchedule } from '../../database/entities/student/student-schedule.entity';
import { TeacherClassSession } from '../../database/entities/teacher/teacher-class-session.entity';
import { TeacherCourseOffering } from '../../database/entities/teacher/teacher-course-offering.entity';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { TeacherUser } from '../../database/entities/teacher/teacher-user.entity';
import { TeacherCourse } from '../../database/entities/teacher/teacher-course.entity';
import {
  BulkMarkAttendanceDto,
  QueryAttendanceDto,
  UpdateAttendanceDto,
} from './dto';
import { EnrollmentStatus, AttendanceStatus } from '../../common/enums/status.enum';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(StudentAttendance)
    private attendanceRepo: Repository<StudentAttendance>,
    @InjectRepository(StudentEnrollment)
    private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(StudentSchedule)
    private scheduleRepo: Repository<StudentSchedule>,
    @InjectRepository(TeacherClassSession)
    private sessionRepo: Repository<TeacherClassSession>,
    @InjectRepository(TeacherCourseOffering)
    private courseOfferingRepo: Repository<TeacherCourseOffering>,
    @InjectRepository(StudentUser)
    private studentRepo: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private teacherRepo: Repository<TeacherUser>,
    @InjectRepository(TeacherCourse)
    private courseRepo: Repository<TeacherCourse>,
    private dataSource: DataSource,
  ) {}

  async getEnrolledStudentsForSession(sessionId: number, teacherId: number) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['courseOffering', 'courseOffering.course'],
    });

    if (!session) {
      throw new NotFoundException(`Class session with ID ${sessionId} not found`);
    }

    if (!session.courseOffering) {
      throw new NotFoundException('Course offering not found for this session');
    }

    if (Number(session.courseOffering.teacherId) !== teacherId) {
      throw new ForbiddenException('You can only view attendance for your own classes');
    }

    const enrollments = await this.enrollmentRepo.find({
      where: {
        courseOfferingId: session.courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
      relations: ['student'],
    });

    const studentIds = enrollments.map(e => e.studentId);

    let attendanceRecords: StudentAttendance[] = [];
    if (studentIds.length > 0) {
      attendanceRecords = await this.attendanceRepo.find({
        where: {
          classSessionId: sessionId,
        },
      });
    }

    const attendanceMap = new Map(
      attendanceRecords.map(a => [a.studentId, a])
    );

    const students = enrollments.map(enrollment => ({
      ...enrollment.student,
      attendance: attendanceMap.get(enrollment.studentId) || null,
    }));

    const marked = attendanceRecords.length;
    const total = students.length;
    const unmarked = total - marked;

    return {
      session: {
        id: session.id,
        sessionDate: session.sessionDate,
        startTime: session.startTime,
        room: session.room,
        courseName: session.courseOffering.course?.title || 'Unknown',
        courseCode: session.courseOffering.course?.code || 'Unknown',
      },
      students,
      stats: {
        total,
        marked,
        unmarked,
      },
    };
  }

  async bulkMarkAttendance(dto: BulkMarkAttendanceDto, teacherId: number) {
    const session = await this.sessionRepo.findOne({
      where: { id: dto.classSessionId },
      relations: ['courseOffering'],
    });

    if (!session) {
      throw new NotFoundException(`Class session with ID ${dto.classSessionId} not found`);
    }

    if (!session.courseOffering) {
      throw new NotFoundException('Course offering not found for this session');
    }

    if (Number(session.courseOffering.teacherId) !== teacherId) {
      throw new ForbiddenException('You can only mark attendance for your own classes');
    }

    const enrollments = await this.enrollmentRepo.find({
      where: {
        courseOfferingId: session.courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    const enrolledStudentIds = new Set(enrollments.map(e => Number(e.studentId)));
    const errors: any[] = [];
    let successCount = 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const record of dto.attendanceRecords) {
        if (!enrolledStudentIds.has(record.studentId)) {
          errors.push({
            studentId: record.studentId,
            error: 'Student is not enrolled in this course',
          });
          continue;
        }

        const existing = await queryRunner.manager.findOne(StudentAttendance, {
          where: {
            studentId: record.studentId,
            classSessionId: dto.classSessionId,
          },
        });

        if (existing) {
          existing.status = record.status;
          existing.remarks = record.remarks || existing.remarks;
          existing.checkInTime = record.checkInTime || existing.checkInTime;
          existing.markedBy = teacherId;
          await queryRunner.manager.save(existing);
        } else {
          const attendance = queryRunner.manager.create(StudentAttendance, {
            studentId: record.studentId,
            classSessionId: dto.classSessionId,
            attendanceDate: session.sessionDate,
            status: record.status,
            remarks: record.remarks || null,
            checkInTime: record.checkInTime || null,
            markedBy: teacherId,
          });
          await queryRunner.manager.save(attendance);
        }

        successCount++;
      }

      await queryRunner.commitTransaction();

      return {
        success: successCount,
        errors,
        total: dto.attendanceRecords.length,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateAttendance(
    attendanceId: number,
    dto: UpdateAttendanceDto,
    teacherId: number,
  ) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${attendanceId} not found`);
    }

    if (!attendance.classSessionId) {
      throw new NotFoundException('Class session ID is missing from attendance record');
    }

    const session = await this.sessionRepo.findOne({
      where: { id: attendance.classSessionId },
      relations: ['courseOffering'],
    });

    if (!session?.courseOffering) {
      throw new NotFoundException('Class session or course offering not found');
    }

    if (Number(session.courseOffering.teacherId) !== teacherId) {
      throw new ForbiddenException('You can only update attendance for your own classes');
    }

    if (dto.status !== undefined) attendance.status = dto.status;
    if (dto.remarks !== undefined) attendance.remarks = dto.remarks;
    if (dto.checkInTime !== undefined) attendance.checkInTime = dto.checkInTime;
    attendance.markedBy = teacherId;

    return this.attendanceRepo.save(attendance);
  }

  async getLatestAttendanceRecord(studentId: number) {
    return this.attendanceRepo.findOne({
      where: { studentId },
      order: { attendanceDate: 'DESC' },
    });
  }

  async getStudentAttendanceHistory(studentId: number, query: QueryAttendanceDto) {
    const queryBuilder = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoin(TeacherClassSession, 'session', 'attendance.classSessionId = session.id')
      .leftJoin(TeacherCourseOffering, 'offering', 'session.courseOfferingId = offering.id')
      .leftJoin(TeacherCourse, 'course', 'offering.courseId = course.id')
      .leftJoin(TeacherUser, 'teacher', 'attendance.markedBy = teacher.id')
      .select([
        'attendance.id as id',
        'attendance.attendanceDate as date',
        'attendance.status as status',
        'attendance.checkInTime as checkInTime',
        'attendance.remarks as remarks',
        'course.title as courseName',
        'course.code as courseCode',
        'CONCAT(teacher.firstName, " ", teacher.lastName) as markedByName',
      ])
      .where('attendance.studentId = :studentId', { studentId });

    if (query.month && query.year) {
      const startDate = new Date(query.year, query.month - 1, 1);
      const endDate = new Date(query.year, query.month, 0);
      queryBuilder.andWhere('attendance.attendanceDate BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('attendance.attendanceDate BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }

    if (query.courseOfferingId) {
      queryBuilder.andWhere('offering.id = :offeringId', { offeringId: query.courseOfferingId });
    }

    const results = await queryBuilder.orderBy('attendance.attendanceDate', 'DESC').getRawMany();

    return results.map(r => ({
      id: r.id,
      date: r.date,
      day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status: r.status,
      checkInTime: r.checkInTime,
      remarks: r.remarks,
      courseName: r.courseName,
      courseCode: r.courseCode,
      markedBy: r.markedByName,
    }));
  }

  async getStudentAttendanceSummary(
    studentId: number,
    month: number,
    year: number,
    courseOfferingId?: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const queryBuilder = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoin(TeacherClassSession, 'session', 'attendance.classSessionId = session.id')
      .where('attendance.studentId = :studentId', { studentId })
      .andWhere('attendance.attendanceDate BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

    if (courseOfferingId) {
      queryBuilder.andWhere('session.courseOfferingId = :offeringId', {
        offeringId: courseOfferingId,
      });
    }

    const attendanceRecords = await queryBuilder.getMany();

    const present = attendanceRecords.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const absent = attendanceRecords.filter(a => a.status === AttendanceStatus.ABSENT).length;
    const late = attendanceRecords.filter(a => a.status === AttendanceStatus.LATE).length;
    const leave = attendanceRecords.filter(a => a.status === AttendanceStatus.EXCUSED).length;

    const workingDaysQuery = this.scheduleRepo
      .createQueryBuilder('schedule')
      .select('COUNT(DISTINCT schedule.sessionDate)', 'count')
      .where('schedule.studentId = :studentId', { studentId })
      .andWhere('schedule.sessionDate BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

    if (courseOfferingId) {
      workingDaysQuery
        .leftJoin(TeacherClassSession, 'session', 'schedule.classSessionId = session.id')
        .andWhere('session.courseOfferingId = :offeringId', { offeringId: courseOfferingId });
    }

    const workingDaysResult = await workingDaysQuery.getRawOne();
    const workingDays = parseInt(workingDaysResult?.count || '0', 10);

    const percentage =
      workingDays > 0 ? ((present + late + leave) / workingDays) * 100 : 0;

    return {
      present,
      absent,
      late,
      leave,
      workingDays,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  async getStudentAttendanceCalendar(studentId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.studentId = :studentId', { studentId })
      .andWhere('attendance.attendanceDate BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .orderBy('attendance.attendanceDate', 'ASC')
      .getMany();

    const dateMap = new Map<string, AttendanceStatus>();

    for (const record of attendanceRecords) {
      if (!record.attendanceDate || !record.status) continue;

      // Handle both Date and string types
      const dateValue = record.attendanceDate as any;
      const dateKey = typeof dateValue === 'string'
        ? (dateValue as string).split('T')[0]
        : new Date(dateValue as Date).toISOString().split('T')[0];
      const existingStatus = dateMap.get(dateKey);

      if (!existingStatus) {
        dateMap.set(dateKey, record.status);
      } else {
        const statusPriority = {
          [AttendanceStatus.ABSENT]: 4,
          [AttendanceStatus.LATE]: 3,
          [AttendanceStatus.EXCUSED]: 2,
          [AttendanceStatus.PRESENT]: 1,
        };

        if (statusPriority[record.status] > statusPriority[existingStatus]) {
          dateMap.set(dateKey, record.status);
        }
      }
    }

    const dates: { [key: string]: string } = {};
    dateMap.forEach((status, date) => {
      dates[date] = status;
    });

    return { dates };
  }

  async getClassAttendanceReport(sessionId: number, teacherId: number) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['courseOffering', 'courseOffering.course'],
    });

    if (!session) {
      throw new NotFoundException(`Class session with ID ${sessionId} not found`);
    }

    if (!session.courseOffering) {
      throw new NotFoundException('Course offering not found for this session');
    }

    if (Number(session.courseOffering.teacherId) !== teacherId) {
      throw new ForbiddenException('You can only view reports for your own classes');
    }

    const enrollments = await this.enrollmentRepo.find({
      where: {
        courseOfferingId: session.courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    const totalStudents = enrollments.length;

    const attendanceRecords = await this.attendanceRepo.find({
      where: { classSessionId: sessionId },
      relations: ['student'],
    });

    const present = attendanceRecords.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const absent = attendanceRecords.filter(a => a.status === AttendanceStatus.ABSENT).length;
    const late = attendanceRecords.filter(a => a.status === AttendanceStatus.LATE).length;
    const leave = attendanceRecords.filter(a => a.status === AttendanceStatus.EXCUSED).length;

    const percentage =
      totalStudents > 0 ? ((present + late + leave) / totalStudents) * 100 : 0;

    return {
      session: {
        id: session.id,
        sessionDate: session.sessionDate,
        startTime: session.startTime,
        room: session.room,
        courseName: session.courseOffering.course?.title || 'Unknown',
        courseCode: session.courseOffering.course?.code || 'Unknown',
      },
      stats: {
        totalStudents,
        present,
        absent,
        late,
        leave,
        percentage: Math.round(percentage * 100) / 100,
      },
      attendance: attendanceRecords.map(a => ({
        studentId: a.studentId,
        studentName: a.student ? `${a.student.firstName} ${a.student.lastName}` : 'Unknown',
        status: a.status,
        checkInTime: a.checkInTime,
        remarks: a.remarks,
      })),
    };
  }

  async getCourseAttendanceStats(courseOfferingId: number, teacherId: number) {
    const courseOffering = await this.courseOfferingRepo.findOne({
      where: { id: courseOfferingId },
      relations: ['course'],
    });

    if (!courseOffering) {
      throw new NotFoundException(`Course offering with ID ${courseOfferingId} not found`);
    }

    if (Number(courseOffering.teacherId) !== teacherId) {
      throw new ForbiddenException('You can only view stats for your own courses');
    }

    const enrollments = await this.enrollmentRepo.find({
      where: {
        courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
      relations: ['student'],
    });

    const sessions = await this.sessionRepo.find({
      where: { courseOfferingId },
    });

    const totalSessions = sessions.length;
    const studentStats = [];

    for (const enrollment of enrollments) {
      const attendanceRecords = await this.attendanceRepo
        .createQueryBuilder('attendance')
        .leftJoin(TeacherClassSession, 'session', 'attendance.classSessionId = session.id')
        .where('attendance.studentId = :studentId', { studentId: enrollment.studentId })
        .andWhere('session.courseOfferingId = :offeringId', { offeringId: courseOfferingId })
        .getMany();

      const present = attendanceRecords.filter(a => a.status === AttendanceStatus.PRESENT).length;
      const absent = attendanceRecords.filter(a => a.status === AttendanceStatus.ABSENT).length;
      const late = attendanceRecords.filter(a => a.status === AttendanceStatus.LATE).length;
      const leave = attendanceRecords.filter(a => a.status === AttendanceStatus.EXCUSED).length;

      const percentage =
        totalSessions > 0 ? ((present + late + leave) / totalSessions) * 100 : 0;

      studentStats.push({
        studentId: enrollment.studentId,
        studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        admissionNo: enrollment.student.admissionNo,
        present,
        absent,
        late,
        leave,
        totalSessions,
        percentage: Math.round(percentage * 100) / 100,
      });
    }

    const totalPresent = studentStats.reduce((sum, s) => sum + s.present, 0);
    const totalAbsent = studentStats.reduce((sum, s) => sum + s.absent, 0);
    const totalLate = studentStats.reduce((sum, s) => sum + s.late, 0);
    const totalLeave = studentStats.reduce((sum, s) => sum + s.leave, 0);
    const overallAttendance =
      enrollments.length * totalSessions > 0
        ? ((totalPresent + totalLate + totalLeave) / (enrollments.length * totalSessions)) * 100
        : 0;

    return {
      course: {
        id: courseOffering.id,
        code: courseOffering.course?.code || 'Unknown',
        title: courseOffering.course?.title || 'Unknown',
        semester: courseOffering.semester,
        year: courseOffering.year,
      },
      overall: {
        totalStudents: enrollments.length,
        totalSessions,
        averageAttendance: Math.round(overallAttendance * 100) / 100,
      },
      students: studentStats,
    };
  }
}
