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
import { CurriculumCourse } from './curriculum-course.entity';
import { CurriculumSession } from './curriculum-session.entity';
import { CurriculumCalendarEvent } from './curriculum-calendar-event.entity';
import { CurriculumAdaptation } from './curriculum-adaptation.entity';

export enum PlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED',
}

@Entity('curriculum_plans')
export class CurriculumPlan {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'course_id', type: 'bigint', unsigned: true })
  courseId: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.DRAFT,
  })
  status: PlanStatus;

  @Column({ type: 'json' })
  macroplan: Record<string, any>;

  @Column({ name: 'teacher_overrides', type: 'json', nullable: true })
  teacherOverrides: Record<string, any> | null;

  @Column({ name: 'generated_at', type: 'datetime' })
  generatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CurriculumCourse, (course) => course.curriculumPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CurriculumCourse;

  @OneToMany(() => CurriculumSession, (session) => session.curriculumPlan)
  sessions: CurriculumSession[];

  @OneToMany(() => CurriculumCalendarEvent, (event) => event.curriculumPlan)
  calendarEvents: CurriculumCalendarEvent[];

  @OneToMany(() => CurriculumAdaptation, (adaptation) => adaptation.curriculumPlan)
  adaptations: CurriculumAdaptation[];
}
