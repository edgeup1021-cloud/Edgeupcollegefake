"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Send, Loader2, UserPlus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationDetail, Message } from "@/services/messaging.service";
import { cn } from "@/lib/utils";

interface ConversationViewProps {
  conversation: ConversationDetail;
  currentUserId: number;
  onSendMessage: (content: string) => Promise<void>;
  onAddParticipants: () => void;
}

export function ConversationView({
  conversation,
  currentUserId,
  onSendMessage,
  onAddParticipants,
}: ConversationViewProps) {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom only when new messages arrive
  useEffect(() => {
    const currentCount = conversation.messages.length;
    const prevCount = prevMessageCountRef.current;

    // Only scroll if message count increased (new message arrived)
    if (currentCount > prevCount) {
      scrollToBottom();
    }

    prevMessageCountRef.current = currentCount;
  }, [conversation.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(messageText);
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{conversation.title}</h2>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Users className="w-4 h-4" />
            <span>
              {conversation.participants.length}{" "}
              {conversation.participants.length === 1 ? "student" : "students"}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onAddParticipants}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Students
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {format(new Date(date), "MMMM d, yyyy")}
              </span>
            </div>
            {messages.map((message) => {
              const isOwnMessage = message.senderType === "teacher";
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender.profileImage || undefined} />
                    <AvatarFallback>
                      {getInitials(
                        message.sender.firstName,
                        message.sender.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      isOwnMessage ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(message.createdAt), "h:mm a")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex gap-2"
      >
        <Input
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={isSending}
          className="flex-1"
        />
        <Button type="submit" disabled={!messageText.trim() || isSending}>
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Card>
  );
}
