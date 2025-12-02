import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from '../../../database/entities/teacher/teacher-assignment.entity';
import { StudentEnrollment } from '../../../database/entities/student/student-enrollment.entity';
import { StudentAssignmentSubmission } from '../../../database/entities/student/student-assignment-submission.entity';
import { TeacherCourseOffering } from '../../../database/entities/teacher/teacher-course-offering.entity';
import { CalendarService } from '../../student/calendar/calendar.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  QueryAssignmentsDto,
  GradeSubmissionDto,
} from '../dto/assignment';
import { EnrollmentStatus } from '../../../common/enums/status.enum';
import { EventType } from '../../../common/enums/event-type.enum';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(TeacherAssignment)
    private assignmentRepo: Repository<TeacherAssignment>,
    @InjectRepository(StudentEnrollment)
    private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(StudentAssignmentSubmission)
    private submissionRepo: Repository<StudentAssignmentSubmission>,
    @InjectRepository(TeacherCourseOffering)
    private courseOfferingRepo: Repository<TeacherCourseOffering>,
    private calendarService: CalendarService,
  ) {}

  async create(
    dto: CreateAssignmentDto,
    teacherId: number,
  ): Promise<TeacherAssignment> {
    // Create the assignment
    const assignment = this.assignmentRepo.create({
      ...dto,
      createdBy: teacherId,
      status: 'ACTIVE',
    });
    const savedAssignment = await this.assignmentRepo.save(assignment);

    // Get enrolled students
    const enrollments = await this.enrollmentRepo.find({
      where: {
        courseOfferingId: dto.courseOfferingId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    // Get course offering details for calendar event
    const courseOffering = await this.courseOfferingRepo.findOne({
      where: { id: dto.courseOfferingId },
      relations: ['course'],
    });

    // Bulk create pending submissions for all enrolled students
    if (enrollments.length > 0) {
      const submissions = enrollments.map((enrollment) =>
        this.submissionRepo.create({
          assignmentId: savedAssignment.id,
          studentId: enrollment.studentId,
          status: 'pending',
        }),
      );
      await this.submissionRepo.save(submissions);

      // Create calendar events for all students
      const calendarPromises = enrollments.map((enrollment) =>
        this.calendarService.create({
          studentId: enrollment.studentId,
          title: dto.title,
          eventType: EventType.ASSIGNMENT,
          eventDate: dto.dueDate.split('T')[0],
          subject: courseOffering?.course?.title || 'Assignment',
          description: dto.description || '',
          color: '#FF6B6B',
        }),
      );

      // Execute calendar creations in parallel
      await Promise.all(calendarPromises).catch((error) => {
        console.error('Error creating calendar events:', error);
        // Don't fail the assignment creation if calendar fails
      });
    }

    return savedAssignment;
  }

  async findAll(filters: QueryAssignmentsDto): Promise<TeacherAssignment[]> {
    const query = this.assignmentRepo.createQueryBuilder('a');

    if (filters.courseOfferingId) {
      query.andWhere('a.courseOfferingId = :id', {
        id: filters.courseOfferingId,
      });
    }

    if (filters.teacherId) {
      query.andWhere('a.createdBy = :tid', { tid: filters.teacherId });
    }

    if (filters.type) {
      query.andWhere('a.type = :type', { type: filters.type });
    }

    if (filters.status) {
      query.andWhere('a.status = :status', { status: filters.status });
    }

    return query.orderBy('a.dueDate', 'ASC').getMany();
  }

  async findOne(id: number): Promise<TeacherAssignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['courseOffering', 'courseOffering.course'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(
    id: number,
    dto: UpdateAssignmentDto,
    teacherId?: number,
  ): Promise<TeacherAssignment> {
    const assignment = await this.findOne(id);

    // Check ownership if teacherId is provided
    if (teacherId && Number(assignment.createdBy) !== teacherId) {
      throw new ForbiddenException(
        'You can only update your own assignments',
      );
    }

    Object.assign(assignment, dto);
    return this.assignmentRepo.save(assignment);
  }

  async remove(id: number, teacherId?: number): Promise<void> {
    const assignment = await this.findOne(id);

    // Check ownership if teacherId is provided
    if (teacherId && Number(assignment.createdBy) !== teacherId) {
      throw new ForbiddenException(
        'You can only delete your own assignments',
      );
    }

    // Soft delete - set status to ARCHIVED
    assignment.status = 'ARCHIVED';
    await this.assignmentRepo.save(assignment);
  }

  async getSubmissions(
    assignmentId: number,
  ): Promise<StudentAssignmentSubmission[]> {
    return this.submissionRepo.find({
      where: { assignmentId },
      relations: ['student'],
      order: { createdAt: 'ASC' },
    });
  }

  async gradeSubmission(
    submissionId: number,
    gradeDto: GradeSubmissionDto,
    teacherId: number,
  ): Promise<StudentAssignmentSubmission> {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['assignment'],
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    }

    // Check if teacher owns the assignment
    // Note: createdBy is bigint which comes as string from DB, convert to number for comparison
    if (Number(submission.assignment.createdBy) !== teacherId) {
      throw new ForbiddenException(
        'You can only grade submissions for your own assignments',
      );
    }

    submission.grade = gradeDto.grade;
    submission.feedback = gradeDto.feedback || null;
    submission.gradedByTeacherId = teacherId;
    submission.status = 'graded';

    return this.submissionRepo.save(submission);
  }
}
