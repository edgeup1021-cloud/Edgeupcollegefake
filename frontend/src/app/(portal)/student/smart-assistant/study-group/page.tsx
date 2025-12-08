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
} from "@/services/study-groups.service";
import type { StudyGroup, StudyGroupJoinType, StudyGroupMessage } from "@/types/study-groups.types";
import { ApiClientError } from "@/services/api.client";
import { DeleteDialog } from "./DeleteDialog";
import { getSocket, disconnectSocket } from "@/lib/socket";

type CreateFormState = {
  name: string;
  description: string;
  subject: string;
  program: string;
  batch: string;
  section: string;
  joinType: StudyGroupJoinType;
  inviteCode: string;
  maxMembers: number;
};

const defaultCreateForm: CreateFormState = {
  name: "",
  description: "",
  subject: "",
  program: "",
  batch: "",
  section: "",
  joinType: "open",
  inviteCode: "",
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
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Map<string, StudyGroupMessage>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
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
  }, [user, isAuthenticated]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedGroup || !user) return;
    fetchMessages(selectedGroup.id);

    const token = getAccessToken('student') || getAccessToken();
    const socket = getSocket(token || undefined);
    const doJoin = () => socket.emit("joinGroup", { groupId: selectedGroup.id });
    socket.on("connect", doJoin);
    doJoin();

    const handler = (msg: StudyGroupMessage) => {
      if (msg.groupId !== selectedGroup.id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
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
    socket.on("newMessage", handler);
    setSocketReady(true);

    return () => {
      socket.emit("leaveGroup", { groupId: selectedGroup.id });
      socket.off("connect", doJoin);
      socket.off("newMessage", handler);
      setSocketReady(false);
    };
  }, [selectedGroup?.id, user]);

  async function fetchGroups() {
    if (!user) return;
    setLoadingGroups(true);
    setError(null);
    try {
      const data = await getStudentStudyGroups(user.id, { limit: 50 });
      setGroups(data);
      if (!selectedGroupId && data.length > 0) {
        setSelectedGroupId(data[0].id);
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
        program: createForm.program || undefined,
        batch: createForm.batch || undefined,
        section: createForm.section || undefined,
        joinType: createForm.joinType,
        maxMembers: createForm.maxMembers,
      };
      if (createForm.joinType === "code") {
        payload.inviteCode = createForm.inviteCode;
      }
      const newGroup = await createStudyGroup(user.id, payload);
      setGroups((prev) => [newGroup, ...prev]);
      setSelectedGroupId(newGroup.id);
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
      await joinStudyGroup(user.id, group.id, group.joinType === "code" ? { inviteCode: joinCode } : undefined);
      await fetchGroups();
      setJoinCode("");
      setSelectedGroupId(group.id);
    } catch (err) {
      // If already joined, refresh state so UI reflects membership
      if (err instanceof ApiClientError && err.statusCode === 409) {
        await fetchGroups();
        setSelectedGroupId(group.id);
        setJoinCode("");
        return;
      }
      handleError(err, "Failed to join group");
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave(group: StudyGroup) {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      await leaveStudyGroup(user.id, group.id);
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
      await deleteStudyGroup(user.id, group.id);
      setGroups((prev) => prev.filter((g) => g.id !== group.id));
      if (selectedGroupId === group.id) {
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
      const saved = await postStudyGroupMessage(user.id, selectedGroup.id, trimmedContent);

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
        <div className="flex items-center gap-2">
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
              const isSelected = selectedGroupId === group.id;
              const isPrivate = group.joinType === "code" || group.joinType === "approval";
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
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
                        {membership.role === "owner" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                            disabled={busy}
                          >
                            Delete Group
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeave(selectedGroup)}
                          disabled={busy || membership.role === "owner"}
                        >
                          Leave
                        </Button>
                      </>
                    ) : (
                      <JoinControls
                        group={selectedGroup}
                        joinCode={joinCode}
                        onJoin={() => handleJoin(selectedGroup)}
                        onCodeChange={setJoinCode}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Program</label>
                  <FormInput
                    value={createForm.program}
                    onChange={(e) => setCreateForm({ ...createForm, program: e.target.value })}
                    placeholder="e.g., CSE"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Batch</label>
                  <FormInput
                    value={createForm.batch}
                    onChange={(e) => setCreateForm({ ...createForm, batch: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Section</label>
                  <FormInput
                    value={createForm.section}
                    onChange={(e) => setCreateForm({ ...createForm, section: e.target.value })}
                    placeholder="A"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Join Type</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    value={createForm.joinType}
                    onChange={(e) => setCreateForm({ ...createForm, joinType: e.target.value as StudyGroupJoinType })}
                  >
                    <option value="open">Open (auto join)</option>
                    <option value="code">Invite code</option>
                    <option value="approval">Approval required</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Invite Code (for code-based)</label>
                  <FormInput
                    value={createForm.inviteCode}
                    onChange={(e) => setCreateForm({ ...createForm, inviteCode: e.target.value })}
                    placeholder="Optional"
                    disabled={createForm.joinType !== "code"}
                  />
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
    </div>
  );
}

function JoinControls({
  group,
  joinCode,
  onCodeChange,
  onJoin,
  disabled,
  pending,
}: {
  group: StudyGroup;
  joinCode: string;
  onCodeChange: (v: string) => void;
  onJoin: () => void;
  disabled: boolean;
  pending?: boolean;
}) {
  const needsCode = group.joinType === "code";
  const needsApproval = group.joinType === "approval";

  return (
    <div className="flex items-center gap-2">
      {needsCode && (
        <FormInput
          placeholder="Invite code"
          value={joinCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-32"
        />
      )}
      <Button
        size="sm"
        onClick={onJoin}
        disabled={disabled || pending || (needsCode && !joinCode.trim())}
        className="bg-brand-primary text-white hover:bg-brand-primary/90"
      >
        {pending ? "Pending" : needsApproval ? "Request to Join" : "Join"}
      </Button>
    </div>
  );
}
