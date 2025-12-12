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
import { CurriculumSession } from './curriculum-session.entity';

export enum CalendarEventType {
  SESSION = 'SESSION',
  QUIZ = 'QUIZ',
  ASSIGNMENT_DUE = 'ASSIGNMENT_DUE',
  MIDTERM = 'MIDTERM',
  FINAL_EXAM = 'FINAL_EXAM',
  PROJECT_DUE = 'PROJECT_DUE',
  BUFFER = 'BUFFER',
  REVIEW_SESSION = 'REVIEW_SESSION',
}

@Entity('curriculum_calendar_events')
export class CurriculumCalendarEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'curriculum_plan_id', type: 'bigint', unsigned: true })
  curriculumPlanId: number;

  @Column({ name: 'session_id', type: 'bigint', unsigned: true, nullable: true })
  sessionId: number | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: CalendarEventType,
  })
  eventType: CalendarEventType;

  @Column({ name: 'start_date_time', type: 'datetime' })
  startDateTime: Date;

  @Column({ name: 'end_date_time', type: 'datetime' })
  endDateTime: Date;

  @Column({ type: 'boolean', default: false })
  synced: boolean;

  @Column({ name: 'external_event_id', type: 'varchar', length: 255, nullable: true })
  externalEventId: string | null;

  @Column({ name: 'week_number', type: 'int', nullable: true })
  weekNumber: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CurriculumPlan, (plan) => plan.calendarEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curriculum_plan_id' })
  curriculumPlan: CurriculumPlan;

  @OneToOne(() => CurriculumSession, (session) => session.calendarEvent)
  @JoinColumn({ name: 'session_id' })
  session: CurriculumSession | null;
}
