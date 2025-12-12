import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StandaloneLesson,
  LessonStatus,
  LessonClassVibe,
} from '../../database/entities/teacher/standalone-lesson.entity';
import {
  LessonResource,
  LessonResourceType,
  LessonSectionType,
} from '../../database/entities/teacher/lesson-resource.entity';
import { CurriculumSession } from '../../database/entities/teacher/curriculum-session.entity';
import { CurriculumAIService, SessionBlueprint, EngagementToolkit } from '../curriculum/curriculum-ai.service';
import { ResourceSearchService } from '../curriculum/resource-search.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import {
  UpdateLessonDto,
  UpdateLessonResourceDto,
  ImportFromCurriculumDto,
} from './dto/update-lesson.dto';

@Injectable()
export class LessonPlannerService {
  private readonly logger = new Logger(LessonPlannerService.name);

  constructor(
    @InjectRepository(StandaloneLesson)
    private lessonRepo: Repository<StandaloneLesson>,
    @InjectRepository(LessonResource)
    private resourceRepo: Repository<LessonResource>,
    @InjectRepository(CurriculumSession)
    private curriculumSessionRepo: Repository<CurriculumSession>,
    private aiService: CurriculumAIService,
    private resourceSearchService: ResourceSearchService,
  ) {}

  // ==================== Lesson CRUD ====================

  async createLesson(
    teacherId: number,
    dto: CreateLessonDto,
  ): Promise<StandaloneLesson> {
    const lesson = this.lessonRepo.create({
      teacherId,
      title: dto.title,
      subject: dto.subject,
      topic: dto.topic,
      gradeLevel: dto.gradeLevel,
      duration: dto.duration,
      classSize: dto.classSize || null,
      classVibe: dto.classVibe || LessonClassVibe.MIXED,
      learningObjectives: dto.learningObjectives,
      prerequisites: dto.prerequisites || null,
      additionalNotes: dto.additionalNotes || null,
      isSubstituteLesson: dto.isSubstituteLesson || false,
      scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      scheduledTime: dto.scheduledTime || null,
      status: LessonStatus.DRAFT,
    });

    return this.lessonRepo.save(lesson);
  }

  async getLessonsByTeacher(teacherId: number): Promise<StandaloneLesson[]> {
    return this.lessonRepo.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  async getLessonById(
    lessonId: number,
    teacherId: number,
  ): Promise<StandaloneLesson> {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId, teacherId },
      relations: ['curriculumSession'],
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async updateLesson(
    lessonId: number,
    teacherId: number,
    dto: UpdateLessonDto,
  ): Promise<StandaloneLesson> {
    const lesson = await this.getLessonById(lessonId, teacherId);

    // Update fields
    if (dto.title !== undefined) lesson.title = dto.title;
    if (dto.subject !== undefined) lesson.subject = dto.subject;
    if (dto.topic !== undefined) lesson.topic = dto.topic;
    if (dto.gradeLevel !== undefined) lesson.gradeLevel = dto.gradeLevel;
    if (dto.duration !== undefined) lesson.duration = dto.duration;
    if (dto.classSize !== undefined) lesson.classSize = dto.classSize;
    if (dto.classVibe !== undefined) lesson.classVibe = dto.classVibe;
    if (dto.learningObjectives !== undefined) lesson.learningObjectives = dto.learningObjectives;
    if (dto.prerequisites !== undefined) lesson.prerequisites = dto.prerequisites;
    if (dto.additionalNotes !== undefined) lesson.additionalNotes = dto.additionalNotes;
    if (dto.status !== undefined) lesson.status = dto.status;
    if (dto.isSubstituteLesson !== undefined) lesson.isSubstituteLesson = dto.isSubstituteLesson;
    if (dto.scheduledDate !== undefined) lesson.scheduledDate = dto.scheduledDate ? new Date(dto.scheduledDate) : null;
    if (dto.scheduledTime !== undefined) lesson.scheduledTime = dto.scheduledTime;
    if (dto.teacherNotes !== undefined) lesson.teacherNotes = dto.teacherNotes;

    if (dto.status === LessonStatus.TAUGHT) {
      lesson.taughtAt = new Date();
    }

    return this.lessonRepo.save(lesson);
  }

  async deleteLesson(lessonId: number, teacherId: number): Promise<void> {
    const lesson = await this.getLessonById(lessonId, teacherId);
    await this.lessonRepo.remove(lesson);
  }

  // ==================== Blueprint Generation ====================

  async generateBlueprint(
    lessonId: number,
    teacherId: number,
  ): Promise<{ lessonId: number; blueprint: SessionBlueprint }> {
    const lesson = await this.getLessonById(lessonId, teacherId);

    this.logger.log(`Generating blueprint for lesson: ${lesson.id} - ${lesson.title}`);

    // Build a pseudo-course and week object for the AI service
    const pseudoCourse = {
      courseName: lesson.subject,
      subject: lesson.subject,
      studentLevel: lesson.gradeLevel,
      classSize: lesson.classSize || 30,
      classVibe: lesson.classVibe || LessonClassVibe.MIXED,
      sessionDuration: lesson.duration,
      outcomes: lesson.learningObjectives,
    };

    const pseudoWeek = {
      weekNumber: 1,
      theme: lesson.topic,
      topics: [lesson.topic],
      learningObjectives: lesson.learningObjectives,
      difficultyLevel: 'medium' as const,
      sessionCount: 1,
    };

    // Wrap in a MacroPlan-like structure (generateSessionBlueprint expects macroPlan.weeks array)
    const pseudoMacroPlan = {
      weeks: [pseudoWeek],
    };

    // Generate using the existing AI service
    // Parameters: course, macroPlan, weekNumber, sessionNumber
    const blueprint = await this.aiService.generateSessionBlueprint(
      pseudoCourse as any,
      pseudoMacroPlan as any,
      1, // weekNumber
      1, // sessionNumber
    );

    // Update lesson with blueprint
    lesson.blueprint = blueprint;
    lesson.status = LessonStatus.GENERATED;
    lesson.generatedAt = new Date();
    await this.lessonRepo.save(lesson);

    return { lessonId: lesson.id, blueprint };
  }

  // ==================== Toolkit Generation ====================

  async generateToolkit(
    lessonId: number,
    teacherId: number,
  ): Promise<{ lessonId: number; toolkit: EngagementToolkit }> {
    const lesson = await this.getLessonById(lessonId, teacherId);

    if (!lesson.blueprint) {
      throw new BadRequestException('Generate blueprint first before generating toolkit');
    }

    this.logger.log(`Generating toolkit for lesson: ${lesson.id}`);

    const pseudoCourse = {
      courseName: lesson.subject,
      subject: lesson.subject,
      studentLevel: lesson.gradeLevel,
      classSize: lesson.classSize || 30,
      classVibe: lesson.classVibe || LessonClassVibe.MIXED,
    };

    const toolkit = await this.aiService.generateEngagementToolkit(
      pseudoCourse as any,
      lesson.blueprint as SessionBlueprint,
    );

    // Update lesson with toolkit
    lesson.toolkit = toolkit;
    await this.lessonRepo.save(lesson);

    return { lessonId: lesson.id, toolkit };
  }

  // ==================== Resource Generation ====================

  async generateResources(
    lessonId: number,
    teacherId: number,
  ): Promise<LessonResource[]> {
    const lesson = await this.getLessonById(lessonId, teacherId);

    if (!lesson.blueprint) {
      throw new BadRequestException('Generate blueprint first before generating resources');
    }

    // Check if Google APIs are configured
    const apiConfig = this.resourceSearchService.isConfigured();
    if (!apiConfig.youtube && !apiConfig.webSearch) {
      throw new BadRequestException(
        'Resource search is not configured. Please add GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID to your .env file.',
      );
    }

    this.logger.log(`Generating resources for lesson: ${lesson.id}`);

    const blueprint = lesson.blueprint as SessionBlueprint;
    const pseudoCourse = {
      courseName: lesson.subject,
      subject: lesson.subject,
      studentLevel: lesson.gradeLevel,
    };

    // Generate search queries using AI
    const queries = await this.aiService.generateResourceSearchQueries(
      blueprint,
      pseudoCourse as any,
    );
    this.logger.log(`Generated search queries: ${JSON.stringify(queries)}`);

    // Execute searches in parallel
    const [youtubeResults, articleResults, pdfResults, presentationResults, interactiveResults] =
      await Promise.all([
        this.searchYouTubeVideos(queries.youtubeQueries),
        this.searchArticles(queries.articleQueries),
        this.searchPDFs(queries.pdfQueries),
        this.searchPresentations((queries as any).presentationQueries || queries.pdfQueries),
        this.searchInteractiveTools(queries.interactiveQueries),
      ]);

    // Combine all results with type tags
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

    // Use AI to filter and rank
    const rankedResources = await this.aiService.filterAndRankResources(
      allResources,
      blueprint,
      pseudoCourse as any,
    );

    this.logger.log(`Ranked to ${rankedResources.length} relevant resources`);

    // Save to database
    const resourceEntities = rankedResources.map((r) =>
      this.resourceRepo.create({
        lessonId: lesson.id,
        resourceType: r.resourceType as LessonResourceType,
        title: r.title,
        description: r.description,
        url: r.url,
        thumbnailUrl: r.thumbnailUrl,
        sourceName: r.sourceName,
        duration: r.duration,
        relevanceScore: r.relevanceScore,
        aiReasoning: r.aiReasoning,
        sectionType: r.sectionType as LessonSectionType,
        isFree: r.isFree,
        fetchedAt: new Date(),
      }),
    );

    return this.resourceRepo.save(resourceEntities);
  }

  async getResources(lessonId: number, teacherId: number): Promise<LessonResource[]> {
    const lesson = await this.getLessonById(lessonId, teacherId);
    return this.resourceRepo.find({
      where: { lessonId: lesson.id, isHidden: 0 as any },
      order: { relevanceScore: 'DESC' },
    });
  }

  async refreshResources(
    lessonId: number,
    teacherId: number,
  ): Promise<LessonResource[]> {
    const lesson = await this.getLessonById(lessonId, teacherId);

    // Delete existing resources
    await this.resourceRepo.delete({ lessonId: lesson.id });

    // Re-generate
    return this.generateResources(lessonId, teacherId);
  }

  async updateResource(
    resourceId: number,
    teacherId: number,
    dto: UpdateLessonResourceDto,
  ): Promise<LessonResource> {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId },
      relations: ['lesson'],
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.lesson.teacherId !== teacherId) {
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

  // ==================== Import from Curriculum ====================

  async getAvailableCurriculumSessions(teacherId: number): Promise<CurriculumSession[]> {
    // Use query builder for nested relation filtering
    return this.curriculumSessionRepo
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.curriculumPlan', 'plan')
      .leftJoinAndSelect('plan.course', 'course')
      .where('course.teacherId = :teacherId', { teacherId })
      .orderBy('session.createdAt', 'DESC')
      .getMany();
  }

  async importFromCurriculum(
    teacherId: number,
    dto: ImportFromCurriculumDto,
  ): Promise<StandaloneLesson> {
    // Fetch the curriculum session
    const session = await this.curriculumSessionRepo.findOne({
      where: { id: dto.curriculumSessionId },
      relations: ['curriculumPlan', 'curriculumPlan.course'],
    });

    if (!session) {
      throw new NotFoundException('Curriculum session not found');
    }

    if (session.curriculumPlan.course.teacherId !== teacherId) {
      throw new NotFoundException('Curriculum session not found');
    }

    const blueprint = session.blueprint as SessionBlueprint;
    const course = session.curriculumPlan.course;

    // Create standalone lesson with copied data
    const lesson = this.lessonRepo.create({
      teacherId,
      curriculumSessionId: session.id,
      title: blueprint?.sessionTitle || `Week ${session.weekNumber} Session ${session.sessionNumber}`,
      subject: course.subject,
      topic: blueprint?.keyConceptsCovered?.join(', ') || course.courseName,
      gradeLevel: course.studentLevel,
      duration: blueprint?.duration || course.sessionDuration,
      classSize: course.classSize,
      classVibe: course.classVibe as unknown as LessonClassVibe,
      learningObjectives: course.outcomes || [],
      blueprint: session.blueprint,
      toolkit: session.toolkit,
      status: session.blueprint ? LessonStatus.GENERATED : LessonStatus.DRAFT,
      isSubstituteLesson: dto.isSubstituteLesson || false,
      scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      scheduledTime: dto.scheduledTime || null,
      generatedAt: session.generatedAt,
    });

    return this.lessonRepo.save(lesson);
  }

  // ==================== Helper Methods ====================

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
