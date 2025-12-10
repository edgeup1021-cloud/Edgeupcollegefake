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
  TeacherConversation,
  TeacherConversationParticipant,
  TeacherMessage,
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
import { MessagingService } from './services/messaging.service';
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
      TeacherConversation,
      TeacherConversationParticipant,
      TeacherMessage,
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
    MessagingService,
  ],
  exports: [TeacherService],
})
export class TeacherModule {}
