import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import {
  StudentUser,
  StudentEnrollment,
  StudentGrade,
  StudentAttendance,
  StudentSchedule,
  StudentNotification,
  StudentStudySession,
  StudentAssessment,
  StudentActivityLog,
} from '../../database/entities/student';
import {
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
} from '../../database/entities/teacher';
import { Campus } from '../../database/entities/management';
import {
  StudentStatus,
  EnrollmentStatus,
  AttendanceStatus,
  StudentAssessmentStatus,
} from '../../common/enums/status.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentOverviewDto } from './dto/student-overview.dto';
import { StudentDashboardDto } from './dto/student-dashboard.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentGrade)
    private readonly gradeRepository: Repository<StudentGrade>,
    @InjectRepository(StudentAttendance)
    private readonly attendanceRepository: Repository<StudentAttendance>,
    @InjectRepository(StudentSchedule)
    private readonly scheduleRepository: Repository<StudentSchedule>,
    @InjectRepository(StudentNotification)
    private readonly notificationRepository: Repository<StudentNotification>,
    @InjectRepository(StudentStudySession)
    private readonly studySessionRepository: Repository<StudentStudySession>,
    @InjectRepository(StudentAssessment)
    private readonly assessmentRepository: Repository<StudentAssessment>,
    @InjectRepository(StudentActivityLog)
    private readonly activityLogRepository: Repository<StudentActivityLog>,
    @InjectRepository(TeacherAssignment)
    private readonly assignmentRepository: Repository<TeacherAssignment>,
    @InjectRepository(TeacherClassSession)
    private readonly classSessionRepository: Repository<TeacherClassSession>,
    @InjectRepository(TeacherCourseOffering)
    private readonly courseOfferingRepository: Repository<TeacherCourseOffering>,
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async findAll(): Promise<StudentUser[]> {
    return this.studentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<StudentUser> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentUser> {
    // Check for duplicates
    const existingEmail = await this.studentRepository.findOne({
      where: { email: createStudentDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingAdmission = await this.studentRepository.findOne({
      where: { admissionNo: createStudentDto.admissionNo },
    });
    if (existingAdmission) {
      throw new ConflictException('Admission number already exists');
    }

    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentUser> {
    const student = await this.findOne(id);

    // Check email uniqueness if being updated
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingEmail = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check admission number uniqueness if being updated
    if (
      updateStudentDto.admissionNo &&
      updateStudentDto.admissionNo !== student.admissionNo
    ) {
      const existingAdmission = await this.studentRepository.findOne({
        where: { admissionNo: updateStudentDto.admissionNo },
      });
      if (existingAdmission) {
        throw new ConflictException('Admission number already in use');
      }
    }

    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<StudentUser> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    // Return the student data (TypeORM removes the id after deletion)
    return { ...student, id };
  }

  async getOverview(): Promise<StudentOverviewDto> {
    const [totalStudents, activeStudents, suspendedStudents, graduatedStudents] =
      await Promise.all([
        this.studentRepository.count(),
        this.studentRepository.count({
          where: { status: StudentStatus.ACTIVE },
        }),
        this.studentRepository.count({
          where: { status: StudentStatus.SUSPENDED },
        }),
        this.studentRepository.count({
          where: { status: StudentStatus.GRADUATED },
        }),
      ]);

    return {
      totalStudents,
      activeStudents,
      suspendedStudents,
      graduatedStudents,
    };
  }

  async getDashboard(studentId: number): Promise<StudentDashboardDto> {
    // Get student profile with campus
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Get campus name if student has campusId
    let collegeName: string | null = null;
    if (student.campusId) {
      const campus = await this.campusRepository.findOne({
        where: { id: student.campusId },
      });
      collegeName = campus?.name || null;
    }

    // Get all data in parallel
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [
      enrollments,
      grades,
      attendanceRecords,
      todayStudySession,
      todayAssessments,
      activityLogs,
      notifications,
    ] = await Promise.all([
      // Get enrollments
      this.enrollmentRepository.find({
        where: { studentId },
      }),
      // Get grades
      this.gradeRepository.find({
        where: { studentId },
      }),
      // Get attendance records
      this.attendanceRepository.find({
        where: { studentId },
      }),
      // Get today's study session
      this.studySessionRepository.findOne({
        where: { studentId, sessionDate: today },
      }),
      // Get today's assessments
      this.assessmentRepository.find({
        where: { studentId, scheduledDate: today },
      }),
      // Get activity logs for streak calculation (last 30 days)
      this.activityLogRepository.find({
        where: { studentId },
        order: { activityDate: 'DESC' },
        take: 30,
      }),
      // Get notifications
      this.notificationRepository.find({
        where: { studentId },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    // Calculate stats
    const completedCourses = enrollments.filter(
      (e) => e.status === EnrollmentStatus.COMPLETED,
    ).length;

    // Calculate attendance percentage
    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE,
    ).length;
    const attendancePercentage =
      totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Calculate GPA from grades
    let gpa: number | null = null;
    if (grades.length > 0) {
      const validGrades = grades.filter(
        (g) => g.marksObtained !== null && g.maxMarks !== null && g.maxMarks > 0,
      );
      if (validGrades.length > 0) {
        const totalWeightedScore = validGrades.reduce((sum, g) => {
          const percentage = (Number(g.marksObtained) / Number(g.maxMarks)) * 100;
          const weight = Number(g.weight) || 1;
          return sum + percentage * weight;
        }, 0);
        const totalWeight = validGrades.reduce(
          (sum, g) => sum + (Number(g.weight) || 1),
          0,
        );
        const avgPercentage = totalWeightedScore / totalWeight;
        // Convert percentage to 4.0 scale
        gpa = Math.round((avgPercentage / 100) * 4 * 100) / 100;
      }
    }

    // Calculate total credits from completed courses
    let totalCredits = 0;
    if (completedCourses > 0) {
      const completedEnrollments = enrollments.filter(
        (e) => e.status === EnrollmentStatus.COMPLETED,
      );
      for (const enrollment of completedEnrollments) {
        const offering = await this.courseOfferingRepository.findOne({
          where: { id: enrollment.courseOfferingId },
          relations: ['course'],
        });
        if (offering?.course) {
          totalCredits += offering.course.credits || 3;
        }
      }
    }

    // Daily goal
    const dailyGoal = {
      current: todayStudySession ? Number(todayStudySession.hoursLogged) : 0,
      target: todayStudySession ? Number(todayStudySession.targetHours) : 4,
    };

    // Tests today
    const testsCompleted = todayAssessments.filter(
      (a) => a.status === StudentAssessmentStatus.COMPLETED,
    ).length;
    const testsToday = {
      completed: testsCompleted,
      total: todayAssessments.length,
    };

    // Calculate day streak
    const dayStreak = this.calculateDayStreak(activityLogs);

    // Get today's schedule
    const scheduleEntries = await this.scheduleRepository.find({
      where: { studentId },
    });

    const schedule = await Promise.all(
      scheduleEntries
        .filter((s) => {
          const scheduleDate = new Date(s.sessionDate).toISOString().split('T')[0];
          return scheduleDate === todayStr;
        })
        .map(async (s) => {
          const classSession = await this.classSessionRepository.findOne({
            where: { id: s.classSessionId },
          });

          let courseTitle = 'Unknown Course';
          let sessionType = 'Lecture';
          let durationMinutes = 60;

          if (classSession) {
            sessionType = classSession.sessionType || 'Lecture';
            durationMinutes = classSession.durationMinutes || 60;

            const offering = await this.courseOfferingRepository.findOne({
              where: { id: classSession.courseOfferingId },
              relations: ['course'],
            });
            if (offering?.course) {
              courseTitle = offering.course.title;
            }
          }

          const startTime = s.startTime || '09:00:00';
          const [hours, minutes] = startTime.split(':');
          const hour = parseInt(hours, 10);
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

          return {
            id: Number(s.id),
            time: `${displayHour}:${minutes}`,
            period,
            title: courseTitle,
            type: sessionType,
            duration: durationMinutes >= 60
              ? `${Math.floor(durationMinutes / 60)} hour${durationMinutes >= 120 ? 's' : ''}`
              : `${durationMinutes} min`,
            room: s.room || null,
          };
        }),
    );

    // Get upcoming deadlines (assignments from enrolled courses)
    const activeEnrollmentIds = enrollments
      .filter((e) => e.status === EnrollmentStatus.ACTIVE)
      .map((e) => e.courseOfferingId);

    let deadlines: any[] = [];
    if (activeEnrollmentIds.length > 0) {
      const upcomingAssignments = await this.assignmentRepository.find({
        where: {
          courseOfferingId: In(activeEnrollmentIds),
          dueDate: MoreThan(new Date()),
        },
        order: { dueDate: 'ASC' },
        take: 5,
      });

      deadlines = await Promise.all(
        upcomingAssignments.map(async (a) => {
          const offering = await this.courseOfferingRepository.findOne({
            where: { id: a.courseOfferingId },
            relations: ['course'],
          });

          const dueDate = new Date(a.dueDate);
          const daysLeft = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          return {
            id: Number(a.id),
            title: a.title,
            type: a.type,
            dueDate: a.dueDate.toISOString(),
            description: a.description,
            daysLeft,
            courseName: offering?.course?.title || 'Unknown Course',
          };
        }),
      );
    }

    // Format notifications
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const recentNotifications = notifications.map((n) => ({
      id: Number(n.id),
      title: n.title,
      type: n.type,
      createdAt: n.createdAt.toISOString(),
    }));

    return {
      profile: {
        id: Number(student.id),
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        program: student.program,
        batch: student.batch,
        college: collegeName,
        profileImage: student.profileImage,
      },
      stats: {
        attendance: {
          percentage: attendancePercentage,
          totalClasses: totalAttendance,
          attendedClasses: presentCount,
        },
        gpa,
        completedCourses,
        totalCredits,
        dailyGoal,
        testsToday,
        dayStreak,
      },
      schedule,
      deadlines,
      notifications: {
        unreadCount,
        recent: recentNotifications,
      },
    };
  }

  private calculateDayStreak(activityLogs: StudentActivityLog[]): number {
    if (activityLogs.length === 0) return 0;

    // Get unique dates sorted in descending order
    const uniqueDates = [
      ...new Set(
        activityLogs.map((log) =>
          new Date(log.activityDate).toISOString().split('T')[0],
        ),
      ),
    ].sort((a, b) => b.localeCompare(a));

    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if the most recent activity is today or yesterday
    const mostRecent = uniqueDates[0];
    if (mostRecent !== today && mostRecent !== yesterday) {
      return 0; // Streak is broken
    }

    // Count consecutive days
    let expectedDate = new Date(mostRecent);
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      const expectedStr = expectedDate.toISOString().split('T')[0];

      if (dateStr === expectedStr) {
        streak++;
        expectedDate = new Date(expectedDate.getTime() - 86400000); // Previous day
      } else {
        break;
      }
    }

    return streak;
  }
}
