import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherUser } from './teacher-user.entity';

export enum LiveClassStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('live_classes')
export class LiveClass {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ length: 100 })
  subject: string;

  @Column({ name: 'meet_link', type: 'varchar', length: 1024 })
  meetLink: string;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: string;

  @Column({ name: 'scheduled_time', type: 'time' })
  scheduledTime: string;

  @Column({ type: 'int', unsigned: true })
  duration: number; // Duration in minutes

  @Column({ length: 100 })
  program: string;

  @Column({ length: 100 })
  batch: string;

  @Column({ length: 50 })
  section: string;

  @Column({
    type: 'enum',
    enum: LiveClassStatus,
    default: LiveClassStatus.SCHEDULED,
  })
  status: LiveClassStatus;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
