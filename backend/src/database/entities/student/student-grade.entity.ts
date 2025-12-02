import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { GradeType } from '../../../common/enums/status.enum';

@Entity('student_grades')
export class StudentGrade {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true })
  courseOfferingId: number;

  @Column({ name: 'assignment_id', type: 'bigint', unsigned: true, nullable: true })
  assignmentId: number | null;

  @Column({ name: 'assessment_id', type: 'bigint', unsigned: true, nullable: true })
  assessmentId: number | null;

  @Column({ name: 'marks_obtained', type: 'decimal', precision: 6, scale: 2, nullable: true })
  marksObtained: number | null;

  @Column({ name: 'max_marks', type: 'decimal', precision: 6, scale: 2, nullable: true })
  maxMarks: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number | null;

  @Column({
    name: 'grade_type',
    type: 'enum',
    enum: GradeType,
    default: GradeType.ASSIGNMENT,
  })
  gradeType: GradeType;

  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
