import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { StudentAttendance } from '../../database/entities/student/student-attendance.entity';
import { StudentEnrollment } from '../../database/entities/student/student-enrollment.entity';
import { StudentSchedule } from '../../database/entities/student/student-schedule.entity';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { TeacherClassSession } from '../../database/entities/teacher/teacher-class-session.entity';
import { TeacherCourseOffering } from '../../database/entities/teacher/teacher-course-offering.entity';
import { TeacherCourse } from '../../database/entities/teacher/teacher-course.entity';
import { TeacherUser } from '../../database/entities/teacher/teacher-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentAttendance,
      StudentEnrollment,
      StudentSchedule,
      StudentUser,
      TeacherClassSession,
      TeacherCourseOffering,
      TeacherCourse,
      TeacherUser,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
