import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, Subject, Topic, Subtopic } from '../../../database/entities/superadmin';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { SubjectsService } from '../subjects/subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Subject, Topic, Subtopic], 'superadmin')],
  controllers: [CoursesController],
  providers: [CoursesService, SubjectsService],
  exports: [CoursesService],
})
export class CoursesModule {}
