"use client";

import { MessageSquare, HelpCircle, ThumbsUp, MessageCircle } from "lucide-react";
import type { DiscussionPost } from "@/types/discussion.types";
import { toggleUpvote } from "@/services/discussion.service";
import { useState } from "react";
import SolvedBadge from "./SolvedBadge";

interface DiscussionCardProps {
  post: DiscussionPost;
  studentId: number | string;
  onClick: () => void;
  onUpdate: (updatedPost: DiscussionPost) => void;
}

export default function DiscussionCard({ post, studentId, onClick, onUpdate }: DiscussionCardProps) {
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
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div
            className={`
            p-2 rounded-lg
            ${
              typeColor === "green"
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }
          `}
          >
            {post.type === "question" ? (
              <HelpCircle className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.isSolved && <SolvedBadge />}
            </div>
            <span
              className={`
              inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${
                typeColor === "green"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              }
            `}
            >
              {post.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                +{post.tags.length - 3} more
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
                post.hasUpvoted
                  ? "text-brand-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-primary"
              }
            `}
          >
            <ThumbsUp
              className={`w-4 h-4 ${post.hasUpvoted ? "fill-current" : ""}`}
            />
            <span className="font-medium">{post.upvoteCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {post.student && `${post.student.firstName} ${post.student.lastName}`}
        </div>
      </div>
    </div>
  );
}
