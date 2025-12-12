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

export enum SemesterResultStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  PENDING = 'pending',
}

@Entity('student_semester_results')
export class StudentSemesterResult {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ type: 'varchar', length: 64 })
  semester: string;

  @Column({ name: 'academic_year', type: 'varchar', length: 32 })
  academicYear: string;

  @Column({ type: 'varchar', length: 64 })
  session: string;

  @Column({ name: 'total_credits', type: 'int', unsigned: true, default: 0 })
  totalCredits: number;

  @Column({ name: 'earned_credits', type: 'int', unsigned: true, default: 0 })
  earnedCredits: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  sgpa: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  cgpa: number | null;

  @Column({ name: 'result_date', type: 'date', nullable: true })
  resultDate: Date | null;

  @Column({
    type: 'enum',
    enum: SemesterResultStatus,
    default: SemesterResultStatus.DRAFT,
  })
  status: SemesterResultStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
