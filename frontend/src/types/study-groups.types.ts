export type StudyGroupJoinType = 'open' | 'code' | 'approval';
export type StudyGroupStatus = 'active' | 'archived';
export type StudyGroupMemberRole = 'owner' | 'moderator' | 'member';
export type StudyGroupMemberStatus = 'joined' | 'pending' | 'rejected';

export interface StudyGroupMembership {
  id?: string | number;
  role: StudyGroupMemberRole;
  status: StudyGroupMemberStatus;
}

export interface StudyGroup {
  id: string | number;
  name: string;
  description?: string | null;
  subject?: string | null;
  program?: string | null;
  batch?: string | null;
  section?: string | null;
  joinType: StudyGroupJoinType;
  status: StudyGroupStatus;
  maxMembers: number;
  currentMembers: number;
  inviteCode?: string | null;
  membership?: StudyGroupMembership | null;
  createdAt?: string;
}

export interface CreateStudyGroupInput {
  name: string;
  description?: string;
  subject?: string;
  courseOfferingId?: number;
  program?: string;
  batch?: string;
  section?: string;
  joinType?: StudyGroupJoinType;
  inviteCode?: string;
  maxMembers?: number;
}

export interface JoinStudyGroupInput {
  inviteCode?: string;
}

export type StudyGroupMessageType = 'text' | 'system';

export interface StudyGroupMessageSender {
  id?: string | number;
  firstName?: string;
  lastName?: string;
}

export interface StudyGroupMessage {
  id: string | number;
  groupId: string | number;
  content: string;
  messageType: StudyGroupMessageType;
  createdAt: string;
  senderStudentId?: string | number | null;
  senderTeacherId?: string | number | null;
  senderStudent?: StudyGroupMessageSender | null;
  senderTeacher?: StudyGroupMessageSender | null;
}
