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
import { CourseSubject } from './course-subject.entity';
import { CourseSubtopic } from './course-subtopic.entity';

@Entity('course_topics')
export class CourseTopic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'subject_id', type: 'bigint', unsigned: true })
  subjectId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CourseSubject, (subject) => subject.topics)
  @JoinColumn({ name: 'subject_id' })
  subject: CourseSubject;

  @OneToMany(() => CourseSubtopic, (subtopic) => subtopic.topic)
  subtopics: CourseSubtopic[];
}
