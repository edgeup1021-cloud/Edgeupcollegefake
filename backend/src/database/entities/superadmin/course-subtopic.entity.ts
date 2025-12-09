import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseTopic } from './course-topic.entity';

@Entity('course_subtopics')
export class CourseSubtopic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'topic_id', type: 'bigint', unsigned: true })
  topicId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'longtext', nullable: true })
  content: string | null;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes: number | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CourseTopic, (topic) => topic.subtopics)
  @JoinColumn({ name: 'topic_id' })
  topic: CourseTopic;
}
