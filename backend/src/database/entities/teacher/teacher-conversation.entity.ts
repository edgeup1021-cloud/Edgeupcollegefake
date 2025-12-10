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
import { TeacherConversationParticipant } from './teacher-conversation-participant.entity';
import { TeacherMessage } from './teacher-message.entity';

@Entity('teacher_conversations')
export class TeacherConversation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
  lastMessageAt: Date | null;

  @Column({ name: 'is_archived', type: 'tinyint', default: 0 })
  isArchived: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TeacherConversationParticipant, (participant) => participant.conversation)
  participants: TeacherConversationParticipant[];

  @OneToMany(() => TeacherMessage, (message) => message.conversation)
  messages: TeacherMessage[];
}
