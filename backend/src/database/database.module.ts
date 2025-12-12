import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from '../config/database.config';

// Student entities
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
  CalendarEvent,
  StudentResume,
} from './entities/student';

// Study group entities
import {
  StudyGroup,
  StudyGroupMember,
  StudyGroupMessage,
  StudyGroupTeacherModerator,
} from './entities/study-groups';

// Teacher entities
import {
  TeacherUser,
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
  CurriculumCourse,
  CurriculumPlan,
  CurriculumSession,
  CurriculumCalendarEvent,
  CurriculumAdaptation,
} from './entities/teacher';

// Management entities
import {
  AdminUser,
  Campus,
  Department,
  Program,
  Financial,
} from './entities/management';

const entities = [
  // Student
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
  CalendarEvent,
  StudentResume,
  // Study groups
  StudyGroup,
  StudyGroupMember,
  StudyGroupMessage,
  StudyGroupTeacherModerator,
  // Teacher
  TeacherUser,
  TeacherCourse,
  TeacherCourseOffering,
  TeacherAssignment,
  TeacherClassSession,
  // Curriculum Planner
  CurriculumCourse,
  CurriculumPlan,
  CurriculumSession,
  CurriculumCalendarEvent,
  CurriculumAdaptation,
  // Management
  AdminUser,
  Campus,
  Department,
  Program,
  Financial,
];

@Global()
@Module({
  imports: [
    // Primary database connection (edgeup_college)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }
