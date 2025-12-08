import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { StudentResume } from '../../database/entities/student/student-resume.entity';
import { MockInterviewController } from './mock-interview/mock-interview.controller';
import { MockInterviewService } from './mock-interview/mock-interview.service';
import { OpenAIService } from './mock-interview/openai.service';
import { Judge0Service } from './mock-interview/judge0.service';
import { InterviewSession } from './mock-interview/entities/interview-session.entity';
import { InterviewReport } from './mock-interview/entities/interview-report.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      StudentResume,
      InterviewSession,
      InterviewReport,
    ]),
  ],
  controllers: [
    CareerController,
    MockInterviewController,
  ],
  providers: [
    CareerService,
    MockInterviewService,
    OpenAIService,
    Judge0Service,
  ],
  exports: [CareerService, MockInterviewService],
})
export class CareerModule {}
