"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { Loader2 } from "lucide-react";

interface Subtopic {
  id: number;
  name: string;
  content: string | null;
  orderIndex: number;
}

interface EditSubtopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  subtopic: Subtopic | null;
  topicId: number;
}

interface SubtopicFormData {
  name: string;
  content: string;
}

export default function EditSubtopicDrawer({
  isOpen,
  onClose,
  onSuccess,
  onError,
  subtopic,
  topicId,
}: EditSubtopicDrawerProps) {
  const [formData, setFormData] = useState<SubtopicFormData>({
    name: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when subtopic changes
  useEffect(() => {
    if (subtopic) {
      setFormData({
        name: subtopic.name,
        content: subtopic.content || "",
      });
    }
  }, [subtopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subtopic) return;

    // Validation
    if (!formData.name.trim()) {
      onError("Subtopic name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        orderIndex: subtopic.orderIndex, // Keep existing order
      };

      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/topics/${topicId}/subtopics/${subtopic.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update subtopic");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating subtopic:", error);
      onError(error.message || "Failed to update subtopic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!subtopic) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Subtopic" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Subtopic Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtopic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Array Operations"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Learning objectives, key concepts, notes..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Subtopic"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
