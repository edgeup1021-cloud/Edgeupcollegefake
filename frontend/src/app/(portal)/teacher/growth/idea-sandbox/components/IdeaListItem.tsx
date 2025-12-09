"use client";

import { Lightbulb, HelpCircle, ThumbsUp, MessageCircle } from "lucide-react";
import type { Idea } from "@/types/idea-sandbox.types";
import { toggleUpvote } from "@/services/idea-sandbox.service";
import { useState } from "react";

interface IdeaListItemProps {
  idea: Idea;
  teacherId: number | string;
  onClick: () => void;
  onUpdate: (updatedIdea: Idea) => void;
}

export default function IdeaListItem({
  idea,
  teacherId,
  onClick,
  onUpdate,
}: IdeaListItemProps) {
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
      <div className="p-4 flex items-start gap-4">
        {/* Upvote Section */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`
              p-2 rounded-lg transition-colors disabled:opacity-50
              ${
                idea.hasUpvoted
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              }
            `}
          >
            <ThumbsUp
              className={`w-5 h-5 ${idea.hasUpvoted ? "fill-current" : ""}`}
            />
          </button>
          <span
            className={`
            text-sm font-medium
            ${
              idea.hasUpvoted
                ? "text-brand-primary"
                : "text-gray-600 dark:text-gray-400"
            }
          `}
          >
            {idea.upvoteCount}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div
              className={`
              p-1.5 rounded
              ${
                typeColor === "orange"
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              }
            `}
            >
              {idea.type === "idea" ? (
                <Lightbulb className="w-4 h-4" />
              ) : (
                <HelpCircle className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors">
                {idea.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${
                    typeColor === "orange"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  }
                `}
                >
                  {idea.category}
                </span>
                {idea.teacher && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {idea.teacher.firstName} {idea.teacher.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {idea.description}
          </p>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {idea.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Meta Section */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{idea.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
