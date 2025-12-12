import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CurriculumCourse,
  SessionType,
  ClassVibe,
  TeacherChallenge,
} from '../../database/entities/teacher/curriculum-course.entity';
import {
  CurriculumPlan,
  PlanStatus,
} from '../../database/entities/teacher/curriculum-plan.entity';
import {
  CurriculumSession,
  SessionStatus,
} from '../../database/entities/teacher/curriculum-session.entity';
import {
  CurriculumCalendarEvent,
  CalendarEventType,
} from '../../database/entities/teacher/curriculum-calendar-event.entity';
import {
  CurriculumAdaptation,
  AdaptationTrigger,
  AdaptationStatus,
} from '../../database/entities/teacher/curriculum-adaptation.entity';
import {
  CurriculumSessionResource,
  ResourceType,
  SectionType,
} from '../../database/entities/teacher/curriculum-session-resource.entity';
import { CurriculumAIService, MacroPlan, SessionBlueprint } from './curriculum-ai.service';
import { ResourceSearchService } from './resource-search.service';
import {
  CreateCurriculumCourseDto,
  GenerateMacroDto,
  GenerateSessionDto,
  GenerateAllSessionsDto,
  GenerateToolkitDto,
  SyncCalendarDto,
  ClassScheduleSlotDto,
  RegenerateDto,
  RegenerateType,
  AdaptDto,
  RespondToAdaptationDto,
  UpdateResourceDto,
} from './dto';

@Injectable()
export class CurriculumService {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(
    @InjectRepository(CurriculumCourse)
    private courseRepo: Repository<CurriculumCourse>,
    @InjectRepository(CurriculumPlan)
    private planRepo: Repository<CurriculumPlan>,
    @InjectRepository(CurriculumSession)
    private sessionRepo: Repository<CurriculumSession>,
    @InjectRepository(CurriculumCalendarEvent)
    private calendarEventRepo: Repository<CurriculumCalendarEvent>,
    @InjectRepository(CurriculumAdaptation)
    private adaptationRepo: Repository<CurriculumAdaptation>,
    @InjectRepository(CurriculumSessionResource)
    private resourceRepo: Repository<CurriculumSessionResource>,
    private aiService: CurriculumAIService,
    private resourceSearchService: ResourceSearchService,
  ) {}

  // Course Management
  async createCourse(
    teacherId: number,
    dto: CreateCurriculumCourseDto,
  ): Promise<CurriculumCourse> {
    const course = this.courseRepo.create({
      teacherId,
      ...dto,
      studentLevel: dto.studentLevel || 'Undergraduate',
    });
    return this.courseRepo.save(course);
  }

  async getCoursesByTeacher(teacherId: number): Promise<CurriculumCourse[]> {
    return this.courseRepo.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  async getCourseById(courseId: number, teacherId: number): Promise<CurriculumCourse> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId, teacherId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  // Macro Plan Generation
  async generateMacroPlan(
    teacherId: number,
    dto: GenerateMacroDto,
  ): Promise<{ curriculumPlanId: number; macroplan: MacroPlan }> {
    let course: CurriculumCourse;

    if (dto.courseId) {
      course = await this.getCourseById(dto.courseId, teacherId);
    } else if (dto.courseData) {
      course = await this.createCourse(teacherId, dto.courseData);
    } else {
      throw new BadRequestException('Either courseId or courseData is required');
    }

    this.logger.log(`Generating macro plan for course: ${course.courseName}`);

    const macroplan = await this.aiService.generateMacroPlan(course);

    // Get the latest version for this course
    const latestPlan = await this.planRepo.findOne({
      where: { courseId: course.id },
      order: { version: 'DESC' },
    });

    const newVersion = latestPlan ? latestPlan.version + 1 : 1;

    const plan = this.planRepo.create({
      courseId: course.id,
      version: newVersion,
      status: PlanStatus.DRAFT,
      macroplan,
      generatedAt: new Date(),
    });

    const savedPlan = await this.planRepo.save(plan);

    return {
      curriculumPlanId: savedPlan.id,
      macroplan,
    };
  }

  async getPlanById(planId: number, teacherId: number): Promise<CurriculumPlan> {
    const plan = await this.planRepo.findOne({
      where: { id: planId },
      relations: ['course', 'sessions'],
    });

    if (!plan) {
      throw new NotFoundException('Curriculum plan not found');
    }

    if (plan.course.teacherId !== teacherId) {
      throw new NotFoundException('Curriculum plan not found');
    }

    return plan;
  }

  async getPlansByTeacher(teacherId: number): Promise<CurriculumPlan[]> {
    return this.planRepo
      .createQueryBuilder('plan')
      .innerJoinAndSelect('plan.course', 'course')
      .where('course.teacherId = :teacherId', { teacherId })
      .orderBy('plan.createdAt', 'DESC')
      .getMany();
  }

  // Session Generation
  async generateSession(
    teacherId: number,
    dto: GenerateSessionDto,
  ): Promise<{ sessionId: number; blueprint: SessionBlueprint }> {
    const plan = await this.getPlanById(dto.curriculumPlanId, teacherId);
    const course = plan.course;
    const macroplan = plan.macroplan as MacroPlan;

    this.logger.log(
      `Generating session blueprint: Week ${dto.weekNumber}, Session ${dto.sessionNumber}`,
    );

    const blueprint = await this.aiService.generateSessionBlueprint(
      course,
      macroplan,
      dto.weekNumber,
      dto.sessionNumber,
    );

    // Check if session already exists
    let session = await this.sessionRepo.findOne({
      where: {
        curriculumPlanId: plan.id,
        weekNumber: dto.weekNumber,
        sessionNumber: dto.sessionNumber,
      },
    });

    if (session) {
      session.blueprint = blueprint;
      session.generatedAt = new Date();
      session.status = SessionStatus.GENERATED;
    } else {
      session = this.sessionRepo.create({
        curriculumPlanId: plan.id,
        weekNumber: dto.weekNumber,
        sessionNumber: dto.sessionNumber,
        blueprint,
        generatedAt: new Date(),
        status: SessionStatus.GENERATED,
      });
    }

    const savedSession = await this.sessionRepo.save(session);

    return {
      sessionId: savedSession.id,
      blueprint,
    };
  }

  async generateAllSessions(
    teacherId: number,
    dto: GenerateAllSessionsDto,
  ): Promise<{ totalGenerated: number; sessions: { weekNumber: number; sessionNumber: number; sessionId: number }[] }> {
    const plan = await this.getPlanById(dto.curriculumPlanId, teacherId);
    const course = plan.course;
    const macroplan = plan.macroplan as MacroPlan;

    const generatedSessions: { weekNumber: number; sessionNumber: number; sessionId: number }[] = [];

    for (const week of macroplan.weeks) {
      for (let sessionNum = 1; sessionNum <= week.sessionCount; sessionNum++) {
        try {
          const result = await this.generateSession(teacherId, {
            curriculumPlanId: plan.id,
            weekNumber: week.weekNumber,
            sessionNumber: sessionNum,
          });

          generatedSessions.push({
            weekNumber: week.weekNumber,
            sessionNumber: sessionNum,
            sessionId: result.sessionId,
          });

          this.logger.log(
            `Generated session: Week ${week.weekNumber}, Session ${sessionNum}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to generate session: Week ${week.weekNumber}, Session ${sessionNum}`,
            error,
          );
        }
      }
    }

    return {
      totalGenerated: generatedSessions.length,
      sessions: generatedSessions,
    };
  }

  async getSessionById(sessionId: number, teacherId: number): Promise<CurriculumSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['curriculumPlan', 'curriculumPlan.course'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.curriculumPlan.course.teacherId !== teacherId) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getSessionsByPlan(planId: number, teacherId: number): Promise<CurriculumSession[]> {
    const plan = await this.getPlanById(planId, teacherId);
    return this.sessionRepo.find({
      where: { curriculumPlanId: plan.id },
      order: { weekNumber: 'ASC', sessionNumber: 'ASC' },
    });
  }

  // Toolkit Generation
  async generateToolkit(
    teacherId: number,
    dto: GenerateToolkitDto,
  ): Promise<{ sessionId: number; toolkit: Record<string, any> }> {
    const session = await this.getSessionById(dto.sessionId, teacherId);
    const course = session.curriculumPlan.course;
    const blueprint = session.blueprint as SessionBlueprint;

    this.logger.log(`Generating engagement toolkit for session: ${session.id}`);

    const toolkit = await this.aiService.generateEngagementToolkit(course, blueprint);

    session.toolkit = toolkit;
    await this.sessionRepo.save(session);

    return {
      sessionId: session.id,
      toolkit,
    };
  }

  // Calendar Sync
  async syncCalendar(
    teacherId: number,
    dto: SyncCalendarDto,
  ): Promise<{ eventsCreated: number; events: CurriculumCalendarEvent[] }> {
    const plan = await this.getPlanById(dto.curriculumPlanId, teacherId);
    const sessions = await this.getSessionsByPlan(plan.id, teacherId);
    const macroplan = plan.macroplan as MacroPlan;

    // Delete existing calendar events for this plan
    await this.calendarEventRepo.delete({ curriculumPlanId: plan.id });

    const startDate = new Date(dto.startDate);
    const skipDates = new Set(dto.skipDates?.map((d) => new Date(d).toDateString()) || []);
    const events: CurriculumCalendarEvent[] = [];

    // Create a schedule map for quick lookup
    const scheduleByDay = new Map<number, ClassScheduleSlotDto[]>();
    for (const slot of dto.classSchedule) {
      if (!scheduleByDay.has(slot.dayOfWeek)) {
        scheduleByDay.set(slot.dayOfWeek, []);
      }
      scheduleByDay.get(slot.dayOfWeek)!.push(slot);
    }

    let currentDate = new Date(startDate);
    let currentWeek = 1;
    let sessionIndex = 0;

    // Iterate through weeks
    while (currentWeek <= macroplan.weeks.length) {
      const weekData = macroplan.weeks.find((w) => w.weekNumber === currentWeek);
      if (!weekData) {
        currentWeek++;
        continue;
      }

      let sessionsScheduledThisWeek = 0;

      // Schedule sessions for this week
      while (sessionsScheduledThisWeek < weekData.sessionCount) {
        const dayOfWeek = currentDate.getDay();
        const slotsForDay = scheduleByDay.get(dayOfWeek);

        if (slotsForDay && !skipDates.has(currentDate.toDateString())) {
          for (const slot of slotsForDay) {
            if (sessionsScheduledThisWeek >= weekData.sessionCount) break;

            const session = sessions.find(
              (s) =>
                s.weekNumber === currentWeek &&
                s.sessionNumber === sessionsScheduledThisWeek + 1,
            );

            const [startHour, startMin] = slot.startTime.split(':').map(Number);
            const [endHour, endMin] = slot.endTime.split(':').map(Number);

            const startDateTime = new Date(currentDate);
            startDateTime.setHours(startHour, startMin, 0, 0);

            const endDateTime = new Date(currentDate);
            endDateTime.setHours(endHour, endMin, 0, 0);

            const sessionTitle = session
              ? (session.blueprint as SessionBlueprint).sessionTitle
              : `Week ${currentWeek} Session ${sessionsScheduledThisWeek + 1}`;

            const event = this.calendarEventRepo.create({
              curriculumPlanId: plan.id,
              sessionId: session?.id || null,
              title: sessionTitle,
              description: `${weekData.theme} - ${weekData.topics.join(', ')}`,
              eventType: CalendarEventType.SESSION,
              startDateTime,
              endDateTime,
              weekNumber: currentWeek,
              synced: false,
            });

            events.push(event);
            sessionsScheduledThisWeek++;
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);

        // Check if we've moved to the next week
        if (currentDate.getDay() === startDate.getDay()) {
          if (sessionsScheduledThisWeek < weekData.sessionCount) {
            this.logger.warn(
              `Could not schedule all sessions for week ${currentWeek}. Scheduled: ${sessionsScheduledThisWeek}/${weekData.sessionCount}`,
            );
          }
          break;
        }
      }

      // Add assessment events
      if (weekData.hasAssessment && weekData.assessmentType) {
        const assessmentDate = new Date(currentDate);
        assessmentDate.setDate(assessmentDate.getDate() - 1); // Day before week ends

        const eventType = this.mapAssessmentType(weekData.assessmentType);

        const assessmentEvent = this.calendarEventRepo.create({
          curriculumPlanId: plan.id,
          title: `${weekData.assessmentType}: ${weekData.assessmentDetails || weekData.theme}`,
          description: weekData.assessmentDetails,
          eventType,
          startDateTime: assessmentDate,
          endDateTime: assessmentDate,
          weekNumber: currentWeek,
          synced: false,
        });

        events.push(assessmentEvent);
      }

      currentWeek++;
    }

    const savedEvents = await this.calendarEventRepo.save(events);

    return {
      eventsCreated: savedEvents.length,
      events: savedEvents,
    };
  }

  private mapAssessmentType(assessmentType: string): CalendarEventType {
    const mapping: Record<string, CalendarEventType> = {
      quiz: CalendarEventType.QUIZ,
      assignment: CalendarEventType.ASSIGNMENT_DUE,
      project: CalendarEventType.PROJECT_DUE,
      midterm: CalendarEventType.MIDTERM,
      final: CalendarEventType.FINAL_EXAM,
    };
    return mapping[assessmentType.toLowerCase()] || CalendarEventType.SESSION;
  }

  async getCalendarEvents(
    planId: number,
    teacherId: number,
  ): Promise<CurriculumCalendarEvent[]> {
    const plan = await this.getPlanById(planId, teacherId);
    return this.calendarEventRepo.find({
      where: { curriculumPlanId: plan.id },
      order: { startDateTime: 'ASC' },
    });
  }

  // Regeneration
  async regenerate(
    teacherId: number,
    dto: RegenerateDto,
  ): Promise<{ success: boolean; data: any }> {
    switch (dto.type) {
      case RegenerateType.MACRO: {
        const plan = await this.getPlanById(dto.targetId, teacherId);
        const result = await this.generateMacroPlan(teacherId, {
          courseId: plan.courseId,
        });
        return { success: true, data: result };
      }

      case RegenerateType.SESSION: {
        const session = await this.getSessionById(dto.targetId, teacherId);
        const result = await this.generateSession(teacherId, {
          curriculumPlanId: session.curriculumPlanId,
          weekNumber: session.weekNumber,
          sessionNumber: session.sessionNumber,
        });
        return { success: true, data: result };
      }

      case RegenerateType.TOOLKIT: {
        const result = await this.generateToolkit(teacherId, {
          sessionId: dto.targetId,
        });
        return { success: true, data: result };
      }

      default:
        throw new BadRequestException('Invalid regeneration type');
    }
  }

  // Adaptation
  async createAdaptation(
    teacherId: number,
    dto: AdaptDto,
  ): Promise<CurriculumAdaptation> {
    const plan = await this.getPlanById(dto.curriculumPlanId, teacherId);
    const course = plan.course;
    const macroplan = plan.macroplan as MacroPlan;

    const { suggestion, reasoning } = await this.aiService.generateAdaptationSuggestion(
      course,
      macroplan,
      dto.triggerType,
      dto.triggerData,
    );

    const adaptation = this.adaptationRepo.create({
      curriculumPlanId: plan.id,
      triggerType: dto.triggerType,
      triggerData: dto.triggerData,
      suggestion,
      reasoning,
      status: AdaptationStatus.PENDING,
    });

    return this.adaptationRepo.save(adaptation);
  }

  async respondToAdaptation(
    teacherId: number,
    dto: RespondToAdaptationDto,
  ): Promise<CurriculumAdaptation> {
    const adaptation = await this.adaptationRepo.findOne({
      where: { id: dto.adaptationId },
      relations: ['curriculumPlan', 'curriculumPlan.course'],
    });

    if (!adaptation) {
      throw new NotFoundException('Adaptation not found');
    }

    if (adaptation.curriculumPlan.course.teacherId !== teacherId) {
      throw new NotFoundException('Adaptation not found');
    }

    adaptation.status = dto.response as AdaptationStatus;
    adaptation.respondedAt = new Date();

    // If accepted, apply the changes to the plan
    if (dto.response === 'ACCEPTED' || dto.response === 'PARTIALLY_ACCEPTED') {
      // Store customizations if provided
      if (dto.customizations) {
        adaptation.suggestion = {
          ...adaptation.suggestion,
          appliedCustomizations: dto.customizations,
        };
      }
      // The actual plan updates would be applied here based on the suggestion
    }

    return this.adaptationRepo.save(adaptation);
  }

  async getAdaptationsByPlan(
    planId: number,
    teacherId: number,
  ): Promise<CurriculumAdaptation[]> {
    const plan = await this.getPlanById(planId, teacherId);
    return this.adaptationRepo.find({
      where: { curriculumPlanId: plan.id },
      order: { createdAt: 'DESC' },
    });
  }

  // Session Status Updates
  async updateSessionStatus(
    sessionId: number,
    teacherId: number,
    status: SessionStatus,
    notes?: string,
  ): Promise<CurriculumSession> {
    const session = await this.getSessionById(sessionId, teacherId);
    session.status = status;

    if (status === SessionStatus.TAUGHT) {
      session.taughtAt = new Date();
    }

    if (notes) {
      session.teacherNotes = notes;
    }

    return this.sessionRepo.save(session);
  }

  // Plan Status Updates
  async updatePlanStatus(
    planId: number,
    teacherId: number,
    status: PlanStatus,
  ): Promise<CurriculumPlan> {
    const plan = await this.getPlanById(planId, teacherId);
    plan.status = status;
    return this.planRepo.save(plan);
  }

  // ==================== Session Resources ====================

  /**
   * Get resources for a session
   */
  async getSessionResources(
    sessionId: number,
    teacherId: number,
  ): Promise<CurriculumSessionResource[]> {
    const session = await this.getSessionById(sessionId, teacherId);
    return this.resourceRepo.find({
      where: { sessionId: session.id, isHidden: 0 as any },
      order: { relevanceScore: 'DESC' },
    });
  }

  /**
   * Generate resources for a session using AI + web search
   */
  async generateSessionResources(
    sessionId: number,
    teacherId: number,
  ): Promise<CurriculumSessionResource[]> {
    // Check if Google APIs are configured
    const apiConfig = this.resourceSearchService.isConfigured();
    if (!apiConfig.youtube && !apiConfig.webSearch) {
      throw new BadRequestException(
        'Resource search is not configured. Please add GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID to your .env file.',
      );
    }

    const session = await this.getSessionById(sessionId, teacherId);
    const course = session.curriculumPlan.course;
    const blueprint = session.blueprint as SessionBlueprint;

    this.logger.log(`Generating resources for session: ${session.id}`);

    // 1. Generate search queries using AI
    const queries = await this.aiService.generateResourceSearchQueries(blueprint, course);
    this.logger.log(`Generated search queries: ${JSON.stringify(queries)}`);

    // 2. Execute searches in parallel
    const [youtubeResults, articleResults, pdfResults, presentationResults, interactiveResults] =
      await Promise.all([
        this.searchYouTubeVideos(queries.youtubeQueries),
        this.searchArticles(queries.articleQueries),
        this.searchPDFs(queries.pdfQueries),
        this.searchPresentations(queries.presentationQueries || queries.pdfQueries),
        this.searchInteractiveTools(queries.interactiveQueries),
      ]);

    // 3. Combine all results with type tags
    const allResources = [
      ...youtubeResults.map((r) => ({ ...r, type: 'YOUTUBE_VIDEO' })),
      ...articleResults.map((r) => ({ ...r, type: 'ARTICLE' })),
      ...pdfResults.map((r) => ({ ...r, type: 'PDF' })),
      ...presentationResults.map((r) => ({ ...r, type: 'PRESENTATION' })),
      ...interactiveResults.map((r) => ({ ...r, type: 'INTERACTIVE_TOOL' })),
    ];

    this.logger.log(`Found ${allResources.length} raw resources`);

    if (allResources.length === 0) {
      return [];
    }

    // 4. Use AI to filter and rank
    const rankedResources = await this.aiService.filterAndRankResources(
      allResources,
      blueprint,
      course,
    );

    this.logger.log(`Ranked to ${rankedResources.length} relevant resources`);

    // 5. Save to database
    const resourceEntities = rankedResources.map((r) =>
      this.resourceRepo.create({
        sessionId: session.id,
        resourceType: r.resourceType as ResourceType,
        title: r.title,
        description: r.description,
        url: r.url,
        thumbnailUrl: r.thumbnailUrl,
        sourceName: r.sourceName,
        duration: r.duration,
        relevanceScore: r.relevanceScore,
        aiReasoning: r.aiReasoning,
        sectionType: r.sectionType as SectionType,
        isFree: r.isFree,
        fetchedAt: new Date(),
      }),
    );

    return this.resourceRepo.save(resourceEntities);
  }

  /**
   * Refresh resources for a session (delete old, generate new)
   */
  async refreshSessionResources(
    sessionId: number,
    teacherId: number,
  ): Promise<CurriculumSessionResource[]> {
    const session = await this.getSessionById(sessionId, teacherId);

    // Delete existing resources
    await this.resourceRepo.delete({ sessionId: session.id });

    // Re-generate
    return this.generateSessionResources(sessionId, teacherId);
  }

  /**
   * Update a resource (rating, notes, hidden)
   */
  async updateResource(
    resourceId: number,
    teacherId: number,
    dto: UpdateResourceDto,
  ): Promise<CurriculumSessionResource> {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId },
      relations: ['session', 'session.curriculumPlan', 'session.curriculumPlan.course'],
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.session.curriculumPlan.course.teacherId !== teacherId) {
      throw new NotFoundException('Resource not found');
    }

    if (dto.teacherRating !== undefined) {
      resource.teacherRating = dto.teacherRating;
    }
    if (dto.teacherNotes !== undefined) {
      resource.teacherNotes = dto.teacherNotes;
    }
    if (dto.isHidden !== undefined) {
      resource.isHidden = dto.isHidden;
    }

    return this.resourceRepo.save(resource);
  }

  // Helper methods for resource searching
  private async searchYouTubeVideos(queries: string[]) {
    const results = [];
    for (const query of queries.slice(0, 2)) {
      const videos = await this.resourceSearchService.searchYouTube(query, {
        maxResults: 3,
      });
      results.push(...videos);
    }
    return results;
  }

  private async searchArticles(queries: string[]) {
    const results = [];
    for (const query of queries.slice(0, 2)) {
      const articles = await this.resourceSearchService.searchArticles(query, 3);
      results.push(...articles);
    }
    return results;
  }

  private async searchPDFs(queries: string[]) {
    const results = [];
    for (const query of queries.slice(0, 2)) {
      const pdfs = await this.resourceSearchService.searchPDFs(query, 2);
      results.push(...pdfs);
    }
    return results;
  }

  private async searchPresentations(queries: string[]) {
    const results = [];
    for (const query of queries.slice(0, 2)) {
      const presentations = await this.resourceSearchService.searchPresentations(query, 3);
      results.push(...presentations);
    }
    return results;
  }

  private async searchInteractiveTools(queries: string[]) {
    const results = [];
    for (const query of queries.slice(0, 2)) {
      const tools = await this.resourceSearchService.searchInteractiveTools(query, 2);
      results.push(...tools);
    }
    return results;
  }
}
