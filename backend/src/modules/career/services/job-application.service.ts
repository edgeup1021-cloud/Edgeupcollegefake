import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentJobApplication } from '../../../database/entities/student/student-job-application.entity';
import { CreateJobApplicationDto } from '../dto/job-application/create-job-application.dto';
import { UpdateJobApplicationDto } from '../dto/job-application/update-job-application.dto';
import { ApplicationStatus } from '../../../common/enums/status.enum';

export interface ApplicationStats {
  total: number;
  applied: number;
  inProgress: number;
  offerReceived: number;
  interviewScheduled: number;
  rejected: number;
  notApplied: number;
}

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(StudentJobApplication)
    private readonly jobApplicationRepository: Repository<StudentJobApplication>,
  ) {}

  /**
   * Get all job applications for a student
   */
  async findAllByStudent(studentId: number): Promise<StudentJobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { studentId },
      order: { applicationDate: 'DESC' },
    });
  }

  /**
   * Get a single job application by ID
   * Verifies ownership before returning
   */
  async findOne(id: number, studentId: number): Promise<StudentJobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    if (application.studentId !== studentId) {
      throw new ForbiddenException('You do not have permission to access this application');
    }

    return application;
  }

  /**
   * Create a new job application
   */
  async create(
    studentId: number,
    dto: CreateJobApplicationDto,
  ): Promise<StudentJobApplication> {
    const application = this.jobApplicationRepository.create({
      ...dto,
      studentId,
    });

    return this.jobApplicationRepository.save(application);
  }

  /**
   * Update an existing job application
   * Verifies ownership before updating
   */
  async update(
    id: number,
    studentId: number,
    dto: UpdateJobApplicationDto,
  ): Promise<StudentJobApplication> {
    const application = await this.findOne(id, studentId);

    Object.assign(application, dto);

    return this.jobApplicationRepository.save(application);
  }

  /**
   * Update only the status of an application (for drag-and-drop)
   * Verifies ownership before updating
   */
  async updateStatus(
    id: number,
    studentId: number,
    status: ApplicationStatus,
  ): Promise<StudentJobApplication> {
    const application = await this.findOne(id, studentId);

    application.status = status;

    return this.jobApplicationRepository.save(application);
  }

  /**
   * Delete a job application
   * Verifies ownership before deleting
   */
  async remove(id: number, studentId: number): Promise<void> {
    const application = await this.findOne(id, studentId);

    await this.jobApplicationRepository.remove(application);
  }

  /**
   * Get application statistics for a student
   */
  async getStats(studentId: number): Promise<ApplicationStats> {
    const applications = await this.findAllByStudent(studentId);

    const stats: ApplicationStats = {
      total: applications.length,
      applied: 0,
      inProgress: 0,
      offerReceived: 0,
      interviewScheduled: 0,
      rejected: 0,
      notApplied: 0,
    };

    applications.forEach((app) => {
      switch (app.status) {
        case ApplicationStatus.APPLIED:
          stats.applied++;
          break;
        case ApplicationStatus.IN_PROGRESS:
          stats.inProgress++;
          break;
        case ApplicationStatus.OFFER_RECEIVED:
          stats.offerReceived++;
          break;
        case ApplicationStatus.INTERVIEW_SCHEDULED:
          stats.interviewScheduled++;
          break;
        case ApplicationStatus.REJECTED:
          stats.rejected++;
          break;
        case ApplicationStatus.NOT_APPLIED:
          stats.notApplied++;
          break;
      }
    });

    return stats;
  }
}
