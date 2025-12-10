import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { StudentResume } from '../../database/entities/student/student-resume.entity';
import { StudentJobApplication } from '../../database/entities/student/student-job-application.entity';
import { MockInterviewController } from './mock-interview/mock-interview.controller';
import { MockInterviewService } from './mock-interview/mock-interview.service';
import { OpenAIService } from './mock-interview/openai.service';
import { Judge0Service } from './mock-interview/judge0.service';
import { InterviewSession } from './mock-interview/entities/interview-session.entity';
import { InterviewReport } from './mock-interview/entities/interview-report.entity';
import { JobApplicationController } from './controllers/job-application.controller';
import { JobApplicationService } from './services/job-application.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      StudentResume,
      InterviewSession,
      InterviewReport,
      StudentJobApplication,
    ]),
  ],
  controllers: [
    CareerController,
    MockInterviewController,
    JobApplicationController,
  ],
  providers: [
    CareerService,
    MockInterviewService,
    OpenAIService,
    Judge0Service,
    JobApplicationService,
  ],
  exports: [CareerService, MockInterviewService],
})
export class CareerModule {}
