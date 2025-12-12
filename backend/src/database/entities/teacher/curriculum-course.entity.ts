import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherUser } from './teacher-user.entity';
import { CurriculumPlan } from './curriculum-plan.entity';

export enum SessionType {
  LECTURE = 'LECTURE',
  LAB = 'LAB',
  TUTORIAL = 'TUTORIAL',
  SEMINAR = 'SEMINAR',
  HYBRID = 'HYBRID',
  WORKSHOP = 'WORKSHOP',
}

export enum ClassVibe {
  HIGH_ENGAGEMENT = 'HIGH_ENGAGEMENT',
  MIXED = 'MIXED',
  LOW_ENGAGEMENT = 'LOW_ENGAGEMENT',
  ADVANCED = 'ADVANCED',
  STRUGGLING = 'STRUGGLING',
}

export enum TeacherChallenge {
  STUDENTS_DISENGAGED = 'STUDENTS_DISENGAGED',
  TOO_MUCH_CONTENT = 'TOO_MUCH_CONTENT',
  WEAK_FUNDAMENTALS = 'WEAK_FUNDAMENTALS',
  MIXED_SKILL_LEVELS = 'MIXED_SKILL_LEVELS',
  TIME_MANAGEMENT = 'TIME_MANAGEMENT',
  ASSESSMENT_ALIGNMENT = 'ASSESSMENT_ALIGNMENT',
  PRACTICAL_APPLICATION = 'PRACTICAL_APPLICATION',
}

@Entity('curriculum_courses')
export class CurriculumCourse {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({ name: 'course_name', type: 'varchar', length: 255 })
  courseName: string;

  @Column({ name: 'course_code', type: 'varchar', length: 50, nullable: true })
  courseCode: string | null;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department: string | null;

  @Column({ name: 'total_weeks', type: 'int' })
  totalWeeks: number;

  @Column({ name: 'hours_per_week', type: 'float' })
  hoursPerWeek: number;

  @Column({ name: 'session_duration', type: 'int' })
  sessionDuration: number;

  @Column({ name: 'sessions_per_week', type: 'int' })
  sessionsPerWeek: number;

  @Column({
    name: 'session_type',
    type: 'enum',
    enum: SessionType,
    default: SessionType.LECTURE,
  })
  sessionType: SessionType;

  @Column({ name: 'class_size', type: 'int' })
  classSize: number;

  @Column({
    name: 'class_vibe',
    type: 'enum',
    enum: ClassVibe,
    default: ClassVibe.MIXED,
  })
  classVibe: ClassVibe;

  @Column({ name: 'student_level', type: 'varchar', length: 50, default: 'Undergraduate' })
  studentLevel: string;

  @Column({ type: 'json' })
  outcomes: string[];

  @Column({
    name: 'primary_challenge',
    type: 'enum',
    enum: TeacherChallenge,
    nullable: true,
  })
  primaryChallenge: TeacherChallenge | null;

  @Column({ name: 'additional_notes', type: 'text', nullable: true })
  additionalNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @OneToMany(() => CurriculumPlan, (plan) => plan.course)
  curriculumPlans: CurriculumPlan[];
}
