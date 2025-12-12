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
import { TeacherMentorship } from '../../database/entities/teacher/teacher-mentorship.entity';
import { TeacherPublication } from '../../database/entities/teacher/teacher-publication.entity';
import {
  StudentEnrollment,
  StudentAssignmentSubmission,
  StudentUser,
  StudentSchedule,
  StudentAttendance,
  Exam,
  ExamSubject,
} from '../../database/entities/student';
import { StudentGrade } from '../../database/entities/student/student-grade.entity';
import { StudentAssessment } from '../../database/entities/student/student-assessment.entity';
import { Department, Subject, GradeScale } from '../../database/entities/management';
import { CalendarModule } from '../student/calendar/calendar.module';
import { AssignmentsService } from './services/assignments.service';
import { TeacherAttendanceService } from './services/teacher-attendance.service';
import { IdeaSandboxService } from './services/idea-sandbox.service';
import { MessagingService } from './services/messaging.service';
import { YouTubeApiService } from './services/youtube-api.service';
import { MentorshipService } from './services/mentorship.service';
import { PublicationsService } from './services/publications.service';
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
      TeacherMentorship,
      TeacherPublication,
      StudentEnrollment,
      StudentAssignmentSubmission,
      StudentUser,
      StudentSchedule,
      StudentAttendance,
      StudentGrade,
      StudentAssessment,
      Department,
      Subject,
      GradeScale,
      Exam,
      ExamSubject,
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
    YouTubeApiService,
    MentorshipService,
    PublicationsService,
  ],
  exports: [TeacherService],
})
export class TeacherModule {}
