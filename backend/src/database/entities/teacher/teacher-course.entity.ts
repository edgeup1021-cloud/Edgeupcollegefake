import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teacher_courses')
export class TeacherCourse {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'department_id', type: 'bigint', unsigned: true, nullable: true })
  departmentId: number | null;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar', name: 'syllabus_link', length: 1024, nullable: true })
  syllabusLink: string | null;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column({ name: 'created_by_teacher_id', type: 'bigint', unsigned: true, nullable: true })
  createdByTeacherId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
