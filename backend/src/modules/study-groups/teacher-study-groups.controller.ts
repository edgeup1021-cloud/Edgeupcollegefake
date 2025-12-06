import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { StudyGroupsService } from './study-groups.service';
import {
  ModerateMemberDto,
  ArchiveStudyGroupDto,
  PostStudyGroupMessageDto,
  QueryGroupMessagesDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('teacher/study-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class TeacherStudyGroupsController {
  constructor(private readonly studyGroupsService: StudyGroupsService) {}

  @Post(':groupId/moderators')
  async addSelfAsModerator(
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.addTeacherModerator(user.id, groupId);
  }

  @Patch(':groupId/members/:memberId')
  async moderateMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: ModerateMemberDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.moderateMember(groupId, memberId, dto, {
      teacherId: user.id,
    });
  }

  @Patch(':groupId/archive')
  async archiveGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: ArchiveStudyGroupDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.setArchived(groupId, dto, { teacherId: user.id });
  }

  @Get(':groupId/messages')
  async getMessages(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: QueryGroupMessagesDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.getMessages(groupId, { teacherId: user.id }, query);
  }

  @Post(':groupId/messages')
  async postMessage(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: PostStudyGroupMessageDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.postMessage(groupId, { teacherId: user.id }, dto);
  }

  @Delete(':groupId')
  async deleteGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.studyGroupsService.deleteGroup(groupId, { teacherId: user.id });
  }
}
