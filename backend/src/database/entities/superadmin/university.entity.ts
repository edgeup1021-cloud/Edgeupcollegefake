import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InstitutionalHead } from './institutional-head.entity';

export enum InstitutionType {
  COLLEGE = 'College',
  UNIVERSITY = 'University',
}

export enum CollegeType {
  ENGINEERING = 'Engineering',
  MEDICAL = 'Medical',
  LAW = 'Law',
  ARTS_AND_SCIENCE = 'Arts and Science',
  POLYTECHNIC = 'Polytechnic',
  MANAGEMENT = 'Management',
  EDUCATION = 'Education',
  AGRICULTURE = 'Agriculture',
  PHARMACY = 'Pharmacy',
  NURSING = 'Nursing',
  ARCHITECTURE = 'Architecture',
  FINE_ARTS = 'Fine Arts',
  PHYSICAL_EDUCATION = 'Physical Education',
  OTHER = 'Other',
}

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'institution_type',
    type: 'enum',
    enum: InstitutionType,
    default: InstitutionType.COLLEGE,
  })
  institutionType: InstitutionType;

  @Column({
    name: 'college_type',
    type: 'enum',
    enum: CollegeType,
    nullable: true,
  })
  collegeType: CollegeType | null;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ name: 'established_year', type: 'int', nullable: true })
  establishedYear: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    name: 'institutional_head_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  institutionalHeadId: number | null;

  @ManyToOne(() => InstitutionalHead, { nullable: true })
  @JoinColumn({ name: 'institutional_head_id' })
  institutionalHead: InstitutionalHead | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
