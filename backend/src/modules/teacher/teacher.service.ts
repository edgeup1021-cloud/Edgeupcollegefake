import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import {
  TeacherUser,
  TeacherCourseOffering,
  TeacherClassSession,
  TeacherAssignment,
  TeacherCourse,
} from '../../database/entities/teacher';
import {
  StudentEnrollment,
  StudentAssignmentSubmission,
  StudentSchedule,
  StudentUser,
} from '../../database/entities/student';
import { Department } from '../../database/entities/management';
import { EnrollmentStatus } from '../../common/enums/status.enum';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherUser)
    private readonly teacherRepository: Repository<TeacherUser>,
    @InjectRepository(TeacherCourseOffering)
    private readonly courseOfferingRepository: Repository<TeacherCourseOffering>,
    @InjectRepository(TeacherClassSession)
    private readonly classSessionRepository: Repository<TeacherClassSession>,
    @InjectRepository(TeacherAssignment)
    private readonly assignmentRepository: Repository<TeacherAssignment>,
    @InjectRepository(TeacherCourse)
    private readonly courseRepository: Repository<TeacherCourse>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentAssignmentSubmission)
    private readonly submissionRepository: Repository<StudentAssignmentSubmission>,
    @InjectRepository(StudentSchedule)
    private readonly scheduleRepository: Repository<StudentSchedule>,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<TeacherUser[]> {
    return this.teacherRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TeacherUser> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherUser> {
    const existingEmail = await this.teacherRepository.findOne({
      where: { email: createTeacherDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const teacher = this.teacherRepository.create(createTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherUser> {
    const teacher = await this.findOne(id);

    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email) {
      const existingEmail = await this.teacherRepository.findOne({
        where: { email: updateTeacherDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    Object.assign(teacher, updateTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  async remove(id: number): Promise<TeacherUser> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
    return { ...teacher, id };
  }

  async getOverview() {
    const [totalTeachers, activeTeachers] = await Promise.all([
      this.teacherRepository.count(),
      this.teacherRepository.count({ where: { isActive: true } }),
    ]);

    return {
      totalTeachers,
      activeTeachers,
      inactiveTeachers: totalTeachers - activeTeachers,
    };
  }

  async getTeacherCourses(teacherId: number) {
    const offerings = await this.courseOfferingRepository.find({
      where: { teacherId },
      relations: ['course'],
      order: { year: 'DESC', semester: 'ASC' },
    });

    // Transform each offering to include nextSession and other frontend-required fields
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for date-only comparison
    const transformedOfferings = await Promise.all(
      offerings.map(async (offering) => {
        // Get sessions for this offering
        const sessions = await this.classSessionRepository.find({
          where: { courseOfferingId: offering.id },
          order: { sessionDate: 'ASC', startTime: 'ASC' },
        });

        // Find next upcoming session (compare date only, ignoring time)
        const nextSession = sessions.find((s) => {
          const sessionDate = new Date(s.sessionDate);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= now;
        }) || null;

        // Extract unique session days from sessions
        const sessionDays = Array.from(
          new Set(
            sessions.map((s) => {
              const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              return dayMap[new Date(s.sessionDate).getDay()];
            }),
          ),
        );

        // Get first session to extract common attributes
        const firstSession = sessions[0];

        return {
          id: offering.id,
          course: {
            id: offering.course.id,
            code: offering.course.code,
            title: offering.course.title,
          },
          semester: offering.semester,
          year: offering.year,
          section: offering.section,
          maxStudents: 0,
          enrolledCount: 0,
          sessionDays: sessionDays,
          room: firstSession?.room || 'TBD',
          startTime: firstSession?.startTime || '00:00',
          nextSession: nextSession
            ? {
                id: nextSession.id,
                date: (() => {
                  const dateValue = nextSession.sessionDate as any;
                  if (typeof dateValue === 'string') {
                    return (dateValue as string).split('T')[0];
                  }
                  return new Date(dateValue as Date).toISOString().split('T')[0];
                })(),
                time: nextSession.startTime,
              }
            : null,
        };
      }),
    );

    return transformedOfferings;
  }

  async createCourseOffering(dto: any, teacherId: number) {
    // 1. Find or create the course
    let course = await this.courseRepository.findOne({
      where: { code: dto.subCode },
    });

    if (!course) {
      course = this.courseRepository.create({
        code: dto.subCode,
        title: dto.subTitle,
        credits: 3, // Default value
        departmentId: null,
        createdByTeacherId: teacherId,
      });
      await this.courseRepository.save(course);
    }

    // 2. Calculate duration in minutes
    const [startHour, startMin] = dto.startTime.split(':').map(Number);
    const [endHour, endMin] = dto.endTime.split(':').map(Number);
    const durationMinutes =
      endHour * 60 + endMin - (startHour * 60 + startMin);

    // 3. Create course offering
    const offering = this.courseOfferingRepository.create({
      teacherId,
      courseId: course.id,
      semester: dto.semester,
      year: dto.year,
      section: dto.section,
    });
    await this.courseOfferingRepository.save(offering);

    // 4. Generate class sessions based on semester dates and selected days
    const sessions = [];
    const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const selectedDayNumbers = dto.sessionDays.map((day: string) => dayMap[day]);

    const startDate = new Date(dto.semesterStartDate);
    const endDate = new Date(dto.semesterEndDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (selectedDayNumbers.includes(dayOfWeek)) {
        const session = this.classSessionRepository.create({
          courseOfferingId: offering.id,
          sessionDate: new Date(currentDate),
          startTime: dto.startTime,
          durationMinutes,
          room: dto.room,
          sessionType: dto.sessionType,
          batch: dto.batch,
          section: dto.section,
        });
        sessions.push(session);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await this.classSessionRepository.save(sessions);

    // 5. Auto-enroll students based on department/batch/section
    const eligibleStudents = await this.studentRepository.find({
      where: {
        program: dto.department as any,
        batch: dto.batch as any,
        section: dto.section as any,
        status: 'active' as any,
      },
    });

    const enrollments = eligibleStudents.map((student) =>
      this.enrollmentRepository.create({
        studentId: student.id,
        courseOfferingId: offering.id,
        status: EnrollmentStatus.ACTIVE,
      }),
    );
    await this.enrollmentRepository.save(enrollments);

    // 6. Create student schedules for all sessions
    const schedules = [];
    for (const session of sessions) {
      for (const student of eligibleStudents) {
        schedules.push(
          this.scheduleRepository.create({
            studentId: student.id,
            classSessionId: session.id,
            sessionDate: session.sessionDate,
            startTime: session.startTime,
            room: session.room,
          }),
        );
      }
    }
    await this.scheduleRepository.save(schedules);

    // 7. Find next upcoming session (compare date only, ignoring time)
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for date-only comparison
    const nextSession = sessions.find((s) => {
      const sessionDate = new Date(s.sessionDate);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate >= now;
    }) || sessions[0];

    // 8. Return response matching frontend expectations
    return {
      id: offering.id,
      course: {
        id: course.id,
        code: course.code,
        title: course.title,
      },
      semester: offering.semester,
      year: offering.year,
      section: dto.section,
      maxStudents: 0,
      enrolledCount: eligibleStudents.length,
      sessionDays: dto.sessionDays,
      room: dto.room,
      startTime: dto.startTime,
      nextSession: nextSession
        ? {
            id: nextSession.id,
            date: (() => {
              const dateValue = nextSession.sessionDate as any;
              if (typeof dateValue === 'string') {
                return (dateValue as string).split('T')[0];
              }
              return new Date(dateValue as Date).toISOString().split('T')[0];
            })(),
            time: nextSession.startTime,
          }
        : null,
    };
  }

  async getTeacherDashboard(teacherId: number) {
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get date 14 days from now for deadline filtering
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    // Execute first batch of queries in parallel
    const [teacher, todaySessions, courseOfferings] = await Promise.all([
      // Query 1: Get teacher with basic info
      this.teacherRepository.findOne({ where: { id: teacherId } }),

      // Query 2: Get today's schedule with course details
      this.classSessionRepository.find({
        where: {
          courseOffering: { teacherId },
          sessionDate: Between(today, tomorrow),
        },
        relations: ['courseOffering', 'courseOffering.course'],
        order: { startTime: 'ASC' },
      }),

      // Query 3: Get all course offerings for this teacher
      this.courseOfferingRepository.find({
        where: { teacherId },
        select: ['id'],
      }),
    ]);

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    // Get department name if departmentId exists
    let departmentName = 'Not Assigned';
    if (teacher.departmentId) {
      const dept = await this.departmentRepository.findOne({
        where: { id: teacher.departmentId },
      });
      departmentName = dept?.name || 'Not Assigned';
    }

    const courseOfferingIds = courseOfferings.map((co) => co.id);

    // Execute second batch of queries in parallel
    const [totalStudents, pendingSubmissions, upcomingAssignments] =
      await Promise.all([
        // Query 4: Count enrolled students
        courseOfferingIds.length > 0
          ? this.enrollmentRepository.count({
              where: {
                courseOfferingId: In(courseOfferingIds),
                status: EnrollmentStatus.ACTIVE,
              },
            })
          : 0,

        // Query 5: Count ungraded submissions
        courseOfferingIds.length > 0
          ? this.submissionRepository
              .createQueryBuilder('submission')
              .innerJoin('submission.assignment', 'assignment')
              .where('assignment.courseOfferingId IN (:...ids)', {
                ids: courseOfferingIds,
              })
              .andWhere('submission.status = :status', { status: 'submitted' })
              .andWhere('submission.grade IS NULL')
              .getCount()
          : 0,

        // Query 6: Get upcoming assignments (next 14 days)
        courseOfferingIds.length > 0
          ? this.assignmentRepository.find({
              where: {
                courseOfferingId: In(courseOfferingIds),
                dueDate: Between(new Date(), twoWeeksLater),
                status: 'ACTIVE',
              },
              relations: ['courseOffering', 'courseOffering.course'],
              order: { dueDate: 'ASC' },
              take: 10,
            })
          : [],
      ]);

    // Transform data into dashboard format
    return {
      profile: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        designation: teacher.designation || 'Faculty',
        department: departmentName,
        college: 'EdgeUp College',
      },
      stats: {
        classesToday: todaySessions.length,
        totalStudents: totalStudents,
        assignmentsToGrade: pendingSubmissions,
        attendanceRate: 85, // Hardcoded for now per requirements
      },
      schedule: todaySessions.map((session) => ({
        id: session.id,
        courseTitle: session.courseOffering.course.title,
        sessionDate: session.sessionDate,
        startTime: session.startTime,
        durationMinutes: session.durationMinutes,
        room: session.room || 'TBD',
        sessionType: session.sessionType,
      })),
      deadlines: upcomingAssignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        courseTitle: assignment.courseOffering.course.title,
        dueDate: assignment.dueDate,
        type: assignment.type,
      })),
    };
  }

  async createSessionWithAutoEnrollment(
    sessionData: {
      courseOfferingId: number;
      sessionDate: string;
      startTime: string;
      durationMinutes: number;
      room?: string;
      sessionType: string;
      departmentId?: number;
      batch?: string;
      section?: string;
    },
    teacherId: number,
  ) {
    const courseOffering = await this.courseOfferingRepository.findOne({
      where: { id: sessionData.courseOfferingId },
    });

    if (!courseOffering) {
      throw new NotFoundException(
        `Course offering with ID ${sessionData.courseOfferingId} not found`,
      );
    }

    if (Number(courseOffering.teacherId) !== teacherId) {
      throw new ConflictException('You can only create sessions for your own courses');
    }

    const session = this.classSessionRepository.create({
      courseOfferingId: sessionData.courseOfferingId,
      sessionDate: new Date(sessionData.sessionDate),
      startTime: sessionData.startTime,
      durationMinutes: sessionData.durationMinutes,
      room: sessionData.room || null,
      sessionType: sessionData.sessionType as any,
      departmentId: sessionData.departmentId || null,
      batch: sessionData.batch || null,
      section: sessionData.section || null,
    });

    const savedSession = await this.classSessionRepository.save(session);

    const enrollments = await this.enrollmentRepository.find({
      where: {
        courseOfferingId: sessionData.courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
      relations: ['student'],
    });

    let matchingStudents = enrollments.map(e => e.student);

    if (sessionData.batch) {
      matchingStudents = matchingStudents.filter(s => s.batch === sessionData.batch);
    }

    if (sessionData.section) {
      matchingStudents = matchingStudents.filter(
        s => s.section === sessionData.section,
      );
    }

    if (matchingStudents.length > 0) {
      const schedules = matchingStudents.map(student =>
        this.scheduleRepository.create({
          studentId: student.id,
          classSessionId: savedSession.id,
          sessionDate: savedSession.sessionDate,
          startTime: savedSession.startTime,
          room: savedSession.room,
        }),
      );

      await this.scheduleRepository.save(schedules);
    }

    return {
      session: savedSession,
      enrolledStudents: matchingStudents.length,
    };
  }
}
