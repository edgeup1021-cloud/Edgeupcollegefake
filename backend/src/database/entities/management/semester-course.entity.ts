import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subject } from './subject.entity';

@Entity('semester_courses')
export class SemesterCourse {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  program: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ name: 'subject_id', type: 'bigint', unsigned: true })
  subjectId: number;

  @Column({ name: 'is_mandatory', type: 'boolean', default: true })
  isMandatory: boolean;

  @Column({ name: 'is_elective', type: 'boolean', default: false })
  isElective: boolean;

  @Column({ name: 'academic_year', type: 'varchar', length: 20 })
  academicYear: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
