import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherAssignment } from '../teacher/teacher-assignment.entity';
import { StudentUser } from './student-user.entity';

@Entity('student_assignment_submissions')
export class StudentAssignmentSubmission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'assignment_id', type: 'bigint', unsigned: true })
  assignmentId: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'submitted', 'graded'],
    default: 'pending',
  })
  status: string;

  @Column({ name: 'file_url', type: 'varchar', length: 1024, nullable: true })
  fileUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'submitted_at', type: 'datetime', nullable: true })
  submittedAt: Date | null;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  grade: number | null;

  @Column({ type: 'text', nullable: true })
  feedback: string | null;

  @Column({
    name: 'graded_by_teacher_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  gradedByTeacherId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherAssignment)
  @JoinColumn({ name: 'assignment_id' })
  assignment: TeacherAssignment;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
