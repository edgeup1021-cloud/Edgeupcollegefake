import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ManagementModule } from './modules/management/management.module';
import { CalendarModule } from './modules/student/calendar/calendar.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';
import { LibraryModule } from './modules/library/library.module';

@Module({
  imports: [
    // Core modules
    ConfigModule,
    DatabaseModule,
    SharedModule,

    // Feature modules
    AuthModule,
    StudentModule,
    TeacherModule,
    ManagementModule,
    CalendarModule,
    AttendanceModule,
    LeaveModule,
    LibraryModule,
  ],
})
export class AppModule { }
