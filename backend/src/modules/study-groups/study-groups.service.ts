import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  StudyGroup,
  StudyGroupJoinType,
  StudyGroupStatus,
} from '../../database/entities/study-groups/study-group.entity';
import {
  StudyGroupMember,
  StudyGroupMemberRole,
  StudyGroupMemberStatus,
} from '../../database/entities/study-groups/study-group-member.entity';
import {
  StudyGroupMessage,
  StudyGroupMessageType,
} from '../../database/entities/study-groups/study-group-message.entity';
import {
  StudyGroupTeacherModerator,
  StudyGroupTeacherRole,
} from '../../database/entities/study-groups/study-group-teacher-moderator.entity';
import { StudentUser } from '../../database/entities/student';
import { TeacherUser, TeacherCourseOffering } from '../../database/entities/teacher';
import {
  CreateStudyGroupDto,
  JoinStudyGroupDto,
  QueryStudyGroupDto,
  PostStudyGroupMessageDto,
  ModerateMemberDto,
  QueryGroupMessagesDto,
  ArchiveStudyGroupDto,
} from './dto';
import { ModerateMemberAction } from './dto/moderate-member.dto';
import { StudyGroupsGateway } from './study-groups.gateway';

@Injectable()
export class StudyGroupsService {
  private readonly logger = new Logger(StudyGroupsService.name);

  constructor(
    @InjectRepository(StudyGroup)
    private readonly groupRepo: Repository<StudyGroup>,
    @InjectRepository(StudyGroupMember)
    private readonly memberRepo: Repository<StudyGroupMember>,
    @InjectRepository(StudyGroupMessage)
    private readonly messageRepo: Repository<StudyGroupMessage>,
    @InjectRepository(StudyGroupTeacherModerator)
    private readonly teacherModRepo: Repository<StudyGroupTeacherModerator>,
    @InjectRepository(StudentUser)
    private readonly studentRepo: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepo: Repository<TeacherUser>,
    @InjectRepository(TeacherCourseOffering)
    private readonly offeringRepo: Repository<TeacherCourseOffering>,
    private readonly dataSource: DataSource,
    private readonly gateway: StudyGroupsGateway,
  ) {}

  async createGroup(studentId: number, dto: CreateStudyGroupDto): Promise<StudyGroup> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    let offering: TeacherCourseOffering | null = null;
    if (dto.courseOfferingId) {
      offering = await this.offeringRepo.findOne({
        where: { id: dto.courseOfferingId },
        relations: ['course'],
      });
      if (!offering) {
        throw new NotFoundException(`Course offering ${dto.courseOfferingId} not found`);
      }
    }

    const joinType = dto.joinType || StudyGroupJoinType.OPEN;
    if (joinType === StudyGroupJoinType.CODE && !dto.inviteCode) {
      throw new BadRequestException('Invite code is required for code-based groups');
    }

    const group = this.groupRepo.create({
      name: dto.name,
      description: dto.description || null,
      subject: dto.subject || offering?.course?.title || null,
      courseOfferingId: dto.courseOfferingId || null,
      program: dto.program || student.program || null,
      batch: dto.batch || student.batch || null,
      section: dto.section || offering?.section || student.section || null,
      joinType,
      inviteCode: joinType === StudyGroupJoinType.CODE ? dto.inviteCode : null,
      maxMembers: dto.maxMembers ?? 50,
      currentMembers: 0,
      createdByStudentId: studentId,
      status: StudyGroupStatus.ACTIVE,
    });

    return this.dataSource.transaction(async (manager) => {
      const savedGroup = await manager.getRepository(StudyGroup).save(group);

      const ownerMembership = manager.getRepository(StudyGroupMember).create({
        groupId: savedGroup.id,
        studentId,
        role: StudyGroupMemberRole.OWNER,
        status: StudyGroupMemberStatus.JOINED,
        joinedAt: new Date(),
      });
      await manager.getRepository(StudyGroupMember).save(ownerMembership);
      await manager.getRepository(StudyGroup).update(savedGroup.id, { currentMembers: 1 });

      return savedGroup;
    });
  }

  async getStudentGroups(studentId: number, query: QueryStudyGroupDto) {
    const membershipList = await this.memberRepo.find({
      where: { studentId },
      select: ['id', 'groupId', 'role', 'status'],
    });
    const membershipMap = new Map<number, StudyGroupMember>();
    membershipList.forEach((m) => membershipMap.set(m.groupId, m));

    const qb = this.groupRepo.createQueryBuilder('g');

    if (query.joinedOnly) {
      qb.innerJoin(
        StudyGroupMember,
        'm',
        'm.group_id = g.id AND m.student_id = :studentId',
        { studentId },
      );
    } else {
      qb.where('1 = 1');

      if (query.status) {
        qb.andWhere('g.status = :status', { status: query.status });
      } else {
        qb.andWhere('g.status = :status', { status: StudyGroupStatus.ACTIVE });
      }

      if (query.courseOfferingId) {
        qb.andWhere('g.course_offering_id = :courseOfferingId', {
          courseOfferingId: query.courseOfferingId,
        });
      }

      // Only filter by program/batch/section when explicitly requested to avoid
      // mismatches between codes and full names.
      if (query.program) qb.andWhere('g.program = :program', { program: query.program });
      if (query.batch) qb.andWhere('g.batch = :batch', { batch: query.batch });
      if (query.section) qb.andWhere('g.section = :section', { section: query.section });

      if (query.joinType) {
        qb.andWhere('g.join_type = :joinType', { joinType: query.joinType });
      }
    }

    qb.orderBy('g.created_at', 'DESC');
    if (query.limit) {
      qb.take(query.limit);
    } else {
      qb.take(25);
    }

    const groups = await qb.getMany();

    return groups.map((group) => {
      const membership = membershipMap.get(group.id);
      return {
        ...group,
        membership: membership
          ? {
              id: membership.id,
              status: membership.status,
              role: membership.role,
            }
          : null,
      };
    });
  }

  async joinGroup(studentId: number, groupId: number, dto: JoinStudyGroupDto) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Study group not found');
    }
    if (group.status !== StudyGroupStatus.ACTIVE) {
      throw new BadRequestException('Group is not active');
    }

    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Enforce contextual alignment if provided
    if (group.program && student.program && !this.matchesProgram(group.program, student.program)) {
      throw new ForbiddenException('Group is limited to a different program');
    }
    if (group.batch && student.batch && !this.matchesNormalized(group.batch, student.batch)) {
      throw new ForbiddenException('Group is limited to a different batch');
    }
    if (group.section && student.section && !this.matchesNormalized(group.section, student.section)) {
      throw new ForbiddenException('Group is limited to a different section');
    }

    const existing = await this.memberRepo.findOne({
      where: { groupId, studentId },
    });

    if (existing && existing.status === StudyGroupMemberStatus.JOINED) {
      throw new ConflictException('You are already a member of this group');
    }

    if (group.joinType === StudyGroupJoinType.CODE) {
      if (!dto.inviteCode || dto.inviteCode !== group.inviteCode) {
        throw new ForbiddenException('Invalid invite code');
      }
    }

    if (group.joinType !== StudyGroupJoinType.APPROVAL) {
      if (group.currentMembers >= group.maxMembers) {
        throw new BadRequestException('Group is full');
      }
    }

    if (group.joinType === StudyGroupJoinType.APPROVAL) {
      if (existing) {
        // Reset to pending if previously rejected
        existing.status = StudyGroupMemberStatus.PENDING;
        existing.joinedAt = null;
        await this.memberRepo.save(existing);
        return { status: 'pending' };
      }

      await this.memberRepo.save(
        this.memberRepo.create({
          groupId,
          studentId,
          status: StudyGroupMemberStatus.PENDING,
          role: StudyGroupMemberRole.MEMBER,
        }),
      );
      return { status: 'pending' };
    }

    // Open or code: join immediately
    return this.dataSource.transaction(async (manager) => {
      if (existing) {
        existing.status = StudyGroupMemberStatus.JOINED;
        existing.joinedAt = new Date();
        existing.role = StudyGroupMemberRole.MEMBER;
        await manager.getRepository(StudyGroupMember).save(existing);
      } else {
        const membership = manager.getRepository(StudyGroupMember).create({
          groupId,
          studentId,
          role: StudyGroupMemberRole.MEMBER,
          status: StudyGroupMemberStatus.JOINED,
          joinedAt: new Date(),
        });
        await manager.getRepository(StudyGroupMember).save(membership);
      }

      await manager
        .getRepository(StudyGroup)
        .increment({ id: groupId }, 'currentMembers', 1);

      return { status: 'joined' };
    });
  }

  async leaveGroup(studentId: number, groupId: number) {
    const membership = await this.memberRepo.findOne({ where: { groupId, studentId } });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    if (membership.role === StudyGroupMemberRole.OWNER) {
      throw new BadRequestException('Owners cannot leave their own group');
    }

    await this.dataSource.transaction(async (manager) => {
      if (membership.status === StudyGroupMemberStatus.JOINED) {
        await manager
          .getRepository(StudyGroup)
          .decrement({ id: groupId }, 'currentMembers', 1);
      }
      await manager.getRepository(StudyGroupMember).remove(membership);
    });

    return { message: 'Left the group' };
  }

  async postMessage(
    groupId: number,
    sender: { studentId?: number; teacherId?: number },
    dto: PostStudyGroupMessageDto,
  ) {
    await this.ensureCanViewGroup(groupId, sender);

    const message = this.messageRepo.create({
      groupId,
      senderStudentId: sender.studentId ?? null,
      senderTeacherId: sender.teacherId ?? null,
      messageType: dto.messageType || StudyGroupMessageType.TEXT,
      content: dto.content,
    });

    const saved = await this.messageRepo.save(message);

    // Fetch the message with relations for broadcasting
    const messageWithRelations = await this.messageRepo.findOne({
      where: { id: saved.id },
      relations: ['senderStudent', 'senderTeacher'],
    });

    // Broadcast to room with error logging
    try {
      await this.gateway.broadcastMessage(groupId, {
        ...(messageWithRelations || saved),
        groupId, // ensure present for clients
      });
    } catch (error) {
      // Log error but don't fail message creation
      this.logger.error(
        `Failed to broadcast message ${saved.id} to group ${groupId}: ${error.message}`,
        error.stack,
      );

      // Future enhancement: Store failed broadcast in a queue for retry
      // For now, just log and continue - clients will get it on next fetch
    }

    return messageWithRelations || saved;
  }

  async getMessages(
    groupId: number,
    sender: { studentId?: number; teacherId?: number },
    query: QueryGroupMessagesDto,
  ) {
    await this.ensureCanViewGroup(groupId, sender);

    const limit = query.limit || 20;
    const qb = this.messageRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.senderStudent', 'student')
      .leftJoinAndSelect('msg.senderTeacher', 'teacher')
      .where('msg.group_id = :groupId', { groupId });

    if (query.cursor) {
      qb.andWhere('msg.id < :cursor', { cursor: query.cursor });
    }

    const messages = await qb
      .orderBy('msg.id', 'DESC')
      .take(limit)
      .getMany();

    // Return in chronological order for chat rendering
    return messages.reverse();
  }

  async addTeacherModerator(teacherId: number, groupId: number) {
    const [teacher, group] = await Promise.all([
      this.teacherRepo.findOne({ where: { id: teacherId } }),
      this.groupRepo.findOne({ where: { id: groupId } }),
    ]);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    if (!group) {
      throw new NotFoundException('Study group not found');
    }

    // If the group is tied to a course offering, only the instructor can self-add
    if (group.courseOfferingId) {
      const offering = await this.offeringRepo.findOne({
        where: { id: group.courseOfferingId },
      });
      if (offering && offering.teacherId !== teacherId) {
        throw new ForbiddenException('Only the course instructor can moderate this group');
      }
    }

    const existing = await this.teacherModRepo.findOne({
      where: { teacherId, groupId },
    });
    if (existing) {
      return existing;
    }

    const moderator = this.teacherModRepo.create({
      groupId,
      teacherId,
      role: StudyGroupTeacherRole.MODERATOR,
    });
    return this.teacherModRepo.save(moderator);
  }

  async moderateMember(
    groupId: number,
    memberId: number,
    dto: ModerateMemberDto,
    actor: { teacherId?: number; studentId?: number },
  ) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Study group not found');
    await this.ensureCanModerate(groupId, actor);

    const membership = await this.memberRepo.findOne({ where: { id: memberId, groupId } });
    if (!membership) {
      throw new NotFoundException('Member not found');
    }
    if (membership.role === StudyGroupMemberRole.OWNER) {
      throw new BadRequestException('Cannot moderate the group owner');
    }

    if (dto.action === ModerateMemberAction.APPROVE) {
      if (membership.status === StudyGroupMemberStatus.JOINED) {
        return membership;
      }
      const groupCap = await this.groupRepo.findOne({ where: { id: groupId } });
      if (groupCap && groupCap.currentMembers >= groupCap.maxMembers) {
        throw new BadRequestException('Group is full');
      }
      membership.status = StudyGroupMemberStatus.JOINED;
      membership.joinedAt = new Date();
      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(StudyGroupMember).save(membership);
        await manager.getRepository(StudyGroup).increment({ id: groupId }, 'currentMembers', 1);
      });
      return membership;
    }

    if (dto.action === ModerateMemberAction.REJECT) {
      membership.status = StudyGroupMemberStatus.REJECTED;
      membership.joinedAt = null;
      return this.memberRepo.save(membership);
    }

    if (dto.action === ModerateMemberAction.KICK) {
      await this.dataSource.transaction(async (manager) => {
        if (membership.status === StudyGroupMemberStatus.JOINED) {
          await manager
            .getRepository(StudyGroup)
            .decrement({ id: groupId }, 'currentMembers', 1);
        }
        await manager.getRepository(StudyGroupMember).remove(membership);
      });
      return { message: 'Member removed' };
    }

    throw new BadRequestException('Unsupported action');
  }

  async setArchived(groupId: number, dto: ArchiveStudyGroupDto, actor: { teacherId?: number; studentId?: number }) {
    await this.ensureCanModerate(groupId, actor);
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Study group not found');

    group.status = dto.archived ? StudyGroupStatus.ARCHIVED : StudyGroupStatus.ACTIVE;
    return this.groupRepo.save(group);
  }

  async deleteGroup(groupId: number, actor: { studentId?: number; teacherId?: number }) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Study group not found');

    // Only group owner (student) or teacher moderator can delete
    if (actor.studentId) {
      const membership = await this.memberRepo.findOne({
        where: { groupId, studentId: actor.studentId },
      });
      if (!membership || membership.role !== StudyGroupMemberRole.OWNER) {
        throw new ForbiddenException('Only the group owner can delete this group');
      }
    } else if (actor.teacherId) {
      const mod = await this.teacherModRepo.findOne({
        where: { groupId, teacherId: actor.teacherId },
      });
      if (!mod) {
        throw new ForbiddenException('Only moderators can delete this group');
      }
    } else {
      throw new ForbiddenException('Not authorized to delete this group');
    }

    // Cascade deletes will remove members/messages/moderators
    await this.groupRepo.delete({ id: groupId });
    return { message: 'Study group deleted' };
  }

  private async ensureCanViewGroup(
    groupId: number,
    actor: { studentId?: number; teacherId?: number },
  ) {
    if (actor.studentId) {
      const membership = await this.memberRepo.findOne({
        where: { groupId, studentId: actor.studentId },
      });
      if (membership && membership.status === StudyGroupMemberStatus.JOINED) {
        return true;
      }
    }

    if (actor.teacherId) {
      const isMod = await this.teacherModRepo.exist({
        where: { groupId, teacherId: actor.teacherId },
      });
      if (isMod) return true;
    }

    throw new ForbiddenException('Access denied for this group');
  }

  private async ensureCanModerate(
    groupId: number,
    actor: { studentId?: number; teacherId?: number },
  ) {
    if (actor.teacherId) {
      const isModerator = await this.teacherModRepo.findOne({
        where: { groupId, teacherId: actor.teacherId },
      });
      if (!isModerator) {
        throw new ForbiddenException('Only moderators can perform this action');
      }
      return true;
    }

    if (actor.studentId) {
      const membership = await this.memberRepo.findOne({
        where: { groupId, studentId: actor.studentId },
      });
      if (
        membership &&
        membership.status === StudyGroupMemberStatus.JOINED &&
        (membership.role === StudyGroupMemberRole.OWNER || membership.role === StudyGroupMemberRole.MODERATOR)
      ) {
        return true;
      }
    }

    throw new ForbiddenException('Only moderators can perform this action');
  }

  private normalizeProgram(program: string | null | undefined): string | null {
    if (!program) return null;
    const trimmed = program.trim();
    if (!trimmed) return null;
    // Prefer code before " - " if present
    const code = trimmed.split(' - ')[0] || trimmed;
    return code.toLowerCase();
  }

  private matchesProgram(a: string, b: string): boolean {
    const normA = this.normalizeProgram(a);
    const normB = this.normalizeProgram(b);
    if (normA && normB && normA === normB) return true;
    // Fallback: case-insensitive full string compare
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  private matchesNormalized(a: string, b: string): boolean {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }
}
