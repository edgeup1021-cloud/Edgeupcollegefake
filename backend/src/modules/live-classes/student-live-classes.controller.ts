import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LiveClassesService } from './live-classes.service';
import { QueryLiveClassDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('student/:studentId/live-classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentLiveClassesController {
  constructor(private readonly liveClassesService: LiveClassesService) {}

  @Get()
  async getStudentLiveClasses(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() query: QueryLiveClassDto,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.getStudentLiveClasses(studentId, query);
  }

  @Post(':liveClassId/join')
  async joinLiveClass(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('liveClassId', ParseIntPipe) liveClassId: number,
    @CurrentUser() user: any,
  ) {
    await this.liveClassesService.joinLiveClass(liveClassId, studentId);
    return { message: 'Successfully joined the live class' };
  }

  @Post(':liveClassId/leave')
  async leaveLiveClass(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('liveClassId', ParseIntPipe) liveClassId: number,
    @CurrentUser() user: any,
  ) {
    await this.liveClassesService.leaveLiveClass(liveClassId, studentId);
    return { message: 'Successfully left the live class' };
  }
}
