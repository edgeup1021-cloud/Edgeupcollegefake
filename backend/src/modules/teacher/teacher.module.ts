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
  TeacherIdeaSandboxPost,
  TeacherIdeaSandboxComment,
  TeacherIdeaSandboxUpvote,
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
import { IdeaSandboxService } from './services/idea-sandbox.service';
import { YouTubeApiService } from './services/youtube-api.service';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherUser,
      TeacherCourse,
      TeacherCourseOffering,
      TeacherAssignment,
      TeacherClassSession,
      TeacherIdeaSandboxPost,
      TeacherIdeaSandboxComment,
      TeacherIdeaSandboxUpvote,
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
  providers: [
    TeacherService,
    AssignmentsService,
    TeacherAttendanceService,
    IdeaSandboxService,
    YouTubeApiService,
  ],
  exports: [TeacherService],
})
export class TeacherModule {}
