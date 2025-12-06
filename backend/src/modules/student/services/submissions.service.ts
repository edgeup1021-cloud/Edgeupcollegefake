import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentAssignmentSubmission } from '../../../database/entities/student/student-assignment-submission.entity';
import { TeacherAssignment } from '../../../database/entities/teacher/teacher-assignment.entity';
import { SubmitAssignmentDto } from '../dto/submission';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(StudentAssignmentSubmission)
    private submissionRepo: Repository<StudentAssignmentSubmission>,
    @InjectRepository(TeacherAssignment)
    private assignmentRepo: Repository<TeacherAssignment>,
  ) {}

  async getStudentAssignments(
    studentId: number,
  ): Promise<StudentAssignmentSubmission[]> {
    return this.submissionRepo
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.assignment', 'assignment')
      .leftJoinAndSelect('assignment.courseOffering', 'offering')
      .leftJoinAndSelect('offering.course', 'course')
      .where('submission.studentId = :studentId', { studentId })
      .andWhere('assignment.status = :status', { status: 'ACTIVE' })
      .orderBy('assignment.dueDate', 'ASC')
      .getMany();
  }

  async submitAssignment(
    dto: SubmitAssignmentDto,
    studentId: number,
  ): Promise<StudentAssignmentSubmission> {
    const submission = await this.submissionRepo.findOne({
      where: {
        assignmentId: dto.assignmentId,
        studentId,
      },
      relations: ['assignment'],
    });

    if (!submission) {
      throw new NotFoundException(
        'Submission not found. You may not be enrolled in this course.',
      );
    }

    // Check if assignment is still active
    if (submission.assignment.status !== 'ACTIVE') {
      throw new NotFoundException('This assignment is no longer active');
    }

    submission.status = 'submitted';
    submission.fileUrl = dto.fileUrl || null;
    submission.notes = dto.notes || null;
    submission.submittedAt = new Date();

    return this.submissionRepo.save(submission);
  }

  async getSubmission(
    assignmentId: number,
    studentId: number,
  ): Promise<StudentAssignmentSubmission> {
    const submission = await this.submissionRepo.findOne({
      where: {
        assignmentId,
        studentId,
      },
      relations: ['assignment', 'assignment.courseOffering', 'assignment.courseOffering.course'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}
