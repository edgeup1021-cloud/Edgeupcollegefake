"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit3, Trash2, Eye, Calendar, Book, ClipboardList, Folder, AlertTriangle, X, Save, Upload, Clock, AlertCircle, Download, FileText, CheckCircle, XCircle, Clock3, User } from "lucide-react";

// Types based on screenshot analysis
type TaskType = "HOMEWORK" | "ASSIGNMENT" | "PROJECT";
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
  class: string;
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

// Mock data based on screenshot
const mockTasks: Task[] = [
  {
    id: "1",
    type: "HOMEWORK",
    subject: "Mathematics",
    title: "Calculus Problem Set - Chapter 5",
    description: "Complete exercises 1-20 from chapter 5. Show all work and explanations.",
    dueDate: "2024-12-25",
    priority: "HIGH",
    class: "Math 101 - Section A",
    status: "PUBLISHED",
    createdAt: "2024-12-01"
  },
  {
    id: "2", 
    type: "ASSIGNMENT",
    subject: "Physics",
    title: "Physics Lab Report - Pendulum Experiment",
    description: "Write a comprehensive lab report including hypothesis, methodology, results, and conclusion.",
    dueDate: "2024-12-28",
    priority: "HIGH", 
    class: "Physics 201 - Section B",
    status: "PUBLISHED",
    createdAt: "2024-12-02"
  },
  {
    id: "3",
    type: "PROJECT",
    subject: "Chemistry", 
    title: "Chemistry Research Project",
    description: "Research and present on organic chemistry applications in daily life.",
    dueDate: "2025-01-05",
    priority: "MEDIUM",
    class: "Chemistry 301 - Section A", 
    status: "PUBLISHED",
    createdAt: "2024-12-01"
  }
];

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"];
const classes = ["Math 101 - Section A", "Physics 201 - Section B", "Chemistry 301 - Section A", "Biology 101 - Section C"];

// Mock student submission data
const mockSubmissions: StudentSubmission[] = [
  {
    id: "sub1",
    studentId: "s1",
    studentName: "Alex Johnson",
    studentEmail: "alex.johnson@student.edu",
    taskId: "1",
    status: "SUBMITTED",
    submittedAt: "2024-12-20T14:30:00Z",
    fileName: "calculus_homework.pdf",
    fileSize: "2.5 MB",
    grade: 85,
    feedback: "Good work! Small calculation error in problem 15."
  },
  {
    id: "sub2",
    studentId: "s2",
    studentName: "Sarah Chen",
    studentEmail: "sarah.chen@student.edu",
    taskId: "1",
    status: "SUBMITTED",
    submittedAt: "2024-12-19T16:45:00Z",
    fileName: "math_solutions.pdf",
    fileSize: "1.8 MB",
    grade: 92,
    feedback: "Excellent work! All solutions are correct."
  },
  {
    id: "sub3",
    studentId: "s3",
    studentName: "Michael Rodriguez",
    studentEmail: "michael.r@student.edu",
    taskId: "1",
    status: "LATE",
    submittedAt: "2024-12-26T10:20:00Z",
    fileName: "homework_chapter5.docx",
    fileSize: "890 KB"
  },
  {
    id: "sub4",
    studentId: "s4",
    studentName: "Emma Wilson",
    studentEmail: "emma.wilson@student.edu",
    taskId: "1",
    status: "NOT_SUBMITTED"
  },
  {
    id: "sub5",
    studentId: "s5",
    studentName: "David Park",
    studentEmail: "david.park@student.edu",
    taskId: "2",
    status: "SUBMITTED",
    submittedAt: "2024-12-27T09:15:00Z",
    fileName: "pendulum_lab_report.pdf",
    fileSize: "4.2 MB",
    grade: 88,
    feedback: "Great methodology section. Improve conclusion."
  },
  {
    id: "sub6",
    studentId: "s6",
    studentName: "Lisa Thompson",
    studentEmail: "lisa.t@student.edu",
    taskId: "2",
    status: "SUBMITTED",
    submittedAt: "2024-12-26T20:30:00Z",
    fileName: "physics_experiment.pdf",
    fileSize: "3.1 MB"
  },
  {
    id: "sub7",
    studentId: "s7",
    studentName: "James Brown",
    studentEmail: "james.brown@student.edu",
    taskId: "3",
    status: "SUBMITTED",
    submittedAt: "2024-12-01T12:45:00Z",
    fileName: "chemistry_research.pdf",
    fileSize: "6.8 MB",
    grade: 95,
    feedback: "Outstanding research! Very thorough analysis."
  }
];

export default function TasksAssignmentsPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
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
    type: "HOMEWORK" as TaskType,
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM" as Priority,
    class: ""
  });

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case "HOMEWORK": return <Book className="w-4 h-4" />;
      case "ASSIGNMENT": return <ClipboardList className="w-4 h-4" />;
      case "PROJECT": return <Folder className="w-4 h-4" />;
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
      type: "HOMEWORK",
      subject: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      class: ""
    });
  };

  // Handle create/edit submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        ...editingTask,
        ...formData,
      };
      setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        status: "PUBLISHED",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTask]);
    }
    
    resetForm();
    setShowCreateForm(false);
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
      class: task.class
    });
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = (task: Task) => {
    setDeletingTask(task);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deletingTask) {
      setTasks(tasks.filter(task => task.id !== deletingTask.id));
      setDeletingTask(null);
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
  const getSubmissionsForTask = (taskId: string) => {
    return mockSubmissions.filter(sub => sub.taskId === taskId);
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
              <option value="HOMEWORK">Homework</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="PROJECT">Project</option>
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

      {/* Create/Edit Task Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${editingTask ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {editingTask ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
              </div>
            </div>
            <button
              onClick={editingTask ? cancelEdit : () => setShowCreateForm(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Task Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as TaskType})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="HOMEWORK">Homework</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Calculus Problem Set - Chapter 5"
                required
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                placeholder="Detailed instructions for students..."
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>

            {/* Class */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assign to Class
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* File Upload Section */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attachments (Optional)
              </label>
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 text-center hover:border-brand-primary transition-colors">
                <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Drop files here or click to upload
                </p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="lg:col-span-2 flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex items-center gap-2 flex-1 bg-brand-primary text-white py-2 px-3 rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-medium"
              >
                <Save className="w-3 h-3" />
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={editingTask ? cancelEdit : () => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
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
                    task.type === 'HOMEWORK' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : task.type === 'ASSIGNMENT' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
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

              {/* Class & Status */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {task.class}
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
                <strong>Class:</strong> {deletingTask.class}
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
                    {viewingSubmissions.class} • Due: {formatDueDate(viewingSubmissions.dueDate)}
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