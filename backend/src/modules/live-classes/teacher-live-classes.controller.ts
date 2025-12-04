import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LiveClassesService } from './live-classes.service';
import {
  CreateLiveClassDto,
  UpdateLiveClassDto,
  QueryLiveClassDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('teacher/live-classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class TeacherLiveClassesController {
  constructor(
    private readonly liveClassesService: LiveClassesService,
  ) {}

  @Get()
  async getTeacherLiveClasses(
    @Query() query: QueryLiveClassDto,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.getTeacherLiveClasses(user.id, query);
  }

  @Post()
  async createLiveClass(
    @Body() dto: CreateLiveClassDto,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.createLiveClass(user.id, dto);
  }

  @Get(':id')
  async getLiveClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.getLiveClassById(id, user.id);
  }

  @Patch(':id')
  async updateLiveClass(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLiveClassDto,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.updateLiveClass(id, user.id, dto);
  }

  @Delete(':id')
  async deleteLiveClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    await this.liveClassesService.deleteLiveClass(id, user.id);
    return { message: 'Live class deleted successfully' };
  }

  @Patch(':id/start')
  async startLiveClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.startLiveClass(id, user.id);
  }

  @Patch(':id/end')
  async endLiveClass(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.endLiveClass(id, user.id);
  }

  @Get(':id/attendance')
  async getLiveClassAttendance(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.liveClassesService.getLiveClassAttendance(id, user.id);
  }
}
