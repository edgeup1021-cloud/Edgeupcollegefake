import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DiscussionForumService } from './discussion-forum.service';
import {
  CreateDiscussionPostDto,
  UpdateDiscussionPostDto,
  QueryDiscussionPostsDto,
  CreateCommentDto,
  ArchivePostDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

interface CurrentUserData {
  id: string | number;
  email: string;
  role: UserRole;
  portalType: string;
}

@Controller('discussion-forum')
export class DiscussionForumController {
  constructor(
    private readonly discussionService: DiscussionForumService,
  ) {}

  // ==================== Student-Specific Routes ====================

  // Student-specific routes (must be before generic :id routes)
  @Get('my-posts')
  @Public()
  getMyPosts(
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ) {
    const id = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.getMyPosts(id, status as any);
  }

  @Get('my-upvoted-posts')
  @Public()
  getMyUpvotedPosts(@Query('studentId') studentId?: string) {
    const id = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.getMyUpvotedPosts(id);
  }

  // ==================== Post CRUD ====================

  @Post('posts')
  @Public()
  createPost(
    @Body() dto: CreateDiscussionPostDto,
    @Query('studentId') studentId?: string,
  ) {
    const id = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.create(dto, id);
  }

  @Get('posts')
  @Public()
  getPosts(@Query() query: QueryDiscussionPostsDto) {
    // Extract currentStudentId for upvote checking
    const { currentStudentId, ...filters } = query;

    return this.discussionService.findAll(filters, currentStudentId);
  }

  @Get('posts/:id')
  @Public()
  getPost(
    @Param('id', ParseIntPipe) id: number,
    @Query('currentStudentId') currentStudentId?: string,
  ) {
    const sid = currentStudentId ? parseInt(currentStudentId, 10) : undefined;
    return this.discussionService.findOne(id, sid);
  }

  @Patch('posts/:id')
  @Public()
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiscussionPostDto,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.update(id, dto, sid);
  }

  @Delete('posts/:id')
  @Public()
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.remove(id, sid);
  }

  @Patch('posts/:id/archive')
  @Public()
  archivePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ArchivePostDto,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.setArchived(id, dto, sid);
  }

  // ==================== Mark as Solved ====================

  @Patch('posts/:id/mark-solved')
  @Public()
  markAsSolved(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.markAsSolved(id, sid);
  }

  // ==================== Upvotes ====================

  @Post('posts/:id/upvote')
  @Public()
  toggleUpvote(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.toggleUpvote(id, sid);
  }

  @Get('posts/:id/upvotes')
  @Public()
  getUpvoters(@Param('id', ParseIntPipe) id: number) {
    return this.discussionService.getUpvoters(id);
  }

  // ==================== Comments ====================

  @Post('posts/:id/comments')
  @Public()
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.addComment(id, dto, sid);
  }

  @Get('posts/:id/comments')
  @Public()
  getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 20;
    const o = offset ? parseInt(offset, 10) : 0;
    return this.discussionService.getComments(id, l, o);
  }

  @Patch('comments/:id')
  @Public()
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.updateComment(id, dto, sid);
  }

  @Delete('comments/:id')
  @Public()
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.removeComment(id, sid);
  }

  @Post('comments/:id/mark-solution')
  @Public()
  markCommentAsSolution(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    const sid = studentId ? parseInt(studentId, 10) : 1;
    return this.discussionService.markCommentAsSolution(id, sid);
  }
}
