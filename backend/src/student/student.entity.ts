import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('student_users')
export class Student {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'admission_no', length: 64, unique: true })
  admissionNo: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 32 })
  phone: string;

  @Column({ name: 'password_hash', nullable: true, length: 255 })
  passwordHash: string;

  @Column({ nullable: true, length: 128 })
  program: string;

  @Column({ nullable: true, length: 32 })
  batch: string;

  @Column({ name: 'campus_id', type: 'bigint', unsigned: true, nullable: true })
  campusId: number;

  @Column({
    type: 'enum',
    enum: ['active', 'suspended', 'graduated', 'withdrawn'],
    default: 'active',
  })
  status: string;

  @Column({ name: 'profile_image', nullable: true, length: 1024 })
  profileImage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
