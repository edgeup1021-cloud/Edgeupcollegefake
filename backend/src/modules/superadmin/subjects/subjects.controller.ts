import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateSubtopicDto } from './dto/create-subtopic.dto';
import { UpdateSubtopicDto } from './dto/update-subtopic.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('curriculum/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  // ========== SUBJECTS ENDPOINTS ==========

  @Public()
  @Post()
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.createSubject(createSubjectDto);
  }

  @Public()
  @Get()
  findAllSubjects() {
    return this.subjectsService.findAllSubjects();
  }

  @Public()
  @Get(':id')
  findOneSubject(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOneSubject(id);
  }

  @Public()
  @Put(':id')
  updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.updateSubject(id, updateSubjectDto);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubject(@Param('id', ParseIntPipe) id: number) {
    await this.subjectsService.removeSubject(id);
  }

  // ========== TOPICS ENDPOINTS ==========

  @Public()
  @Post(':subjectId/topics')
  createTopic(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.subjectsService.createTopic(subjectId, createTopicDto);
  }

  @Public()
  @Get(':subjectId/topics/:topicId')
  findOneTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.subjectsService.findOneTopic(topicId);
  }

  @Public()
  @Put('topics/:topicId')
  updateTopic(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.subjectsService.updateTopic(topicId, updateTopicDto);
  }

  @Public()
  @Delete(':subjectId/topics/:topicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    await this.subjectsService.removeTopic(topicId);
  }

  // ========== SUBTOPICS ENDPOINTS ==========

  @Public()
  @Post('topics/:topicId/subtopics')
  createSubtopic(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() createSubtopicDto: CreateSubtopicDto,
  ) {
    return this.subjectsService.createSubtopic(topicId, createSubtopicDto);
  }

  @Public()
  @Put('subtopics/:subtopicId')
  updateSubtopic(
    @Param('subtopicId', ParseIntPipe) subtopicId: number,
    @Body() updateSubtopicDto: UpdateSubtopicDto,
  ) {
    return this.subjectsService.updateSubtopic(subtopicId, updateSubtopicDto);
  }

  @Public()
  @Delete('subtopics/:subtopicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubtopic(@Param('subtopicId', ParseIntPipe) subtopicId: number) {
    await this.subjectsService.removeSubtopic(subtopicId);
  }
}
