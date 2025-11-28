import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // GET /api/student - List all students
  @Get()
  @Public() // Make public for now, add auth later
  findAll() {
    return this.studentService.findAll();
  }

  // GET /api/student/overview - Dashboard statistics
  // IMPORTANT: This route MUST be before :id to avoid "overview" being parsed as an id
  @Get('overview')
  @Public() // Make public for now, add auth later
  getOverview() {
    return this.studentService.getOverview();
  }

  // GET /api/student/:id - Get student by ID
  @Get(':id')
  @Public() // Make public for now, add auth later
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findOne(id);
  }

  // POST /api/student - Create student
  @Post()
  @Public() // Make public for now, add auth later
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  // PATCH /api/student/:id - Update student
  @Patch(':id')
  @Public() // Make public for now, add auth later
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  // DELETE /api/student/:id - Delete student
  @Delete(':id')
  @Public() // Make public for now, add auth later
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.remove(id);
  }
}
