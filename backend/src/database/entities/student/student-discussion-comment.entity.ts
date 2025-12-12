import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentDiscussionPost } from './student-discussion-post.entity';
import { StudentUser } from './student-user.entity';

@Entity('student_discussion_comments')
export class StudentDiscussionComment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'post_id', type: 'bigint', unsigned: true })
  postId: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_solution', type: 'boolean', default: false })
  isSolution: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentDiscussionPost, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: StudentDiscussionPost;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
