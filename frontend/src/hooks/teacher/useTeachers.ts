/**
 * Teacher Hooks for Dashboard and Management
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTeacherDashboard,
  getTeacherProfile,
  TeacherApiError,
} from '@/services/teacher.service';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Teacher,
  TeacherOverview,
  TeacherSchedule,
  TeacherDashboardData,
  TeacherDashboardStats,
} from '@/types/teacher.types';

/**
 * Hook for fetching teacher dashboard data
 */
export function useTeacherDashboard() {
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDashboard = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call new dashboard API with actual user ID
      const dashboardResponse = await getTeacherDashboard(user.id);

      // Transform to frontend format
      const dashboardData: TeacherDashboardData = {
        profile: dashboardResponse.profile,

        stats: {
          classesToday: {
            value: dashboardResponse.stats.classesToday,
            total: dashboardResponse.stats.classesToday,
            label: 'Classes Today',
          },
          totalStudents: {
            value: dashboardResponse.stats.totalStudents,
            total: dashboardResponse.stats.totalStudents + 50,
            label: 'Total Students',
          },
          assignmentsToGrade: {
            value: dashboardResponse.stats.assignmentsToGrade,
            total: dashboardResponse.stats.assignmentsToGrade + 10,
            label: 'Assignments to Grade',
          },
          attendanceRate: {
            value: 0,
            total: 100,
            unit: '',
            label: 'Class Attendance Rate',
          },
        },

        schedule: dashboardResponse.schedule.map(item => ({
          time: new Date(`${item.sessionDate}T${item.startTime}`).getHours().toString(),
          period: new Date(`${item.sessionDate}T${item.startTime}`).getHours() >= 12 ? 'PM' : 'AM',
          title: item.courseTitle,
          type: mapSessionType(item.sessionType),
          duration: `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}m`,
          room: item.room,
        })),

        deadlines: dashboardResponse.deadlines.map(item => {
          const dueDate = new Date(item.dueDate);
          const now = new Date();
          const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          return {
            title: `${item.title} - ${item.courseTitle}`,
            type: mapDeadlineType(item.type),
            dueDate: item.dueDate as string,
            description: `Assignment due for grading`,
            daysLeft: Math.max(0, daysLeft),
          };
        }),
      };

      setDashboard(dashboardData);
    } catch (err) {
      console.error('Failed to fetch teacher dashboard:', err);
      if (err instanceof TeacherApiError) {
        setError(err.message);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refresh = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh,
  };
}

/**
 * Helper function to map session types
 */
function mapSessionType(sessionType: string): 'Lecture' | 'Lab' | 'Tutorial' {
  const typeMap: Record<string, 'Lecture' | 'Lab' | 'Tutorial'> = {
    lecture: 'Lecture',
    lab: 'Lab',
    tutorial: 'Tutorial',
    exam: 'Lecture', // Map exam to lecture as fallback
  };

  return typeMap[sessionType.toLowerCase()] || 'Lecture';
}

/**
 * Helper function to map deadline types
 */
function mapDeadlineType(type: string): 'grading' | 'administrative' | 'exam' | 'meeting' {
  const typeMap: Record<string, 'grading' | 'administrative' | 'exam' | 'meeting'> = {
    'assignment': 'grading',
    'project': 'grading',
    'homework': 'grading',
    'lab': 'grading',
    'exam': 'exam',
    'quiz': 'exam',
  };
  return typeMap[type.toLowerCase()] || 'grading';
}

/**
 * Hook for fetching teacher profile
 */
export function useTeacherProfile() {
  const [profile, setProfile] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await getTeacherProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch teacher profile:', err);
      if (err instanceof TeacherApiError) {
        setError(err.message);
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
  };
}