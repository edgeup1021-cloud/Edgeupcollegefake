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
    console.log('[TeacherLiveClasses] GET / called - query:', query, 'user.id:', user?.id);
    return this.liveClassesService.getTeacherLiveClasses(user.id, query);
  }

  @Post()
  async createLiveClass(
    @Body() dto: CreateLiveClassDto,
    @CurrentUser() user: any,
  ) {
    console.log('[TeacherLiveClasses] POST / called');
    return this.liveClassesService.createLiveClass(user.id, dto);
  }

  @Get(':id')
  async getLiveClass(
    @Param('id') idRaw: string,
    @CurrentUser() user: any,
  ) {
    console.log('[TeacherLiveClasses] GET /:id called - idRaw:', idRaw);
    const id = parseInt(idRaw, 10);
    if (isNaN(id)) {
      throw new Error(`Invalid id parameter: ${idRaw}`);
    }
    return this.liveClassesService.getLiveClassById(id, user.id);
  }

  @Patch(':id')
  async updateLiveClass(
    @Param('id') idRaw: string,
    @Body() dto: UpdateLiveClassDto,
    @CurrentUser() user: any,
  ) {
    const id = parseInt(idRaw, 10);
    return this.liveClassesService.updateLiveClass(id, user.id, dto);
  }

  @Delete(':id')
  async deleteLiveClass(
    @Param('id') idRaw: string,
    @CurrentUser() user: any,
  ) {
    const id = parseInt(idRaw, 10);
    await this.liveClassesService.deleteLiveClass(id, user.id);
    return { message: 'Live class deleted successfully' };
  }

  @Patch(':id/start')
  async startLiveClass(
    @Param('id') idRaw: string,
    @CurrentUser() user: any,
  ) {
    const id = parseInt(idRaw, 10);
    return this.liveClassesService.startLiveClass(id, user.id);
  }

  @Patch(':id/end')
  async endLiveClass(
    @Param('id') idRaw: string,
    @CurrentUser() user: any,
  ) {
    const id = parseInt(idRaw, 10);
    return this.liveClassesService.endLiveClass(id, user.id);
  }

  @Get(':id/attendance')
  async getLiveClassAttendance(
    @Param('id') idRaw: string,
    @CurrentUser() user: any,
  ) {
    const id = parseInt(idRaw, 10);
    return this.liveClassesService.getLiveClassAttendance(id, user.id);
  }
}
