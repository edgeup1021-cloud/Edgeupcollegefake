"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit3, Trash2, Eye, Calendar, Book, ClipboardList, Folder, AlertTriangle, X, Save, Upload, Clock, AlertCircle, Download, FileText, CheckCircle, XCircle, Clock3, User } from "lucide-react";
import { createAssignment, getAssignments, updateAssignment, deleteAssignment } from '@/services/assignment.service';
import type { AssignmentType } from '@/types/teacher.types';
import { PROGRAMS, BATCHES, SECTIONS, SUBJECTS } from '@/config/dropdowns.config';
import { useAuth } from '@/contexts/AuthContext';

// Types based on screenshot analysis
type TaskType = "Assignment" | "Project" | "Homework" | "Lab";
type Priority = "HIGH" | "MEDIUM" | "LOW";
type TaskStatus = "DRAFT" | "PUBLISHED" | "COMPLETED";

interface Task {
  id: string;
  type: TaskType;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  program: string;
  batch: string;
  section: string;
  status: TaskStatus;
  createdAt: string;
}

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  taskId: string;
  status: "SUBMITTED" | "LATE" | "NOT_SUBMITTED";
  submittedAt?: string;
  fileName?: string;
  fileSize?: string;
  grade?: number;
  feedback?: string;
}

// Task data comes from API

// Type mapping functions
const mapBackendTypeToFrontend = (type: string): TaskType => {
  const mapping: Record<string, TaskType> = {
    'Homework': 'Homework',
    'Assignment': 'Assignment',
    'Project': 'Project',
    'Lab': 'Lab'
  };
  return mapping[type] || 'Assignment';
};

const mapFrontendTypeToBackend = (type: TaskType): AssignmentType => {
  const mapping: Record<string, AssignmentType> = {
    'Homework': 'Homework' as AssignmentType,
    'Assignment': 'Assignment' as AssignmentType,
    'Project': 'Project' as AssignmentType,
    'Lab': 'Lab' as AssignmentType
  };
  return mapping[type] || ('Assignment' as AssignmentType);
};

const transformBackendToFrontend = (assignment: any): Task => ({
  id: assignment.id.toString(),
  type: mapBackendTypeToFrontend(assignment.type),
  subject: assignment.subject || '',
  title: assignment.title,
  description: assignment.description || '',
  dueDate: assignment.dueDate.split('T')[0],
  priority: (assignment.priority || 'MEDIUM') as Priority,
  program: assignment.program || '',
  batch: assignment.batch || '',
  section: assignment.section || '',
  status: (assignment.status === 'ACTIVE' ? 'PUBLISHED' : 'DRAFT') as TaskStatus,
  createdAt: assignment.createdAt.split('T')[0],
});

// Student submission data comes from API

export default function TasksAssignmentsPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<TaskType | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL");
  const [viewingSubmissions, setViewingSubmissions] = useState<Task | null>(null);
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState("");
  const [submissionFilter, setSubmissionFilter] = useState<"ALL" | "SUBMITTED" | "LATE" | "NOT_SUBMITTED">("ALL");

  // Form state
  const [formData, setFormData] = useState({
    type: "Assignment" as TaskType,
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM" as Priority,
    program: "",
    batch: "",
    section: ""
  });

  // Load assignments on mount
  useEffect(() => {
    if (user?.id) {
      loadAssignments();
    }
  }, [user?.id]);

  const loadAssignments = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      setLoading(true);
      console.log('[loadAssignments] Fetching assignments for user:', user);
      console.log('[loadAssignments] Query params:', { teacherId: user.id });
      const data = await getAssignments({ teacherId: user.id });
      console.log('[loadAssignments] Received', data.length, 'assignments:', data);
      setTasks(data.map(transformBackendToFrontend));
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case "Homework": return <Book className="w-4 h-4" />;
      case "Assignment": return <ClipboardList className="w-4 h-4" />;
      case "Project": return <Folder className="w-4 h-4" />;
      case "Lab": return <Folder className="w-4 h-4" />;
      default: return <ClipboardList className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM": return "bg-orange-100 text-orange-800 border-orange-200";
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "PUBLISHED": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "Assignment",
      subject: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      program: "",
      batch: "",
      section: ""
    });
  };

  // Handle create/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert('User ID not available. Please refresh and try again.');
      return;
    }

    try {
      const payload = {
        courseOfferingId: 1, // TODO: Get from course dropdown
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        type: mapFrontendTypeToBackend(formData.type),
        subject: formData.subject,
        program: formData.program,
        batch: formData.batch,
        section: formData.section,
        priority: formData.priority,
        maxMarks: 100,
      };

      if (editingTask) {
        await updateAssignment(Number(editingTask.id), payload);
      } else {
        await createAssignment(payload, user.id);
      }

      await loadAssignments();
      resetForm();
      setShowCreateForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save assignment:', error);
      alert('Failed to save assignment. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      type: task.type,
      subject: task.subject,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      program: task.program || "",
      batch: task.batch || "",
      section: task.section || ""
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = (task: Task) => {
    setDeletingTask(task);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingTask) return;

    try {
      await deleteAssignment(Number(deletingTask.id));
      await loadAssignments();
      setDeletingTask(null);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      alert('Failed to delete assignment. Please try again.');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingTask(null);
    resetForm();
    setShowCreateForm(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || task.type === filterType;
    const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    return new Date(dueDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Submissions functions
  const getSubmissionsForTask = (taskId: string): StudentSubmission[] => {
    // TODO: Fetch submissions from API
    return [];
  };

  const getSubmissionStats = (taskId: string) => {
    const submissions = getSubmissionsForTask(taskId);
    const submitted = submissions.filter(sub => sub.status === "SUBMITTED").length;
    const late = submissions.filter(sub => sub.status === "LATE").length;
    const notSubmitted = submissions.filter(sub => sub.status === "NOT_SUBMITTED").length;
    const total = submissions.length;
    
    return { submitted, late, notSubmitted, total };
  };

  const formatSubmissionDate = (dateString?: string) => {
    if (!dateString) return "Not submitted";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubmissionStatusColor = (status: StudentSubmission["status"]) => {
    switch (status) {
      case "SUBMITTED": return "bg-green-100 text-green-800 border-green-200";
      case "LATE": return "bg-orange-100 text-orange-800 border-orange-200";
      case "NOT_SUBMITTED": return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getSubmissionStatusIcon = (status: StudentSubmission["status"]) => {
    switch (status) {
      case "SUBMITTED": return <CheckCircle className="w-4 h-4" />;
      case "LATE": return <Clock3 className="w-4 h-4" />;
      case "NOT_SUBMITTED": return <XCircle className="w-4 h-4" />;
    }
  };

  const handleViewSubmissions = (task: Task) => {
    setViewingSubmissions(task);
    setSubmissionSearchTerm("");
    setSubmissionFilter("ALL");
  };

  const filteredSubmissions = viewingSubmissions ? getSubmissionsForTask(viewingSubmissions.id).filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(submissionSearchTerm.toLowerCase()) ||
                         submission.studentEmail.toLowerCase().includes(submissionSearchTerm.toLowerCase());
    const matchesFilter = submissionFilter === "ALL" || submission.status === submissionFilter;
    return matchesSearch && matchesFilter;
  }) : [];

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tasks & Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage tasks for your students
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TaskType | "ALL")}
              className="px-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Types</option>
              <option value="Homework">Homework</option>
              <option value="Assignment">Assignment</option>
              <option value="Project">Project</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | "ALL")}
              className="px-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Task Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    {editingTask ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <p className="text-white/80 text-sm mt-0.5">
                      {editingTask ? 'Update task details below' : 'Fill in the details to create a new assignment'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={editingTask ? cancelEdit : () => setShowCreateForm(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-6">
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Task Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as TaskType})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="Homework">📖 Homework</option>
                        <option value="Assignment">✍️ Assignment</option>
                        <option value="Project">📁 Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="e.g., Calculus Problem Set - Chapter 5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                      placeholder="Detailed instructions for students..."
                      required
                    />
                  </div>
                </div>

                {/* Section 2: Schedule & Priority */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Schedule & Priority
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="LOW">🟢 Low Priority</option>
                        <option value="MEDIUM">🟡 Medium Priority</option>
                        <option value="HIGH">🔴 High Priority</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Student Assignment */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Assign To
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Program
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select Program</option>
                        {PROGRAMS.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Batch
                      </label>
                      <select
                        value={formData.batch}
                        onChange={(e) => setFormData({...formData, batch: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select Batch</option>
                        {BATCHES.map(batch => (
                          <option key={batch} value={batch}>{batch}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Section
                      </label>
                      <select
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select Section</option>
                        {SECTIONS.map(section => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Attachments */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Attachments <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </h3>

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, PPT, or images up to 10MB
                    </p>
                    <input type="file" multiple className="hidden" />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={editingTask ? cancelEdit : () => setShowCreateForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTasks.map((task) => {
          const overdue = isOverdue(task.dueDate);
          const daysUntil = getDaysUntilDue(task.dueDate);
          const urgentDeadline = daysUntil <= 2 && !overdue;
          
          return (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                overdue 
                  ? 'border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-900/10'
                  : urgentDeadline
                  ? 'border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-primary/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    task.type === 'Homework' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : task.type === 'Assignment' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {task.type}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {task.subject}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-3">
                <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                  {task.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Due Date - Enhanced */}
              <div className={`p-2.5 rounded-lg mb-3 ${
                overdue 
                  ? 'bg-red-100 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  : urgentDeadline
                  ? 'bg-orange-100 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  : 'bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {overdue ? (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : urgentDeadline ? (
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Due Date
                      </p>
                      <p className={`text-xs font-bold ${
                        overdue 
                          ? 'text-red-700 dark:text-red-300'
                          : urgentDeadline
                          ? 'text-orange-700 dark:text-orange-300'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {formatDueDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {overdue ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded-full dark:bg-red-800 dark:text-red-200">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {getDaysOverdue(task.dueDate)}d overdue
                      </span>
                    ) : urgentDeadline ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-200 text-orange-800 text-xs font-bold rounded-full dark:bg-orange-800 dark:text-orange-200">
                        <Clock className="w-2.5 h-2.5" />
                        {daysUntil}d left
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full dark:bg-gray-600 dark:text-gray-300">
                        {daysUntil}d left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Program, Batch, Section & Status */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {task.program.split(' - ')[0]} • {task.batch} • Sec {task.section}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(task.status)} border border-current`}>
                  {task.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewSubmissions(task)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-2 px-3 rounded-lg text-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 font-medium"
                >
                  <Eye className="w-3 h-3" />
                  View Submissions
                </button>
                <button 
                  onClick={() => handleEdit(task)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 hover:scale-105"
                  title="Edit Task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(task)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-105"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterType !== "ALL" || filterPriority !== "ALL"
              ? "Try adjusting your filters or search terms"
              : "Create your first task to get started"
            }
          </p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Create New Task
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Task:</strong> {deletingTask.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Type:</strong> {deletingTask.type} • <strong>Subject:</strong> {deletingTask.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Program:</strong> {deletingTask.program.split(' - ')[0]} • <strong>Batch:</strong> {deletingTask.batch} • <strong>Section:</strong> {deletingTask.section}
              </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this task? All student submissions will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete Task
              </button>
              <button
                onClick={() => setDeletingTask(null)}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {viewingSubmissions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Submissions for "{viewingSubmissions.title}"
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {viewingSubmissions.program} - {viewingSubmissions.batch} - Section {viewingSubmissions.section} • Due: {formatDueDate(viewingSubmissions.dueDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingSubmissions(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-4 gap-4">
                {(() => {
                  const stats = getSubmissionStats(viewingSubmissions.id);
                  return (
                    <>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.submitted}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Submitted</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.late}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Late</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.notSubmitted}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Not Submitted</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={submissionSearchTerm}
                    onChange={(e) => setSubmissionSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {/* Status Filter */}
                <select
                  value={submissionFilter}
                  onChange={(e) => setSubmissionFilter(e.target.value as "ALL" | "SUBMITTED" | "LATE" | "NOT_SUBMITTED")}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="ALL">All Submissions</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="LATE">Late</option>
                  <option value="NOT_SUBMITTED">Not Submitted</option>
                </select>
              </div>
            </div>

            {/* Submissions List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No submissions found</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-semibold">
                          {submission.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {submission.studentName}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getSubmissionStatusColor(submission.status)}`}>
                              {getSubmissionStatusIcon(submission.status)}
                              {submission.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{submission.studentEmail}</p>
                          {submission.fileName && (
                            <div className="flex items-center gap-2 mt-1">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {submission.fileName} ({submission.fileSize})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatSubmissionDate(submission.submittedAt)}
                          </p>
                          {submission.grade && (
                            <p className="text-sm text-brand-primary font-semibold">
                              {submission.grade}/100
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.fileName && (
                            <button
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Download submission"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {submission.status !== "NOT_SUBMITTED" && (
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredSubmissions.length} of {getSubmissionsForTask(viewingSubmissions.id).length} submissions
                </p>
                <button
                  onClick={() => setViewingSubmissions(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}