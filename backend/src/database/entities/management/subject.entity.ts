import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from './department.entity';

export enum SubjectType {
  THEORY = 'theory',
  PRACTICAL = 'practical',
  LAB = 'lab',
  PROJECT = 'project',
}

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'subject_code', type: 'varchar', length: 20, unique: true })
  subjectCode: string;

  @Column({ name: 'subject_name', type: 'varchar', length: 200 })
  subjectName: string;

  @Column({ name: 'department_id', type: 'bigint', unsigned: true, nullable: true })
  departmentId: number | null;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column({
    name: 'subject_type',
    type: 'enum',
    enum: SubjectType,
    default: SubjectType.THEORY,
  })
  subjectType: SubjectType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
