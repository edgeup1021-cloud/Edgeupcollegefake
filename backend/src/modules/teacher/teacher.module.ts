import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import {
  TeacherUser,
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
} from '../../database/entities/teacher';
import {
  StudentEnrollment,
  StudentAssignmentSubmission,
} from '../../database/entities/student';
import { CalendarModule } from '../student/calendar/calendar.module';
import { AssignmentsService } from './services/assignments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherUser,
      TeacherCourse,
      TeacherCourseOffering,
      TeacherAssignment,
      TeacherClassSession,
      StudentEnrollment,
      StudentAssignmentSubmission,
    ]),
    CalendarModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService, AssignmentsService],
  exports: [TeacherService],
})
export class TeacherModule {}
