import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { StudentDiscussionPost } from './student-discussion-post.entity';
import { StudentUser } from './student-user.entity';

@Entity('student_discussion_upvotes')
@Unique('unique_post_student_upvote', ['postId', 'studentId'])
export class StudentDiscussionUpvote {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'post_id', type: 'bigint', unsigned: true })
  postId: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => StudentDiscussionPost, (post) => post.upvotes)
  @JoinColumn({ name: 'post_id' })
  post: StudentDiscussionPost;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;
}
