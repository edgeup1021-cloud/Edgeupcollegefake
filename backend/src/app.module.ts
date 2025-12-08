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
import { LibraryModule } from './modules/library/library.module';
import { CareerModule } from './modules/career/career.module';
import { LiveClassesModule } from './modules/live-classes/live-classes.module';

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
    LiveClassesModule, // Must come before TeacherModule to avoid route conflicts
    TeacherModule,
    ManagementModule,
    SuperadminModule,
    CalendarModule,
    AttendanceModule,
    LeaveModule,
    LibraryModule,
    CareerModule,
  ],
})
export class AppModule { }
