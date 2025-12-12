import { api } from './api.client';

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
}

export interface ConversationParticipant extends Student {
  joinedAt: Date;
}

export interface Message {
  id: number;
  content: string;
  senderType: 'teacher' | 'student';
  sender: Teacher | Student;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  teacher: Teacher | null;
  lastMessage: {
    content: string;
    senderType: 'teacher' | 'student';
    createdAt: Date;
  } | null;
  unreadCount: number;
  participants: ConversationParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDetail {
  id: number;
  title: string;
  teacher: Teacher | null;
  participants: ConversationParticipant[];
  messages: Message[];
  createdAt: Date;
}

export interface SendMessageDto {
  content: string;
}

export interface CreateConversationDto {
  teacherId: number;
  title?: string;
}

// Get all teachers for a student
export async function getStudentTeachers(studentId: number): Promise<Teacher[]> {
  return api.get<Teacher[]>(`/student/${studentId}/teachers`);
}

// Create a conversation as student
export async function createConversationAsStudent(
  studentId: number,
  dto: CreateConversationDto
): Promise<ConversationDetail> {
  return api.post<ConversationDetail>(
    `/student/${studentId}/conversations`,
    dto
  );
}

// Get all conversations for a student
export async function getStudentConversations(studentId: number): Promise<Conversation[]> {
  return api.get<Conversation[]>(`/student/${studentId}/conversations`);
}

// Get conversation details
export async function getConversationById(
  studentId: number,
  conversationId: number
): Promise<ConversationDetail> {
  return api.get<ConversationDetail>(
    `/student/${studentId}/conversations/${conversationId}`
  );
}

// Send a message
export async function sendMessage(
  studentId: number,
  conversationId: number,
  dto: SendMessageDto
): Promise<Message> {
  return api.post<Message>(
    `/student/${studentId}/conversations/${conversationId}/messages`,
    dto
  );
}
