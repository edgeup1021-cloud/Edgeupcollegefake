import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherUser } from './teacher-user.entity';

export enum PublicationStatus {
  PUBLISHED = 'Published',
  UNDER_REVIEW = 'Under Review',
  IN_PROGRESS = 'In Progress',
  REJECTED = 'Rejected',
}

@Entity('teacher_publications')
export class TeacherPublication {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({ name: 'publication_title', length: 500 })
  publicationTitle: string;

  @Column({ name: 'journal_conference_name', length: 300 })
  journalConferenceName: string;

  @Column({ name: 'publication_date', type: 'date' })
  publicationDate: Date;

  @Column({
    type: 'enum',
    enum: PublicationStatus,
    default: PublicationStatus.IN_PROGRESS,
  })
  status: PublicationStatus;

  @Column({ name: 'co_authors', type: 'text', nullable: true })
  coAuthors: string | null;

  @Column({ name: 'publication_url', type: 'varchar', length: 1024, nullable: true })
  publicationUrl: string | null;

  @Column({ name: 'citations_count', type: 'int', default: 0 })
  citationsCount: number;

  @Column({ name: 'impact_factor', type: 'decimal', precision: 5, scale: 2, nullable: true })
  impactFactor: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  doi: string | null;

  @Column({ name: 'isbn_issn', type: 'varchar', length: 50, nullable: true })
  isbnIssn: string | null;

  @Column({ name: 'volume_number', type: 'varchar', length: 20, nullable: true })
  volumeNumber: string | null;

  @Column({ name: 'issue_number', type: 'varchar', length: 20, nullable: true })
  issueNumber: string | null;

  @Column({ name: 'page_numbers', type: 'varchar', length: 50, nullable: true })
  pageNumbers: string | null;

  @Column({ name: 'personal_notes', type: 'varchar', length: 500, nullable: true })
  personalNotes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;
}
