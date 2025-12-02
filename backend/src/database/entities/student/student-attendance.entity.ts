import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { AttendanceStatus } from '../../../common/enums/status.enum';

@Entity('student_attendance')
export class StudentAttendance {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true, nullable: true })
  studentId: number | null;

  @Column({ name: 'class_session_id', type: 'bigint', unsigned: true, nullable: true })
  classSessionId: number | null;

  // Keep original 'name' field for backwards compatibility
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  // Enhanced: proper date type (new records should use this)
  @Column({ name: 'attendance_date', type: 'date', nullable: true })
  attendanceDate: Date | null;

  // New: attendance status
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
    nullable: true,
  })
  status: AttendanceStatus | null;

  // New: teacher who marked attendance
  @Column({ name: 'marked_by', type: 'bigint', unsigned: true, nullable: true })
  markedBy: number | null;

  // New: optional remarks
  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
