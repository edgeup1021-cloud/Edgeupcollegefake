import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import {
  StudentUser,
  StudentProfile,
  StudentEnrollment,
  StudentGrade,
  StudentAttendance,
  StudentSchedule,
  StudentNotification,
  StudentStudySession,
  StudentAssessment,
  StudentActivityLog,
  StudentAssignmentSubmission,
} from '../../database/entities/student';
import {
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
} from '../../database/entities/teacher';
import { Campus } from '../../database/entities/management';
import { SubmissionsService } from './services/submissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Student entities
      StudentUser,
      StudentProfile,
      StudentEnrollment,
      StudentGrade,
      StudentAttendance,
      StudentSchedule,
      StudentNotification,
      StudentStudySession,
      StudentAssessment,
      StudentActivityLog,
      StudentAssignmentSubmission,
      // Teacher entities (for dashboard queries)
      TeacherCourse,
      TeacherCourseOffering,
      TeacherAssignment,
      TeacherClassSession,
      // Management entities
      Campus,
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, SubmissionsService],
  exports: [StudentService],
})
export class StudentModule {}
