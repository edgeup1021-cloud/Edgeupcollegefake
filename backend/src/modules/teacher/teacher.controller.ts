import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Public } from '../../common/decorators/public.decorator';
import { AssignmentsService } from './services/assignments.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  QueryAssignmentsDto,
  GradeSubmissionDto,
} from './dto/assignment';
import { TeacherAttendanceService } from './services/teacher-attendance.service';
import { MarkAttendanceDto } from './dto/attendance-roster-response.dto';

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentsService: AssignmentsService,
    private readonly teacherAttendanceService: TeacherAttendanceService,
  ) {}

  @Get()
  @Public()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get('overview')
  @Public()
  getOverview() {
    return this.teacherService.getOverview();
  }

  @Get('dashboard')
  @Public()
  getDashboard(@Query('teacherId') teacherId?: string) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherService.getTeacherDashboard(id);
  }

  @Post()
  @Public()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  // Course Offering endpoints
  @Post('course-offerings')
  @Public()
  createCourseOffering(
    @Body() dto: any,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherService.createCourseOffering(dto, id);
  }

  @Get('course-offerings')
  @Public()
  getCourseOfferings(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherService.getTeacherCourses(id);
  }

  // Assignment CRUD
  @Post('assignments')
  @Public()
  createAssignment(
    @Body() dto: CreateAssignmentDto,
    @Query('teacherId') teacherId?: string,
  ) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.assignmentsService.create(dto, id);
  }

  @Get('assignments')
  @Public()
  getAssignments(@Query() query: QueryAssignmentsDto) {
    return this.assignmentsService.findAll(query);
  }

  @Get('assignments/:id')
  @Public()
  getAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }

  @Patch('assignments/:id')
  @Public()
  updateAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, dto);
  }

  @Delete('assignments/:id')
  @Public()
  deleteAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.remove(id);
  }

  // Submission Management
  @Get('assignments/:id/submissions')
  @Public()
  getSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.getSubmissions(id);
  }

  @Post('submissions/:id/grade')
  @Public()
  gradeSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
    @Body() dto: GradeSubmissionDto,
  ) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    return this.assignmentsService.gradeSubmission(submissionId, dto, 1);
  }

  // Attendance endpoints - must be before :id routes
  @Get('class-sessions/:sessionId/attendance-roster')
  @Public()
  async getAttendanceRoster(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherAttendanceService.getAttendanceRoster(sessionId, id);
  }

  @Post('class-sessions/:sessionId/attendance')
  @Public()
  async markAttendance(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: MarkAttendanceDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherAttendanceService.markSessionAttendance(sessionId, dto, id);
  }

  // Teacher CRUD - placed after specific routes to avoid route conflicts
  @Get(':id/courses')
  @Public()
  getCourses(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getTeacherCourses(id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.remove(id);
  }
}
