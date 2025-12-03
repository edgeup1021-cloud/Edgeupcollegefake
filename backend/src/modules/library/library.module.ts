import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherLibraryResource } from '../../database/entities/teacher/teacher-library-resource.entity';
import { LibraryTeacherController } from './library-teacher.controller';
import { LibraryStudentController } from './library-student.controller';
import { LibraryTeacherService } from './services/library-teacher.service';
import { LibraryStudentService } from './services/library-student.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherLibraryResource])],
  controllers: [LibraryTeacherController, LibraryStudentController],
  providers: [LibraryTeacherService, LibraryStudentService],
  exports: [LibraryTeacherService, LibraryStudentService],
})
export class LibraryModule {}
