import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Program } from './program.entity';
import { CourseSubject } from './course-subject.entity';

@Entity('program_semesters')
export class ProgramSemester {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'program_id', type: 'bigint', unsigned: true })
  programId: number;

  @Column({ name: 'semester_number', type: 'int' })
  semesterNumber: number;

  @Column({ name: 'academic_year', type: 'varchar', length: 20, nullable: true })
  academicYear: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Program, (program) => program.semesters)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @OneToMany(() => CourseSubject, (subject) => subject.semester)
  subjects: CourseSubject[];
}
