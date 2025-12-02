import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { ActivityType } from '../../../common/enums/status.enum';

@Entity('student_activity_logs')
export class StudentActivityLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'activity_date', type: 'date' })
  activityDate: Date;

  @Column({ name: 'activity_type', type: 'enum', enum: ActivityType, default: ActivityType.LOGIN })
  activityType: ActivityType;

  @Column({ type: 'text', nullable: true })
  metadata: string | null; // JSON for additional data

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
