import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TeacherConversation } from 'src/database/entities/teacher/teacher-conversation.entity';
import { TeacherConversationParticipant } from 'src/database/entities/teacher/teacher-conversation-participant.entity';
import { TeacherMessage, MessageSenderType } from 'src/database/entities/teacher/teacher-message.entity';
import { StudentUser } from 'src/database/entities/student/student-user.entity';
import { TeacherUser } from 'src/database/entities/teacher/teacher-user.entity';
import { StudentEnrollment } from 'src/database/entities/student/student-enrollment.entity';
import { TeacherCourseOffering } from 'src/database/entities/teacher/teacher-course-offering.entity';
import { SendMessageDto } from 'src/modules/teacher/dto/messaging/send-message.dto';
import { EnrollmentStatus } from 'src/common/enums/status.enum';

@Injectable()
export class StudentMessagingService {
  constructor(
    @InjectRepository(TeacherConversation)
    private conversationRepo: Repository<TeacherConversation>,
    @InjectRepository(TeacherConversationParticipant)
    private participantRepo: Repository<TeacherConversationParticipant>,
    @InjectRepository(TeacherMessage)
    private messageRepo: Repository<TeacherMessage>,
    @InjectRepository(StudentUser)
    private studentRepo: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private teacherRepo: Repository<TeacherUser>,
    @InjectRepository(StudentEnrollment)
    private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(TeacherCourseOffering)
    private courseOfferingRepo: Repository<TeacherCourseOffering>,
  ) {}

  /**
   * Get all teachers for a student (based on their enrollments)
   */
  async getStudentTeachers(studentId: number): Promise<any[]> {
    // Get student's active enrollments
    const enrollments = await this.enrollmentRepo.find({
      where: { studentId, status: EnrollmentStatus.ACTIVE },
      relations: ['courseOffering'],
    });

    if (enrollments.length === 0) {
      return [];
    }

    // Get unique course offering IDs
    const courseOfferingIds = [
      ...new Set(enrollments.map((e) => e.courseOfferingId)),
    ];

    // Get teachers for these course offerings
    const courseOfferings = await this.courseOfferingRepo.find({
      where: { id: In(courseOfferingIds) },
      relations: ['teacher'],
    });

    // Extract unique teachers
    const teacherMap = new Map();
    courseOfferings.forEach((offering) => {
      if (offering.teacher && !teacherMap.has(offering.teacher.id)) {
        teacherMap.set(offering.teacher.id, {
          id: offering.teacher.id,
          firstName: offering.teacher.firstName,
          lastName: offering.teacher.lastName,
          email: offering.teacher.email,
          profileImage: offering.teacher.profileImage,
        });
      }
    });

    return Array.from(teacherMap.values());
  }

  /**
   * Create a conversation from student side
   */
  async createConversationAsStudent(
    teacherId: number,
    studentId: number,
    title?: string,
  ): Promise<any> {
    // Verify teacher exists
    const teacher = await this.teacherRepo.findOne({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Verify student is enrolled in at least one of teacher's courses
    const studentTeachers = await this.getStudentTeachers(studentId);
    const hasTeacher = studentTeachers.some((t) => Number(t.id) === Number(teacherId));

    if (!hasTeacher) {
      throw new ForbiddenException(
        'You can only start conversations with your teachers',
      );
    }

    // Create conversation
    const conversation = this.conversationRepo.create({
      teacherId,
      title:
        title ||
        `Conversation with ${teacher.firstName} ${teacher.lastName}`,
    });

    const savedConversation = await this.conversationRepo.save(conversation);

    // Add student as participant
    const participant = this.participantRepo.create({
      conversationId: savedConversation.id,
      studentId,
    });

    await this.participantRepo.save(participant);

    return this.getConversationById(savedConversation.id, studentId);
  }

  /**
   * Get all conversations for a student
   */
  async getStudentConversations(studentId: number): Promise<any[]> {
    // Find all conversations where the student is a participant
    const participants = await this.participantRepo.find({
      where: { studentId },
      relations: ['conversation', 'conversation.participants', 'conversation.participants.student'],
    });

    // Build conversation list with metadata
    const conversations = await Promise.all(
      participants.map(async (participant) => {
        const conversation = participant.conversation;

        // Get teacher info
        const teacher = await this.teacherRepo.findOne({
          where: { id: conversation.teacherId },
        });

        // Get last message
        const lastMessage = await this.messageRepo.findOne({
          where: { conversationId: conversation.id },
          order: { createdAt: 'DESC' },
          relations: ['senderTeacher', 'senderStudent'],
        });

        // Get unread count for student
        const unreadCount = await this.messageRepo.count({
          where: {
            conversationId: conversation.id,
            senderType: MessageSenderType.TEACHER, // Only count teacher messages
            isRead: false,
          },
        });

        // Map participants
        const participantList = conversation.participants.map((p) => ({
          id: p.student.id,
          firstName: p.student.firstName,
          lastName: p.student.lastName,
          email: p.student.email,
          profileImage: p.student.profileImage,
          joinedAt: p.joinedAt,
        }));

        return {
          id: conversation.id,
          title: conversation.title,
          teacher: teacher
            ? {
                id: teacher.id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                profileImage: teacher.profileImage,
              }
            : null,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderType: lastMessage.senderType,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          participants: participantList,
          createdAt: conversation.createdAt,
          updatedAt: conversation.lastMessageAt || conversation.createdAt,
        };
      }),
    );

    // Sort by most recent activity
    return conversations.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  /**
   * Get conversation details by ID (student must be a participant)
   */
  async getConversationById(
    conversationId: number,
    studentId: number,
  ): Promise<any> {
    // Check if student is a participant
    const participant = await this.participantRepo.findOne({
      where: { conversationId, studentId },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participants', 'participants.student'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Mark all teacher messages in this conversation as read for this student
    await this.messageRepo.update(
      {
        conversationId,
        senderType: MessageSenderType.TEACHER,
        isRead: false,
      },
      { isRead: true },
    );

    // Get teacher info
    const teacher = await this.teacherRepo.findOne({
      where: { id: conversation.teacherId },
    });

    const messages = await this.messageRepo.find({
      where: { conversationId },
      relations: ['senderTeacher', 'senderStudent'],
      order: { createdAt: 'ASC' },
    });

    const formattedMessages = messages.map((msg) => {
      const sender =
        msg.senderType === MessageSenderType.TEACHER && msg.senderTeacher
          ? {
              id: msg.senderTeacher.id,
              firstName: msg.senderTeacher.firstName,
              lastName: msg.senderTeacher.lastName,
              email: msg.senderTeacher.email,
              profileImage: msg.senderTeacher.profileImage,
            }
          : msg.senderStudent
          ? {
              id: msg.senderStudent.id,
              firstName: msg.senderStudent.firstName,
              lastName: msg.senderStudent.lastName,
              email: msg.senderStudent.email,
              profileImage: msg.senderStudent.profileImage,
            }
          : {
              id: 0,
              firstName: 'Unknown',
              lastName: 'User',
              email: '',
              profileImage: null,
            };

      return {
        id: msg.id,
        content: msg.content,
        senderType: msg.senderType,
        sender,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      };
    });

    const participantList = conversation.participants.map((p) => ({
      id: p.student.id,
      firstName: p.student.firstName,
      lastName: p.student.lastName,
      email: p.student.email,
      profileImage: p.student.profileImage,
      joinedAt: p.joinedAt,
    }));

    return {
      id: conversation.id,
      title: conversation.title,
      teacher: teacher
        ? {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            profileImage: teacher.profileImage,
          }
        : null,
      participants: participantList,
      messages: formattedMessages,
      createdAt: conversation.createdAt,
    };
  }

  /**
   * Send a message as a student
   */
  async sendMessage(
    conversationId: number,
    dto: SendMessageDto,
    studentId: number,
  ): Promise<any> {
    // Check if student is a participant
    const participant = await this.participantRepo.findOne({
      where: { conversationId, studentId },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }

    const message = this.messageRepo.create({
      conversationId,
      senderType: MessageSenderType.STUDENT,
      senderStudentId: studentId,
      content: dto.content,
      isRead: false,
    });

    const savedMessage = await this.messageRepo.save(message);

    // Update conversation's lastMessageAt
    await this.conversationRepo.update(conversationId, {
      lastMessageAt: new Date(),
    });

    // Fetch the complete message with relations
    const messageWithSender = await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['senderTeacher', 'senderStudent'],
    });

    if (!messageWithSender || !messageWithSender.senderStudent) {
      throw new NotFoundException('Message not found after creation');
    }

    const sender = {
      id: messageWithSender.senderStudent.id,
      firstName: messageWithSender.senderStudent.firstName,
      lastName: messageWithSender.senderStudent.lastName,
      email: messageWithSender.senderStudent.email,
      profileImage: messageWithSender.senderStudent.profileImage,
    };

    return {
      id: messageWithSender.id,
      content: messageWithSender.content,
      senderType: messageWithSender.senderType,
      sender,
      createdAt: messageWithSender.createdAt,
      isRead: messageWithSender.isRead,
    };
  }
}
