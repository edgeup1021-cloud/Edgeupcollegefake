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
import { MessagingService } from './services/messaging.service';
import {
  CreateConversationDto,
  AddParticipantsDto,
  SendMessageDto,
} from './dto/messaging';
import { YouTubeApiService } from './services/youtube-api.service';
import { QueryDevelopmentProgramsDto } from './dto/query-development-programs.dto';
import { MentorshipService } from './services/mentorship.service';
import {
  CreateMentorshipDto,
  UpdateMentorshipDto,
  BulkAssignMenteesDto,
} from './dto/mentorship';
import { MentorshipStatus } from '../../database/entities/teacher/teacher-mentorship.entity';
import { PublicationsService } from './services/publications.service';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
  QueryPublicationsDto,
} from './dto/publications';
import { QuestionGeneratorService } from './services/question-generator.service';
import { GenerateQuestionsDto } from './dto/question-generator';

@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly assignmentsService: AssignmentsService,
    private readonly teacherAttendanceService: TeacherAttendanceService,
    private readonly ideaSandboxService: IdeaSandboxService,
    private readonly messagingService: MessagingService,
    private readonly youtubeApiService: YouTubeApiService,
    private readonly mentorshipService: MentorshipService,
    private readonly publicationsService: PublicationsService,
    private readonly questionGeneratorService: QuestionGeneratorService,
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

  // ==================== Question Generator Routes ====================

  @Post('questions/generate')
  @Public()
  async generateQuestions(
    @Body() dto: GenerateQuestionsDto,
    @Query('teacherId') teacherId?: string,
  ) {
    // teacherId passed for future use (not required by AI service in MVP)
    return this.questionGeneratorService.generateQuestions(dto);
  }

  @Get('questions/subjects')
  @Public()
  async getSubjects(@Query('course') course: string) {
    return this.questionGeneratorService.getSubjects(course);
  }

  @Get('questions/topics')
  @Public()
  async getTopics(
    @Query('course') course: string,
    @Query('subject') subject: string,
  ) {
    return this.questionGeneratorService.getTopics(course, subject);
  }

  @Get('questions/subtopics')
  @Public()
  async getSubtopics(
    @Query('course') course: string,
    @Query('subject') subject: string,
    @Query('topic') topic: string,
  ) {
    return this.questionGeneratorService.getSubtopics(course, subject, topic);
  }

  @Get('questions/departments')
  @Public()
  async getDepartments(@Query('course') course: string) {
    return this.questionGeneratorService.getDepartments(course);
  }

  // ==================== End Question Generator Routes ====================

  @Get('students')
  @Public()
  getStudents(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.teacherService.getTeacherStudents(id);
  }

  // ==================== Mentorship Routes ====================

  @Get('mentees')
  @Public()
  getMentees(
    @Query('teacherId') teacherId?: string,
    @Query('status') status?: MentorshipStatus,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.getMentees(id, status);
  }

  @Get('mentees/available')
  @Public()
  getAvailableStudents(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.getAvailableStudents(id);
  }

  @Post('mentees')
  @Public()
  assignMentee(
    @Body() dto: CreateMentorshipDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.assignMentee(dto, id);
  }

  @Post('mentees/bulk-assign')
  @Public()
  bulkAssignMentees(
    @Body() dto: BulkAssignMenteesDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.bulkAssignMentees(dto, id);
  }

  @Get('mentees/:id')
  @Public()
  getMenteeDetails(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.getMenteeDetails(id, tid);
  }

  @Patch('mentees/:id')
  @Public()
  updateMentorship(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMentorshipDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.updateMentorship(id, dto, tid);
  }

  @Delete('mentees/:id')
  @Public()
  removeMentee(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.mentorshipService.removeMentee(id, tid);
  }

  // ==================== End Mentorship Routes ====================

  // ==================== Publications Routes ====================

  @Post('publications')
  @Public()
  createPublication(
    @Body() dto: CreatePublicationDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.publicationsService.create(dto, id);
  }

  @Get('publications')
  @Public()
  getPublications(@Query() query: QueryPublicationsDto) {
    return this.publicationsService.findAll(query);
  }

  @Get('publications/stats')
  @Public()
  getPublicationStats(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.publicationsService.getStatistics(id);
  }

  @Get('publications/:id')
  @Public()
  getPublication(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : undefined;
    return this.publicationsService.findOne(id, tid);
  }

  @Patch('publications/:id')
  @Public()
  updatePublication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePublicationDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.publicationsService.update(id, dto, tid);
  }

  @Delete('publications/:id')
  @Public()
  deletePublication(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.publicationsService.remove(id, tid);
  }

  // ==================== End Publications Routes ====================

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

  // ==================== Messaging Routes ====================

  @Post('conversations')
  @Public()
  createConversation(
    @Body() dto: CreateConversationDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.createConversation(dto, id);
  }

  @Get('conversations')
  @Public()
  getConversations(@Query('teacherId') teacherId?: string) {
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.getConversations(id);
  }

  @Get('conversations/:id')
  @Public()
  getConversation(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.getConversationById(id, tid);
  }

  @Post('conversations/:id/messages')
  @Public()
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.sendMessage(id, dto, tid);
  }

  @Post('conversations/:id/participants')
  @Public()
  addParticipants(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddParticipantsDto,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.addParticipants(id, dto, tid);
  }

  @Delete('conversations/:id')
  @Public()
  deleteConversation(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.messagingService.deleteConversation(id, tid);
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
