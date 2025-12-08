import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentUser } from '../../../../database/entities/student/student-user.entity';

@Entity('interview_sessions')
export class InterviewSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @ManyToOne(() => StudentUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @Column({ type: 'json' })
  messages: object[];

  @Column({ type: 'varchar', length: 50 })
  status: 'active' | 'completed' | 'abandoned';

  @Column({ type: 'varchar', length: 50, nullable: true })
  selectedLanguage: string | null;

  @Column({ type: 'int', default: 0 })
  challengesAttempted: number;

  @Column({ type: 'int', default: 0 })
  challengesPassed: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
