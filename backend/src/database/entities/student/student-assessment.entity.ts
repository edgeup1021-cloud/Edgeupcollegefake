import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { StudentAssessmentType, StudentAssessmentStatus } from '../../../common/enums/status.enum';

@Entity('student_assessments')
export class StudentAssessment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true })
  courseOfferingId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'enum', enum: StudentAssessmentType, default: StudentAssessmentType.QUIZ })
  type: StudentAssessmentType;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: Date;

  @Column({ name: 'scheduled_time', type: 'time', nullable: true })
  scheduledTime: string | null;

  @Column({ type: 'enum', enum: StudentAssessmentStatus, default: StudentAssessmentStatus.UPCOMING })
  status: StudentAssessmentStatus;

  @Column({ name: 'max_marks', type: 'int', default: 100 })
  maxMarks: number;

  @Column({ type: 'int', nullable: true })
  duration: number; // in minutes

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
