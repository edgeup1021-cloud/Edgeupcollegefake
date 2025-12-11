import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('grade_scales')
export class GradeScale {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'scale_name', type: 'varchar', length: 100 })
  scaleName: string;

  @Column({ name: 'min_percentage', type: 'decimal', precision: 5, scale: 2 })
  minPercentage: number;

  @Column({ name: 'max_percentage', type: 'decimal', precision: 5, scale: 2 })
  maxPercentage: number;

  @Column({ name: 'grade_letter', type: 'varchar', length: 5 })
  gradeLetter: string;

  @Column({ name: 'grade_points', type: 'decimal', precision: 4, scale: 2 })
  gradePoints: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string | null;

  @Column({ name: 'is_passing', type: 'boolean', default: true })
  isPassing: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
