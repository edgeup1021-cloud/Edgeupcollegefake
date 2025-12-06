import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { StudentUser } from '../student/student-user.entity';

export enum StudyGroupMemberRole {
  OWNER = 'owner',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

export enum StudyGroupMemberStatus {
  JOINED = 'joined',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

@Entity('study_group_members')
export class StudyGroupMember {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'group_id', type: 'bigint', unsigned: true })
  groupId: number;

  @ManyToOne(() => StudyGroup, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: StudyGroup;

  @Column({ name: 'student_id', type: 'bigint', unsigned: true })
  studentId: number;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'student_id' })
  student: StudentUser;

  @Column({
    type: 'enum',
    enum: StudyGroupMemberRole,
    default: StudyGroupMemberRole.MEMBER,
  })
  role: StudyGroupMemberRole;

  @Column({
    type: 'enum',
    enum: StudyGroupMemberStatus,
    default: StudyGroupMemberStatus.JOINED,
  })
  status: StudyGroupMemberStatus;

  @Column({ name: 'joined_at', type: 'timestamp', nullable: true })
  joinedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
