import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TeacherIdeaSandboxPost } from './teacher-idea-sandbox-post.entity';
import { TeacherUser } from './teacher-user.entity';

@Entity('teacher_idea_sandbox_upvotes')
@Unique('unique_post_teacher_upvote', ['postId', 'teacherId'])
export class TeacherIdeaSandboxUpvote {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'post_id', type: 'bigint', unsigned: true })
  postId: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => TeacherIdeaSandboxPost, (post) => post.upvotes)
  @JoinColumn({ name: 'post_id' })
  post: TeacherIdeaSandboxPost;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;
}
