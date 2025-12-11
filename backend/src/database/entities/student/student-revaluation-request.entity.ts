import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { StudentGrade } from './student-grade.entity';

export enum RevaluationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('student_revaluation_requests')
export class StudentRevaluationRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'grade_id', type: 'bigint', unsigned: true })
  gradeId: number;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  fee: number;

  @Column({
    type: 'enum',
    enum: RevaluationStatus,
    default: RevaluationStatus.PENDING,
  })
  status: RevaluationStatus;

  @CreateDateColumn({ name: 'requested_at' })
  requestedAt: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @Column({ name: 'old_marks', type: 'decimal', precision: 6, scale: 2, nullable: true })
  oldMarks: number | null;

  @Column({ name: 'new_marks', type: 'decimal', precision: 6, scale: 2, nullable: true })
  newMarks: number | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @ManyToOne(() => StudentGrade)
  @JoinColumn({ name: 'grade_id' })
  grade: StudentGrade;
}
