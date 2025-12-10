import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  TeacherConversation,
  TeacherConversationParticipant,
  TeacherMessage,
  TeacherUser,
} from '../../../database/entities/teacher';
import { StudentUser } from '../../../database/entities/student';
import {
  CreateConversationDto,
  AddParticipantsDto,
  SendMessageDto,
} from '../dto/messaging';
import { MessageSenderType } from '../../../database/entities/teacher/teacher-message.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(TeacherConversation)
    private readonly conversationRepo: Repository<TeacherConversation>,
    @InjectRepository(TeacherConversationParticipant)
    private readonly participantRepo: Repository<TeacherConversationParticipant>,
    @InjectRepository(TeacherMessage)
    private readonly messageRepo: Repository<TeacherMessage>,
    @InjectRepository(StudentUser)
    private readonly studentRepo: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepo: Repository<TeacherUser>,
  ) {}

  async createConversation(
    dto: CreateConversationDto,
    teacherId: number,
  ): Promise<any> {
    const students = await this.studentRepo.find({
      where: { id: In(dto.studentIds) },
    });

    if (students.length !== dto.studentIds.length) {
      throw new BadRequestException('One or more students not found');
    }

    const conversation = this.conversationRepo.create({
      teacherId,
      title: dto.title || `Conversation with ${students.map(s => s.firstName).join(', ')}`,
    });

    const savedConversation = await this.conversationRepo.save(conversation);

    const participants = dto.studentIds.map((studentId) =>
      this.participantRepo.create({
        conversationId: savedConversation.id,
        studentId,
      }),
    );

    await this.participantRepo.save(participants);

    return this.getConversationById(savedConversation.id, teacherId);
  }

  async getConversations(teacherId: number): Promise<any[]> {
    const conversations = await this.conversationRepo.find({
      where: { teacherId, isArchived: false },
      relations: ['participants', 'participants.student', 'messages'],
      order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
    });

    return conversations.map((conv) => {
      const lastMessage = conv.messages && conv.messages.length > 0
        ? conv.messages[conv.messages.length - 1]
        : null;

      // Count unread messages from students
      const unreadCount = conv.messages
        ? conv.messages.filter(
            (msg) =>
              msg.senderType === MessageSenderType.STUDENT && !msg.isRead,
          ).length
        : 0;

      return {
        id: conv.id,
        title: conv.title,
        participants: conv.participants.map((p) => ({
          id: p.student.id,
          firstName: p.student.firstName,
          lastName: p.student.lastName,
          email: p.student.email,
          profileImage: p.student.profileImage,
        })),
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderType: lastMessage.senderType,
            }
          : null,
        unreadCount,
        createdAt: conv.createdAt,
        lastMessageAt: conv.lastMessageAt,
      };
    });
  }

  async getConversationById(
    conversationId: number,
    teacherId: number,
  ): Promise<any> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants', 'participants.student', 'messages'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Convert to numbers for comparison (handles bigint string issues)
    if (Number(conversation.teacherId) !== Number(teacherId)) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    const messages = await this.messageRepo.find({
      where: { conversationId },
      relations: ['senderTeacher', 'senderStudent'],
      order: { createdAt: 'ASC' },
    });

    // Mark all unread student messages as read when teacher opens conversation
    await this.messageRepo.update(
      {
        conversationId,
        senderType: MessageSenderType.STUDENT,
        isRead: false,
      },
      { isRead: true },
    );

    return {
      id: conversation.id,
      title: conversation.title,
      participants: conversation.participants.map((p) => ({
        id: p.student.id,
        firstName: p.student.firstName,
        lastName: p.student.lastName,
        email: p.student.email,
        profileImage: p.student.profileImage,
        joinedAt: p.joinedAt,
      })),
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderType: msg.senderType,
        sender:
          msg.senderType === MessageSenderType.TEACHER
            ? {
                id: msg.senderTeacher?.id,
                firstName: msg.senderTeacher?.firstName,
                lastName: msg.senderTeacher?.lastName,
                profileImage: msg.senderTeacher?.profileImage,
              }
            : {
                id: msg.senderStudent?.id,
                firstName: msg.senderStudent?.firstName,
                lastName: msg.senderStudent?.lastName,
                profileImage: msg.senderStudent?.profileImage,
              },
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      })),
      createdAt: conversation.createdAt,
    };
  }

  async sendMessage(
    conversationId: number,
    dto: SendMessageDto,
    teacherId: number,
  ): Promise<any> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Convert to numbers for comparison (handles bigint string issues)
    if (Number(conversation.teacherId) !== Number(teacherId)) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    const message = this.messageRepo.create({
      conversationId,
      senderType: MessageSenderType.TEACHER,
      senderTeacherId: teacherId,
      content: dto.content,
    });

    const savedMessage = await this.messageRepo.save(message);

    await this.conversationRepo.update(conversationId, {
      lastMessageAt: new Date(),
    });

    const messageWithSender = await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['senderTeacher'],
    });

    if (!messageWithSender) {
      throw new NotFoundException('Message not found after creation');
    }

    return {
      id: messageWithSender.id,
      content: messageWithSender.content,
      senderType: messageWithSender.senderType,
      sender: {
        id: messageWithSender.senderTeacher?.id,
        firstName: messageWithSender.senderTeacher?.firstName,
        lastName: messageWithSender.senderTeacher?.lastName,
        profileImage: messageWithSender.senderTeacher?.profileImage,
      },
      createdAt: messageWithSender.createdAt,
      isRead: messageWithSender.isRead,
    };
  }

  async addParticipants(
    conversationId: number,
    dto: AddParticipantsDto,
    teacherId: number,
  ): Promise<any> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Convert to numbers for comparison (handles bigint string issues)
    if (Number(conversation.teacherId) !== Number(teacherId)) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    const students = await this.studentRepo.find({
      where: { id: In(dto.studentIds) },
    });

    if (students.length !== dto.studentIds.length) {
      throw new BadRequestException('One or more students not found');
    }

    const existingParticipantIds = conversation.participants.map(
      (p) => p.studentId,
    );
    const newStudentIds = dto.studentIds.filter(
      (id) => !existingParticipantIds.includes(id),
    );

    if (newStudentIds.length === 0) {
      throw new BadRequestException('All students are already participants');
    }

    const newParticipants = newStudentIds.map((studentId) =>
      this.participantRepo.create({
        conversationId,
        studentId,
      }),
    );

    await this.participantRepo.save(newParticipants);

    return this.getConversationById(conversationId, teacherId);
  }

  async deleteConversation(
    conversationId: number,
    teacherId: number,
  ): Promise<void> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Convert to numbers for comparison (handles bigint string issues)
    if (Number(conversation.teacherId) !== Number(teacherId)) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    await this.conversationRepo.remove(conversation);
  }
}
