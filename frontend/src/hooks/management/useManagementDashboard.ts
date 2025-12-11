/**
 * useManagementDashboard - Hook for Management Dashboard Data
 *
 * Fetches and manages management dashboard data including profile, stats, and institution.
 * Similar pattern to useStudentDashboard and useTeacherDashboard.
 */

import { useState, useEffect, useCallback } from 'react';
import { getManagementDashboard, ManagementApiError } from '@/services/management.service';
import type { ManagementDashboard } from '@/types/management.types';

interface UseManagementDashboardReturn {
  dashboard: ManagementDashboard | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching management dashboard data
 */
export function useManagementDashboard(): UseManagementDashboardReturn {
  const [dashboard, setDashboard] = useState<ManagementDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getManagementDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Failed to fetch management dashboard:', err);
      if (err instanceof ManagementApiError) {
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

  return {
    dashboard,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
