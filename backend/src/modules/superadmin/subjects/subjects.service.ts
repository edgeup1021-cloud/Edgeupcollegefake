import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, Topic, Subtopic } from '../../../database/entities/superadmin';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateSubtopicDto } from './dto/create-subtopic.dto';
import { UpdateSubtopicDto } from './dto/update-subtopic.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject, 'superadmin')
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Topic, 'superadmin')
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Subtopic, 'superadmin')
    private readonly subtopicRepository: Repository<Subtopic>,
  ) {}

  // ========== SUBJECTS ==========

  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    // Check if code already exists
    const existingSubject = await this.subjectRepository.findOne({
      where: { code: createSubjectDto.code },
    });
    if (existingSubject) {
      throw new ConflictException(
        `Subject with code ${createSubjectDto.code} already exists`,
      );
    }

    const subject = this.subjectRepository.create(createSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async findAllSubjects(): Promise<Subject[]> {
    return await this.subjectRepository.find({
      relations: ['topics', 'topics.subtopics'],
      order: { name: 'ASC' },
    });
  }

  async findSubjectsByCourse(courseId: number): Promise<Subject[]> {
    return await this.subjectRepository.find({
      where: { courseId },
      relations: ['topics', 'topics.subtopics'],
      order: { name: 'ASC' },
    });
  }

  async findOneSubject(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['topics', 'topics.subtopics'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async updateSubject(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOneSubject(id);

    // Check code uniqueness if being updated
    if (updateSubjectDto.code && updateSubjectDto.code !== subject.code) {
      const existingSubject = await this.subjectRepository.findOne({
        where: { code: updateSubjectDto.code },
      });
      if (existingSubject) {
        throw new ConflictException(
          `Subject with code ${updateSubjectDto.code} already exists`,
        );
      }
    }

    Object.assign(subject, updateSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async removeSubject(id: number): Promise<void> {
    const subject = await this.findOneSubject(id);
    await this.subjectRepository.remove(subject);
  }

  // ========== TOPICS ==========

  async createTopic(
    subjectId: number,
    createTopicDto: CreateTopicDto,
  ): Promise<Topic> {
    // Verify subject exists
    await this.findOneSubject(subjectId);

    const topic = this.topicRepository.create({
      ...createTopicDto,
      subjectId,
    });
    return await this.topicRepository.save(topic);
  }

  async findOneTopic(topicId: number): Promise<Topic> {
    const topic = await this.topicRepository.findOne({
      where: { id: topicId },
      relations: ['subtopics'],
    });
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }
    return topic;
  }

  async updateTopic(
    topicId: number,
    updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    const topic = await this.findOneTopic(topicId);
    Object.assign(topic, updateTopicDto);
    return await this.topicRepository.save(topic);
  }

  async removeTopic(topicId: number): Promise<void> {
    const topic = await this.findOneTopic(topicId);
    await this.topicRepository.remove(topic);
  }

  // ========== SUBTOPICS ==========

  async createSubtopic(
    topicId: number,
    createSubtopicDto: CreateSubtopicDto,
  ): Promise<Subtopic> {
    // Verify topic exists
    await this.findOneTopic(topicId);

    const subtopic = this.subtopicRepository.create({
      ...createSubtopicDto,
      topicId,
    });
    return await this.subtopicRepository.save(subtopic);
  }

  async findOneSubtopic(subtopicId: number): Promise<Subtopic> {
    const subtopic = await this.subtopicRepository.findOne({
      where: { id: subtopicId },
    });
    if (!subtopic) {
      throw new NotFoundException(`Subtopic with ID ${subtopicId} not found`);
    }
    return subtopic;
  }

  async updateSubtopic(
    subtopicId: number,
    updateSubtopicDto: UpdateSubtopicDto,
  ): Promise<Subtopic> {
    const subtopic = await this.findOneSubtopic(subtopicId);
    Object.assign(subtopic, updateSubtopicDto);
    return await this.subtopicRepository.save(subtopic);
  }

  async removeSubtopic(subtopicId: number): Promise<void> {
    const subtopic = await this.findOneSubtopic(subtopicId);
    await this.subtopicRepository.remove(subtopic);
  }
}
