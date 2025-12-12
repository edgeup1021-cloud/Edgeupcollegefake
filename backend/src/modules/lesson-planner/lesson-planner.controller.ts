import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { LessonPlannerService } from './lesson-planner.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import {
  UpdateLessonDto,
  UpdateLessonResourceDto,
  ImportFromCurriculumDto,
} from './dto/update-lesson.dto';

interface CurrentUserPayload {
  id: number;
  email: string;
  role: UserRole;
}

@Controller('lesson-planner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class LessonPlannerController {
  constructor(private readonly lessonPlannerService: LessonPlannerService) {}

  // ==================== Lesson CRUD ====================

  @Post('lessons')
  async createLesson(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateLessonDto,
  ) {
    const lesson = await this.lessonPlannerService.createLesson(user.id, dto);
    return {
      success: true,
      data: lesson,
    };
  }

  @Get('lessons')
  async getLessons(@CurrentUser() user: CurrentUserPayload) {
    const lessons = await this.lessonPlannerService.getLessonsByTeacher(user.id);
    return {
      success: true,
      data: lessons,
    };
  }

  @Get('lessons/:lessonId')
  async getLesson(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const lesson = await this.lessonPlannerService.getLessonById(lessonId, user.id);
    return {
      success: true,
      data: lesson,
    };
  }

  @Put('lessons/:lessonId')
  async updateLesson(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: UpdateLessonDto,
  ) {
    const lesson = await this.lessonPlannerService.updateLesson(
      lessonId,
      user.id,
      dto,
    );
    return {
      success: true,
      data: lesson,
    };
  }

  @Delete('lessons/:lessonId')
  async deleteLesson(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    await this.lessonPlannerService.deleteLesson(lessonId, user.id);
    return {
      success: true,
      message: 'Lesson deleted successfully',
    };
  }

  // ==================== Generation ====================

  @Post('lessons/:lessonId/generate-blueprint')
  async generateBlueprint(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const result = await this.lessonPlannerService.generateBlueprint(
      lessonId,
      user.id,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('lessons/:lessonId/generate-toolkit')
  async generateToolkit(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const result = await this.lessonPlannerService.generateToolkit(
      lessonId,
      user.id,
    );
    return {
      success: true,
      data: result,
    };
  }

  // ==================== Resources ====================

  @Get('lessons/:lessonId/resources')
  async getResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const resources = await this.lessonPlannerService.getResources(
      lessonId,
      user.id,
    );
    return {
      success: true,
      data: resources,
    };
  }

  @Post('lessons/:lessonId/resources/generate')
  async generateResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const resources = await this.lessonPlannerService.generateResources(
      lessonId,
      user.id,
    );
    return {
      success: true,
      data: resources,
    };
  }

  @Post('lessons/:lessonId/resources/refresh')
  async refreshResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const resources = await this.lessonPlannerService.refreshResources(
      lessonId,
      user.id,
    );
    return {
      success: true,
      data: resources,
    };
  }

  @Put('resources/:resourceId')
  async updateResource(
    @CurrentUser() user: CurrentUserPayload,
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() dto: UpdateLessonResourceDto,
  ) {
    const resource = await this.lessonPlannerService.updateResource(
      resourceId,
      user.id,
      dto,
    );
    return {
      success: true,
      data: resource,
    };
  }

  // ==================== Import from Curriculum ====================

  @Get('curriculum-sessions')
  async getAvailableCurriculumSessions(@CurrentUser() user: CurrentUserPayload) {
    const sessions = await this.lessonPlannerService.getAvailableCurriculumSessions(
      user.id,
    );
    return {
      success: true,
      data: sessions,
    };
  }

  @Post('import-from-curriculum')
  async importFromCurriculum(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: ImportFromCurriculumDto,
  ) {
    const lesson = await this.lessonPlannerService.importFromCurriculum(
      user.id,
      dto,
    );
    return {
      success: true,
      data: lesson,
    };
  }
}
