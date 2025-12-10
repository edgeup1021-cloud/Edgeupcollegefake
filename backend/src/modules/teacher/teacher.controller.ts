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
import { IdeaSandboxService } from './services/idea-sandbox.service';
import {
  CreateIdeaSandboxPostDto,
  UpdateIdeaSandboxPostDto,
  QueryIdeaSandboxPostsDto,
  CreateCommentDto,
  ArchivePostDto,
} from './dto/idea-sandbox';
import { YouTubeApiService } from './services/youtube-api.service';
import { QueryDevelopmentProgramsDto } from './dto/query-development-programs.dto';

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentsService: AssignmentsService,
    private readonly teacherAttendanceService: TeacherAttendanceService,
    private readonly ideaSandboxService: IdeaSandboxService,
    private readonly youtubeApiService: YouTubeApiService,
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

  // ==================== Idea Sandbox Routes ====================

  // Teacher-specific routes (must be before generic :id routes)
  @Get('idea-sandbox/my-posts')
  @Public()
  getMyPosts(
    @Query('teacherId') teacherId?: string,
    @Query('status') status?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.getMyPosts(id, status as any);
  }

  @Get('idea-sandbox/my-upvoted-posts')
  @Public()
  getMyUpvotedPosts(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.getMyUpvotedPosts(id);
  }

  // Post CRUD
  @Post('idea-sandbox/posts')
  @Public()
  createIdeaSandboxPost(
    @Body() dto: CreateIdeaSandboxPostDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.create(dto, id);
  }

  @Get('idea-sandbox/posts')
  @Public()
  getIdeaSandboxPosts(@Query() query: QueryIdeaSandboxPostsDto) {
    // Extract currentTeacherId for upvote checking
    const { currentTeacherId, ...filters } = query;

    return this.ideaSandboxService.findAll(filters, currentTeacherId);
  }

  @Get('idea-sandbox/posts/:id')
  @Public()
  getIdeaSandboxPost(
    @Param('id', ParseIntPipe) id: number,
    @Query('currentTeacherId') currentTeacherId?: string,
  ) {
    const tid = currentTeacherId ? parseInt(currentTeacherId, 10) : undefined;
    return this.ideaSandboxService.findOne(id, tid);
  }

  @Patch('idea-sandbox/posts/:id')
  @Public()
  updateIdeaSandboxPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIdeaSandboxPostDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.update(id, dto, tid);
  }

  @Delete('idea-sandbox/posts/:id')
  @Public()
  deleteIdeaSandboxPost(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.remove(id, tid);
  }

  @Patch('idea-sandbox/posts/:id/archive')
  @Public()
  archiveIdeaSandboxPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ArchivePostDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.setArchived(id, dto, tid);
  }

  // Upvotes
  @Post('idea-sandbox/posts/:id/upvote')
  @Public()
  toggleUpvote(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.toggleUpvote(id, tid);
  }

  @Get('idea-sandbox/posts/:id/upvotes')
  @Public()
  getUpvoters(@Param('id', ParseIntPipe) id: number) {
    return this.ideaSandboxService.getUpvoters(id);
  }

  // Comments
  @Post('idea-sandbox/posts/:id/comments')
  @Public()
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.addComment(id, dto, tid);
  }

  @Get('idea-sandbox/posts/:id/comments')
  @Public()
  getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 20;
    const o = offset ? parseInt(offset, 10) : 0;
    return this.ideaSandboxService.getComments(id, l, o);
  }

  @Patch('idea-sandbox/comments/:id')
  @Public()
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.updateComment(id, dto, tid);
  }

  @Delete('idea-sandbox/comments/:id')
  @Public()
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.ideaSandboxService.removeComment(id, tid);
  }

  // Development Programs - YouTube API integration

  // Personalized recommendations (must be before /search to avoid route conflict)
  @Get('development-programs/personalized/:teacherId')
  @Public()
  async getPersonalizedPrograms(@Param('teacherId', ParseIntPipe) id: number) {
    return this.youtubeApiService.getPersonalizedCourses(id);
  }

  @Get('development-programs/search')
  @Public()
  async searchDevelopmentPrograms(@Query() query: QueryDevelopmentProgramsDto) {
    return this.youtubeApiService.searchEducationalVideos(query);
  }

  @Get('development-programs/channels')
  @Public()
  getEducationalChannels() {
    return this.youtubeApiService.getEducationalChannels();
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
