import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { TeacherUser } from '../teacher/teacher-user.entity';
import { LeaveType, LeaveStatus } from '../../../common/enums/status.enum';

@Entity('student_leave_requests')
export class StudentLeaveRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true, nullable: true })
  courseOfferingId: number | null;

  @Column({ name: 'class_session_id', type: 'bigint', unsigned: true, nullable: true })
  classSessionId: number | null;

  @Column({
    name: 'leave_type',
    type: 'enum',
    enum: LeaveType,
  })
  leaveType: LeaveType;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'supporting_document', type: 'varchar', length: 1024, nullable: true })
  supportingDocument: string | null;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ name: 'reviewed_by', type: 'bigint', unsigned: true, nullable: true })
  reviewedBy: number | null;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'review_remarks', type: 'text', nullable: true })
  reviewRemarks: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: TeacherUser;
}
