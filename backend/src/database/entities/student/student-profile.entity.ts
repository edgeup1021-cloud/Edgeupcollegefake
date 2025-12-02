import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female', 'Other'],
    nullable: true,
  })
  gender: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', name: 'guardian_name', length: 255, nullable: true })
  guardianName: string | null;

  @Column({ type: 'varchar', name: 'guardian_phone', length: 32, nullable: true })
  guardianPhone: string | null;

  @Column({ type: 'varchar', name: 'emergency_contact', length: 32, nullable: true })
  emergencyContact: string | null;

  @Column({ type: 'varchar', name: 'blood_group', length: 10, nullable: true })
  bloodGroup: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
