import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurriculumService } from './curriculum.service';
import { SessionStatus } from '../../database/entities/teacher/curriculum-session.entity';
import { PlanStatus } from '../../database/entities/teacher/curriculum-plan.entity';
import {
  CreateCurriculumCourseDto,
  GenerateMacroDto,
  GenerateSessionDto,
  GenerateAllSessionsDto,
  GenerateToolkitDto,
  SyncCalendarDto,
  RegenerateDto,
  AdaptDto,
  RespondToAdaptationDto,
  UpdateResourceDto,
} from './dto';

interface CurrentUserPayload {
  id: number;
  email: string;
  role: UserRole;
}

@Controller('curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  // ==================== Course Management ====================

  @Post('courses')
  async createCourse(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCurriculumCourseDto,
  ) {
    const course = await this.curriculumService.createCourse(user.id, dto);
    return {
      success: true,
      data: course,
    };
  }

  @Get('courses')
  async getCourses(@CurrentUser() user: CurrentUserPayload) {
    const courses = await this.curriculumService.getCoursesByTeacher(user.id);
    return {
      success: true,
      data: courses,
    };
  }

  @Get('courses/:courseId')
  async getCourse(
    @CurrentUser() user: CurrentUserPayload,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const course = await this.curriculumService.getCourseById(courseId, user.id);
    return {
      success: true,
      data: course,
    };
  }

  // ==================== Macro Plan ====================

  @Post('generate-macro')
  async generateMacroPlan(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GenerateMacroDto,
  ) {
    const result = await this.curriculumService.generateMacroPlan(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('plans')
  async getPlans(@CurrentUser() user: CurrentUserPayload) {
    const plans = await this.curriculumService.getPlansByTeacher(user.id);
    return {
      success: true,
      data: plans,
    };
  }

  @Get('plans/:planId')
  async getPlan(
    @CurrentUser() user: CurrentUserPayload,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    const plan = await this.curriculumService.getPlanById(planId, user.id);
    return {
      success: true,
      data: plan,
    };
  }

  @Put('plans/:planId/status')
  async updatePlanStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Param('planId', ParseIntPipe) planId: number,
    @Body('status') status: PlanStatus,
  ) {
    const plan = await this.curriculumService.updatePlanStatus(planId, user.id, status);
    return {
      success: true,
      data: plan,
    };
  }

  // ==================== Session Generation ====================

  @Post('generate-session')
  async generateSession(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GenerateSessionDto,
  ) {
    const result = await this.curriculumService.generateSession(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('generate-all-sessions')
  async generateAllSessions(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GenerateAllSessionsDto,
  ) {
    const result = await this.curriculumService.generateAllSessions(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('plans/:planId/sessions')
  async getSessionsByPlan(
    @CurrentUser() user: CurrentUserPayload,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    const sessions = await this.curriculumService.getSessionsByPlan(planId, user.id);
    return {
      success: true,
      data: sessions,
    };
  }

  @Get('sessions/:sessionId')
  async getSession(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    const session = await this.curriculumService.getSessionById(sessionId, user.id);
    return {
      success: true,
      data: session,
    };
  }

  @Put('sessions/:sessionId/status')
  async updateSessionStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body('status') status: SessionStatus,
    @Body('notes') notes?: string,
  ) {
    const session = await this.curriculumService.updateSessionStatus(
      sessionId,
      user.id,
      status,
      notes,
    );
    return {
      success: true,
      data: session,
    };
  }

  // ==================== Engagement Toolkit ====================

  @Post('generate-toolkit')
  async generateToolkit(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GenerateToolkitDto,
  ) {
    const result = await this.curriculumService.generateToolkit(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  // ==================== Calendar Sync ====================

  @Post('sync-calendar')
  async syncCalendar(@CurrentUser() user: CurrentUserPayload, @Body() dto: SyncCalendarDto) {
    const result = await this.curriculumService.syncCalendar(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('plans/:planId/calendar')
  async getCalendarEvents(
    @CurrentUser() user: CurrentUserPayload,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    const events = await this.curriculumService.getCalendarEvents(planId, user.id);
    return {
      success: true,
      data: events,
    };
  }

  // ==================== Regeneration ====================

  @Post('regenerate')
  async regenerate(@CurrentUser() user: CurrentUserPayload, @Body() dto: RegenerateDto) {
    const result = await this.curriculumService.regenerate(user.id, dto);
    return {
      success: true,
      data: result,
    };
  }

  // ==================== Adaptation ====================

  @Post('adapt')
  async createAdaptation(@CurrentUser() user: CurrentUserPayload, @Body() dto: AdaptDto) {
    const adaptation = await this.curriculumService.createAdaptation(user.id, dto);
    return {
      success: true,
      data: adaptation,
    };
  }

  @Post('adaptations/respond')
  async respondToAdaptation(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: RespondToAdaptationDto,
  ) {
    const adaptation = await this.curriculumService.respondToAdaptation(user.id, dto);
    return {
      success: true,
      data: adaptation,
    };
  }

  @Get('plans/:planId/adaptations')
  async getAdaptationsByPlan(
    @CurrentUser() user: CurrentUserPayload,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    const adaptations = await this.curriculumService.getAdaptationsByPlan(
      planId,
      user.id,
    );
    return {
      success: true,
      data: adaptations,
    };
  }

  // ==================== Session Resources ====================

  @Get('sessions/:sessionId/resources')
  async getSessionResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    const resources = await this.curriculumService.getSessionResources(
      sessionId,
      user.id,
    );
    return {
      success: true,
      data: resources,
    };
  }

  @Post('sessions/:sessionId/resources/generate')
  async generateSessionResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    const resources = await this.curriculumService.generateSessionResources(
      sessionId,
      user.id,
    );
    return {
      success: true,
      data: resources,
    };
  }

  @Post('sessions/:sessionId/resources/refresh')
  async refreshSessionResources(
    @CurrentUser() user: CurrentUserPayload,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    const resources = await this.curriculumService.refreshSessionResources(
      sessionId,
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
    @Body() dto: UpdateResourceDto,
  ) {
    const resource = await this.curriculumService.updateResource(
      resourceId,
      user.id,
      dto,
    );
    return {
      success: true,
      data: resource,
    };
  }
}
