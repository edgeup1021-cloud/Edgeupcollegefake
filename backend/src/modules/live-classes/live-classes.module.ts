import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherLiveClassesController } from './teacher-live-classes.controller';
import { StudentLiveClassesController } from './student-live-classes.controller';
import { LiveClassesService } from './live-classes.service';
import { LiveClass } from '../../database/entities/teacher/teacher-live-class.entity';
import { LiveClassAttendance } from '../../database/entities/student/student-live-class-attendance.entity';
import { StudentUser } from '../../database/entities/student/student-user.entity';
import { TeacherUser } from '../../database/entities/teacher/teacher-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiveClass,
      LiveClassAttendance,
      StudentUser,
      TeacherUser,
    ]),
  ],
  controllers: [TeacherLiveClassesController, StudentLiveClassesController],
  providers: [LiveClassesService],
  exports: [LiveClassesService],
})
export class LiveClassesModule {}
