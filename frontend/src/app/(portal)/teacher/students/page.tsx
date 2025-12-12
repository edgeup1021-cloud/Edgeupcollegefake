"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Plus, Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getConversations,
  getConversationById,
  createConversation,
  sendMessage,
  addParticipants,
  getTeacherStudents,
  type Conversation,
  type ConversationDetail,
  type Student,
} from "@/services/messaging.service";
import { ConversationList } from "./components/ConversationList";
import { ConversationView } from "./components/ConversationView";
import { CreateConversationDialog } from "./components/CreateConversationDialog";
import { AddParticipantsDialog } from "./components/AddParticipantsDialog";

export default function StudentMessagingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDetail | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addParticipantsDialogOpen, setAddParticipantsDialogOpen] =
    useState(false);
  const hasLoadedRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesPollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (showLoading = false) => {
    if (!user) return;

    if (showLoading) setLoading(true);
    try {
      const teacherId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;

      const [conversationsData, studentsData] = await Promise.all([
        getConversations(teacherId),
        getTeacherStudents(teacherId),
      ]);

      setConversations(conversationsData);
      setStudents(studentsData.students);
    } catch (error) {
      console.error("Failed to load data:", error);
      // Set empty data on error to prevent infinite loops
      setConversations([]);
      setStudents([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  const loadMessages = useCallback(async (conversationId: number) => {
    if (!user) return;

    try {
      const teacherId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const conversation = await getConversationById(conversationId, teacherId);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  }, [user]);

  const handleSelectConversation = async (conversationId: number) => {
    await loadMessages(conversationId);
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

  const handleCreateConversation = useCallback(async (
    title: string,
    studentIds: number[]
  ) => {
    if (!user) return;

    try {
      const teacherId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const newConversation = await createConversation(
        { title, studentIds },
        teacherId
      );

      await loadData(false); // Refresh without loading spinner
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  }, [user, loadData]);

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedConversation) return;

    try {
      const teacherId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const newMessage = await sendMessage(
        selectedConversation.id,
        { content },
        teacherId
      );

      setSelectedConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      });

      await loadData(false); // Refresh without loading spinner
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const handleAddParticipants = useCallback(async (studentIds: number[]) => {
    if (!user || !selectedConversation) return;

    try {
      const teacherId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      const updatedConversation = await addParticipants(
        selectedConversation.id,
        { studentIds },
        teacherId
      );

      setSelectedConversation(updatedConversation);
      await loadData(false); // Refresh without loading spinner
    } catch (error) {
      console.error("Failed to add participants:", error);
      throw error;
    }
  }, [user, selectedConversation, loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
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
            <h1 className="text-3xl font-bold">Student Messages</h1>
            <p className="text-muted-foreground mt-1">
              Communicate with your students
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Start Conversation
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Conversations List */}
        <div className="lg:col-span-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id || null}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              currentUserId={
                typeof user.id === "string" ? parseInt(user.id, 10) : user.id
              }
              onSendMessage={handleSendMessage}
              onAddParticipants={() => setAddParticipantsDialogOpen(true)}
            />
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a conversation from the list or start a new one
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateConversationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        students={students}
        onCreateConversation={handleCreateConversation}
      />

      {selectedConversation && (
        <AddParticipantsDialog
          open={addParticipantsDialogOpen}
          onOpenChange={setAddParticipantsDialogOpen}
          students={students}
          existingParticipantIds={selectedConversation.participants.map(
            (p) => p.id
          )}
          onAddParticipants={handleAddParticipants}
        />
      )}
    </div>
  );
}
