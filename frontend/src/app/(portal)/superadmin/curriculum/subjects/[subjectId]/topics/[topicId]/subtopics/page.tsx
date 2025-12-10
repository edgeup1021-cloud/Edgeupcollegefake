"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import CreateSubtopicDrawer from "../../../../components/CreateSubtopicDrawer";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface Subtopic {
  id: number;
  name: string;
  orderIndex: number;
  content: string | null;
}

interface Topic {
  id: number;
  name: string;
  description: string | null;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function SubtopicsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = Number(params.subjectId);
  const topicId = Number(params.topicId);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subtopicToDelete, setSubtopicToDelete] = useState<Subtopic | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Fetch topic and subtopics
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/${subjectId}/topics/${topicId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch topic");
      }
      const data = await response.json();
      setTopic(data);
      setSubtopics(data.subtopics || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to fetch subtopics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId && topicId) {
      fetchData();
    }
  }, [subjectId, topicId]);

  const handleBack = () => {
    router.push(`/superadmin/curriculum/subjects/${subjectId}/topics`);
  };

  const handleCreateSubtopic = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleEditSubtopic = (id: number) => {
    // TODO: Implement edit subtopic functionality
    console.log("Edit subtopic:", id);
  };

  const handleDeleteSubtopic = (id: number) => {
    const subtopic = subtopics.find((st) => st.id === id);
    if (subtopic) {
      setSubtopicToDelete(subtopic);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!subtopicToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/topics/${topicId}/subtopics/${subtopicToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subtopic");
      }

      showToast("Subtopic deleted successfully", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      showToast("Failed to delete subtopic", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSubtopicToDelete(null);
    }
  };

  const handleCreateSuccess = () => {
    showToast("Subtopic created successfully", "success");
    fetchData();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {topic?.name || "Subtopics"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage subtopics for this topic
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateSubtopic}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Subtopic
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : subtopics.length === 0 ? (
            // Empty State
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No subtopics yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first subtopic
              </p>
              <button
                onClick={handleCreateSubtopic}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Subtopic
              </button>
            </div>
          ) : (
            // Subtopics List
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {subtopics.map((subtopic) => (
                <div
                  key={subtopic.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Subtopic Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {subtopic.name}
                      </h3>
                      {subtopic.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                          {subtopic.content}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditSubtopic(subtopic.id)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteSubtopic(subtopic.id)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Create Drawer */}
      <CreateSubtopicDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={(message) => showToast(message, "error")}
        topicId={topicId}
        topicName={topic?.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Subtopic"
        description={`Are you sure you want to delete "${subtopicToDelete?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}
