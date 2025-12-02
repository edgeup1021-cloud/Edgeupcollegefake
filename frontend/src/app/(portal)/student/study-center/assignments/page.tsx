"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, AlertTriangle, CheckCircle, FileText, Download, Upload, Eye, Star, BookOpen, Target, AlertCircle, XCircle, Clock3, User } from "lucide-react";
import { getStudentAssignments, submitAssignment } from '@/services/assignment.service';
import { SUBJECTS } from '@/config/dropdowns.config';
import { useAuth } from '@/contexts/AuthContext';

// Types for student assignments
type TaskType = "Homework" | "Assignment" | "Project" | "Lab";
type Priority = "HIGH" | "MEDIUM" | "LOW";
type SubmissionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "LATE" | "GRADED";

interface StudentAssignment {
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
  status: SubmissionStatus;
  createdAt: string;
  maxMarks: number;
  attachmentUrl?: string;
  attachmentName?: string;
  submission?: {
    id: string;
    submittedAt: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    grade?: number;
    feedback?: string;
    isLate: boolean;
  };
}

// Student data comes from auth context

// Filter options - subjects from centralized config with "All Subjects" option
const subjects = ["All Subjects", ...SUBJECTS];

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

const mapStatusToFrontend = (status: string): SubmissionStatus => {
  const mapping: Record<string, SubmissionStatus> = {
    'pending': 'NOT_STARTED',
    'submitted': 'SUBMITTED',
    'graded': 'GRADED'
  };
  return mapping[status] || 'NOT_STARTED';
};

const transformBackendToFrontend = (sub: any): StudentAssignment => {
  const assignment = sub.assignment;
  return {
    id: assignment?.id?.toString() || sub.assignmentId.toString(),
    type: mapBackendTypeToFrontend(assignment?.type || 'Assignment'),
    subject: assignment?.subject || 'Unknown',
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate?.split('T')[0] || '',
    priority: (assignment?.priority || 'MEDIUM') as Priority,
    program: assignment?.program || '',
    batch: assignment?.batch || '',
    section: assignment?.section || '',
    status: mapStatusToFrontend(sub.status),
    createdAt: sub.createdAt.split('T')[0],
    maxMarks: assignment?.maxMarks || 100,
    attachmentUrl: assignment?.fileUrl,
    attachmentName: assignment?.fileUrl?.split('/').pop(),
    submission: sub.status !== 'pending' ? {
      id: sub.id.toString(),
      submittedAt: sub.submittedAt?.toString() || '',
      content: sub.notes || undefined,
      fileUrl: sub.fileUrl || undefined,
      fileName: sub.fileUrl?.split('/').pop(),
      grade: sub.grade || undefined,
      feedback: sub.feedback || undefined,
      isLate: false,
    } : undefined,
  };
};

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "ALL">("ALL");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"dueDate" | "status" | "subject">("dueDate");
  const [viewingAssignment, setViewingAssignment] = useState<StudentAssignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");

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
      const data = await getStudentAssignments(user.id);
      setAssignments(data.map(transformBackendToFrontend));
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || assignment.status === filterStatus;
      const matchesSubject = filterSubject === "All Subjects" || assignment.subject === filterSubject;
      const matchesPriority = filterPriority === "ALL" || assignment.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesSubject && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "subject":
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

  // Utility functions
  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();
  const getDaysUntilDue = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: SubmissionStatus, dueDate: string) => {
    const overdue = isOverdue(dueDate) && status !== "SUBMITTED" && status !== "GRADED";
    
    switch (status) {
      case "NOT_STARTED":
        return overdue ? "bg-red-100 text-red-800 border-red-200" : "bg-gray-100 text-gray-800 border-gray-200";
      case "IN_PROGRESS":
        return overdue ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-blue-100 text-blue-800 border-blue-200";
      case "SUBMITTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "LATE":
        return "bg-red-100 text-red-800 border-red-200";
      case "GRADED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
      case "NOT_STARTED":
        return <Clock3 className="w-3 h-3" />;
      case "IN_PROGRESS":
        return <Clock className="w-3 h-3" />;
      case "SUBMITTED":
        return <CheckCircle className="w-3 h-3" />;
      case "LATE":
        return <AlertTriangle className="w-3 h-3" />;
      case "GRADED":
        return <Star className="w-3 h-3" />;
      default:
        return <Clock3 className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case "Homework":
        return <BookOpen className="w-4 h-4" />;
      case "Assignment":
        return <FileText className="w-4 h-4" />;
      case "Project":
        return <Target className="w-4 h-4" />;
      case "Lab":
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    if (!user?.id) {
      console.error('No user ID available');
      alert('You must be logged in to submit assignments.');
      return;
    }

    try {
      const payload = {
        assignmentId: Number(assignmentId),
        notes: submissionText,
        // fileUrl will be added when S3 integration is done
      };

      await submitAssignment(user.id, payload);
      await loadAssignments(); // Reload to get updated data

      setSubmissionText("");
      setViewingAssignment(null);
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

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
            Assignments & Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and submit your assignments
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
          <div>{filteredAssignments.length} total assignments</div>
          <div className="text-xs">
            {filteredAssignments.filter(a => a.status === "NOT_STARTED" || a.status === "IN_PROGRESS").length} pending
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | "ALL")}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | "ALL")}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "dueDate" | "status" | "subject")}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="status">Sort by Status</option>
              <option value="subject">Sort by Subject</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => {
          const overdue = isOverdue(assignment.dueDate) && assignment.status !== "SUBMITTED" && assignment.status !== "GRADED";
          const daysUntil = getDaysUntilDue(assignment.dueDate);
          const urgentDeadline = daysUntil <= 2 && !overdue && assignment.status !== "SUBMITTED" && assignment.status !== "GRADED";

          return (
            <div
              key={assignment.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
                overdue ? "border-red-300 dark:border-red-700" : 
                urgentDeadline ? "border-yellow-300 dark:border-yellow-700" :
                "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${assignment.type === "Project" ? "bg-purple-100 text-purple-600" : assignment.type === "Assignment" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                    {getTypeIcon(assignment.type)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {assignment.type}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </span>
              </div>

              {/* Subject */}
              <div className="text-xs font-semibold text-brand-primary mb-1">
                {assignment.subject}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {assignment.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                {assignment.description}
              </p>

              {/* Due Date */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={`${overdue ? "text-red-600 font-semibold" : urgentDeadline ? "text-yellow-600 font-semibold" : "text-gray-600 dark:text-gray-400"}`}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  {overdue ? " (Overdue)" : 
                   urgentDeadline ? ` (${daysUntil} day${daysUntil === 1 ? '' : 's'} left)` : 
                   ` (${daysUntil} days left)`}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(assignment.status, assignment.dueDate)}`}>
                  {getStatusIcon(assignment.status)}
                  {assignment.status.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Max: {assignment.maxMarks} marks
                </span>
              </div>

              {/* Grade display */}
              {assignment.submission?.grade !== undefined && (
                <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-800 dark:text-green-300">Grade:</span>
                    <span className="font-bold text-green-800 dark:text-green-300">
                      {assignment.submission.grade}/{assignment.maxMarks}
                    </span>
                  </div>
                  {assignment.submission.feedback && (
                    <div className="mt-1 text-xs text-green-700 dark:text-green-300">
                      {assignment.submission.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Attachment */}
              {assignment.attachmentUrl && (
                <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs">
                      {assignment.attachmentName}
                    </span>
                    <button className="ml-auto text-brand-primary hover:text-brand-primary/80 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Submission info */}
              {assignment.submission && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    <div className="flex items-center justify-between">
                      <span>Submitted:</span>
                      <span>{new Date(assignment.submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {assignment.submission.fileName && (
                      <div className="flex items-center gap-1 mt-1">
                        <FileText className="w-3 h-3" />
                        <span>{assignment.submission.fileName} ({assignment.submission.fileSize})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingAssignment(assignment)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
                
                {(assignment.status === "NOT_STARTED" || assignment.status === "IN_PROGRESS") && (
                  <button
                    onClick={() => setViewingAssignment(assignment)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    {assignment.status === "NOT_STARTED" ? "Start" : "Continue"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No results */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later for new assignments.
          </p>
        </div>
      )}

      {/* Assignment Detail Modal */}
      {viewingAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {viewingAssignment.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {viewingAssignment.subject} • {viewingAssignment.type}
                  </p>
                </div>
                <button
                  onClick={() => setViewingAssignment(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Assignment Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {viewingAssignment.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Due Date</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(viewingAssignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Max Marks</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {viewingAssignment.maxMarks}
                    </p>
                  </div>
                </div>

                {viewingAssignment.attachmentUrl && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attachment</h4>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {viewingAssignment.attachmentName}
                      </span>
                      <button className="ml-auto text-brand-primary hover:text-brand-primary/80 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submission Section */}
              {(viewingAssignment.status === "NOT_STARTED" || viewingAssignment.status === "IN_PROGRESS") && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Submit Assignment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Written Response
                      </label>
                      <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your response here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Upload (Optional)
                      </label>
                      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center hover:border-brand-primary transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Drop files here or click to upload
                        </p>
                        <input type="file" multiple className="hidden" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSubmit(viewingAssignment.id)}
                        disabled={!submissionText.trim()}
                        className="flex-1 bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Assignment
                      </button>
                      <button
                        onClick={() => setViewingAssignment(null)}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission History */}
              {viewingAssignment.submission && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Submission Details</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(viewingAssignment.submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {viewingAssignment.submission.grade !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Grade:</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {viewingAssignment.submission.grade}/{viewingAssignment.maxMarks}
                        </span>
                      </div>
                    )}

                    {viewingAssignment.submission.feedback && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Feedback:</span>
                        <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-2 rounded">
                          {viewingAssignment.submission.feedback}
                        </p>
                      </div>
                    )}

                    {viewingAssignment.submission.content && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Submission:</span>
                        <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-600 p-2 rounded">
                          {viewingAssignment.submission.content}
                        </p>
                      </div>
                    )}

                    {viewingAssignment.submission.fileName && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {viewingAssignment.submission.fileName} ({viewingAssignment.submission.fileSize})
                        </span>
                        <button className="ml-auto text-brand-primary hover:text-brand-primary/80 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}