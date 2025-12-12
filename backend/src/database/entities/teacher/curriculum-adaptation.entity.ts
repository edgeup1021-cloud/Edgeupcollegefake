import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CurriculumPlan } from './curriculum-plan.entity';

export enum AdaptationTrigger {
  LOW_QUIZ_SCORES = 'LOW_QUIZ_SCORES',
  STUDENT_FEEDBACK = 'STUDENT_FEEDBACK',
  PACING_ISSUE = 'PACING_ISSUE',
  TEACHER_REQUEST = 'TEACHER_REQUEST',
  ATTENDANCE_DROP = 'ATTENDANCE_DROP',
}

export enum AdaptationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED',
}

@Entity('curriculum_adaptations')
export class CurriculumAdaptation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'curriculum_plan_id', type: 'bigint', unsigned: true })
  curriculumPlanId: number;

  @Column({
    name: 'trigger_type',
    type: 'enum',
    enum: AdaptationTrigger,
  })
  triggerType: AdaptationTrigger;

  @Column({ name: 'trigger_data', type: 'json' })
  triggerData: Record<string, any>;

  @Column({ type: 'json' })
  suggestion: Record<string, any>;

  @Column({ type: 'text' })
  reasoning: string;

  @Column({
    type: 'enum',
    enum: AdaptationStatus,
    default: AdaptationStatus.PENDING,
  })
  status: AdaptationStatus;

  @Column({ name: 'responded_at', type: 'datetime', nullable: true })
  respondedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CurriculumPlan, (plan) => plan.adaptations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curriculum_plan_id' })
  curriculumPlan: CurriculumPlan;
}
