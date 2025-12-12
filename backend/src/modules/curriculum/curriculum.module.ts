import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { CurriculumAIService } from './curriculum-ai.service';
import { ResourceSearchService } from './resource-search.service';
import {
  CurriculumCourse,
  CurriculumPlan,
  CurriculumSession,
  CurriculumCalendarEvent,
  CurriculumAdaptation,
  CurriculumSessionResource,
} from '../../database/entities/teacher';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      CurriculumCourse,
      CurriculumPlan,
      CurriculumSession,
      CurriculumCalendarEvent,
      CurriculumAdaptation,
      CurriculumSessionResource,
    ]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService, CurriculumAIService, ResourceSearchService],
  exports: [CurriculumService, CurriculumAIService, ResourceSearchService],
})
export class CurriculumModule {}
