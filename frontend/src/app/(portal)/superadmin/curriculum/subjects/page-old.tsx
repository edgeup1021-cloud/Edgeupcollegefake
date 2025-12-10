"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import SubjectCard from "./components/SubjectCard";
import EmptyState from "./components/EmptyState";
import CreateSubjectDrawer from "./components/CreateSubjectDrawer";
import EditSubjectDrawer from "./components/EditSubjectDrawer";
import CreateTopicDrawer from "./components/CreateTopicDrawer";
import CreateSubtopicDrawer from "./components/CreateSubtopicDrawer";
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
  orderIndex: number;
  description: string | null;
  subtopics: Subtopic[];
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  topics: Topic[];
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

interface DeleteContext {
  type: "subject" | "topic" | "subtopic";
  id: number;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  // Drawer states
  const [isCreateSubjectDrawerOpen, setIsCreateSubjectDrawerOpen] = useState(false);
  const [isEditSubjectDrawerOpen, setIsEditSubjectDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [isCreateTopicDrawerOpen, setIsCreateTopicDrawerOpen] = useState(false);
  const [selectedSubjectForTopic, setSelectedSubjectForTopic] = useState<{ id: number; name: string } | null>(null);

  const [isCreateSubtopicDrawerOpen, setIsCreateSubtopicDrawerOpen] = useState(false);
  const [selectedTopicForSubtopic, setSelectedTopicForSubtopic] = useState<{ id: number; name: string } | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<DeleteContext | null>(null);
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

  // Fetch subjects from backend
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/curriculum/subjects');
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showToast("Failed to fetch subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const toggleSubject = (id: number) => {
    setExpandedSubject(expandedSubject === id ? null : id);
    setExpandedTopic(null); // Close any open topics when switching subjects
  };

  const toggleTopic = (id: number) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  // Subject handlers
  const handleViewSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      // TODO: Open a view-only drawer with full subject details
      console.log("View subject:", subject);
    }
  };

  const handleEditSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSelectedSubject(subject);
      setIsEditSubjectDrawerOpen(true);
    }
  };

  const handleDeleteSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setDeleteContext({ type: "subject", id: subject.id, name: subject.name });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleCreateSubject = () => {
    setIsCreateSubjectDrawerOpen(true);
  };

  // Topic handlers
  const handleAddTopic = (subjectId: number) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      setSelectedSubjectForTopic({ id: subject.id, name: subject.name });
      setIsCreateTopicDrawerOpen(true);
    }
  };

  const handleViewTopic = (id: number) => {
    // Find topic across all subjects
    for (const subject of subjects) {
      const topic = subject.topics.find((t) => t.id === id);
      if (topic) {
        // TODO: Open a view-only drawer with full topic details
        console.log("View topic:", topic);
        break;
      }
    }
  };

  const handleEditTopic = (id: number) => {
    // TODO: Implement edit topic functionality (similar to edit subject)
    console.log("Edit topic:", id);
    showToast("Edit topic feature coming soon", "info");
  };

  const handleDeleteTopic = (id: number) => {
    // Find topic across all subjects
    for (const subject of subjects) {
      const topic = subject.topics.find((t) => t.id === id);
      if (topic) {
        setDeleteContext({ type: "topic", id: topic.id, name: topic.name });
        setIsDeleteDialogOpen(true);
        break;
      }
    }
  };

  // Subtopic handlers
  const handleAddSubtopic = (topicId: number) => {
    // Find topic across all subjects
    for (const subject of subjects) {
      const topic = subject.topics.find((t) => t.id === topicId);
      if (topic) {
        setSelectedTopicForSubtopic({ id: topic.id, name: topic.name });
        setIsCreateSubtopicDrawerOpen(true);
        break;
      }
    }
  };

  const handleViewSubtopic = (id: number) => {
    // Find subtopic across all subjects and topics
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        const subtopic = topic.subtopics.find((st) => st.id === id);
        if (subtopic) {
          // TODO: Open a view-only drawer with full subtopic details
          console.log("View subtopic:", subtopic);
          return;
        }
      }
    }
  };

  const handleEditSubtopic = (id: number) => {
    // TODO: Implement edit subtopic functionality
    console.log("Edit subtopic:", id);
    showToast("Edit subtopic feature coming soon", "info");
  };

  const handleDeleteSubtopic = (id: number) => {
    // Find subtopic across all subjects and topics
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        const subtopic = topic.subtopics.find((st) => st.id === id);
        if (subtopic) {
          setDeleteContext({ type: "subtopic", id: subtopic.id, name: subtopic.name });
          setIsDeleteDialogOpen(true);
          return;
        }
      }
    }
  };

  // Delete confirmation handler
  const confirmDelete = async () => {
    if (!deleteContext) return;

    try {
      setIsDeleting(true);

      let endpoint = '';
      if (deleteContext.type === "subject") {
        endpoint = `http://localhost:3001/api/curriculum/subjects/${deleteContext.id}`;
      } else if (deleteContext.type === "topic") {
        endpoint = `http://localhost:3001/api/curriculum/subjects/topics/${deleteContext.id}`;
      } else if (deleteContext.type === "subtopic") {
        endpoint = `http://localhost:3001/api/curriculum/subjects/subtopics/${deleteContext.id}`;
      }

      const response = await fetch(endpoint, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Failed to delete ${deleteContext.type}`);
      }

      showToast(`${deleteContext.type.charAt(0).toUpperCase() + deleteContext.type.slice(1)} deleted successfully`, "success");
      fetchSubjects(); // Refresh the entire list
      setIsDeleteDialogOpen(false);
      setDeleteContext(null);
    } catch (error) {
      console.error(`Error deleting ${deleteContext.type}:`, error);
      showToast(`Failed to delete ${deleteContext.type}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Success handlers
  const handleCreateSubjectSuccess = () => {
    showToast("Subject created successfully", "success");
    fetchSubjects();
  };

  const handleEditSubjectSuccess = () => {
    showToast("Subject updated successfully", "success");
    fetchSubjects();
  };

  const handleCreateTopicSuccess = () => {
    showToast("Topic created successfully", "success");
    fetchSubjects();
  };

  const handleCreateSubtopicSuccess = () => {
    showToast("Subtopic created successfully", "success");
    fetchSubjects();
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
              <BookOpen className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Subjects Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage subjects, topics, and subtopics
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateSubject}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Subject
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : subjects.length === 0 ? (
            // Empty State
            <EmptyState />
          ) : (
            // Subjects List
            <div className="p-4 space-y-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  isExpanded={expandedSubject === subject.id}
                  expandedTopic={expandedTopic}
                  onToggle={() => toggleSubject(subject.id)}
                  onToggleTopic={toggleTopic}
                  onView={handleViewSubject}
                  onEdit={handleEditSubject}
                  onDelete={handleDeleteSubject}
                  onAddTopic={handleAddTopic}
                  onViewTopic={handleViewTopic}
                  onEditTopic={handleEditTopic}
                  onDeleteTopic={handleDeleteTopic}
                  onAddSubtopic={handleAddSubtopic}
                  onViewSubtopic={handleViewSubtopic}
                  onEditSubtopic={handleEditSubtopic}
                  onDeleteSubtopic={handleDeleteSubtopic}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Drawer */}
      <CreateSubjectDrawer
        isOpen={isCreateSubjectDrawerOpen}
        onClose={() => setIsCreateSubjectDrawerOpen(false)}
        onSuccess={handleCreateSubjectSuccess}
        onError={(message) => showToast(message, "error")}
      />

      {/* Edit Subject Drawer */}
      <EditSubjectDrawer
        isOpen={isEditSubjectDrawerOpen}
        onClose={() => setIsEditSubjectDrawerOpen(false)}
        onSuccess={handleEditSubjectSuccess}
        onError={(message) => showToast(message, "error")}
        subject={selectedSubject}
      />

      {/* Create Topic Drawer */}
      <CreateTopicDrawer
        isOpen={isCreateTopicDrawerOpen}
        onClose={() => setIsCreateTopicDrawerOpen(false)}
        onSuccess={handleCreateTopicSuccess}
        onError={(message) => showToast(message, "error")}
        subjectId={selectedSubjectForTopic?.id || null}
        subjectName={selectedSubjectForTopic?.name}
      />

      {/* Create Subtopic Drawer */}
      <CreateSubtopicDrawer
        isOpen={isCreateSubtopicDrawerOpen}
        onClose={() => setIsCreateSubtopicDrawerOpen(false)}
        onSuccess={handleCreateSubtopicSuccess}
        onError={(message) => showToast(message, "error")}
        topicId={selectedTopicForSubtopic?.id || null}
        topicName={selectedTopicForSubtopic?.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteContext?.type ? deleteContext.type.charAt(0).toUpperCase() + deleteContext.type.slice(1) : ""}`}
        message={`Are you sure you want to delete this ${deleteContext?.type}?`}
        itemName={deleteContext?.name}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
