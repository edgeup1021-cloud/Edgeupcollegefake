import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teacher_users')
export class TeacherUser {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string | null;

  @Column({ name: 'subjects_taught', type: 'varchar', length: 500, nullable: true })
  subjectsTaught: string | null;

  @Column({ name: 'department_id', type: 'bigint', unsigned: true, nullable: true })
  departmentId: number | null;

  @Column({ type: 'varchar', name: 'profile_image', length: 1024, nullable: true })
  profileImage: string | null;

  @Column({ type: 'varchar', name: 'password_hash', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
