import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { StudentUser } from '../../../../database/entities/student/student-user.entity';
import { InterviewSession } from './interview-session.entity';

@Entity('interview_reports')
export class InterviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @ManyToOne(() => StudentUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @Column({ name: 'session_id', nullable: true })
  sessionId: number | null;

  @ManyToOne(() => InterviewSession, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'session_id' })
  session: InterviewSession;

  // Report metadata
  @Column({ type: 'varchar', length: 255 })
  duration: string;

  @Column({ type: 'varchar', length: 50 })
  language: string;

  // Scores
  @Column({ type: 'int' })
  technicalScore: number;

  @Column({ type: 'int' })
  communicationScore: number;

  @Column({ type: 'int' })
  problemSolvingScore: number;

  @Column({ type: 'int' })
  overallScore: number;

  // Assessment
  @Column({ type: 'text' })
  overallAssessment: string;

  @Column({ type: 'json' })
  strengths: string[];

  @Column({ type: 'json' })
  areasForImprovement: string[];

  // Detailed analysis
  @Column({ type: 'text', nullable: true })
  executiveSummary: string | null;

  @Column({ type: 'text', nullable: true })
  technicalAnalysis: string | null;

  @Column({ type: 'text', nullable: true })
  communicationAnalysis: string | null;

  @Column({ type: 'text', nullable: true })
  codingPerformanceDetails: string | null;

  @Column({ type: 'int', default: 0 })
  challengesAttempted: number;

  @Column({ type: 'int', default: 0 })
  challengesPassed: number;

  @Column({ type: 'json', nullable: true })
  keyHighlights: string[] | null;

  @Column({ type: 'json', nullable: true })
  recommendations: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
