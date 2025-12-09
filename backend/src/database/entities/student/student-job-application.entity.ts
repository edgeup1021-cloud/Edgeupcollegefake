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
import { ApplicationStatus } from '../../../common/enums/status.enum';

@Entity('student_job_applications')
export class StudentJobApplication {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  companyName: string;

  @Column({ name: 'company_logo', type: 'varchar', length: 1024, nullable: true })
  companyLogo: string | null;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ name: 'application_date', type: 'date' })
  applicationDate: Date;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @Column({ name: 'job_type', type: 'varchar', length: 100, nullable: true })
  jobType: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  salary: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'job_url', type: 'varchar', length: 1024, nullable: true })
  jobUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'interview_date', type: 'datetime', nullable: true })
  interviewDate: Date | null;

  @Column({ name: 'offer_deadline', type: 'date', nullable: true })
  offerDeadline: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
