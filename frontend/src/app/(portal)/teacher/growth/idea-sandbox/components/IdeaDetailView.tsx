"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Lightbulb,
  HelpCircle,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
} from "lucide-react";
import type { Idea } from "@/types/idea-sandbox.types";
import { getIdeaById, toggleUpvote } from "@/services/idea-sandbox.service";
import CommentSection from "./CommentSection";

interface IdeaDetailViewProps {
  ideaId: number;
  teacherId?: number | string;
  onBack: () => void;
}

export default function IdeaDetailView({ ideaId, teacherId, onBack }: IdeaDetailViewProps) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [ideaId]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const tid = teacherId
        ? typeof teacherId === 'string'
          ? parseInt(teacherId, 10)
          : teacherId
        : undefined;
      const data = await getIdeaById(ideaId, tid);
      setIdea(data);
    } catch (error) {
      console.error("Failed to fetch idea:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!idea || isUpvoting || !teacherId) return;

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
      setIdea(optimisticIdea);

      // API call
      const tid = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;
      const result = await toggleUpvote(idea.id, tid);

      // Sync with server response
      setIdea({
        ...idea,
        hasUpvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      // Revert on error
      fetchIdea();
    } finally {
      setIsUpvoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all ideas
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Idea not found.
          </p>
        </div>
      </div>
    );
  }

  const typeColor = idea.type === "idea" ? "orange" : "green";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all ideas
        </button>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div
                className={`
                p-3 rounded-lg
                ${
                  typeColor === "orange"
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                }
              `}
              >
                {idea.type === "idea" ? (
                  <Lightbulb className="w-6 h-6" />
                ) : (
                  <HelpCircle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {idea.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span
                    className={`
                    px-3 py-1 rounded-full font-medium
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
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {idea.teacher.firstName} {idea.teacher.lastName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {idea.description}
            </p>

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50
                  ${
                    idea.hasUpvoted
                      ? "bg-brand-primary text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-brand-primary"
                  }
                `}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${idea.hasUpvoted ? "fill-current" : ""}`}
                />
                <span>{idea.upvoteCount}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{idea.commentCount} Comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <CommentSection postId={idea.id} teacherId={teacherId} />
        </div>
      </div>
    </div>
  );
}
