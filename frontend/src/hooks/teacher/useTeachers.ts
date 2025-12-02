/**
 * Teacher Hooks for Dashboard and Management
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTeacherOverview,
  getTeacherProfile,
  getTeacherSchedule,
  TeacherApiError,
} from '@/services/teacher.service';
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

  const fetchDashboard = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {
      // For now, only fetch overview data since profile and schedule endpoints don't exist yet
      const overview = await getTeacherOverview();
      
      // Mock data for profile and schedule until backend endpoints are implemented
      const profile = {
        id: 1,
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@college.edu',
        phone: '+1-234-567-8900',
        designation: 'Professor',
        departmentId: 1,
        profileImage: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const schedule = [
        {
          id: 1,
          courseTitle: 'Data Structures & Algorithms',
          sessionDate: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          durationMinutes: 60,
          room: 'Room 301',
          sessionType: 'lecture' as const,
        },
        {
          id: 2,
          courseTitle: 'Database Management Systems',
          sessionDate: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          durationMinutes: 120,
          room: 'Computer Lab 2',
          sessionType: 'lab' as const,
        },
      ];

      // Transform the data into dashboard format
      const dashboardData: TeacherDashboardData = {
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          designation: profile.designation || 'Faculty',
          department: 'Computer Science', // TODO: Get from department API
          college: 'MIT College of Engineering', // TODO: Get from config
        },
        stats: {
          classesToday: {
            value: schedule.filter(s => {
              const today = new Date().toISOString().split('T')[0];
              return s.sessionDate.startsWith(today);
            }).length,
            total: schedule.length,
            label: 'Classes Today',
          },
          totalStudents: {
            value: overview.totalStudents,
            total: overview.totalStudents + 50, // Show as progress towards target
            label: 'Total Students',
          },
          assignmentsToGrade: {
            value: overview.pendingAssignments,
            total: overview.pendingAssignments + 10, // Show as progress
            label: 'Assignments to Grade',
          },
          attendanceRate: {
            value: 85, // TODO: Calculate from actual attendance data
            total: 100,
            unit: '%',
            label: 'Class Attendance Rate',
          },
        },
        schedule: schedule.map(item => ({
          time: new Date(`${item.sessionDate}T${item.startTime}`).getHours().toString(),
          period: new Date(`${item.sessionDate}T${item.startTime}`).getHours() >= 12 ? 'PM' : 'AM',
          title: item.courseTitle,
          type: mapSessionType(item.sessionType),
          duration: `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}m`,
          room: item.room || 'TBD',
        })),
        deadlines: [
          // TODO: Fetch actual deadlines from backend
          {
            title: 'Grade Midterm Exams - Data Structures',
            type: 'grading',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Grade 45 midterm exam papers',
            daysLeft: 2,
          },
          {
            title: 'Submit Final Grades - DBMS',
            type: 'administrative',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Submit final grades to academic office',
            daysLeft: 7,
          },
        ],
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
  }, []);

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