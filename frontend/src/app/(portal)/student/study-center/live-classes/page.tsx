'use client';

import { useEffect, useState } from 'react';
import { Video, Calendar, Clock, User, Search, Loader2, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentLiveClasses, joinLiveClass } from '@/services/live-classes.service';
import type { LiveClass } from '@/types/live-classes.types';

export default function StudentLiveClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'LIVE' | 'COMPLETED'>('ALL');
  const [joiningClassId, setJoiningClassId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadClasses();
    }
  }, [user, statusFilter]);

  // Auto-refresh every minute to check if scheduled classes can be joined
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render by updating a dummy state
      setClasses((prev) => [...prev]);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadClasses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : undefined;
      const data = await getStudentLiveClasses(user.id, params);
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (liveClass: LiveClass) => {
    if (!user?.id || joiningClassId) return;

    console.log('Joining class:', liveClass);
    console.log('Meet link:', liveClass.meetLink);

    // Check if meetLink exists
    if (!liveClass.meetLink) {
      alert('No Meet link available for this class.');
      return;
    }

    try {
      setJoiningClassId(liveClass.id);

      // Open Google Meet in new tab FIRST (before API call to avoid popup blocking)
      console.log('Opening Meet link in new tab...');
      const meetWindow = window.open(liveClass.meetLink, '_blank', 'noopener,noreferrer');

      if (!meetWindow || meetWindow.closed || typeof meetWindow.closed === 'undefined') {
        console.error('Popup blocked');
        alert('Please allow popups for this site to join the class. Check your browser settings.');
        setJoiningClassId(null);
        return;
      }

      console.log('Meet window opened successfully');

      // Track attendance in backend asynchronously (don't block on this)
      joinLiveClass(liveClass.id, user.id)
        .then(() => console.log('Attendance tracked successfully'))
        .catch((error) => {
          console.error('Failed to track attendance:', error);
          // Don't show error to user since they already joined the meet
        });

      setJoiningClassId(null);
    } catch (error) {
      console.error('Failed to join class:', error);
      alert('Failed to join class. Please try again.');
      setJoiningClassId(null);
    }
  };

  const filteredClasses = classes.filter((cls) =>
    cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: LiveClass['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'LIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const canJoinClass = (liveClass: LiveClass) => {
    // Can join if status is LIVE
    if (liveClass.status === 'LIVE') return true;

    // Can join if scheduled time has arrived (even if status is still SCHEDULED)
    if (liveClass.status === 'SCHEDULED') {
      const scheduledDateTime = new Date(`${liveClass.scheduledDate.split('T')[0]}T${liveClass.scheduledTime}`);
      const now = new Date();
      return now >= scheduledDateTime;
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Join live classes and never miss a session
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['ALL', 'SCHEDULED', 'LIVE', 'COMPLETED'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={statusFilter === status ? 'bg-brand-primary hover:bg-brand-primary/90' : ''}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          </div>
        ) : filteredClasses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search' : 'No classes scheduled yet'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((liveClass, index) => (
              <motion.div
                key={liveClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {liveClass.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {liveClass.subject}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(liveClass.status)}`}>
                    {liveClass.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {liveClass.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{liveClass.teacherName || 'Teacher'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(liveClass.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{liveClass.scheduledTime} ({liveClass.duration} min)</span>
                  </div>
                </div>

                {/* Action Button */}
                {canJoinClass(liveClass) ? (
                  <Button
                    onClick={() => handleJoinClass(liveClass)}
                    disabled={joiningClassId === liveClass.id}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90"
                  >
                    {joiningClassId === liveClass.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Join Class
                  </Button>
                ) : liveClass.status === 'SCHEDULED' ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Scheduled
                  </Button>
                ) : liveClass.status === 'COMPLETED' ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full"
                  >
                    Completed
                  </Button>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
