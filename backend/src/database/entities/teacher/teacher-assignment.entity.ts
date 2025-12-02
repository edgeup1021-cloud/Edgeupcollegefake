import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherCourseOffering } from './teacher-course-offering.entity';
import { AssignmentType } from '../../../common/enums/status.enum';

@Entity('teacher_assignments')
export class TeacherAssignment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true })
  courseOfferingId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'due_date', type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'enum', enum: AssignmentType, default: AssignmentType.ASSIGNMENT })
  type: AssignmentType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  program: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  batch: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  section: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ name: 'max_marks', type: 'int', default: 100 })
  maxMarks: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority: string | null;

  @Column({ name: 'file_url', type: 'varchar', length: 1024, nullable: true })
  fileUrl: string | null;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  createdBy: number | null;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @ManyToOne(() => TeacherCourseOffering)
  @JoinColumn({ name: 'course_offering_id' })
  courseOffering: TeacherCourseOffering;
}
