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
} from '../../database/entities/student';
import {
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
} from '../../database/entities/teacher';
import { Campus } from '../../database/entities/management';

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
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
