import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { Subject } from '../management/subject.entity';

@Entity('exam_subjects')
export class ExamSubject {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'exam_id', type: 'bigint', unsigned: true })
  examId: number;

  @Column({ name: 'subject_id', type: 'bigint', unsigned: true })
  subjectId: number;

  @Column({ name: 'exam_date', type: 'date' })
  examDate: Date;

  @Column({ name: 'exam_time', type: 'time' })
  examTime: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 180 })
  durationMinutes: number;

  @Column({ name: 'max_marks', type: 'int' })
  maxMarks: number;

  @Column({ name: 'min_passing_marks', type: 'int' })
  minPassingMarks: number;

  @Column({ name: 'room_number', type: 'varchar', length: 50, nullable: true })
  roomNumber: string | null;

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
