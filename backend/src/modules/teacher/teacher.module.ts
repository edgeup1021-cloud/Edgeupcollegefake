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
  StudentUser,
  StudentSchedule,
  StudentAttendance,
} from '../../database/entities/student';
import { Department } from '../../database/entities/management';
import { CalendarModule } from '../student/calendar/calendar.module';
import { AssignmentsService } from './services/assignments.service';
import { TeacherAttendanceService } from './services/teacher-attendance.service';
import { AttendanceModule } from '../attendance/attendance.module';

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
      StudentUser,
      StudentSchedule,
      StudentAttendance,
      Department,
    ]),
    CalendarModule,
    AttendanceModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService, AssignmentsService, TeacherAttendanceService],
  exports: [TeacherService],
})
export class TeacherModule {}
