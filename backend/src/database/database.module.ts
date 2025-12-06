import { Module } from '@nestjs/common';
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
  // Management
  AdminUser,
  Campus,
  Department,
  Program,
  Financial,
];

@Module({
  imports: [
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
