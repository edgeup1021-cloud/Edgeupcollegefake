import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CurriculumSession } from './curriculum-session.entity';

export enum LessonStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  REVIEWED = 'REVIEWED',
  TAUGHT = 'TAUGHT',
}

export enum LessonClassVibe {
  HIGH_ENGAGEMENT = 'HIGH_ENGAGEMENT',
  MIXED = 'MIXED',
  LOW_ENGAGEMENT = 'LOW_ENGAGEMENT',
  ADVANCED = 'ADVANCED',
  STRUGGLING = 'STRUGGLING',
}

@Entity('standalone_lessons')
export class StandaloneLesson {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({ name: 'curriculum_session_id', type: 'bigint', unsigned: true, nullable: true })
  curriculumSessionId: number | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @Column({ name: 'grade_level', type: 'varchar', length: 50 })
  gradeLevel: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ name: 'class_size', type: 'int', nullable: true })
  classSize: number | null;

  @Column({
    name: 'class_vibe',
    type: 'enum',
    enum: LessonClassVibe,
    default: LessonClassVibe.MIXED,
    nullable: true,
  })
  classVibe: LessonClassVibe | null;

  @Column({ name: 'learning_objectives', type: 'json' })
  learningObjectives: string[];

  @Column({ type: 'json', nullable: true })
  prerequisites: string[] | null;

  @Column({ name: 'additional_notes', type: 'text', nullable: true })
  additionalNotes: string | null;

  @Column({ type: 'json', nullable: true })
  blueprint: Record<string, any> | null;

  @Column({ type: 'json', nullable: true })
  toolkit: Record<string, any> | null;

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  status: LessonStatus;

  @Column({ name: 'is_substitute_lesson', type: 'tinyint', default: 0 })
  isSubstituteLesson: boolean;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate: Date | null;

  @Column({ name: 'scheduled_time', type: 'time', nullable: true })
  scheduledTime: string | null;

  @Column({ name: 'generated_at', type: 'datetime', nullable: true })
  generatedAt: Date | null;

  @Column({ name: 'taught_at', type: 'datetime', nullable: true })
  taughtAt: Date | null;

  @Column({ name: 'teacher_notes', type: 'text', nullable: true })
  teacherNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => CurriculumSession, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'curriculum_session_id' })
  curriculumSession: CurriculumSession | null;
}
