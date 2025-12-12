import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StandaloneLesson } from './standalone-lesson.entity';

export enum LessonResourceType {
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  ARTICLE = 'ARTICLE',
  PDF = 'PDF',
  PRESENTATION = 'PRESENTATION',
  INTERACTIVE_TOOL = 'INTERACTIVE_TOOL',
  WEBSITE = 'WEBSITE',
}

export enum LessonSectionType {
  HOOK = 'hook',
  CORE = 'core',
  ACTIVITY = 'activity',
  APPLICATION = 'application',
  CHECKPOINT = 'checkpoint',
  CLOSE = 'close',
}

@Entity('lesson_resources')
export class LessonResource {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'lesson_id', type: 'bigint', unsigned: true })
  lessonId: number;

  @Column({ name: 'resource_type', type: 'enum', enum: LessonResourceType })
  resourceType: LessonResourceType;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 2048, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'source_name', type: 'varchar', length: 255, nullable: true })
  sourceName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  duration: string | null;

  @Column({ name: 'relevance_score', type: 'float', nullable: true })
  relevanceScore: number | null;

  @Column({ name: 'ai_reasoning', type: 'text', nullable: true })
  aiReasoning: string | null;

  @Column({ name: 'section_type', type: 'enum', enum: LessonSectionType, nullable: true })
  sectionType: LessonSectionType | null;

  @Column({ name: 'is_free', type: 'tinyint', default: 1 })
  isFree: boolean;

  @Column({ name: 'teacher_rating', type: 'tinyint', nullable: true })
  teacherRating: number | null;

  @Column({ name: 'teacher_notes', type: 'text', nullable: true })
  teacherNotes: string | null;

  @Column({ name: 'is_hidden', type: 'tinyint', default: 0 })
  isHidden: boolean;

  @Column({ name: 'fetched_at', type: 'datetime' })
  fetchedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StandaloneLesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: StandaloneLesson;
}
