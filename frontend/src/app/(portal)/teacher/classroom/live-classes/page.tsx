"use client";

import { useState, useEffect } from "react";
import { Plus, Video, Calendar, Clock, Users, Eye, Edit3, Trash2, Play, Square, Search, Filter, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getTeacherLiveClasses, createLiveClass, updateLiveClass, deleteLiveClass, startLiveClass, endLiveClass } from "@/services/live-classes.service";
import type { LiveClass, CreateLiveClassInput } from "@/types/live-classes.types";
import { SUBJECTS, PROGRAMS, BATCHES, SECTIONS } from "@/config/dropdowns.config";

export default function LiveClassesPage() {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SCHEDULED' | 'LIVE' | 'COMPLETED'>('ALL');

  const [formData, setFormData] = useState<CreateLiveClassInput>({
    title: "",
    description: "",
    subject: "",
    meetLink: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    program: "",
    batch: "",
    section: ""
  });

  useEffect(() => {
    if (user?.id) {
      loadLiveClasses();
    }
  }, [user?.id]);

  const loadLiveClasses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getTeacherLiveClasses();
      setLiveClasses(data);
    } catch (error) {
      console.error('Failed to load live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      meetLink: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: 60,
      program: "",
      batch: "",
      section: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    try {
      if (editingClass) {
        await updateLiveClass(editingClass.id, formData);
      } else {
        await createLiveClass(formData);
      }

      await loadLiveClasses();
      resetForm();
      setShowCreateForm(false);
      setEditingClass(null);
    } catch (error) {
      console.error('Failed to save live class:', error);
      alert('Failed to save live class. Please try again.');
    }
  };

  const handleEdit = (liveClass: LiveClass) => {
    setEditingClass(liveClass);
    setFormData({
      title: liveClass.title,
      description: liveClass.description,
      subject: liveClass.subject,
      meetLink: liveClass.meetLink,
      scheduledDate: liveClass.scheduledDate.split('T')[0],
      scheduledTime: liveClass.scheduledTime,
      duration: liveClass.duration,
      program: liveClass.program,
      batch: liveClass.batch,
      section: liveClass.section
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      await deleteLiveClass(id);
      await loadLiveClasses();
    } catch (error) {
      console.error('Failed to delete live class:', error);
      alert('Failed to delete live class. Please try again.');
    }
  };

  const handleStartClass = async (id: number, meetLink: string) => {
    try {
      await startLiveClass(id);
      await loadLiveClasses();
      // Open Meet link in new tab
      window.open(meetLink, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to start class:', error);
    }
  };

  const handleEndClass = async (id: number) => {
    try {
      await endLiveClass(id);
      await loadLiveClasses();
    } catch (error) {
      console.error('Failed to end class:', error);
    }
  };

  const cancelEdit = () => {
    setEditingClass(null);
    resetForm();
    setShowCreateForm(false);
  };


  const filteredClasses = liveClasses.filter(liveClass => {
    const matchesSearch = liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         liveClass.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || liveClass.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: LiveClass['status']) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'LIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="w-7 h-7 text-brand-primary" />
            Live Classes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Schedule and manage your live classes
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] font-semibold"
        >
          <Plus className="w-5 h-5" />
          Schedule Live Class
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live Now</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingClass ? 'Edit Live Class' : 'Schedule Live Class'}
                    </h2>
                    <p className="text-white/80 text-sm mt-0.5">
                      Schedule a class with Google Meet link
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelEdit}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Class Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Class Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Introduction to Data Structures"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        min="15"
                        max="480"
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="Brief description of what will be covered..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Schedule
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Google Meet Link */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Google Meet Link
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meet Link
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="url"
                        value={formData.meetLink}
                        onChange={(e) => setFormData({...formData, meetLink: e.target.value})}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      Paste your Google Meet link here
                    </p>
                  </div>
                </div>

                {/* Assign To */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-brand-primary rounded-full"></div>
                    Assign To Students
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Program
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select</option>
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
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select</option>
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
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select</option>
                        {SECTIONS.map(section => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold"
                  >
                    {editingClass ? 'Update Class' : 'Schedule Class'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((liveClass) => (
          <motion.div
            key={liveClass.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl text-white">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                    {liveClass.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {liveClass.subject}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(liveClass.status)}`}>
                {liveClass.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {liveClass.description}
            </p>

            {/* Schedule Info */}
            <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatDate(liveClass.scheduledDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatTime(liveClass.scheduledTime)} • {liveClass.duration} min
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {liveClass.program.split(' - ')[0]} • {liveClass.batch} • Sec {liveClass.section}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {liveClass.status === 'LIVE' && (
                <a
                  href={liveClass.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-3 rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
                >
                  <Video className="w-4 h-4" />
                  Join Class
                </a>
              )}

              {liveClass.status === 'SCHEDULED' && (
                <>
                  <button
                    onClick={() => handleStartClass(liveClass.id, liveClass.meetLink)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-2.5 px-3 rounded-lg hover:shadow-md transition-all font-medium text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Start & Join
                  </button>
                  <button
                    onClick={() => handleEdit(liveClass)}
                    className="p-2.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}

              {liveClass.status === 'COMPLETED' && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 py-2.5 px-3 rounded-lg font-medium text-sm cursor-not-allowed"
                  disabled
                >
                  <Square className="w-4 h-4" />
                  Ended
                </button>
              )}

              {liveClass.status === 'LIVE' && (
                <button
                  onClick={() => handleEndClass(liveClass.id)}
                  className="p-2.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handleDelete(liveClass.id)}
                className="p-2.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No live classes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterStatus !== 'ALL'
              ? "Try adjusting your filters"
              : "Schedule your first live class to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
}
