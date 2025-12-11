"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, ArrowLeft, ChevronRight, Edit, Trash2, Search } from "lucide-react";
import CreateTopicDrawer from "../../components/CreateTopicDrawer";
import EditTopicDrawer from "../../components/EditTopicDrawer";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
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
    router.push("/superadmin/curriculum");
  };

  const handleViewSubtopics = (topicId: number) => {
    router.push(`/superadmin/curriculum/subjects/${subjectId}/topics/${topicId}/subtopics`);
  };

  const handleCreateTopic = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleEditTopic = (id: number) => {
    const topic = topics.find((t) => t.id === id);
    if (topic) {
      setSelectedTopic(topic);
      setIsEditDrawerOpen(true);
    }
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

  const handleEditSuccess = () => {
    showToast("Topic updated successfully", "success");
    fetchData();
  };

  // Filter topics based on search query
  const filteredTopics = topics.filter((topic) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      topic.name.toLowerCase().includes(searchLower) ||
      (topic.description?.toLowerCase().includes(searchLower) || false)
    );
  });

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
            Back to Curriculum
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : filteredTopics.length === 0 ? (
            // Empty State
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No topics found" : "No topics yet"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Get started by creating your first topic"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateTopic}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Topic
                </button>
              )}
            </div>
          ) : (
            // Table View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Topic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewSubtopics(topic.id)}
                          className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          {topic.name}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                          {topic.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditTopic(topic.id)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      {/* Edit Drawer */}
      <EditTopicDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        onError={(message) => showToast(message, "error")}
        topic={selectedTopic}
        subjectId={subjectId}
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
