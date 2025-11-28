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
} from '../../database/entities/student';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentUser,
      StudentProfile,
      StudentEnrollment,
      StudentGrade,
      StudentAttendance,
      StudentSchedule,
      StudentNotification,
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
