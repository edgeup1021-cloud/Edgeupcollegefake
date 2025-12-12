import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LessonPlannerController } from './lesson-planner.controller';
import { LessonPlannerService } from './lesson-planner.service';
import {
  StandaloneLesson,
  LessonResource,
  CurriculumSession,
} from '../../database/entities/teacher';
import { CurriculumModule } from '../curriculum/curriculum.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      StandaloneLesson,
      LessonResource,
      CurriculumSession,
    ]),
    CurriculumModule, // Import to reuse CurriculumAIService and ResourceSearchService
  ],
  controllers: [LessonPlannerController],
  providers: [LessonPlannerService],
  exports: [LessonPlannerService],
})
export class LessonPlannerModule {}
