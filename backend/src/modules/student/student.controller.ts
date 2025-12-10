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
  ForbiddenException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { SubmissionsService } from './services/submissions.service';
import { SubmitAssignmentDto } from './dto/submission';
import { StudentMessagingService } from './services/student-messaging.service';
import { SendMessageDto } from '../teacher/dto/messaging/send-message.dto';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly submissionsService: SubmissionsService,
    private readonly studentMessagingService: StudentMessagingService,
  ) {}

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

  // Messaging endpoints - MUST be before generic :id routes
  // GET /api/student/:id/teachers - Get all teachers for student
  @Get(':id/teachers')
  @Public()
  getTeachers(@Param('id', ParseIntPipe) studentId: number) {
    return this.studentMessagingService.getStudentTeachers(studentId);
  }

  // GET /api/student/:id/conversations - Get all conversations for student
  @Get(':id/conversations')
  @Public()
  getConversations(@Param('id', ParseIntPipe) studentId: number) {
    return this.studentMessagingService.getStudentConversations(studentId);
  }

  // POST /api/student/:id/conversations - Create a conversation as student
  @Post(':id/conversations')
  @Public()
  createConversation(
    @Param('id', ParseIntPipe) studentId: number,
    @Body() dto: { teacherId: number; title?: string },
  ) {
    return this.studentMessagingService.createConversationAsStudent(
      dto.teacherId,
      studentId,
      dto.title,
    );
  }

  // GET /api/student/:id/conversations/:conversationId - Get conversation details
  @Get(':id/conversations/:conversationId')
  @Public()
  getConversation(
    @Param('id', ParseIntPipe) studentId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.studentMessagingService.getConversationById(
      conversationId,
      studentId,
    );
  }

  // POST /api/student/:id/conversations/:conversationId/messages - Send message
  @Post(':id/conversations/:conversationId/messages')
  @Public()
  sendMessage(
    @Param('id', ParseIntPipe) studentId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.studentMessagingService.sendMessage(
      conversationId,
      dto,
      studentId,
    );
  }

  // GET /api/student/:id/assignments - Get all assignments for student
  @Get(':id/assignments')
  @Public()
  getAssignments(@Param('id', ParseIntPipe) studentId: number) {
    return this.submissionsService.getStudentAssignments(studentId);
  }

  // POST /api/student/:id/assignments/submit - Submit assignment
  @Post(':id/assignments/submit')
  @Public()
  submitAssignment(
    @Param('id', ParseIntPipe) studentId: number,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.submissionsService.submitAssignment(dto, studentId);
  }

  // GET /api/student/:id/assignments/:assignmentId/submission - Get submission details
  @Get(':id/assignments/:assignmentId/submission')
  @Public()
  getSubmission(
    @Param('id', ParseIntPipe) studentId: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    return this.submissionsService.getSubmission(assignmentId, studentId);
  }

  // GET /api/student/:id/dashboard - Get student dashboard data
  // IMPORTANT: This route MUST be before :id to avoid "dashboard" being parsed incorrectly
  @Get(':id/dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboard(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    // Students can only access their own dashboard
    // Admins can access any student's dashboard
    if (user.role !== UserRole.ADMIN && Number(user.id) !== id) {
      throw new ForbiddenException('You can only access your own dashboard');
    }
    return this.studentService.getDashboard(id);
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
