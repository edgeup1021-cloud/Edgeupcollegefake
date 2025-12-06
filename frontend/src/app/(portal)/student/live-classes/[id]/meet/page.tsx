'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Users, Clock, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getLiveClass, leaveLiveClass } from '@/services/live-classes.service';
import type { LiveClass } from '@/types/live-classes.types';

export default function StudentMeetPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [leavingClass, setLeavingClass] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadLiveClass();
    }
  }, [params.id]);

  const loadLiveClass = async () => {
    try {
      setLoading(true);
      const data = await getLiveClass(Number(params.id));
      setLiveClass(data);
    } catch (error) {
      console.error('Failed to load live class:', error);
      alert('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClass = async () => {
    if (!liveClass || !user?.id || leavingClass) return;

    if (!confirm('Are you sure you want to leave this class?')) {
      return;
    }

    try {
      setLeavingClass(true);
      await leaveLiveClass(liveClass.id, user.id);
      router.push('/student/live-classes');
    } catch (error) {
      console.error('Failed to leave class:', error);
      alert('Failed to leave class. Please try again.');
      setLeavingClass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading class...</p>
        </div>
      </div>
    );
  }

  if (!liveClass) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Class not found</p>
          <Button onClick={() => router.push('/student/live-classes')}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-b border-gray-700 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          {/* Class Info */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{liveClass.title}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <span>{liveClass.subject}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {liveClass.duration} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {liveClass.status === 'LIVE' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium text-sm">Live</span>
              </div>
            )}

            <Button
              variant="destructive"
              onClick={handleLeaveClass}
              disabled={leavingClass}
              className="bg-red-600 hover:bg-red-700"
            >
              {leavingClass ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Leave Class
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Meet Iframe Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 relative"
      >
        <iframe
          src={liveClass.meetLink}
          className="w-full h-full"
          allow="camera; microphone; fullscreen; speaker; display-capture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </motion.div>

      {/* Bottom Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border-t border-gray-700 px-6 py-3"
      >
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-6">
            <span>Subject: {liveClass.subject}</span>
            <span>Date: {new Date(liveClass.scheduledDate).toLocaleDateString()}</span>
            <span>Time: {liveClass.scheduledTime}</span>
          </div>
          <span className="text-xs text-gray-500">
            Hosted by {liveClass.teacherName || 'Teacher'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
