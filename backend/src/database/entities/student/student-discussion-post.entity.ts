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
import { StudentUser } from './student-user.entity';
import { StudentDiscussionComment } from './student-discussion-comment.entity';
import { StudentDiscussionUpvote } from './student-discussion-upvote.entity';
import {
  DiscussionPostType,
  DiscussionCategory,
  DiscussionPostStatus,
} from '../../../common/enums/status.enum';

@Entity('student_discussion_posts')
export class StudentDiscussionPost {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @Column({
    type: 'enum',
    enum: DiscussionPostType,
    default: DiscussionPostType.QUESTION,
  })
  type: DiscussionPostType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: DiscussionCategory,
  })
  category: DiscussionCategory;

  @Column({ type: 'json', nullable: true })
  tags: string[] | null;

  @Column({
    type: 'enum',
    enum: DiscussionPostStatus,
    default: DiscussionPostStatus.ACTIVE,
  })
  status: DiscussionPostStatus;

  @Column({ name: 'upvote_count', type: 'int', unsigned: true, default: 0 })
  upvoteCount: number;

  @Column({ name: 'comment_count', type: 'int', unsigned: true, default: 0 })
  commentCount: number;

  @Column({ name: 'is_solved', type: 'boolean', default: false })
  isSolved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @OneToMany(() => StudentDiscussionComment, (comment) => comment.post)
  comments: StudentDiscussionComment[];

  @OneToMany(() => StudentDiscussionUpvote, (upvote) => upvote.post)
  upvotes: StudentDiscussionUpvote[];
}
