import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SuperadminDatabaseModule } from './database/superadmin-database.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ManagementModule } from './modules/management/management.module';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { CalendarModule } from './modules/student/calendar/calendar.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';
import { LibraryModule } from './modules/digital-library/library.module';
import { LiveClassesModule } from './modules/live-classes/live-classes.module';
import { StudyGroupsModule } from './modules/study-groups/study-groups.module';
import { CareerModule } from './modules/career/career.module';
import { DiscussionForumModule } from './modules/discussion-forum/discussion-forum.module';

@Module({
  imports: [
    // Core modules
    ConfigModule,
    DatabaseModule,
    SuperadminDatabaseModule,
    SharedModule,

    // Feature modules
    AuthModule,
    StudentModule,
    TeacherModule,
    ManagementModule,
    SuperadminModule,
    CalendarModule,
    AttendanceModule,
    LeaveModule,
    LibraryModule,
    LiveClassesModule,
    StudyGroupsModule,
    CareerModule,
    DiscussionForumModule,
  ],
})
export class AppModule { }
