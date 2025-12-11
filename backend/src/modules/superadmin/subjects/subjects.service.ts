import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
import { BulkUploadResponseDto } from './dto/bulk-upload.dto';
import * as XLSX from 'xlsx';

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

  // ========== BULK UPLOAD ==========

  async bulkUploadFromExcel(
    courseId: number,
    fileBuffer: Buffer,
  ): Promise<BulkUploadResponseDto> {
    const response: BulkUploadResponseDto = {
      success: false,
      totalRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      created: {
        subjects: 0,
        topics: 0,
        subtopics: 0,
      },
    };

    try {
      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      response.totalRows = jsonData.length;

      if (jsonData.length === 0) {
        throw new BadRequestException('Excel file is empty');
      }

      // Track created entities to avoid duplicates
      const subjectCache = new Map<string, Subject>();
      const topicCache = new Map<string, Topic>();

      // Process each row
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNumber = i + 2; // Excel row number (starting from 2, accounting for header)

        try {
          // Validate required fields
          if (!row['Subject Name'] || !row['Subject Code']) {
            response.errors.push({
              row: rowNumber,
              error: 'Missing Subject Name or Subject Code',
            });
            response.errorCount++;
            continue;
          }

          if (!row['Topic Name'] || !row['Topic Code']) {
            response.errors.push({
              row: rowNumber,
              error: 'Missing Topic Name or Topic Code',
            });
            response.errorCount++;
            continue;
          }

          if (!row['Subtopic Name'] || !row['Subtopic Code']) {
            response.errors.push({
              row: rowNumber,
              error: 'Missing Subtopic Name or Subtopic Code',
            });
            response.errorCount++;
            continue;
          }

          // Get or create Subject
          let subject: Subject;
          const subjectKey = row['Subject Code'].toString().trim();

          if (subjectCache.has(subjectKey)) {
            subject = subjectCache.get(subjectKey)!;
          } else {
            // Check if subject already exists in database
            const existingSubject = await this.subjectRepository.findOne({
              where: { code: subjectKey, courseId },
            });

            if (existingSubject) {
              subject = existingSubject;
            } else {
              // Create new subject
              const newSubject = this.subjectRepository.create({
                name: row['Subject Name'].toString().trim(),
                code: subjectKey,
                description: row['Subject Description']?.toString().trim() || null,
                courseId,
              });
              subject = await this.subjectRepository.save(newSubject);
              response.created.subjects++;
            }
            subjectCache.set(subjectKey, subject);
          }

          // Get or create Topic
          let topic: Topic;
          const topicKey = `${subject.id}-${row['Topic Code'].toString().trim()}`;

          if (topicCache.has(topicKey)) {
            topic = topicCache.get(topicKey)!;
          } else {
            // Check if topic already exists in database
            const existingTopic = await this.topicRepository.findOne({
              where: {
                code: row['Topic Code'].toString().trim(),
                subjectId: subject.id,
              },
            });

            if (existingTopic) {
              topic = existingTopic;
            } else {
              // Create new topic
              const newTopic = this.topicRepository.create({
                name: row['Topic Name'].toString().trim(),
                code: row['Topic Code'].toString().trim(),
                description: row['Topic Description']?.toString().trim() || null,
                subjectId: subject.id,
              });
              topic = await this.topicRepository.save(newTopic);
              response.created.topics++;
            }
            topicCache.set(topicKey, topic);
          }

          // Check if subtopic already exists
          const existingSubtopic = await this.subtopicRepository.findOne({
            where: {
              code: row['Subtopic Code'].toString().trim(),
              topicId: topic.id,
            },
          });

          if (!existingSubtopic) {
            // Create new subtopic
            const newSubtopic = this.subtopicRepository.create({
              name: row['Subtopic Name'].toString().trim(),
              code: row['Subtopic Code'].toString().trim(),
              description: row['Subtopic Description']?.toString().trim() || null,
              topicId: topic.id,
            });
            await this.subtopicRepository.save(newSubtopic);
            response.created.subtopics++;
          }

          response.successCount++;
        } catch (error) {
          response.errors.push({
            row: rowNumber,
            error: error.message || 'Unknown error',
          });
          response.errorCount++;
        }
      }

      response.success = response.errorCount === 0;
      return response;
    } catch (error) {
      throw new BadRequestException(
        `Failed to process Excel file: ${error.message}`,
      );
    }
  }
}
