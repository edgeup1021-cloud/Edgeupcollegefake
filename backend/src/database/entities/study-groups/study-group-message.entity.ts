import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { StudentUser } from '../student/student-user.entity';
import { TeacherUser } from '../teacher/teacher-user.entity';

export enum StudyGroupMessageType {
  TEXT = 'text',
  SYSTEM = 'system',
}

@Entity('study_group_messages')
export class StudyGroupMessage {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'group_id', type: 'bigint', unsigned: true })
  groupId: number;

  @ManyToOne(() => StudyGroup, (group) => group.messages)
  @JoinColumn({ name: 'group_id' })
  group: StudyGroup;

  @Column({ name: 'sender_student_id', type: 'bigint', unsigned: true, nullable: true })
  senderStudentId: number | null;

  @ManyToOne(() => StudentUser, { nullable: true })
  @JoinColumn({ name: 'sender_student_id' })
  senderStudent: StudentUser | null;

  @Column({ name: 'sender_teacher_id', type: 'bigint', unsigned: true, nullable: true })
  senderTeacherId: number | null;

  @ManyToOne(() => TeacherUser, { nullable: true })
  @JoinColumn({ name: 'sender_teacher_id' })
  senderTeacher: TeacherUser | null;

  @Column({
    name: 'message_type',
    type: 'enum',
    enum: StudyGroupMessageType,
    default: StudyGroupMessageType.TEXT,
  })
  messageType: StudyGroupMessageType;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
