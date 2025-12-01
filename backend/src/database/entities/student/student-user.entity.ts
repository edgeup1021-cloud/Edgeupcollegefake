import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StudentStatus } from '../../../common/enums/status.enum';

@Entity('student_users')
export class StudentUser {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'admission_no', length: 64, unique: true })
  admissionNo: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', name: 'password_hash', length: 255, nullable: true })
    passwordHash: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  program: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  batch: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  section: string | null;


  @Column({ name: 'campus_id', type: 'bigint', unsigned: true, nullable: true })
  campusId: number | null;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @Column({ type: 'varchar', name: 'profile_image', length: 1024, nullable: true })
  profileImage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
