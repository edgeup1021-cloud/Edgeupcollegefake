/**
 * student.module.ts - Student Feature Module
 *
 * This module encapsulates all student-related functionality.
 * TypeOrmModule.forFeature registers the Student entity repository
 * which can then be injected into the StudentService.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Module({
  imports: [
    // Register the Student entity for this module
    // This makes Repository<Student> available for injection
    TypeOrmModule.forFeature([Student]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService], // Export if other modules need StudentService
})
export class StudentModule {}
