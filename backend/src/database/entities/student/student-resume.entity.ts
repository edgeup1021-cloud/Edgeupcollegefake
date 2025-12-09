import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';

@Entity('student_resumes')
export class StudentResume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @ManyToOne(() => StudentUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @Column({ type: 'json', nullable: false })
  resumeData: object;

  @Column({ type: 'varchar', length: 50, default: 'modern' })
  templateUsed: string;

  @Column({ type: 'boolean', default: false })
  isSubmitted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'float', nullable: true })
  atsScore: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
