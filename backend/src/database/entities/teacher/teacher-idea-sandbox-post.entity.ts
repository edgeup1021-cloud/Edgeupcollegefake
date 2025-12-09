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
import { TeacherUser } from './teacher-user.entity';
import { TeacherIdeaSandboxComment } from './teacher-idea-sandbox-comment.entity';
import { TeacherIdeaSandboxUpvote } from './teacher-idea-sandbox-upvote.entity';
import {
  IdeaSandboxPostType,
  IdeaSandboxCategory,
  IdeaSandboxPostStatus,
} from '../../../common/enums/status.enum';

@Entity('teacher_idea_sandbox_posts')
export class TeacherIdeaSandboxPost {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @Column({
    type: 'enum',
    enum: IdeaSandboxPostType,
    default: IdeaSandboxPostType.IDEA,
  })
  type: IdeaSandboxPostType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: IdeaSandboxCategory,
  })
  category: IdeaSandboxCategory;

  @Column({ type: 'json', nullable: true })
  tags: string[] | null;

  @Column({
    type: 'enum',
    enum: IdeaSandboxPostStatus,
    default: IdeaSandboxPostStatus.ACTIVE,
  })
  status: IdeaSandboxPostStatus;

  @Column({ name: 'upvote_count', type: 'int', unsigned: true, default: 0 })
  upvoteCount: number;

  @Column({ name: 'comment_count', type: 'int', unsigned: true, default: 0 })
  commentCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @OneToMany(() => TeacherIdeaSandboxComment, (comment) => comment.post)
  comments: TeacherIdeaSandboxComment[];

  @OneToMany(() => TeacherIdeaSandboxUpvote, (upvote) => upvote.post)
  upvotes: TeacherIdeaSandboxUpvote[];
}
