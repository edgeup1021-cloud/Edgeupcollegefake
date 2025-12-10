"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, ArrowLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import CreateTopicDrawer from "../../components/CreateTopicDrawer";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface Topic {
  id: number;
  name: string;
  orderIndex: number;
  description: string | null;
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function TopicsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = Number(params.subjectId);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
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

  // Fetch subject and topics
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/curriculum/subjects/${subjectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subject");
      }
      const data = await response.json();
      setSubject(data);
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to fetch topics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchData();
    }
  }, [subjectId]);

  const handleBack = () => {
    router.push("/superadmin/curriculum/subjects");
  };

  const handleViewSubtopics = (topicId: number) => {
    router.push(`/superadmin/curriculum/subjects/${subjectId}/topics/${topicId}/subtopics`);
  };

  const handleCreateTopic = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleEditTopic = (id: number) => {
    // TODO: Implement edit topic functionality
    console.log("Edit topic:", id);
  };

  const handleDeleteTopic = (id: number) => {
    const topic = topics.find((t) => t.id === id);
    if (topic) {
      setTopicToDelete(topic);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!topicToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/${subjectId}/topics/${topicToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete topic");
      }

      showToast("Topic deleted successfully", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting topic:", error);
      showToast("Failed to delete topic", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTopicToDelete(null);
    }
  };

  const handleCreateSuccess = () => {
    showToast("Topic created successfully", "success");
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
            Back to Subjects
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subject?.name || "Topics"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subject?.code} • Manage topics for this subject
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateTopic}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Topic
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
          ) : topics.length === 0 ? (
            // Empty State
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No topics yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first topic
              </p>
              <button
                onClick={handleCreateTopic}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Topic
              </button>
            </div>
          ) : (
            // Topics List
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Topic Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {topic.name}
                      </h3>
                      {topic.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleViewSubtopics(topic.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-light dark:bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/30 transition-colors text-xs font-medium whitespace-nowrap"
                      >
                        View Subtopics
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleEditTopic(topic.id)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
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
      <CreateTopicDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={(message) => showToast(message, "error")}
        subjectId={subjectId}
        subjectName={subject?.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Topic"
        description={`Are you sure you want to delete "${topicToDelete?.name}"? This action cannot be undone and will also delete all associated subtopics.`}
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
