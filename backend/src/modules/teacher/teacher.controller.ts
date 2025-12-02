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

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentsService: AssignmentsService,
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

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOne(id);
  }

  @Get(':id/courses')
  @Public()
  getCourses(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getTeacherCourses(id);
  }

  @Post()
  @Public()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
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

  // Assignment CRUD
  @Post('assignments')
  @Public()
  createAssignment(@Body() dto: CreateAssignmentDto) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    return this.assignmentsService.create(dto, 1);
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
}
