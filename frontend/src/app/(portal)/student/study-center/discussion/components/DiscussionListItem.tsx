"use client";

import { MessageSquare, HelpCircle, ThumbsUp, MessageCircle } from "lucide-react";
import type { DiscussionPost } from "@/types/discussion.types";
import { toggleUpvote } from "@/services/discussion.service";
import { useState } from "react";
import SolvedBadge from "./SolvedBadge";

interface DiscussionListItemProps {
  post: DiscussionPost;
  studentId: number | string;
  onClick: () => void;
  onUpdate: (updatedPost: DiscussionPost) => void;
}

export default function DiscussionListItem({
  post,
  studentId,
  onClick,
  onUpdate,
}: DiscussionListItemProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoting) return;

    try {
      setIsUpvoting(true);

      // Optimistic update
      const optimisticPost = {
        ...post,
        hasUpvoted: !post.hasUpvoted,
        upvoteCount: post.hasUpvoted
          ? post.upvoteCount - 1
          : post.upvoteCount + 1,
      };
      onUpdate(optimisticPost);

      // API call
      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
      const result = await toggleUpvote(post.id, sid);

      // Sync with server response
      onUpdate({
        ...post,
        hasUpvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      // Revert on error
      onUpdate(post);
    } finally {
      setIsUpvoting(false);
    }
  };

  const typeColor = post.type === "question" ? "green" : "blue";

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
                post.hasUpvoted
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              }
            `}
          >
            <ThumbsUp
              className={`w-5 h-5 ${post.hasUpvoted ? "fill-current" : ""}`}
            />
          </button>
          <span
            className={`
            text-sm font-medium
            ${
              post.hasUpvoted
                ? "text-brand-primary"
                : "text-gray-600 dark:text-gray-400"
            }
          `}
          >
            {post.upvoteCount}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div
              className={`
              p-1.5 rounded
              ${
                typeColor === "green"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              }
            `}
            >
              {post.type === "question" ? (
                <HelpCircle className="w-4 h-4" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                {post.isSolved && <SolvedBadge />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${
                    typeColor === "green"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }
                `}
                >
                  {post.category}
                </span>
                {post.student && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    by {post.student.firstName} {post.student.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.slice(0, 5).map((tag) => (
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
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
