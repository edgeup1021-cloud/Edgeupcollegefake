"use client";

import { Lightbulb, HelpCircle, ThumbsUp, MessageCircle } from "lucide-react";
import type { Idea } from "@/types/idea-sandbox.types";
import { toggleUpvote } from "@/services/idea-sandbox.service";
import { useState } from "react";

interface IdeaCardProps {
  idea: Idea;
  teacherId: number | string;
  onClick: () => void;
  onUpdate: (updatedIdea: Idea) => void;
}

export default function IdeaCard({ idea, teacherId, onClick, onUpdate }: IdeaCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoting) return;

    try {
      setIsUpvoting(true);

      // Optimistic update
      const optimisticIdea = {
        ...idea,
        hasUpvoted: !idea.hasUpvoted,
        upvoteCount: idea.hasUpvoted
          ? idea.upvoteCount - 1
          : idea.upvoteCount + 1,
      };
      onUpdate(optimisticIdea);

      // API call
      const tid = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;
      const result = await toggleUpvote(idea.id, tid);

      // Sync with server response
      onUpdate({
        ...idea,
        hasUpvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      // Revert on error
      onUpdate(idea);
    } finally {
      setIsUpvoting(false);
    }
  };

  const typeColor = idea.type === "idea" ? "orange" : "green";

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-primary dark:hover:border-brand-primary transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div
            className={`
            p-2 rounded-lg
            ${
              typeColor === "orange"
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            }
          `}
          >
            {idea.type === "idea" ? (
              <Lightbulb className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors line-clamp-2">
              {idea.title}
            </h3>
            <span
              className={`
              inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${
                typeColor === "orange"
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              }
            `}
            >
              {idea.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {idea.description}
        </p>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {idea.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {idea.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{idea.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`
              flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50
              ${
                idea.hasUpvoted
                  ? "text-brand-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-primary"
              }
            `}
          >
            <ThumbsUp
              className={`w-4 h-4 ${idea.hasUpvoted ? "fill-current" : ""}`}
            />
            <span className="font-medium">{idea.upvoteCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{idea.commentCount}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {idea.teacher && `${idea.teacher.firstName} ${idea.teacher.lastName}`}
        </div>
      </div>
    </div>
  );
}
