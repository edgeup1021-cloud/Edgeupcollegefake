"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, MessageSquare, HelpCircle } from "lucide-react";
import { createDiscussionSchema, DISCUSSION_CATEGORIES } from "@/lib/validations/discussion";
import type { CreateDiscussionFormData } from "@/lib/validations/discussion";
import type { DiscussionType } from "@/types/discussion.types";
import { createPost } from "@/services/discussion.service";
import TagSelector from "./TagSelector";

interface CreateDiscussionModalProps {
  isOpen: boolean;
  studentId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_TAGS = [
  "Algorithms",
  "Data Structures",
  "Calculus",
  "Linear Algebra",
  "Physics",
  "Chemistry",
  "Programming",
  "Web Development",
  "Machine Learning",
  "Database",
  "Networking",
  "Operating Systems",
  "Statistics",
  "Discrete Math",
  "Software Engineering",
  "Electronics",
  "Thermodynamics",
  "Research",
  "Project Help",
  "Exam Prep",
];

export default function CreateDiscussionModal({
  isOpen,
  studentId,
  onClose,
  onSuccess,
}: CreateDiscussionModalProps) {
  const [discussionType, setDiscussionType] = useState<DiscussionType>("question");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateDiscussionFormData>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      type: "question",
      tags: [],
    },
  });

  const title = watch("title");
  const description = watch("description");

  const onSubmit = async (data: CreateDiscussionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const sid = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;

      await createPost(
        {
          ...data,
          type: discussionType,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        },
        sid
      );

      reset();
      setSelectedTags([]);
      setDiscussionType("question");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedTags([]);
      setDiscussionType("question");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Start a Discussion
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What would you like to do?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDiscussionType("question")}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    discussionType === "question"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    p-2 rounded-lg
                    ${
                      discussionType === "question"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Ask a Question
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get help from peers
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDiscussionType("discussion")}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    discussionType === "discussion"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    p-2 rounded-lg
                    ${
                      discussionType === "discussion"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Start a Discussion
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Share your thoughts
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {discussionType === "question" ? "Question" : "Title"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder={
                discussionType === "question"
                  ? "What would you like to know?"
                  : "Give your discussion a title..."
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-red-500">{errors.title?.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {title?.length || 0}/255 (min 10)
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {discussionType === "question" ? "Details" : "Description"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              placeholder={
                discussionType === "question"
                  ? "Provide context for your question..."
                  : "Describe your topic in detail..."
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-red-500">
                {errors.description?.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description?.length || 0} characters (min 50)
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category")}
              id="category"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select a category...</option>
              {DISCUSSION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="text-xs text-red-500 mt-1">
              {errors.category?.message}
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <TagSelector
              availableTags={AVAILABLE_TAGS}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              maxTags={5}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-6 py-2 text-white rounded-lg font-medium transition-all disabled:opacity-50
                ${
                  discussionType === "question"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
            >
              {isSubmitting ? "Posting..." : discussionType === "question" ? "Post Question" : "Start Discussion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
