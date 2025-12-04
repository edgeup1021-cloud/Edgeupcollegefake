import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { StudentLeaveRequest } from '../../database/entities/student/student-leave-request.entity';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { StudentEnrollment } from '../../database/entities/student/student-enrollment.entity';
import { StudentAttendance } from '../../database/entities/student/student-attendance.entity';
import { StudentSchedule } from '../../database/entities/student/student-schedule.entity';
import { TeacherClassSession } from '../../database/entities/teacher/teacher-class-session.entity';
import { TeacherCourseOffering } from '../../database/entities/teacher/teacher-course-offering.entity';
import { CalendarModule } from '../student/calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentLeaveRequest,
      StudentUser,
      StudentEnrollment,
      StudentAttendance,
      StudentSchedule,
      TeacherClassSession,
      TeacherCourseOffering,
    ]),
    CalendarModule,
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
