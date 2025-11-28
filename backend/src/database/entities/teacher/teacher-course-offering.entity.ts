import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherCourse } from './teacher-course.entity';
import { TeacherUser } from './teacher-user.entity';
import { Semester } from '../../../common/enums/status.enum';

@Entity('teacher_course_offerings')
export class TeacherCourseOffering {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'course_id', type: 'bigint', unsigned: true })
  courseId: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({ type: 'enum', enum: Semester })
  semester: Semester;

  @Column({ type: 'smallint' })
  year: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  section: string | null;

  @Column({ name: 'campus_id', type: 'bigint', unsigned: true, nullable: true })
  campusId: number | null;

  @Column({ name: 'max_students', type: 'int', default: 0 })
  maxStudents: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherCourse)
  @JoinColumn({ name: 'course_id' })
  course: TeacherCourse;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;
}
