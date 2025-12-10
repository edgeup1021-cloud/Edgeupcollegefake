"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import CourseCard from "./components/CourseCard";
import EmptyState from "./components/EmptyState";
import CreateCourseDrawer from "./components/CreateCourseDrawer";
import EditCourseDrawer from "./components/EditCourseDrawer";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface Course {
  id: number;
  name: string;
  description: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
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

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/curriculum/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setSelectedCourse(course);
      setIsEditDrawerOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCourseToDelete(course);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`http://localhost:3001/api/curriculum/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete course');

      showToast("Course deleted successfully", "success");
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("Failed to delete course", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = () => {
    setIsCreateDrawerOpen(true);
  };

  const handleCreateSuccess = () => {
    showToast("Course created successfully", "success");
    fetchCourses(); // Refresh list
  };

  const handleEditSuccess = () => {
    showToast("Course updated successfully", "success");
    fetchCourses(); // Refresh list
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
                Course Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and organize your courses
              </p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Course
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
          ) : courses.length === 0 ? (
            // Empty State
            <EmptyState />
          ) : (
            // Course List
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Create Drawer */}
      <CreateCourseDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={(message) => showToast(message, "error")}
      />

      {/* Edit Drawer */}
      <EditCourseDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        onError={(message) => showToast(message, "error")}
        course={selectedCourse}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        itemName={courseToDelete?.name}
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
