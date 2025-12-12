"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Conversation } from "@/services/messaging.service";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new conversation with your students
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const participantNames = conversation.participants
          .map((p) => `${p.firstName} ${p.lastName}`)
          .join(", ");

        return (
          <Card
            key={conversation.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              isSelected && "border-primary bg-muted/50"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {conversation.title}
                  </h3>
                  {conversation.unreadCount > 0 && (
                    <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Users className="w-3 h-3" />
                  <span className="truncate">{participantNames}</span>
                </div>

                {conversation.lastMessage && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {conversation.lastMessage.senderType === "teacher"
                        ? "You: "
                        : ""}
                      {conversation.lastMessage.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
