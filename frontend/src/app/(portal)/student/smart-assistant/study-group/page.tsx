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
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// ============ MOCK DATA ============
const mockGroups: StudyGroup[] = [
  {
    id: 1,
    name: "Calculus Study Squad",
    subject: "Mathematics",
    topic: "Calculus",
    description: "A group for students to collaborate on calculus problems and concepts.",
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
    name: "CS Study Group",
    subject: "Computer Science",
    topic: "Data Structures",
    description: "Learn and practice data structures together.",
    privacy: "public",
    memberCount: 8,
    onlineCount: 2,
    lastActivity: "2 hours ago",
    nextSession: {
      date: "Tomorrow",
      time: "2:00 PM",
      topic: "Binary Trees",
      videoLink: "https://zoom.us/j/123456789",
    },
    isAdmin: false,
  },
  {
    id: 3,
    name: "Physics Problem Solvers",
    subject: "Physics",
    topic: "Mechanics",
    description: "Solve physics problems and discuss concepts.",
    privacy: "private",
    memberCount: 4,
    onlineCount: 1,
    lastActivity: "1 day ago",
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
    content: "Sure! The formula is ∫u dv = uv - ∫v du. You need to choose u and dv wisely.",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: 3,
    userId: 3,
    userName: "Mike Johnson",
    content: "I always use LIATE to choose u: Logarithmic, Inverse trig, Algebraic, Trig, Exponential",
    timestamp: "10:35 AM",
    isCurrentUser: false,
  },
  {
    id: 4,
    userId: 2,
    userName: "Sarah Chen",
    content: "That makes so much sense! Thanks guys 🙌",
    timestamp: "10:38 AM",
    isCurrentUser: false,
  },
  {
    id: 5,
    userId: 1,
    userName: "You",
    content: "No problem! Let me share some practice problems in the resources tab.",
    timestamp: "10:40 AM",
    isCurrentUser: true,
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
    type: "file",
    name: "Practice_Problems.pdf",
    url: "/files/practice.pdf",
    size: "856 KB",
    addedBy: "You",
    addedAt: "1 week ago",
  },
  {
    id: 3,
    type: "link",
    name: "Khan Academy - Integration",
    url: "https://khanacademy.org/math/calculus",
    addedBy: "Mike Johnson",
    addedAt: "3 days ago",
  },
  {
    id: 4,
    type: "link",
    name: "MIT OpenCourseWare - Calculus",
    url: "https://ocw.mit.edu/courses/mathematics",
    addedBy: "Sarah Chen",
    addedAt: "5 days ago",
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
    date: "Tomorrow",
    time: "2:00 PM",
    topic: "Practice Problems Session",
    hostName: "You",
    videoLink: "https://zoom.us/j/123456789",
    status: "upcoming",
  },
  {
    id: 3,
    date: "Dec 1",
    time: "3:00 PM",
    topic: "Derivatives Deep Dive",
    hostName: "Mike Johnson",
    status: "completed",
    attendeeCount: 4,
  },
];

const mockMembers: GroupMember[] = [
  { id: 1, name: "You", isOnline: true, isAdmin: true, isCurrentUser: true },
  { id: 2, name: "Sarah Chen", isOnline: true, isAdmin: true, isCurrentUser: false },
  { id: 3, name: "Mike Johnson", isOnline: true, isAdmin: false, isCurrentUser: false },
  { id: 4, name: "Emma Wilson", isOnline: false, isAdmin: false, isCurrentUser: false },
  { id: 5, name: "David Brown", isOnline: false, isAdmin: false, isCurrentUser: false },
];

const mockDiscoverGroups: StudyGroup[] = [
  {
    id: 101,
    name: "Linear Algebra Masters",
    subject: "Mathematics",
    topic: "Linear Algebra",
    description: "Master linear algebra concepts together.",
    privacy: "public",
    memberCount: 12,
    onlineCount: 4,
    lastActivity: "30 min ago",
    isAdmin: false,
  },
  {
    id: 102,
    name: "Organic Chemistry Help",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    description: "Help each other with organic chemistry.",
    privacy: "public",
    memberCount: 15,
    onlineCount: 6,
    lastActivity: "1 hour ago",
    isAdmin: false,
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
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg text-left transition-all",
        "border border-transparent",
        "hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600",
        isSelected
          ? "bg-brand-primary/10 dark:bg-brand-primary/20 border-l-2 border-l-brand-primary"
          : "bg-gray-50/80 dark:bg-gray-700/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {group.name}
            </h4>
            {group.privacy === "private" ? (
              <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            ) : (
              <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {group.memberCount} members • {group.onlineCount} online
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {group.lastActivity}
          </p>
        </div>
        {group.nextSession && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}
      </div>
      {group.nextSession && (
        <div className="mt-2 p-2 rounded-md bg-brand-secondary/10 dark:bg-brand-secondary/20">
          <p className="text-xs text-brand-secondary font-medium">
            📅 {group.nextSession.date}, {group.nextSession.time}
          </p>
        </div>
      )}
    </button>
  );
}

// Message Bubble
function MessageBubble({ message }: { message: GroupMessage }) {
  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        message.isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
          message.isCurrentUser
            ? "bg-brand-primary text-white"
            : "bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 text-brand-secondary"
        )}
      >
        {message.userName.charAt(0)}
      </div>
      <div className={cn("max-w-[75%]", message.isCurrentUser ? "text-right" : "text-left")}>
        {!message.isCurrentUser && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{message.userName}</p>
        )}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl inline-block",
            message.isCurrentUser
              ? "bg-brand-primary text-white rounded-br-md"
              : "bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-bl-md"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p
          className={cn(
            "text-xs mt-1",
            message.isCurrentUser ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

// Resource Item
function ResourceItem({ resource }: { resource: GroupResource }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            resource.type === "file"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          )}
        >
          {resource.type === "file" ? (
            <File className="w-5 h-5" />
          ) : (
            <LinkIcon className="w-5 h-5" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {resource.size && `${resource.size} • `}
            {resource.addedBy} • {resource.addedAt}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-brand-primary"
      >
        {resource.type === "file" ? (
          <Download className="w-4 h-4" />
        ) : (
          <LinkIcon className="w-4 h-4" />
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
        "p-4 rounded-lg border transition-colors",
        isUpcoming
          ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          : "bg-gray-50/80 dark:bg-gray-700/30 border-transparent"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-secondary" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {session.date}, {session.time}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{session.topic}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Hosted by: {session.hostName}
            {session.attendeeCount && ` • ${session.attendeeCount} attended`}
          </p>
        </div>
        {isUpcoming && session.videoLink && (
          <Button
            size="sm"
            className="bg-brand-secondary hover:bg-brand-secondary/90 text-white"
          >
            <VideoCamera className="w-4 h-4 mr-1" />
            Join
          </Button>
        )}
        {!isUpcoming && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
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
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/30">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 flex items-center justify-center text-sm font-semibold text-brand-secondary">
            {member.name.charAt(0)}
          </div>
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
              member.isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {member.name}
              {member.isCurrentUser && " (You)"}
            </p>
            {member.isAdmin && (
              <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <Crown className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {member.isOnline ? "Online" : "Offline"}
          </p>
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
  const [activeTab, setActiveTab] = useState<"my-groups" | "discover" | "invitations">("my-groups");
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(mockGroups[0]);
  const [groupTab, setGroupTab] = useState<"chat" | "resources" | "sessions" | "members">("chat");
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const groups = activeTab === "my-groups" ? mockGroups : activeTab === "discover" ? mockDiscoverGroups : [];

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 flex items-center justify-center">
            <UsersThree className="w-6 h-6 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Study Groups</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Collaborate and learn together
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Create Group</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className={cn("flex gap-2", isMobileDetailView && "hidden lg:flex")}>
        {[
          { id: "my-groups", label: "My Groups" },
          { id: "discover", label: "Discover" },
          { id: "invitations", label: "Invitations", badge: 2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.id
                ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Groups Sidebar */}
        <Card
          className={cn(
            "w-full lg:w-80 flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm",
            isMobileDetailView && "hidden lg:flex"
          )}
        >
          <CardHeader className="py-3 px-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-2 space-y-2">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <UsersThree className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No groups found</p>
              </div>
            ) : (
              groups.map((group) => (
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
              "flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm",
              !isMobileDetailView && "hidden lg:flex"
            )}
          >
            {/* Group Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedGroup.name}
                    </h2>
                    {selectedGroup.privacy === "private" ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedGroup.subject} • {selectedGroup.topic}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    👥 {selectedGroup.memberCount} members • 🟢 {selectedGroup.onlineCount} online
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <DotsThree className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Group Tabs */}
            <div className="flex gap-1 px-4 pt-2 border-b border-gray-100 dark:border-gray-700">
              {[
                { id: "chat", label: "Chat", icon: ChatCircle },
                { id: "resources", label: "Resources", icon: Folder },
                { id: "sessions", label: "Sessions", icon: Calendar },
                { id: "members", label: "Members", icon: UsersThree },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGroupTab(tab.id as typeof groupTab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
                    groupTab === tab.id
                      ? "bg-gray-100 dark:bg-gray-700/50 text-brand-primary border-b-2 border-brand-primary -mb-px"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
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
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-gray-200 dark:border-gray-600 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 rounded-xl h-12 w-12 border-gray-200 dark:border-gray-600"
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={() => setIsRecording(!isRecording)}
                        className={cn(
                          "flex-shrink-0 rounded-xl h-12 w-12",
                          !isRecording && "border-gray-200 dark:border-gray-600"
                        )}
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
                        className="flex-shrink-0 rounded-xl h-12 w-12 bg-brand-primary hover:bg-brand-primary/90"
                      >
                        <PaperPlaneRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {groupTab === "resources" && (
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Shared Resources
                    </h3>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
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

              {groupTab === "sessions" && (
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Study Sessions
                    </h3>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Upcoming
                    </h4>
                    {mockSessions
                      .filter((s) => s.status === "upcoming")
                      .map((session) => (
                        <SessionItem key={session.id} session={session} />
                      ))}
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-4">
                      Past Sessions
                    </h4>
                    {mockSessions
                      .filter((s) => s.status === "completed")
                      .map((session) => (
                        <SessionItem key={session.id} session={session} />
                      ))}
                  </div>
                </CardContent>
              )}

              {groupTab === "members" && (
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Members ({mockMembers.length})
                    </h3>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Invite
                    </Button>
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
          <Card className="hidden lg:flex flex-1 items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <UsersThree className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Select a group to view details</p>
            </div>
          </Card>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
