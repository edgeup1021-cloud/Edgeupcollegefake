import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherUser } from './teacher-user.entity';
import { StudentUser } from '../student/student-user.entity';

export enum MentorshipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity('teacher_mentorships')
export class TeacherMentorship {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({
    type: 'enum',
    enum: MentorshipStatus,
    default: MentorshipStatus.ACTIVE,
  })
  status: MentorshipStatus;

  @Column({ name: 'assigned_date', type: 'date' })
  assignedDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ name: 'assigned_by', type: 'bigint', unsigned: true, nullable: true })
  assignedBy: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
