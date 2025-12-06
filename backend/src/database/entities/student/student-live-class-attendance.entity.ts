import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LiveClass } from '../teacher/teacher-live-class.entity';
import { StudentUser } from './student-user.entity';

export enum LiveClassAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

@Entity('live_class_attendance')
export class LiveClassAttendance {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'live_class_id', type: 'bigint', unsigned: true })
  liveClassId: number;

  @ManyToOne(() => LiveClass)
  @JoinColumn({ name: 'live_class_id' })
  liveClass: LiveClass;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @Column({ name: 'joined_at', type: 'timestamp', nullable: true })
  joinedAt: Date | null;

  @Column({ name: 'left_at', type: 'timestamp', nullable: true })
  leftAt: Date | null;

  @Column({ type: 'int', unsigned: true, default: 0 })
  duration: number; // Duration in minutes

  @Column({
    type: 'enum',
    enum: LiveClassAttendanceStatus,
    default: LiveClassAttendanceStatus.ABSENT,
  })
  status: LiveClassAttendanceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
