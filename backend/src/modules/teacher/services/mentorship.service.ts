import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import {
  TeacherMentorship,
  MentorshipStatus,
} from '../../../database/entities/teacher/teacher-mentorship.entity';
import { StudentUser } from '../../../database/entities/student/student-user.entity';
import { StudentGrade } from '../../../database/entities/student/student-grade.entity';
import { StudentAttendance } from '../../../database/entities/student/student-attendance.entity';
import { StudentEnrollment } from '../../../database/entities/student/student-enrollment.entity';
import { StudentAssignmentSubmission } from '../../../database/entities/student/student-assignment-submission.entity';
import { TeacherCourseOffering } from '../../../database/entities/teacher/teacher-course-offering.entity';
import { Subject } from '../../../database/entities/management/subject.entity';
import { GradeScale } from '../../../database/entities/management/grade-scale.entity';
import { Exam, ExamStatus } from '../../../database/entities/student/exam.entity';
import {
  CreateMentorshipDto,
  UpdateMentorshipDto,
  BulkAssignMenteesDto,
  MenteeDetailsDto,
  MenteeAcademicStats,
  MenteeRecentPerformance,
} from '../dto/mentorship';
import {
  AttendanceStatus,
  EnrollmentStatus,
} from '../../../common/enums/status.enum';

@Injectable()
export class MentorshipService {
  constructor(
    @InjectRepository(TeacherMentorship)
    private readonly mentorshipRepository: Repository<TeacherMentorship>,
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
    @InjectRepository(StudentGrade)
    private readonly gradeRepository: Repository<StudentGrade>,
    @InjectRepository(StudentAttendance)
    private readonly attendanceRepository: Repository<StudentAttendance>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentAssignmentSubmission)
    private readonly submissionRepository: Repository<StudentAssignmentSubmission>,
    @InjectRepository(TeacherCourseOffering)
    private readonly courseOfferingRepository: Repository<TeacherCourseOffering>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(GradeScale)
    private readonly gradeScaleRepository: Repository<GradeScale>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  // Helper function to convert percentage to 10-point CGPA with grade letter using database
  private async getGradeInfo(percentage: number): Promise<{
    letter: string;
    points: number;
  }> {
    const gradeScale = await this.gradeScaleRepository.findOne({
      where: {
        scaleName: '10-point CGPA',
        isActive: true,
      },
      order: { minPercentage: 'DESC' },
    });

    if (!gradeScale) {
      // Fallback to hardcoded values if database is empty
      if (percentage >= 90) return { letter: 'A+', points: 10 };
      if (percentage >= 80) return { letter: 'A', points: 9 };
      if (percentage >= 70) return { letter: 'B+', points: 8 };
      if (percentage >= 60) return { letter: 'B', points: 7 };
      if (percentage >= 55) return { letter: 'C+', points: 6 };
      if (percentage >= 50) return { letter: 'C', points: 5 };
      if (percentage >= 40) return { letter: 'D', points: 4 };
      return { letter: 'F', points: 0 };
    }

    // Find the appropriate grade from database
    const grades = await this.gradeScaleRepository.find({
      where: {
        scaleName: '10-point CGPA',
        isActive: true,
      },
      order: { minPercentage: 'DESC' },
    });

    for (const grade of grades) {
      if (percentage >= Number(grade.minPercentage) && percentage <= Number(grade.maxPercentage)) {
        return {
          letter: grade.gradeLetter,
          points: Number(grade.gradePoints),
        };
      }
    }

    // Default to F if no match found
    return { letter: 'F', points: 0 };
  }

  // Get all mentees for a teacher
  async getMentees(teacherId: number, status?: MentorshipStatus) {
    const where: any = { teacherId };
    if (status) {
      where.status = status;
    } else {
      where.status = MentorshipStatus.ACTIVE;
    }

    const mentorships = await this.mentorshipRepository.find({
      where,
      relations: ['student'],
      order: { assignedDate: 'DESC' },
    });

    // Fetch academic stats for each mentee
    const menteesWithStats = await Promise.all(
      mentorships.map(async (m) => {
        // Get quick stats for overview
        const grades = await this.gradeRepository.find({
          where: { studentId: m.studentId },
        });

        const attendanceRecords = await this.attendanceRepository.find({
          where: { studentId: m.studentId },
        });

        // Calculate CGPA
        let cgpa: number | null = null;
        if (grades.length > 0) {
          const gradesWithPoints = await Promise.all(
            grades.map(async (g) => {
              if (
                g.gradePoints === null &&
                g.marksObtained !== null &&
                g.maxMarks !== null &&
                g.maxMarks > 0
              ) {
                const percentage = (g.marksObtained / g.maxMarks) * 100;
                const gradeInfo = await this.getGradeInfo(percentage);
                return { ...g, gradePoints: gradeInfo.points };
              }
              return g;
            }),
          );

          const validGrades = gradesWithPoints.filter(
            (g) => g.gradePoints !== null && g.gradePoints !== undefined,
          );

          if (validGrades.length > 0) {
            const avgPoints =
              validGrades.reduce((sum, g) => sum + Number(g.gradePoints || 0), 0) /
              validGrades.length;
            cgpa = Math.round(avgPoints * 100) / 100;
          }
        }

        // Calculate attendance percentage
        let attendancePercentage: number | null = null;
        if (attendanceRecords.length > 0) {
          const attendedClasses = attendanceRecords.filter(
            (a) =>
              a.status === AttendanceStatus.PRESENT ||
              a.status === AttendanceStatus.LATE ||
              a.status === AttendanceStatus.EXCUSED,
          ).length;
          attendancePercentage = Math.round(
            (attendedClasses / attendanceRecords.length) * 100,
          );
        }

        return {
          id: m.id,
          studentId: m.studentId,
          firstName: m.student.firstName,
          lastName: m.student.lastName,
          admissionNo: m.student.admissionNo,
          email: m.student.email,
          program: m.student.program,
          batch: m.student.batch,
          section: m.student.section,
          status: m.student.status,
          profileImage: m.student.profileImage,
          mentorshipStatus: m.status,
          assignedDate: m.assignedDate,
          notes: m.notes,
          cgpa,
          attendancePercentage,
        };
      }),
    );

    return menteesWithStats;
  }

  // Get available students not assigned to this teacher
  async getAvailableStudents(teacherId: number) {
    const assignedMentorships = await this.mentorshipRepository.find({
      where: { teacherId, status: MentorshipStatus.ACTIVE },
      select: ['studentId'],
    });

    const assignedStudentIds = assignedMentorships.map((m) => m.studentId);

    const query = this.studentRepository
      .createQueryBuilder('student')
      .where('student.status = :status', { status: 'active' });

    if (assignedStudentIds.length > 0) {
      query.andWhere('student.id NOT IN (:...ids)', {
        ids: assignedStudentIds,
      });
    }

    const availableStudents = await query
      .orderBy('student.firstName', 'ASC')
      .getMany();

    return availableStudents.map((s) => ({
      id: s.id,
      admissionNo: s.admissionNo,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      program: s.program,
      batch: s.batch,
      section: s.section,
    }));
  }

  // Assign a single mentee
  async assignMentee(dto: CreateMentorshipDto, teacherId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${dto.studentId} not found`,
      );
    }

    const existing = await this.mentorshipRepository.findOne({
      where: {
        teacherId,
        studentId: dto.studentId,
        status: MentorshipStatus.ACTIVE,
      },
    });

    if (existing) {
      throw new ConflictException('This student is already your mentee');
    }

    // Check current mentee count
    const currentCount = await this.mentorshipRepository.count({
      where: { teacherId, status: MentorshipStatus.ACTIVE },
    });

    if (currentCount >= 20) {
      throw new BadRequestException(
        `You have reached the maximum limit of 20 mentees. Current count: ${currentCount}`,
      );
    }

    const mentorship = this.mentorshipRepository.create({
      teacherId,
      studentId: dto.studentId,
      assignedDate: dto.assignedDate ? new Date(dto.assignedDate) : new Date(),
      notes: dto.notes || null,
      status: MentorshipStatus.ACTIVE,
    });

    await this.mentorshipRepository.save(mentorship);

    return {
      ...mentorship,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNo: student.admissionNo,
        email: student.email,
      },
    };
  }

  // Bulk assign mentees
  async bulkAssignMentees(dto: BulkAssignMenteesDto, teacherId: number) {
    const students = await this.studentRepository.find({
      where: { id: In(dto.studentIds) },
    });

    if (students.length !== dto.studentIds.length) {
      throw new NotFoundException('One or more students not found');
    }

    const currentCount = await this.mentorshipRepository.count({
      where: { teacherId, status: MentorshipStatus.ACTIVE },
    });

    if (currentCount + dto.studentIds.length > 20) {
      throw new BadRequestException(
        `Cannot assign ${dto.studentIds.length} mentees. Maximum is 20, you currently have ${currentCount}.`,
      );
    }

    const alreadyAssigned = await this.mentorshipRepository.find({
      where: {
        teacherId,
        studentId: In(dto.studentIds),
        status: MentorshipStatus.ACTIVE,
      },
      select: ['studentId'],
    });

    const alreadyAssignedIds = alreadyAssigned.map((m) => m.studentId);
    const newStudentIds = dto.studentIds.filter(
      (id) => !alreadyAssignedIds.includes(id),
    );

    const mentorships = newStudentIds.map((studentId) =>
      this.mentorshipRepository.create({
        teacherId,
        studentId,
        assignedDate: new Date(),
        notes: dto.notes || null,
        status: MentorshipStatus.ACTIVE,
      }),
    );

    await this.mentorshipRepository.save(mentorships);

    return {
      assigned: newStudentIds.length,
      skipped: alreadyAssignedIds.length,
      total: dto.studentIds.length,
    };
  }

  // Update mentorship
  async updateMentorship(
    id: number,
    dto: UpdateMentorshipDto,
    teacherId: number,
  ) {
    const mentorship = await this.mentorshipRepository.findOne({
      where: { id, teacherId },
    });

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found');
    }

    Object.assign(mentorship, dto);

    if (
      dto.status === MentorshipStatus.INACTIVE ||
      dto.status === MentorshipStatus.COMPLETED
    ) {
      if (!mentorship.endDate) {
        mentorship.endDate = new Date();
      }
    }

    await this.mentorshipRepository.save(mentorship);

    return mentorship;
  }

  // Remove mentee (set status to inactive)
  async removeMentee(id: number, teacherId: number) {
    const mentorship = await this.mentorshipRepository.findOne({
      where: { id, teacherId },
    });

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found');
    }

    mentorship.status = MentorshipStatus.INACTIVE;
    mentorship.endDate = new Date();

    await this.mentorshipRepository.save(mentorship);

    return { message: 'Mentee removed successfully' };
  }

  // Get detailed mentee information with academic stats
  async getMenteeDetails(
    menteeId: number,
    teacherId: number,
  ): Promise<MenteeDetailsDto> {
    const mentorship = await this.mentorshipRepository.findOne({
      where: {
        id: menteeId,
        teacherId,
      },
      relations: ['student'],
    });

    if (!mentorship) {
      throw new NotFoundException('Mentee not found');
    }

    const studentId = mentorship.studentId;
    const student = mentorship.student;

    const academicStats = await this.calculateAcademicStats(studentId);
    const recentPerformance = await this.getRecentPerformance(studentId);

    return {
      studentInfo: {
        id: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        program: student.program,
        batch: student.batch,
        section: student.section,
        status: student.status,
        profileImage: student.profileImage,
      },
      mentorshipInfo: {
        id: mentorship.id,
        assignedDate: typeof mentorship.assignedDate === 'string'
          ? mentorship.assignedDate
          : mentorship.assignedDate.toISOString().split('T')[0],
        status: mentorship.status,
        notes: mentorship.notes,
      },
      academicStats,
      recentPerformance,
    };
  }

  // Helper: Calculate academic statistics with 10-point CGPA
  private async calculateAcademicStats(
    studentId: number,
  ): Promise<MenteeAcademicStats> {
    // Get student info to find program
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    const grades = await this.gradeRepository.find({
      where: { studentId },
    });

    let currentCGPA: number | null = null;

    if (grades.length > 0) {
      // First, calculate grade points for each grade if not already set
      const gradesWithPoints = await Promise.all(
        grades.map(async (g) => {
          if (
            g.gradePoints === null &&
            g.marksObtained !== null &&
            g.maxMarks !== null &&
            g.maxMarks > 0
          ) {
            const percentage = (g.marksObtained / g.maxMarks) * 100;
            const gradeInfo = await this.getGradeInfo(percentage);
            return { ...g, gradePoints: gradeInfo.points };
          }
          return g;
        }),
      );

      // Calculate weighted CGPA based on credits
      const validGrades = gradesWithPoints.filter(
        (g) => g.gradePoints !== null,
      );

      if (validGrades.length > 0) {
        // Get course offerings to find credits
        const courseOfferingIds = [
          ...new Set(validGrades.map((g) => g.courseOfferingId)),
        ];
        const courseOfferings = await this.courseOfferingRepository.find({
          where: { id: In(courseOfferingIds) },
          relations: ['course'],
        });

        const offeringMap = new Map(
          courseOfferings.map((o) => [o.id, o.course?.credits || 3]),
        );

        let totalPoints = 0;
        let totalCredits = 0;

        for (const grade of validGrades) {
          const credits = offeringMap.get(grade.courseOfferingId) || 3;
          totalPoints += grade.gradePoints! * credits;
          totalCredits += credits;
        }

        currentCGPA =
          totalCredits > 0
            ? Math.round((totalPoints / totalCredits) * 100) / 100
            : null;
      }
    }

    // Get attendance stats
    const attendanceRecords = await this.attendanceRepository.find({
      where: { studentId },
    });

    const totalClasses = attendanceRecords.length;
    const attendedClasses = attendanceRecords.filter(
      (a) =>
        a.status === AttendanceStatus.PRESENT ||
        a.status === AttendanceStatus.LATE ||
        a.status === AttendanceStatus.EXCUSED,
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // Get enrollment count
    const totalCoursesEnrolled = await this.enrollmentRepository.count({
      where: { studentId, status: EnrollmentStatus.ACTIVE },
    });

    // Get assignment stats
    const submissions = await this.submissionRepository.find({
      where: { studentId },
    });

    const completedAssignments = submissions.filter(
      (s) => s.status === 'submitted' || s.status === 'graded',
    ).length;
    const pendingAssignments = submissions.filter(
      (s) => s.status === 'pending',
    ).length;

    // Get upcoming exams from exam schedules
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcomingExams = 0;
    if (student && student.program) {
      upcomingExams = await this.examRepository.count({
        where: {
          program: student.program,
          status: ExamStatus.SCHEDULED,
        },
      });
    }

    return {
      currentCGPA,
      attendancePercentage,
      totalCoursesEnrolled,
      completedAssignments,
      pendingAssignments,
      upcomingExams,
    };
  }

  // Helper: Get recent performance data
  private async getRecentPerformance(
    studentId: number,
  ): Promise<MenteeRecentPerformance> {
    // Get recent grades (last 10)
    const grades = await this.gradeRepository
      .createQueryBuilder('grade')
      .where('grade.studentId = :studentId', { studentId })
      .orderBy('grade.calculatedAt', 'DESC')
      .limit(10)
      .getMany();

    // Get course information for these grades
    const gradeData = await Promise.all(
      grades.map(async (grade) => {
        const offering = await this.courseOfferingRepository.findOne({
          where: { id: grade.courseOfferingId },
          relations: ['course'],
        });

        // Try to get subject info if linked
        let subject = null;
        if (grade.subjectId) {
          subject = await this.subjectRepository.findOne({
            where: { id: grade.subjectId },
          });
        }

        const percentage =
          grade.maxMarks && grade.maxMarks > 0
            ? Math.round((grade.marksObtained! / grade.maxMarks) * 100)
            : 0;

        // Get grade info if not already set
        let gradeLetter = grade.gradeLetter;
        let gradePoints = grade.gradePoints;

        if (!gradeLetter && percentage > 0) {
          const gradeInfo = await this.getGradeInfo(percentage);
          gradeLetter = gradeInfo.letter;
          gradePoints = gradeInfo.points;
        }

        return {
          courseCode: subject?.subjectCode || offering?.course?.code || 'N/A',
          courseTitle: subject?.subjectName || offering?.course?.title || 'Unknown Course',
          grade: grade.marksObtained || 0,
          maxMarks: grade.maxMarks || 0,
          percentage,
          gradeType: grade.gradeType || 'Assignment',
          gradeLetter: gradeLetter || 'N/A',
          gradePoints: gradePoints || 0,
          date: grade.calculatedAt.toISOString().split('T')[0],
        };
      }),
    );

    // Get recent attendance (last 15 records)
    const attendanceRecords = await this.attendanceRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: 15,
    });

    const recentAttendance = attendanceRecords.map((record) => ({
      date: record.attendanceDate
        ? typeof record.attendanceDate === 'string'
          ? record.attendanceDate
          : record.attendanceDate.toISOString().split('T')[0]
        : '',
      courseCode: 'N/A',
      courseTitle: 'General Attendance',
      status: record.status || 'absent',
    }));

    return {
      recentGrades: gradeData,
      recentAttendance,
    };
  }
}
