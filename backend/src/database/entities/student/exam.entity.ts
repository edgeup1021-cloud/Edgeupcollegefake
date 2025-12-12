import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum ExamType {
  SESSIONAL = 'sessional',
  MID_TERM = 'mid_term',
  END_TERM = 'end_term',
  SUPPLEMENTARY = 'supplementary',
  REVALUATION = 'revaluation',
}

export enum ExamStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'exam_code', type: 'varchar', length: 50, unique: true })
  examCode: string;

  @Column({ name: 'exam_name', type: 'varchar', length: 200 })
  examName: string;

  @Column({
    name: 'exam_type',
    type: 'enum',
    enum: ExamType,
  })
  examType: ExamType;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 100 })
  program: string;

  @Column({ name: 'academic_year', type: 'varchar', length: 20 })
  academicYear: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  session: string | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.SCHEDULED,
  })
  status: ExamStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
