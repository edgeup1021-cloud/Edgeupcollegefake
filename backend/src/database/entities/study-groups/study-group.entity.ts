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
import { StudentUser } from '../student/student-user.entity';
import { TeacherCourseOffering } from '../teacher/teacher-course-offering.entity';
import { StudyGroupMember } from './study-group-member.entity';
import { StudyGroupMessage } from './study-group-message.entity';
import { StudyGroupTeacherModerator } from './study-group-teacher-moderator.entity';

export enum StudyGroupJoinType {
  OPEN = 'open',
  CODE = 'code',
  APPROVAL = 'approval',
}

export enum StudyGroupStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('study_groups')
export class StudyGroup {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string | null;

  @Column({ name: 'course_offering_id', type: 'bigint', unsigned: true, nullable: true })
  courseOfferingId: number | null;

  @ManyToOne(() => TeacherCourseOffering)
  @JoinColumn({ name: 'course_offering_id' })
  courseOffering: TeacherCourseOffering | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  program: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  batch: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  section: string | null;

  @Column({
    name: 'join_type',
    type: 'enum',
    enum: StudyGroupJoinType,
    default: StudyGroupJoinType.OPEN,
  })
  joinType: StudyGroupJoinType;

  @Column({ name: 'invite_code', type: 'varchar', length: 64, nullable: true })
  inviteCode: string | null;

  @Column({ name: 'max_members', type: 'int', unsigned: true, default: 50 })
  maxMembers: number;

  @Column({ name: 'current_members', type: 'int', unsigned: true, default: 0 })
  currentMembers: number;

  @Column({ name: 'created_by_student_id', type: 'bigint', unsigned: true })
  createdByStudentId: number;

  @ManyToOne(() => StudentUser)
  @JoinColumn({ name: 'created_by_student_id' })
  createdByStudent: StudentUser;

  @Column({
    type: 'enum',
    enum: StudyGroupStatus,
    default: StudyGroupStatus.ACTIVE,
  })
  status: StudyGroupStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => StudyGroupMember, (member) => member.group)
  members: StudyGroupMember[];

  @OneToMany(() => StudyGroupMessage, (message) => message.group)
  messages: StudyGroupMessage[];

  @OneToMany(() => StudyGroupTeacherModerator, (moderator) => moderator.group)
  teacherModerators: StudyGroupTeacherModerator[];
}
