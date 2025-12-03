import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { TeacherLibraryResource } from '../teacher/teacher-library-resource.entity';

@Entity('student_library_access_logs')
export class StudentLibraryAccessLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'resource_id', type: 'bigint', unsigned: true })
  resourceId: number;

  @CreateDateColumn({ name: 'accessed_at' })
  accessedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @ManyToOne(() => TeacherLibraryResource)
  @JoinColumn({ name: 'resource_id' })
  resource: TeacherLibraryResource;
}
