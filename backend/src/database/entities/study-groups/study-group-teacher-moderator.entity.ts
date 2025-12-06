import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { TeacherUser } from '../teacher/teacher-user.entity';

export enum StudyGroupTeacherRole {
  MODERATOR = 'moderator',
  OWNER = 'owner',
}

@Entity('study_group_teacher_moderators')
export class StudyGroupTeacherModerator {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'group_id', type: 'bigint', unsigned: true })
  groupId: number;

  @ManyToOne(() => StudyGroup, (group) => group.teacherModerators)
  @JoinColumn({ name: 'group_id' })
  group: StudyGroup;

  @Column({ name: 'teacher_id', type: 'bigint', unsigned: true })
  teacherId: number;

  @ManyToOne(() => TeacherUser)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherUser;

  @Column({
    type: 'enum',
    enum: StudyGroupTeacherRole,
    default: StudyGroupTeacherRole.MODERATOR,
  })
  role: StudyGroupTeacherRole;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
