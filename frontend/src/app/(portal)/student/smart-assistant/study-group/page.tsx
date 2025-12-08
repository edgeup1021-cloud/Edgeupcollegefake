"use client";

import { useEffect, useMemo, useState, useRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Plus, UsersThree, Lock, Globe, PaperPlaneRight, ArrowLeft } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/services/auth.service";
import {
  getStudentStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  getStudyGroupMessages,
  postStudyGroupMessage,
  deleteStudyGroup,
  getStudentPendingRequests,
  getPendingMembers,
  moderateMember,
} from "@/services/study-groups.service";
import type { StudyGroup, StudyGroupJoinType, StudyGroupMessage, PendingRequest, PendingMember } from "@/types/study-groups.types";
import { ApiClientError } from "@/services/api.client";
import { DeleteDialog } from "./DeleteDialog";
import { getSocket, disconnectSocket } from "@/lib/socket";

type CreateFormState = {
  name: string;
  description: string;
  subject: string;
  joinType: StudyGroupJoinType;
  maxMembers: number;
};

const defaultCreateForm: CreateFormState = {
  name: "",
  description: "",
  subject: "",
  joinType: "open",
  maxMembers: 25,
};

function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white",
        "focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary",
        props.className,
      )}
    />
  );
}

function FormTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white",
        "focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary",
        props.className,
      )}
    />
  );
}

function formatDate(ts?: string) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function StudyGroupPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [messages, setMessages] = useState<StudyGroupMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(defaultCreateForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Map<string, StudyGroupMessage>>(new Map());
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [showPendingRequestsPanel, setShowPendingRequestsPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedGroup = useMemo(
    () => groups.find((g) => Number(g.id) === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const membership = selectedGroup?.membership || null;
  const canChat = membership?.status === "joined";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    fetchGroups();
    fetchPendingRequests();
  }, [user, isAuthenticated, showAllPrograms]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedGroup || !user) return;
    fetchMessages(Number(selectedGroup.id));

    // Fetch pending members if user is moderator/owner
    if (membership?.role === 'owner' || membership?.role === 'moderator') {
      fetchPendingMembers(Number(selectedGroup.id));
    }

    const token = getAccessToken('student') || getAccessToken();
    const socket = getSocket(token || undefined);
    const doJoin = () => {
      console.log('📤 Emitting joinGroup for group:', selectedGroup.id);
      socket.emit("joinGroup", { groupId: selectedGroup.id }, (response: any) => {
        if (response?.success) {
          console.log('✅ Successfully joined room:', response.room);
          setSocketReady(true);
        } else {
          console.error('❌ Failed to join room:', response?.error);
          setError(`Failed to join chat: ${response?.error || 'Unknown error'}`);
          setSocketReady(false);
        }
      });
    };

    // Connection event handlers
    const handleConnect = () => {
      console.log('✅ Socket connected:', socket.id);
      // Note: setSocketReady(true) is now done in doJoin callback after successful room join
      doJoin();
    };

    const handleConnectError = (error: Error) => {
      console.error('❌ Socket connection error:', error);
      setError("Failed to connect to chat. Please refresh the page.");
      setSocketReady(false);
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 Socket disconnected:', reason);
      setSocketReady(false);
    };

    const handleError = (error: Error) => {
      console.error('❌ Socket error:', error);
    };

    const handler = (msg: StudyGroupMessage) => {
      console.log('📨 Received message:', msg);
      if (Number(msg.groupId) !== Number(selectedGroup.id)) {
        console.log('⚠️ Message groupId mismatch:', msg.groupId, 'vs', selectedGroup.id);
        return;
      }
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) {
          console.log('⚠️ Duplicate message ignored:', msg.id);
          return prev;
        }
        return [...prev, msg];
      });

      // Remove from pending if exists (socket delivered before API response)
      setPendingMessages((prev) => {
        const next = new Map(prev);
        // Find and remove any pending message with same content
        for (const [key, pendingMsg] of prev.entries()) {
          if (pendingMsg.content === msg.content &&
              pendingMsg.senderStudentId === msg.senderStudentId) {
            next.delete(key);
            break;
          }
        }
        return next;
      });
    };

    // Register all event listeners
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("newMessage", handler);

    // If already connected, join immediately
    if (socket.connected) {
      console.log('Socket already connected, joining group immediately');
      doJoin();
      // Note: setSocketReady(true) is now done in doJoin callback after successful room join
    }

    return () => {
      console.log('🧹 Cleaning up socket listeners for group:', selectedGroup.id);
      socket.emit("leaveGroup", { groupId: selectedGroup.id });
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("newMessage", handler);
      setSocketReady(false);
    };
  }, [selectedGroup?.id, user?.id]);

  async function fetchGroups() {
    if (!user) return;
    setLoadingGroups(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (showAllPrograms) {
        params.includeAllPrograms = true;
      }
      const data = await getStudentStudyGroups(user.id, params);
      setGroups(data);
      if (!selectedGroupId && data.length > 0) {
        setSelectedGroupId(Number(data[0].id));
      }
    } catch (err) {
      handleError(err, "Failed to load study groups");
    } finally {
      setLoadingGroups(false);
    }
  }

  async function fetchMessages(groupId: number) {
    if (!user) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await getStudyGroupMessages(user.id, groupId, { limit: 50 });
      setMessages(data);
    } catch (err) {
      handleError(err, "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function fetchPendingRequests() {
    if (!user) return;
    try {
      const data = await getStudentPendingRequests(user.id);
      setPendingRequests(data);
    } catch (err) {
      console.error('Failed to load pending requests:', err);
    }
  }

  async function fetchPendingMembers(groupId: number) {
    if (!user) return;
    try {
      const data = await getPendingMembers(user.id, groupId);
      setPendingMembers(data);
    } catch (err) {
      console.error('Failed to load pending members:', err);
    }
  }

  async function handleApprove(memberId: number) {
    if (!user || !selectedGroup) return;
    setBusy(true);
    setError(null);
    try {
      await moderateMember(user.id, selectedGroup.id as number, memberId, 'approve');
      await fetchPendingMembers(selectedGroup.id as number);
      await fetchGroups(); // Refresh to update member count
      // Clear error to show success
      setError(null);
    } catch (err) {
      handleError(err, 'Failed to approve member');
    } finally {
      setBusy(false);
    }
  }

  async function handleReject(memberId: number) {
    if (!user || !selectedGroup) return;
    setBusy(true);
    setError(null);
    try {
      await moderateMember(user.id, selectedGroup.id as number, memberId, 'reject');
      await fetchPendingMembers(selectedGroup.id as number);
      // Clear error to show success
      setError(null);
    } catch (err) {
      handleError(err, 'Failed to reject member');
    } finally {
      setBusy(false);
    }
  }

  function senderName(msg: StudyGroupMessage) {
    if (msg.senderStudent) {
      const { firstName = "", lastName = "" } = msg.senderStudent;
      const full = `${firstName} ${lastName}`.trim();
      if (full) return full;
    }
    if (msg.senderTeacher) {
      const { firstName = "", lastName = "" } = msg.senderTeacher;
      const full = `${firstName} ${lastName}`.trim();
      if (full) return full;
    }
    if (msg.senderStudentId) return `Student #${msg.senderStudentId}`;
    if (msg.senderTeacherId) return `Teacher #${msg.senderTeacherId}`;
    return "System";
  }

  function handleError(err: unknown, fallback: string) {
    console.error(err);
    if (err instanceof ApiClientError) {
      const message = Array.isArray(err.data.message) ? err.data.message.join(", ") : err.data.message;
      setError(message || fallback);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(fallback);
    }
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const payload: any = {
        name: createForm.name,
        description: createForm.description || undefined,
        subject: createForm.subject || undefined,
        // Automatically use student's program and batch
        program: user.program || undefined,
        batch: user.batch || undefined,
        // Don't include section - only program and batch
        joinType: createForm.joinType,
        maxMembers: createForm.maxMembers,
      };
      const newGroup = await createStudyGroup(user.id, payload);
      // Refresh groups to get proper membership data
      await fetchGroups();
      setSelectedGroupId(Number(newGroup.id));
      setCreateOpen(false);
      setCreateForm(defaultCreateForm);
    } catch (err) {
      handleError(err, "Failed to create group");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(group: StudyGroup) {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await joinStudyGroup(user.id, Number(group.id), undefined);
      await fetchGroups();
      await fetchPendingRequests(); // Update pending requests count
      setSelectedGroupId(Number(group.id));
    } catch (err) {
      // If already joined, refresh state so UI reflects membership
      if (err instanceof ApiClientError && err.statusCode === 409) {
        await fetchGroups();
        setSelectedGroupId(Number(group.id));
      }

      // Only show error if not a "already joined" conflict
      if (!(err instanceof ApiClientError && err.statusCode === 409)) {
        handleError(err, "Failed to join group");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave(group: StudyGroup) {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await leaveStudyGroup(user.id, Number(group.id));
      await fetchGroups();
      setSelectedGroupId(null);
      setMessages([]);
    } catch (err) {
      handleError(err, "Failed to leave group");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteGroup(group: StudyGroup) {
    if (!user) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteStudyGroup(user.id, Number(group.id));
      setGroups((prev) => prev.filter((g) => Number(g.id) !== Number(group.id)));
      if (selectedGroupId === Number(group.id)) {
        setSelectedGroupId(null);
        setMessages([]);
      }
      setDeleteOpen(false);
    } catch (err) {
      handleError(err, "Failed to delete group");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedGroup || !messageInput.trim()) return;
    if (!canChat) {
      setError("Join the group to send messages");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const trimmedContent = messageInput.trim();

    // Create optimistic message
    const optimisticMessage: StudyGroupMessage = {
      id: tempId as any,
      groupId: selectedGroup.id,
      senderStudentId: user.id,
      senderTeacherId: null,
      messageType: "text",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      senderStudent: {
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
      senderTeacher: null,
    };

    // Add to messages and pending
    setMessages((prev) => [...prev, optimisticMessage]);
    setPendingMessages((prev) => new Map(prev).set(tempId, optimisticMessage));
    setMessageInput("");
    setBusy(true);
    setError(null);

    try {
      const saved = await postStudyGroupMessage(user.id, Number(selectedGroup.id), trimmedContent);

      // Remove optimistic message and add real one
      setPendingMessages((prev) => {
        const next = new Map(prev);
        next.delete(tempId);
        return next;
      });

      setMessages((prev) => {
        // Replace temp with real message
        const filtered = prev.filter((m) => String(m.id) !== tempId);
        if (filtered.some((m) => m.id === saved.id)) {
          return filtered; // Already have it from socket
        }
        return [...filtered, saved];
      });
    } catch (err) {
      // Remove optimistic message on error
      setPendingMessages((prev) => {
        const next = new Map(prev);
        next.delete(tempId);
        return next;
      });

      setMessages((prev) => prev.filter((m) => String(m.id) !== tempId));
      handleError(err, "Failed to send message");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Please sign in as a student to access study groups.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Collaborate with peers</p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Study Groups</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowPendingRequestsPanel(!showPendingRequestsPanel)}
            variant="outline"
            className="relative"
          >
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-brand-primary text-white hover:bg-brand-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
          <Button variant="outline" onClick={fetchGroups} disabled={loadingGroups}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Your Groups</CardTitle>
            <span className="text-xs text-gray-500 dark:text-gray-400">{groups.length} total</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingGroups && <p className="text-sm text-gray-500">Loading groups...</p>}
            {!loadingGroups && groups.length === 0 && (
              <p className="text-sm text-gray-500">No groups yet. Create or join one to get started.</p>
            )}
            {groups.map((group) => {
              const isSelected = selectedGroupId === Number(group.id);
              const isPrivate = group.joinType === "approval";
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(Number(group.id))}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    isSelected
                      ? "border-brand-primary bg-brand-primary/5 shadow-sm"
                      : "border-gray-200 dark:border-gray-800 hover:border-brand-primary/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {group.name}
                        </h3>
                        {isPrivate ? (
                          <Lock className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Globe className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {group.subject && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {group.subject}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <UsersThree className="w-4 h-4" />
                        <span>{group.currentMembers}/{group.maxMembers} members</span>
                        <span>•</span>
                        <span className="capitalize">{group.joinType} join</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-800 min-h-[600px]">
          {!selectedGroup ? (
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500">Select or create a study group to get started.</p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-2">
                <div className="flex items-start gap-3">
                  <button
                    className="lg:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    onClick={() => setSelectedGroupId(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide">Study Group</p>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{selectedGroup.name}</h2>
                    {selectedGroup.subject && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedGroup.subject}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedGroup.program ? `${selectedGroup.program}` : "Open"} {selectedGroup.batch && `• Batch ${selectedGroup.batch}`} {selectedGroup.section && `• Section ${selectedGroup.section}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {membership?.status === "joined" ? (
                      <>
                        {membership.role === "owner" ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                            disabled={busy}
                          >
                            Delete Group
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeave(selectedGroup)}
                            disabled={busy}
                          >
                            Leave
                          </Button>
                        )}
                      </>
                    ) : (
                      <JoinControls
                        group={selectedGroup}
                        onJoin={() => handleJoin(selectedGroup)}
                        disabled={busy || membership?.status === "pending"}
                        pending={membership?.status === "pending"}
                      />
                    )}
                  </div>
                </div>
                {selectedGroup.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedGroup.description}</p>
                )}
                {membership?.status === "pending" && (
                  <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    Your join request is pending approval.
                  </div>
                )}
              </CardHeader>

              <CardContent className="grid grid-rows-[1fr_auto] gap-3 h-[520px]">
                <div className="overflow-y-auto pr-1">
                  {loadingMessages ? (
                    <p className="text-sm text-gray-500">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                  ) : (
                    <div className="space-y-3">
                    {messages.map((msg) => {
                      // Convert both to numbers for comparison to handle any type mismatches
                      const isSelf = msg.senderStudentId != null && Number(msg.senderStudentId) === Number(user.id);
                      const isPending = pendingMessages.has(msg.id as any);

                      // Debug logging
                      if (!isSelf && msg.senderStudentId) {
                        console.log('Message not identified as self:', {
                          msgSenderStudentId: msg.senderStudentId,
                          msgSenderStudentIdType: typeof msg.senderStudentId,
                          userId: user.id,
                          userIdType: typeof user.id,
                          comparison: Number(msg.senderStudentId) === Number(user.id),
                          message: msg.content,
                        });
                      }

                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isSelf ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-xl px-4 py-3 shadow-sm border relative",
                              isSelf
                                ? "bg-brand-primary text-white border-brand-primary"
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700",
                              isPending && "opacity-60"
                            )}
                          >
                            <div className="text-xs font-semibold mb-1 opacity-80">
                              {isSelf ? "You" : senderName(msg)}
                              {isPending && <span className="ml-2 text-[10px]">(Sending...)</span>}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <div className="text-[11px] opacity-70 mt-1">{formatDate(msg.createdAt)}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                    </div>
                  )}

                  {(membership?.role === 'owner' || membership?.role === 'moderator') && pendingMembers.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Pending Approval Requests</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {pendingMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 border rounded-lg border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-gray-900 dark:text-white">{member.studentName}</p>
                              <p className="text-xs text-gray-500">
                                {member.program && `${member.program}`}
                                {member.batch && ` • ${member.batch}`}
                                {member.section && ` • ${member.section}`}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                                onClick={() => handleApprove(member.id)}
                                disabled={busy}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                onClick={() => handleReject(member.id)}
                                disabled={busy}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <FormInput
                    placeholder={
                      membership?.status === "joined"
                        ? "Type a message..."
                        : "Join the group to chat"
                    }
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!canChat || busy}
                  />
                  <Button
                    type="submit"
                    disabled={!canChat || !messageInput.trim() || busy}
                    className="bg-brand-primary text-white hover:bg-brand-primary/90"
                  >
                    <PaperPlaneRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs uppercase text-gray-500">Create Study Group</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bring learners together</h3>
              </div>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Close
              </Button>
            </div>
            <form onSubmit={handleCreateGroup} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <FormInput
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g., Algorithms Peer Group"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Subject</label>
                  <FormInput
                    value={createForm.subject}
                    onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <FormTextarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="What will you cover in this group?"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Join Type</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    value={createForm.joinType}
                    onChange={(e) => setCreateForm({ ...createForm, joinType: e.target.value as StudyGroupJoinType })}
                  >
                    <option value="open">Open (auto join)</option>
                    <option value="approval">Approval required</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max Members</label>
                  <FormInput
                    type="number"
                    min={2}
                    max={500}
                    value={createForm.maxMembers}
                    onChange={(e) => setCreateForm({ ...createForm, maxMembers: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setCreateOpen(false)} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-primary text-white hover:bg-brand-primary/90"
                  disabled={busy}
                >
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGroup && membership?.role === "owner" && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() => handleDeleteGroup(selectedGroup)}
          loading={deleteLoading}
        />
      )}

      {showPendingRequestsPanel && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Your Pending Join Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div
                    key={req.membershipId}
                    className="flex items-center justify-between p-3 border rounded-lg border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium text-sm">{req.group.name}</p>
                      <p className="text-xs text-gray-500">
                        Requested {new Date(req.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function JoinControls({
  group,
  onJoin,
  disabled,
  pending,
}: {
  group: StudyGroup;
  onJoin: () => void;
  disabled: boolean;
  pending?: boolean;
}) {
  const needsApproval = group.joinType === "approval";

  return (
    <Button
      size="sm"
      onClick={onJoin}
      disabled={disabled || pending}
      className="bg-brand-primary text-white hover:bg-brand-primary/90"
    >
      {pending ? "Pending" : needsApproval ? "Request to Join" : "Join"}
    </Button>
  );
}
