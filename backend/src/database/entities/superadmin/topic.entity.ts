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
import { Subject } from './subject.entity';
import { Subtopic } from './subtopic.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'subject_id', type: 'bigint', unsigned: true, nullable: false })
  subjectId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'order_index', type: 'int', default: 1, nullable: false })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Subject, (subject) => subject.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @OneToMany(() => Subtopic, (subtopic) => subtopic.topic, { cascade: true })
  subtopics: Subtopic[];
}
