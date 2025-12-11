"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Loader2, Edit, Trash2, Search, ChevronRight, ArrowLeft, Upload } from "lucide-react";
import CreateCourseDrawer from "./course/components/CreateCourseDrawer";
import EditCourseDrawer from "./course/components/EditCourseDrawer";
import CreateSubjectDrawer from "./subjects/components/CreateSubjectDrawer";
import EditSubjectDrawer from "./subjects/components/EditSubjectDrawer";
import BulkUploadDrawer from "./subjects/components/BulkUploadDrawer";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface Course {
  id: number;
  name: string;
  description: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  courseId: number;
  isActive: boolean;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

type View = "courses" | "subjects";

export default function CurriculumPage() {
  const router = useRouter();

  // View state
  const [currentView, setCurrentView] = useState<View>("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer states for courses
  const [isCreateCourseDrawerOpen, setIsCreateCourseDrawerOpen] = useState(false);
  const [isEditCourseDrawerOpen, setIsEditCourseDrawerOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null);

  // Drawer states for subjects
  const [isCreateSubjectDrawerOpen, setIsCreateSubjectDrawerOpen] = useState(false);
  const [isEditSubjectDrawerOpen, setIsEditSubjectDrawerOpen] = useState(false);
  const [isBulkUploadDrawerOpen, setIsBulkUploadDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCourseIdForBulkUpload, setSelectedCourseIdForBulkUpload] = useState<number | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "course" | "subject"; item: Course | Subject } | null>(null);
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

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/curriculum/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
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

  // Fetch subjects for selected course
  const fetchSubjects = async (courseId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/curriculum/courses/${courseId}/subjects`);
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
    if (currentView === "courses") {
      fetchCourses();
    } else if (currentView === "subjects" && selectedCourse) {
      fetchSubjects(selectedCourse.id);
    }
  }, [currentView, selectedCourse]);

  // Course handlers
  const handleViewSubjects = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView("subjects");
    setSearchQuery(""); // Reset search when switching views
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentView("courses");
    setSearchQuery(""); // Reset search when switching views
  };

  const handleCreateCourse = () => {
    setIsCreateCourseDrawerOpen(true);
  };

  const handleEditCourse = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setSelectedCourseForEdit(course);
      setIsEditCourseDrawerOpen(true);
    }
  };

  const handleDeleteCourse = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setItemToDelete({ type: "course", item: course });
      setIsDeleteDialogOpen(true);
    }
  };

  // Subject handlers
  const handleViewTopics = (subjectId: number) => {
    router.push(`/superadmin/curriculum/subjects/${subjectId}/topics`);
  };

  const handleCreateSubject = () => {
    setIsCreateSubjectDrawerOpen(true);
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
      setItemToDelete({ type: "subject", item: subject as Subject });
      setIsDeleteDialogOpen(true);
    }
  };

  // Delete confirmation
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const endpoint =
        itemToDelete.type === "course"
          ? `http://localhost:3001/api/curriculum/courses/${itemToDelete.item.id}`
          : `http://localhost:3001/api/curriculum/subjects/${itemToDelete.item.id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${itemToDelete.type}`);
      }

      showToast(`${itemToDelete.type === "course" ? "Course" : "Subject"} deleted successfully`, "success");

      if (itemToDelete.type === "course") {
        fetchCourses();
      } else {
        if (selectedCourse) {
          fetchSubjects(selectedCourse.id);
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      showToast(`Failed to delete ${itemToDelete.type}`, "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Success handlers
  const handleCourseCreateSuccess = () => {
    showToast("Course created successfully", "success");
    fetchCourses();
  };

  const handleCourseEditSuccess = () => {
    showToast("Course updated successfully", "success");
    fetchCourses();
  };

  const handleSubjectCreateSuccess = () => {
    showToast("Subject created successfully", "success");
    if (selectedCourse) {
      fetchSubjects(selectedCourse.id);
    }
  };

  const handleSubjectEditSuccess = () => {
    showToast("Subject updated successfully", "success");
    if (selectedCourse) {
      fetchSubjects(selectedCourse.id);
    }
  };

  // Filter data based on search query
  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(searchLower) ||
      (course.description?.toLowerCase().includes(searchLower) || false)
    );
  });

  const filteredSubjects = subjects.filter((subject) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      subject.name.toLowerCase().includes(searchLower) ||
      (subject.description?.toLowerCase().includes(searchLower) || false)
    );
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          {currentView === "subjects" && (
            <button
              onClick={handleBackToCourses}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentView === "courses" ? "Courses" : selectedCourse?.name || "Subjects"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentView === "courses"
                    ? "Manage and organize your courses"
                    : "Manage subjects for this course"}
                </p>
              </div>
            </div>

            <button
              onClick={currentView === "courses" ? handleCreateCourse : handleCreateSubject}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              {currentView === "courses" ? "Create Course" : "Create Subject"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${currentView}...`}
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
          ) : currentView === "courses" ? (
            // Courses View
            filteredCourses.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No courses found" : "No courses yet"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by creating your first course"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleCreateCourse}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Course
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Course Name
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
                    {filteredCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewSubjects(course)}
                            className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                          >
                            {course.name}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                            {course.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedCourseIdForBulkUpload(course.id);
                                setIsBulkUploadDrawerOpen(true);
                              }}
                              className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                              title="Bulk Upload Curriculum"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditCourse(course.id)}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
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
            )
          ) : (
            // Subjects View
            filteredSubjects.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No subjects found" : "No subjects yet"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by creating your first subject"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleCreateSubject}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Subject
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Subject Name
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
                    {filteredSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewTopics(subject.id)}
                            className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                          >
                            {subject.name}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                            {subject.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditSubject(subject.id)}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(subject.id)}
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
            )
          )}
        </div>
      </div>

      {/* Course Drawers */}
      <CreateCourseDrawer
        isOpen={isCreateCourseDrawerOpen}
        onClose={() => setIsCreateCourseDrawerOpen(false)}
        onSuccess={handleCourseCreateSuccess}
        onError={(message) => showToast(message, "error")}
      />

      <EditCourseDrawer
        isOpen={isEditCourseDrawerOpen}
        onClose={() => setIsEditCourseDrawerOpen(false)}
        onSuccess={handleCourseEditSuccess}
        onError={(message) => showToast(message, "error")}
        course={selectedCourseForEdit}
      />

      {/* Subject Drawers */}
      {selectedCourse && (
        <>
          <CreateSubjectDrawer
            isOpen={isCreateSubjectDrawerOpen}
            onClose={() => setIsCreateSubjectDrawerOpen(false)}
            onSuccess={handleSubjectCreateSuccess}
            onError={(message) => showToast(message, "error")}
            courseId={selectedCourse.id}
          />

          <EditSubjectDrawer
            isOpen={isEditSubjectDrawerOpen}
            onClose={() => setIsEditSubjectDrawerOpen(false)}
            onSuccess={handleSubjectEditSuccess}
            onError={(message) => showToast(message, "error")}
            subject={selectedSubject}
          />
        </>
      )}

      {/* Bulk Upload Drawer */}
      {selectedCourseIdForBulkUpload && (
        <BulkUploadDrawer
          isOpen={isBulkUploadDrawerOpen}
          onClose={() => {
            setIsBulkUploadDrawerOpen(false);
            setSelectedCourseIdForBulkUpload(null);
          }}
          courseId={selectedCourseIdForBulkUpload}
          onSuccess={() => {
            setIsBulkUploadDrawerOpen(false);
            setSelectedCourseIdForBulkUpload(null);
            if (selectedCourse && selectedCourse.id === selectedCourseIdForBulkUpload) {
              fetchSubjects(selectedCourse.id);
            }
            showToast("Bulk upload completed successfully!", "success");
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete?.type === "course" ? "Course" : "Subject"}`}
        description={`Are you sure you want to delete "${itemToDelete?.item.name}"? This action cannot be undone${
          itemToDelete?.type === "course" ? " and will also delete all associated subjects, topics and subtopics" : " and will also delete all associated topics and subtopics"
        }.`}
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
