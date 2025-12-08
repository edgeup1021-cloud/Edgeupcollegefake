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
import { ProgramSemester } from './program-semester.entity';
import { CourseType } from './course-type.entity';
import { CourseTopic } from './course-topic.entity';

@Entity('course_subjects')
export class CourseSubject {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'semester_id', type: 'bigint', unsigned: true })
  semesterId: number;

  @Column({ name: 'type_id', type: 'bigint', unsigned: true })
  typeId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ProgramSemester, (semester) => semester.subjects)
  @JoinColumn({ name: 'semester_id' })
  semester: ProgramSemester;

  @ManyToOne(() => CourseType, (type) => type.subjects)
  @JoinColumn({ name: 'type_id' })
  type: CourseType;

  @OneToMany(() => CourseTopic, (topic) => topic.subject)
  topics: CourseTopic[];
}
