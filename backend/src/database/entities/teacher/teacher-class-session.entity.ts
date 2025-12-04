import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherCourseOffering } from './teacher-course-offering.entity';
import { SessionType } from '../../../common/enums/status.enum';

@Entity('teacher_class_sessions')
export class TeacherClassSession {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true })
  courseOfferingId: number;

  @Column({ name: 'session_date', type: 'date' })
  sessionDate: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 60 })
  durationMinutes: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  room: string | null;

  @Column({
    name: 'session_type',
    type: 'enum',
    enum: SessionType,
    default: SessionType.LECTURE,
  })
  sessionType: SessionType;

  // Filters for auto-enrollment
  @Column({ name: 'department_id', type: 'bigint', unsigned: true, nullable: true })
  departmentId: number | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  batch: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  section: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => TeacherCourseOffering)
  @JoinColumn({ name: 'course_offering_id' })
  courseOffering: TeacherCourseOffering;
}
