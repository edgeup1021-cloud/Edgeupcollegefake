"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import SimpleSubjectCard from "./components/SimpleSubjectCard";
import EmptyState from "./components/EmptyState";
import CreateSubjectDrawer from "./components/CreateSubjectDrawer";
import EditSubjectDrawer from "./components/EditSubjectDrawer";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
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
      const response = await fetch("http://localhost:3001/api/curriculum/subjects");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
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

  // Subject handlers
  const handleCreateSubject = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleEditSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSelectedSubject(subject);
      setIsEditDrawerOpen(true);
    }
  };

  const handleDeleteSubject = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      setSubjectToDelete(subject);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/${subjectToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      showToast("Subject deleted successfully", "success");
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      showToast("Failed to delete subject", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSubjectToDelete(null);
    }
  };

  const handleCreateSuccess = () => {
    showToast("Subject created successfully", "success");
    fetchSubjects();
  };

  const handleEditSuccess = () => {
    showToast("Subject updated successfully", "success");
    fetchSubjects();
  };

  return (
    <>
      <div className="space-y-6">
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
                Manage your subjects and curriculum
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
        <div>
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
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <SimpleSubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={handleEditSubject}
                  onDelete={handleDeleteSubject}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Create Drawer */}
      <CreateSubjectDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={(message) => showToast(message, "error")}
      />

      {/* Edit Drawer */}
      <EditSubjectDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        onError={(message) => showToast(message, "error")}
        subject={selectedSubject}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        description={`Are you sure you want to delete "${subjectToDelete?.name}"? This action cannot be undone and will also delete all associated topics and subtopics.`}
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
