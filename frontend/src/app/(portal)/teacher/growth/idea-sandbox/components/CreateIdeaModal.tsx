"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Lightbulb, HelpCircle } from "lucide-react";
import { createIdeaSchema, IDEA_CATEGORIES } from "@/lib/validations/idea-sandbox";
import type { CreateIdeaFormData } from "@/lib/validations/idea-sandbox";
import type { IdeaType } from "@/types/idea-sandbox.types";
import { createIdea } from "@/services/idea-sandbox.service";
import TagSelector from "./TagSelector";

interface CreateIdeaModalProps {
  isOpen: boolean;
  teacherId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_TAGS = [
  "Classroom Activities",
  "Student Engagement",
  "Remote Learning",
  "Assessment Techniques",
  "Differentiation",
  "Collaboration",
  "Time Management",
  "Educational Technology",
  "Project-Based Learning",
  "Feedback Strategies",
  "Behavior Management",
  "Parent Communication",
  "Professional Development",
  "Curriculum Design",
  "Inclusive Education",
];

export default function CreateIdeaModal({
  isOpen,
  teacherId,
  onClose,
  onSuccess,
}: CreateIdeaModalProps) {
  const [ideaType, setIdeaType] = useState<IdeaType>("idea");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      type: "idea",
      tags: [],
    },
  });

  const title = watch("title");
  const description = watch("description");

  const onSubmit = async (data: CreateIdeaFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const tid = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;

      await createIdea(
        {
          ...data,
          type: ideaType,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        },
        tid
      );

      reset();
      setSelectedTags([]);
      setIdeaType("idea");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create idea:", err);
      setError("Failed to create idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedTags([]);
      setIdeaType("idea");
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
            Share Your Ideas
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
                onClick={() => setIdeaType("idea")}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    ideaType === "idea"
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    p-2 rounded-lg
                    ${
                      ideaType === "idea"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Share an Idea
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Share your teaching strategies
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIdeaType("question")}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    ideaType === "question"
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
                      ideaType === "question"
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
                      Get advice from peers
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
              {ideaType === "idea" ? "Title" : "Question"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder={
                ideaType === "idea"
                  ? "Give your idea a catchy title..."
                  : "What would you like to know?"
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
              {ideaType === "idea" ? "Description" : "Details"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              placeholder={
                ideaType === "idea"
                  ? "Describe your idea in detail..."
                  : "Provide context for your question..."
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
              {IDEA_CATEGORIES.map((category) => (
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
                  ideaType === "idea"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-500 hover:bg-green-600"
                }
              `}
            >
              {isSubmitting ? "Posting..." : ideaType === "idea" ? "Share Idea" : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
