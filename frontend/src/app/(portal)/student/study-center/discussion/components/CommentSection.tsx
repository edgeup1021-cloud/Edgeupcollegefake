"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { commentSchema } from "@/lib/validations/discussion";
import type { CommentFormData } from "@/lib/validations/discussion";
import type { Comment } from "@/types/discussion.types";
import {
  getPostComments,
  createComment,
  markCommentAsSolution,
} from "@/services/discussion.service";

interface CommentSectionProps {
  postId: number;
  studentId?: number | string;
  postOwnerId?: number;
}

export default function CommentSection({ postId, studentId, postOwnerId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [markingAsSolution, setMarkingAsSolution] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getPostComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CommentFormData) => {
    if (!studentId) return;

    try {
      setSubmitting(true);
      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
      const newComment = await createComment(
        postId,
        { content: data.content },
        sid
      );
      setComments((prev) => [...prev, newComment]);
      reset();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsSolution = async (commentId: number) => {
    if (!studentId || markingAsSolution) return;

    try {
      setMarkingAsSolution(commentId);
      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
      await markCommentAsSolution(commentId, sid);

      // Update comments list
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, isSolution: true }
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to mark comment as solution:", error);
    } finally {
      setMarkingAsSolution(null);
    }
  };

  const sid = studentId
    ? typeof studentId === 'string'
      ? parseInt(studentId, 10)
      : studentId
    : undefined;

  // Ensure postOwnerId is a number for comparison
  const ownerIdNum = typeof postOwnerId === 'string'
    ? parseInt(postOwnerId, 10)
    : postOwnerId;
  const isPostOwner = sid === ownerIdNum;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              {...register("content")}
              rows={3}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
            {errors.content && (
              <p className="text-xs text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="self-start px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`
                p-4 rounded-lg
                ${
                  comment.isSolution
                    ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600"
                    : "bg-gray-50 dark:bg-gray-700/50"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-brand-primary">
                      {comment.student.firstName[0]}
                      {comment.student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.student.firstName} {comment.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {comment.isSolution && (
                  <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-2.5 py-1 text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Solution
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>

              {/* Mark as Solution Button (only for post owner) */}
              {isPostOwner && !comment.isSolution && (
                <button
                  onClick={() => handleMarkAsSolution(comment.id)}
                  disabled={markingAsSolution === comment.id}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Solution
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
