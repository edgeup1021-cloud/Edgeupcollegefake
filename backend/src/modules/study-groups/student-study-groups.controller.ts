import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { StudyGroupsService } from './study-groups.service';
import {
  CreateStudyGroupDto,
  JoinStudyGroupDto,
  QueryStudyGroupDto,
  PostStudyGroupMessageDto,
  QueryGroupMessagesDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('student/:studentId/study-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentStudyGroupsController {
  constructor(private readonly studyGroupsService: StudyGroupsService) {}

  @Post()
  async createGroup(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() dto: CreateStudyGroupDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.createGroup(studentId, dto);
  }

  @Get()
  async listGroups(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: QueryStudyGroupDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.getStudentGroups(studentId, query);
  }

  @Post(':groupId/join')
  async joinGroup(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: JoinStudyGroupDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.joinGroup(studentId, groupId, dto);
  }

  @Post(':groupId/leave')
  async leaveGroup(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.leaveGroup(studentId, groupId);
  }

  @Delete(':groupId')
  async deleteGroup(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.deleteGroup(groupId, { studentId });
  }

  @Get(':groupId/messages')
  async getMessages(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: QueryGroupMessagesDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.getMessages(groupId, { studentId }, query);
  }

  @Post(':groupId/messages')
  async postMessage(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: PostStudyGroupMessageDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    this.ensureSameStudent(studentId, user);
    return this.studyGroupsService.postMessage(groupId, { studentId }, dto);
  }

  private ensureSameStudent(studentId: number, user: CurrentUserData) {
    if (user.role !== UserRole.ADMIN && Number(user.id) !== Number(studentId)) {
      throw new ForbiddenException('You can only access your own study groups');
    }
  }
}
