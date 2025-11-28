/**
 * student.controller.ts - Student REST API Controller
 *
 * This controller handles all HTTP requests for student operations.
 * It delegates business logic to StudentService and handles HTTP-specific concerns.
 *
 * REST Endpoints:
 * - GET    /api/student          - List all students
 * - GET    /api/student/overview - Dashboard statistics
 * - GET    /api/student/:id      - Get single student
 * - POST   /api/student          - Create new student
 * - PATCH  /api/student/:id      - Update student
 * - DELETE /api/student/:id      - Delete student
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * POST /api/student
   * Create a new student record
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  /**
   * GET /api/student
   * Retrieve all students ordered by creation date (newest first)
   */
  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  /**
   * GET /api/student/overview
   * Get dashboard statistics (total, active, avg GPA, etc.)
   * Note: This route must be defined before :id to prevent "overview" being parsed as an ID
   */
  @Get('overview')
  getOverview(): Promise<{
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
    graduatedStudents: number;
  }> {
    return this.studentService.getOverview();
  }

  /**
   * GET /api/student/:id
   * Retrieve a single student by ID
   * ParseIntPipe validates and converts the id parameter to a number
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.studentService.findOne(id);
  }

  /**
   * PATCH /api/student/:id
   * Update a student's information (partial update)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentService.update(id, updateStudentDto);
  }

  /**
   * DELETE /api/student/:id
   * Remove a student from the database
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.studentService.remove(id);
  }
}
