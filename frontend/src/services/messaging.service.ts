import { api } from './api.client';

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
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  participants: ConversationParticipant[];
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderType: 'teacher' | 'student';
  } | null;
  unreadCount: number;
  createdAt: Date;
  lastMessageAt?: Date | null;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface CreateConversationInput {
  title?: string;
  studentIds: number[];
}

export interface SendMessageInput {
  content: string;
}

export interface AddParticipantsInput {
  studentIds: number[];
}

export async function createConversation(
  data: CreateConversationInput,
  teacherId: number
): Promise<ConversationDetail> {
  return api.post<ConversationDetail>(
    `/teacher/conversations?teacherId=${teacherId}`,
    data
  );
}

export async function getConversations(teacherId: number): Promise<Conversation[]> {
  return api.get<Conversation[]>(`/teacher/conversations?teacherId=${teacherId}`);
}

export async function getConversationById(
  conversationId: number,
  teacherId: number
): Promise<ConversationDetail> {
  return api.get<ConversationDetail>(
    `/teacher/conversations/${conversationId}?teacherId=${teacherId}`
  );
}

export async function sendMessage(
  conversationId: number,
  data: SendMessageInput,
  teacherId: number
): Promise<Message> {
  return api.post<Message>(
    `/teacher/conversations/${conversationId}/messages?teacherId=${teacherId}`,
    data
  );
}

export async function addParticipants(
  conversationId: number,
  data: AddParticipantsInput,
  teacherId: number
): Promise<ConversationDetail> {
  return api.post<ConversationDetail>(
    `/teacher/conversations/${conversationId}/participants?teacherId=${teacherId}`,
    data
  );
}

export async function deleteConversation(
  conversationId: number,
  teacherId: number
): Promise<void> {
  return api.delete<void>(
    `/teacher/conversations/${conversationId}?teacherId=${teacherId}`
  );
}

export async function getTeacherStudents(teacherId: number): Promise<{ students: Student[] }> {
  return api.get<{ students: Student[] }>(`/teacher/students?teacherId=${teacherId}`);
}
