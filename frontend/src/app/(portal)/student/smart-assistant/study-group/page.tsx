"use client";

import { useState, useRef, useEffect } from "react";
import {
  UsersThree,
  ChatCircle,
  Folder,
  Calendar,
  Plus,
  PaperPlaneRight,
  Microphone,
  MicrophoneSlash,
  Paperclip,
  Crown,
  Globe,
  Lock,
  VideoCamera,
  File,
  Link as LinkIcon,
  ArrowLeft,
  X,
  MagnifyingGlass,
  DotsThree,
  Download,
  CaretDown,
  Envelope,
  Check,
  XCircle,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============ HELPER FUNCTIONS ============
const getSubjectColor = (subject: string) => {
  const colors = {
    Mathematics: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-700", badge: "bg-blue-100 dark:bg-blue-900/40" },
    "Computer Science": { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-700", badge: "bg-purple-100 dark:bg-purple-900/40" },
    Physics: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-700", badge: "bg-emerald-100 dark:bg-emerald-900/40" },
    Chemistry: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-700", badge: "bg-amber-100 dark:bg-amber-900/40" },
  };
  return colors[subject as keyof typeof colors] || { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700", badge: "bg-gray-100 dark:bg-gray-700" };
};

// ============ TYPES ============
interface StudyGroup {
  id: number;
  name: string;
  subject: string;
  topic: string;
  description: string;
  privacy: "public" | "private";
  memberCount: number;
  onlineCount: number;
  lastActivity: string;
  nextSession?: {
    date: string;
    time: string;
    topic: string;
    videoLink?: string;
  };
  isAdmin: boolean;
}

interface GroupMessage {
  id: number;
  userId: number;
  userName: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface GroupResource {
  id: number;
  type: "file" | "link";
  name: string;
  url: string;
  size?: string;
  addedBy: string;
  addedAt: string;
}

interface GroupSession {
  id: number;
  date: string;
  time: string;
  topic: string;
  hostName: string;
  videoLink?: string;
  status: "upcoming" | "completed";
  attendeeCount?: number;
}

interface GroupMember {
  id: number;
  name: string;
  isOnline: boolean;
  isAdmin: boolean;
  isCurrentUser: boolean;
}

interface GroupInvitation {
  id: number;
  groupName: string;
  subject: string;
  invitedBy: string;
  invitedAt: string;
  memberCount: number;
}

// ============ MOCK DATA ============
const mockGroups: StudyGroup[] = [
  {
    id: 1,
    name: "Calculus Study Squad",
    subject: "Mathematics",
    topic: "Calculus",
    description: "Collaborative space for mastering calculus concepts and problem-solving.",
    privacy: "private",
    memberCount: 5,
    onlineCount: 3,
    lastActivity: "10 min ago",
    nextSession: {
      date: "Today",
      time: "4:00 PM",
      topic: "Integration Review",
      videoLink: "https://meet.google.com/abc-defg-hij",
    },
    isAdmin: true,
  },
  {
    id: 2,
    name: "Data Structures Hub",
    subject: "Computer Science",
    topic: "Data Structures",
    description: "Master data structures and algorithms through collaborative learning.",
    privacy: "public",
    memberCount: 8,
    onlineCount: 2,
    lastActivity: "2 hours ago",
    isAdmin: false,
  },
];

const mockMessages: GroupMessage[] = [
  {
    id: 1,
    userId: 2,
    userName: "Sarah Chen",
    content: "Hey everyone! Can someone explain integration by parts?",
    timestamp: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: 2,
    userId: 1,
    userName: "You",
    content: "Sure! The formula is ∫u dv = uv - ∫v du. Use LIATE to choose u wisely.",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: 3,
    userId: 2,
    userName: "Sarah Chen",
    content: "That makes so much sense! Thanks! 🙌",
    timestamp: "10:35 AM",
    isCurrentUser: false,
  },
];

const mockResources: GroupResource[] = [
  {
    id: 1,
    type: "file",
    name: "Calculus_Notes_Ch5.pdf",
    url: "/files/calculus-notes.pdf",
    size: "1.2 MB",
    addedBy: "Sarah Chen",
    addedAt: "2 days ago",
  },
  {
    id: 2,
    type: "link",
    name: "Khan Academy - Integration",
    url: "https://khanacademy.org/math/calculus",
    addedBy: "You",
    addedAt: "3 days ago",
  },
];

const mockSessions: GroupSession[] = [
  {
    id: 1,
    date: "Today",
    time: "4:00 PM",
    topic: "Integration Review",
    hostName: "Sarah Chen",
    videoLink: "https://meet.google.com/abc-defg-hij",
    status: "upcoming",
  },
  {
    id: 2,
    date: "Dec 1",
    time: "3:00 PM",
    topic: "Derivatives Deep Dive",
    hostName: "You",
    status: "completed",
    attendeeCount: 4,
  },
];

const mockMembers: GroupMember[] = [
  { id: 1, name: "You", isOnline: true, isAdmin: true, isCurrentUser: true },
  { id: 2, name: "Sarah Chen", isOnline: true, isAdmin: true, isCurrentUser: false },
  { id: 3, name: "Mike Johnson", isOnline: false, isAdmin: false, isCurrentUser: false },
];

const mockInvitations: GroupInvitation[] = [
  {
    id: 1,
    groupName: "Advanced Algorithms Study Group",
    subject: "Computer Science",
    invitedBy: "Dr. Emily Watson",
    invitedAt: "2 hours ago",
    memberCount: 15,
  },
  {
    id: 2,
    groupName: "Quantum Physics Discussion",
    subject: "Physics",
    invitedBy: "Prof. Michael Chen",
    invitedAt: "1 day ago",
    memberCount: 8,
  },
  {
    id: 3,
    groupName: "Linear Algebra Mastery",
    subject: "Mathematics",
    invitedBy: "Sarah Chen",
    invitedAt: "3 days ago",
    memberCount: 12,
  },
];

// ============ SUB-COMPONENTS ============

// Group Card for sidebar
function GroupCard({
  group,
  isSelected,
  onClick,
}: {
  group: StudyGroup;
  isSelected: boolean;
  onClick: () => void;
}) {
  const subjectColor = getSubjectColor(group.subject);
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-left transition-all duration-200 border",
        isSelected
          ? "bg-white dark:bg-gray-800 border-brand-primary shadow-md ring-2 ring-brand-primary/20"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-semibold truncate",
              isSelected ? subjectColor.text : "text-gray-900 dark:text-white"
            )}>
              {group.name}
            </h4>
            {group.privacy === "private" ? (
              <div className="shrink-0 p-1 rounded bg-orange-100 dark:bg-orange-900/30">
                <Lock className="w-3 h-3 text-orange-600 dark:text-orange-400" />
              </div>
            ) : (
              <div className="shrink-0 p-1 rounded bg-green-100 dark:bg-green-900/30">
                <Globe className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
            )}
          </div>
          <span className={cn(
            "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",
            subjectColor.badge,
            subjectColor.text
          )}>
            {group.subject}
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <UsersThree className="w-3.5 h-3.5" />
              {group.memberCount}
            </span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {group.onlineCount} online
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {group.lastActivity}
          </p>
        </div>
        {group.nextSession && (
          <div className="shrink-0">
            <div className="relative w-2.5 h-2.5">
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              <div className="relative w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>
        )}
      </div>
      {group.nextSession && (
        <div className="mt-3 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {group.nextSession.date} at {group.nextSession.time}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
            {group.nextSession.topic}
          </p>
        </div>
      )}
    </button>
  );
}

// Message Bubble
function MessageBubble({ message }: { message: GroupMessage }) {
  const [showReactions, setShowReactions] = useState(false);
  
  return (
    <div
      className={cn(
        "flex gap-3 mb-4 group",
        message.isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white dark:ring-gray-800",
          message.isCurrentUser
            ? "bg-brand-primary text-white"
            : "bg-blue-500 dark:bg-blue-600 text-white"
        )}
      >
        {message.userName.charAt(0)}
      </div>
      <div className={cn("max-w-[75%] space-y-1", message.isCurrentUser ? "text-right" : "text-left")}>
        {!message.isCurrentUser && (
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{message.userName}</p>
        )}
        <div className="relative group/message">
          <div
            className={cn(
              "px-4 py-3 rounded-2xl inline-block shadow-sm transition-all duration-200 hover:shadow-md",
              message.isCurrentUser
                ? "bg-brand-primary text-white rounded-br-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600"
            )}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-xs",
              message.isCurrentUser ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}

// Resource Item
function ResourceItem({ resource }: { resource: GroupResource }) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
            resource.type === "file"
              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
              : "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
          )}
        >
          {resource.type === "file" ? (
            <File className="w-5 h-5" weight="duotone" />
          ) : (
            <LinkIcon className="w-5 h-5" weight="duotone" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">{resource.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
            {resource.size && <><span className="font-medium">{resource.size}</span> <span>•</span></>}
            <span>{resource.addedBy}</span>
            <span>•</span>
            <span>{resource.addedAt}</span>
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
      >
        {resource.type === "file" ? (
          <Download className="w-5 h-5" weight="bold" />
        ) : (
          <LinkIcon className="w-5 h-5" weight="bold" />
        )}
      </Button>
    </div>
  );
}

// Session Item
function SessionItem({ session }: { session: GroupSession }) {
  const isUpcoming = session.status === "upcoming";

  return (
    <div
      className={cn(
        "p-4 rounded-xl border-2 transition-all duration-200",
        isUpcoming
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md"
          : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "p-1.5 rounded-lg",
              isUpcoming ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-200 dark:bg-gray-700"
            )}>
              <Calendar className={cn(
                "w-4 h-4",
                isUpcoming ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              )} weight="duotone" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                {session.date}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {session.time}
              </span>
            </div>
            {isUpcoming && (
              <span className="ml-auto px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Upcoming
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{session.topic}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <UsersThree className="w-3.5 h-3.5" />
              {session.hostName}
            </span>
            {session.attendeeCount && (
              <>
                <span>•</span>
                <span>{session.attendeeCount} attended</span>
              </>
            )}
          </div>
        </div>
        {isUpcoming && session.videoLink && (
          <Button
            size="sm"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg"
          >
            <VideoCamera className="w-4 h-4 mr-1.5" weight="fill" />
            Join Now
          </Button>
        )}
        {!isUpcoming && (
          <span className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
            Completed
          </span>
        )}
      </div>
    </div>
  );
}

// Member Item
function MemberItem({ member }: { member: GroupMember }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-brand-primary/30 dark:hover:border-brand-primary/30 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
            {member.name.charAt(0)}
          </div>
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm",
              member.isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          >
            {member.isOnline && (
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {member.name}
              {member.isCurrentUser && <span className="text-brand-primary"> (You)</span>}
            </p>
            {member.isAdmin && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-medium shrink-0">
                <Crown className="w-3 h-3" weight="fill" />
                Admin
              </span>
            )}
          </div>
          <p className={cn(
            "text-xs font-medium",
            member.isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
          )}>
            {member.isOnline ? "● Online" : "○ Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Invitations Modal
function InvitationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const handleAccept = (invitationId: number) => {
    // In real app, accept invitation via backend
    console.log("Accepted invitation:", invitationId);
  };

  const handleDecline = (invitationId: number) => {
    // In real app, decline invitation via backend
    console.log("Declined invitation:", invitationId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
              <Envelope className="w-5 h-5 text-brand-primary" weight="fill" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Group Invitations
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mockInvitations.length} pending invitation{mockInvitations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(80vh-140px)]">
          {mockInvitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                <Envelope className="w-16 h-16 text-gray-400 dark:text-gray-600" weight="duotone" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Invitations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You don't have any pending group invitations at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockInvitations.map((invitation) => {
                const subjectColor = getSubjectColor(invitation.subject);
                return (
                  <div
                    key={invitation.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          {invitation.groupName}
                        </h3>
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",
                          subjectColor.badge,
                          subjectColor.text
                        )}>
                          {invitation.subject}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <UsersThree className="w-4 h-4" />
                            {invitation.memberCount} members
                          </span>
                          <span>•</span>
                          <span>Invited by {invitation.invitedBy}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {invitation.invitedAt}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invitation.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" weight="bold" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invitation.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <XCircle className="w-4 h-4 mr-1" weight="bold" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create Group Modal
function CreateGroupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("private");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create Study Group
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Calculus Study Squad"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Calculus"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your study group..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Privacy
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === "public"}
                  onChange={() => setPrivacy("public")}
                  className="text-brand-primary"
                />
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Public</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Anyone can find and join</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === "private"}
                  onChange={() => setPrivacy("private")}
                  className="text-brand-primary"
                />
                <Lock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Private</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Invite only</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function StudyGroupPage() {
  const [activeTab, setActiveTab] = useState<"my-groups">("my-groups");
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(mockGroups[0]);
  const [groupTab, setGroupTab] = useState<"chat" | "resources" | "members">("chat");
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In real app, send message to backend
    setMessageInput("");
  };

  const handleGroupSelect = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsMobileDetailView(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobileDetailView && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileDetailView(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
            <UsersThree className="w-6 h-6 text-brand-primary" weight="fill" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Study Groups</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Collaborate and learn together
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowInvitations(true)}
            variant="outline"
            className="relative"
          >
            <Envelope className="w-4 h-4 sm:mr-2" weight="fill" />
            <span className="hidden sm:inline">Invitations</span>
            {mockInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {mockInvitations.length}
              </span>
            )}
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Group</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Groups Sidebar */}
        <Card
          className={cn(
            "w-full lg:w-80 shrink-0 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden",
            isMobileDetailView && "hidden lg:flex"
          )}
        >
          <CardHeader className="py-4 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-3 space-y-2">
            {mockGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="mb-6 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <UsersThree className="w-16 h-16 text-gray-400 dark:text-gray-600" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Study Groups Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-xs">
                  Create your first group or join existing ones to start collaborating with peers
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </div>
            ) : (
              mockGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isSelected={selectedGroup?.id === group.id}
                  onClick={() => handleGroupSelect(group)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Group Detail */}
        {selectedGroup ? (
          <Card
            className={cn(
              "flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden",
              !isMobileDetailView && "hidden lg:flex"
            )}
          >
            {/* Group Tabs */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {[
                  { id: "chat", label: "Chat", icon: ChatCircle },
                  { id: "resources", label: "Resources", icon: Folder },
                  { id: "members", label: "Members", icon: UsersThree },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setGroupTab(tab.id as typeof groupTab)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      groupTab === tab.id
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <tab.icon className="w-4 h-4" weight={groupTab === tab.id ? "fill" : "regular"} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {groupTab === "chat" && (
                <>
                  <CardContent className="flex-1 overflow-auto p-4">
                    {mockMessages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={chatEndRef} />
                  </CardContent>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 rounded-xl h-12 w-12"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={() => setIsRecording(!isRecording)}
                        className="shrink-0 rounded-xl h-12 w-12"
                      >
                        {isRecording ? (
                          <MicrophoneSlash className="w-5 h-5" />
                        ) : (
                          <Microphone className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="shrink-0 rounded-xl h-12 w-12 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 shadow-sm"
                      >
                        <PaperPlaneRight className="w-5 h-5" weight="fill" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {groupTab === "resources" && (
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-brand-primary" weight="fill" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Shared Resources
                      </h3>
                    </div>
                    <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Resource
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Files
                    </h4>
                    {mockResources
                      .filter((r) => r.type === "file")
                      .map((resource) => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-4">
                      Links
                    </h4>
                    {mockResources
                      .filter((r) => r.type === "link")
                      .map((resource) => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                  </div>
                </CardContent>
              )}

              {groupTab === "members" && (
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <UsersThree className="w-5 h-5 text-brand-primary" weight="fill" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Members <span className="text-gray-500 dark:text-gray-400">({mockMembers.length})</span>
                      </h3>
                    </div>
                    {selectedGroup.isAdmin && (
                      <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-1" />
                        Invite Members
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {mockMembers.map((member) => (
                      <MemberItem key={member.id} member={member} />
                    ))}
                  </div>
                </CardContent>
              )}
            </div>
          </Card>
        ) : (
          <Card className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-center px-8 py-12">
              <div className="mb-6 p-6 rounded-full bg-gray-100 dark:bg-gray-800 inline-block">
                <UsersThree className="w-20 h-20 text-gray-400 dark:text-gray-600" weight="duotone" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select a Study Group
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Choose a group from the sidebar to view conversations, resources, and upcoming sessions
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Invitations Modal */}
      <InvitationsModal isOpen={showInvitations} onClose={() => setShowInvitations(false)} />

      {/* Create Group Modal */}
      <CreateGroupModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
