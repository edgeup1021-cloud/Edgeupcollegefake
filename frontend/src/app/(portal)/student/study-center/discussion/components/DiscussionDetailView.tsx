"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import type { DiscussionPost } from "@/types/discussion.types";
import { getPostById, toggleUpvote, markAsSolved } from "@/services/discussion.service";
import CommentSection from "./CommentSection";
import SolvedBadge from "./SolvedBadge";

interface DiscussionDetailViewProps {
  postId: number;
  studentId?: number | string;
  onBack: () => void;
}

export default function DiscussionDetailView({ postId, studentId, onBack }: DiscussionDetailViewProps) {
  const [post, setPost] = useState<DiscussionPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isMarkingSolved, setIsMarkingSolved] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const sid = studentId
        ? typeof studentId === 'string'
          ? parseInt(studentId, 10)
          : studentId
        : undefined;
      const data = await getPostById(postId, sid);
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!post || isUpvoting || !studentId) return;

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
      setPost(optimisticPost);

      // API call
      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
      const result = await toggleUpvote(post.id, sid);

      // Sync with server response
      setPost({
        ...post,
        hasUpvoted: result.upvoted,
        upvoteCount: result.upvoteCount,
      });
    } catch (error) {
      console.error("Failed to toggle upvote:", error);
      // Revert on error
      fetchPost();
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleMarkAsSolved = async () => {
    if (!post || isMarkingSolved || !studentId || post.isSolved) return;

    try {
      setIsMarkingSolved(true);
      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
      const updatedPost = await markAsSolved(post.id, sid);
      setPost(updatedPost);
    } catch (error) {
      console.error("Failed to mark as solved:", error);
    } finally {
      setIsMarkingSolved(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Post not found.
          </p>
        </div>
      </div>
    );
  }

  const typeColor = post.type === "question" ? "green" : "blue";
  const sid = studentId
    ? typeof studentId === 'string'
      ? parseInt(studentId, 10)
      : studentId
    : undefined;

  // Ensure both IDs are numbers for comparison
  const postOwnerId = typeof post.studentId === 'string'
    ? parseInt(post.studentId, 10)
    : post.studentId;
  const isOwner = sid === postOwnerId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to discussions
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
                  typeColor === "green"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }
              `}
              >
                {post.type === "question" ? (
                  <HelpCircle className="w-6 h-6" />
                ) : (
                  <MessageSquare className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {post.title}
                  </h1>
                  {post.isSolved && <SolvedBadge />}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span
                    className={`
                    px-3 py-1 rounded-full font-medium
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
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.student.firstName} {post.student.lastName}
                      {post.student.admissionNo && ` (${post.student.admissionNo})`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
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
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Left side - Engagement metrics */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUpvote}
                  disabled={isUpvoting}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50
                    ${
                      post.hasUpvoted
                        ? "bg-brand-primary text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-brand-primary"
                    }
                  `}
                >
                  <ThumbsUp
                    className={`w-5 h-5 ${post.hasUpvoted ? "fill-current" : ""}`}
                  />
                  <span>{post.upvoteCount}</span>
                </button>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.commentCount} Comments</span>
                </div>
              </div>

              {/* Right side - Mark as Solved Button (only for post owner and questions) */}
              {isOwner && post.type === "question" && !post.isSolved && (
                <button
                  onClick={handleMarkAsSolved}
                  disabled={isMarkingSolved}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Solved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <CommentSection
            postId={post.id}
            studentId={studentId}
            postOwnerId={post.studentId}
          />
        </div>
      </div>
    </div>
  );
}
