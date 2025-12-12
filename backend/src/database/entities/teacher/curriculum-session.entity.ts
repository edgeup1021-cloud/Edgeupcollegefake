import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CurriculumPlan } from './curriculum-plan.entity';
import { CurriculumCalendarEvent } from './curriculum-calendar-event.entity';

export enum SessionStatus {
  GENERATED = 'GENERATED',
  REVIEWED = 'REVIEWED',
  SCHEDULED = 'SCHEDULED',
  TAUGHT = 'TAUGHT',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

@Entity('curriculum_sessions')
export class CurriculumSession {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'curriculum_plan_id', type: 'bigint', unsigned: true })
  curriculumPlanId: number;

  @Column({ name: 'week_number', type: 'int' })
  weekNumber: number;

  @Column({ name: 'session_number', type: 'int' })
  sessionNumber: number;

  @Column({ type: 'json' })
  blueprint: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  toolkit: Record<string, any> | null;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.GENERATED,
  })
  status: SessionStatus;

  @Column({ name: 'teacher_overrides', type: 'json', nullable: true })
  teacherOverrides: Record<string, any> | null;

  @Column({ name: 'generated_at', type: 'datetime' })
  generatedAt: Date;

  @Column({ name: 'taught_at', type: 'datetime', nullable: true })
  taughtAt: Date | null;

  @Column({ name: 'student_feedback', type: 'json', nullable: true })
  studentFeedback: Record<string, any> | null;

  @Column({ name: 'checkpoint_results', type: 'json', nullable: true })
  checkpointResults: Record<string, any> | null;

  @Column({ name: 'teacher_notes', type: 'text', nullable: true })
  teacherNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CurriculumPlan, (plan) => plan.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curriculum_plan_id' })
  curriculumPlan: CurriculumPlan;

  @OneToOne(() => CurriculumCalendarEvent, (event) => event.session)
  calendarEvent: CurriculumCalendarEvent;
}
