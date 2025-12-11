"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { Loader2 } from "lucide-react";

interface Topic {
  id: number;
  name: string;
  description: string | null;
  orderIndex: number;
}

interface EditTopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  topic: Topic | null;
  subjectId: number;
}

interface TopicFormData {
  name: string;
  description: string;
}

export default function EditTopicDrawer({
  isOpen,
  onClose,
  onSuccess,
  onError,
  topic,
  subjectId,
}: EditTopicDrawerProps) {
  const [formData, setFormData] = useState<TopicFormData>({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when topic changes
  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name,
        description: topic.description || "",
      });
    }
  }, [topic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic) return;

    // Validation
    if (!formData.name.trim()) {
      onError("Topic name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        orderIndex: topic.orderIndex, // Keep existing order
      };

      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/${subjectId}/topics/${topic.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update topic");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating topic:", error);
      onError(error.message || "Failed to update topic. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!topic) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Topic" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Arrays and Lists"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this topic..."
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
              "Update Topic"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
