import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { University } from './university.entity';
import { ProgramDepartment } from './program-department.entity';
import { ProgramSemester } from './program-semester.entity';

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'university_id', type: 'bigint', unsigned: true })
  universityId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'duration_years', type: 'int', default: 4 })
  durationYears: number;

  @Column({ name: 'degree_type', type: 'varchar', length: 50, nullable: true })
  degreeType: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => University, (university) => university.programs)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @OneToMany(() => ProgramDepartment, (department) => department.program)
  departments: ProgramDepartment[];

  @OneToMany(() => ProgramSemester, (semester) => semester.program)
  semesters: ProgramSemester[];
}
