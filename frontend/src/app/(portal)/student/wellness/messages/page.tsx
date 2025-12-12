"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, MessageSquare, Send, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getStudentConversations,
  getConversationById,
  sendMessage,
  getStudentTeachers,
  createConversationAsStudent,
  Conversation,
  ConversationDetail,
  Message,
  Teacher,
} from "@/services/student-messaging.service";
import { formatDistanceToNow } from "date-fns";
import { StartConversationDialog } from "./components/StartConversationDialog";

export default function StudentMessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDetail | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesPollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (showLoading = false) => {
    if (!user) return;

    if (showLoading) setLoading(true);
    try {
      const studentId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const [conversationsData, teachersData] = await Promise.all([
        getStudentConversations(studentId),
        getStudentTeachers(studentId),
      ]);
      setConversations(conversationsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setConversations([]);
      setTeachers([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: number) => {
    if (!user) return;

    try {
      const studentId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const details = await getConversationById(studentId, conversationId);
      setSelectedConversation(details);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  }, [user]);

  // Handle conversation selection
  const handleSelectConversation = async (conversation: Conversation) => {
    await loadMessages(conversation.id);
  };

  // Initial load
  useEffect(() => {
    if (user?.id && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadData(true); // Show loading spinner on initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Auto-refresh conversations list every 3 seconds
  useEffect(() => {
    if (!user) return;

    pollIntervalRef.current = setInterval(() => {
      loadData(false); // Don't show loading spinner on auto-refresh
    }, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, loadData]);

  // Auto-refresh messages for selected conversation every 2 seconds
  useEffect(() => {
    if (!user || !selectedConversation) return;

    messagesPollIntervalRef.current = setInterval(() => {
      loadMessages(selectedConversation.id);
    }, 2000);

    return () => {
      if (messagesPollIntervalRef.current) {
        clearInterval(messagesPollIntervalRef.current);
      }
    };
  }, [user, selectedConversation?.id, loadMessages]);

  // Scroll to bottom only when new messages arrive
  const prevMessageCountRef = useRef<number>(0);
  useEffect(() => {
    if (!selectedConversation?.messages) return;

    const currentCount = selectedConversation.messages.length;
    const prevCount = prevMessageCountRef.current;

    // Only scroll if message count increased (new message arrived)
    if (currentCount > prevCount) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessageCountRef.current = currentCount;
  }, [selectedConversation?.messages]);

  // Handle start conversation
  const handleStartConversation = useCallback(
    async (teacherId: number, title: string) => {
      if (!user) return;

      try {
        const studentId =
          typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
        const newConversation = await createConversationAsStudent(studentId, {
          teacherId,
          title,
        });
        await loadData(false);
        setSelectedConversation(newConversation);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        throw error;
      }
    },
    [user, loadData]
  );

  // Handle send message
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !selectedConversation || !messageContent.trim()) return;

      setSending(true);
      try {
        const studentId =
          typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
        const newMessage = await sendMessage(
          studentId,
          selectedConversation.id,
          { content: messageContent }
        );

        setSelectedConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : null
        );

        setMessageContent("");
        await loadData(false); // Refresh without loading spinner
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setSending(false);
      }
    },
    [user, selectedConversation, messageContent, loadData]
  );

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Teacher Messages</h1>
            <p className="text-muted-foreground mt-1">
              View and respond to messages from your teachers
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Start Conversation
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {/* Conversations List */}
        <Card className="col-span-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">
                Your teachers will start conversations with you
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {conversation.teacher
                          ? `${conversation.teacher.firstName} ${conversation.teacher.lastName}`
                          : conversation.title}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                  </div>
                  {conversation.lastMessage && (
                    <>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </p>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Conversation View */}
        <Card className="col-span-1 md:col-span-2 flex flex-col min-h-0">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {selectedConversation.teacher
                    ? `${selectedConversation.teacher.firstName} ${selectedConversation.teacher.lastName}`
                    : selectedConversation.title}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(
                  groupMessagesByDate(selectedConversation.messages)
                ).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center my-4">
                      <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                        {date}
                      </span>
                    </div>
                    {msgs.map((message) => {
                      const isOwnMessage = message.senderType === "student";
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          } mb-3`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwnMessage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1">
                                {message.sender.firstName}{" "}
                                {message.sender.lastName}
                              </p>
                            )}
                            <p className="text-sm break-words">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatDistanceToNow(
                                new Date(message.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={sending || !messageContent.trim()}>
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Dialog */}
      <StartConversationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        teachers={teachers}
        onStartConversation={handleStartConversation}
      />
    </div>
  );
}
