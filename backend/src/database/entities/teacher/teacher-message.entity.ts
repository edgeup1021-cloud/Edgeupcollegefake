import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherConversation } from './teacher-conversation.entity';
import { TeacherUser } from './teacher-user.entity';
import { StudentUser } from '../student/student-user.entity';

export enum MessageSenderType {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity('teacher_messages')
export class TeacherMessage {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'conversation_id', type: 'bigint', unsigned: true })
  conversationId: number;

  @ManyToOne(() => TeacherConversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: TeacherConversation;

  @Column({
    name: 'sender_type',
    type: 'enum',
    enum: MessageSenderType,
  })
  senderType: MessageSenderType;

  @Column({ name: 'sender_teacher_id', type: 'bigint', unsigned: true, nullable: true })
  senderTeacherId: number | null;

  @ManyToOne(() => TeacherUser, { nullable: true })
  @JoinColumn({ name: 'sender_teacher_id' })
  senderTeacher: TeacherUser | null;

  @Column({ name: 'sender_student_id', type: 'bigint', unsigned: true, nullable: true })
  senderStudentId: number | null;

  @ManyToOne(() => StudentUser, { nullable: true })
  @JoinColumn({ name: 'sender_student_id' })
  senderStudent: StudentUser | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_read', type: 'tinyint', default: 0 })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
