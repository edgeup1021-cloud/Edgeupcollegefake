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
    return this.courseOfferingRepository.find({
      where: { teacherId },
      relations: ['course'],
      order: { year: 'DESC', semester: 'ASC' },
    });
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
}
