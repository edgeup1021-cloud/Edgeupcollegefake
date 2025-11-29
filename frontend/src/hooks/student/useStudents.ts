'use client';

/**
 * useStudents.ts - React Hook for Student Data Management
 *
 * This hook provides a complete interface for fetching and managing student data.
 * It handles loading states, errors, and provides refresh capabilities.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentOverview,
  getStudentDashboard,
  StudentApiError,
} from '@/src/services/student.service';
import type {
  Student,
  StudentOverview,
  StudentDashboard,
  CreateStudentInput,
  UpdateStudentInput,
} from '@/src/types/student.types';

interface UseStudentsState {
  students: Student[];
  overview: StudentOverview | null;
  loading: boolean;
  error: string | null;
}

interface UseStudentsReturn extends UseStudentsState {
  // Refresh functions
  refreshStudents: () => Promise<void>;
  refreshOverview: () => Promise<void>;
  refresh: () => Promise<void>;

  // CRUD operations
  fetchStudent: (id: number) => Promise<Student | null>;
  addStudent: (input: CreateStudentInput) => Promise<Student | null>;
  editStudent: (id: number, input: UpdateStudentInput) => Promise<Student | null>;
  removeStudent: (id: number) => Promise<boolean>;

  // Utility
  clearError: () => void;
}

/**
 * Custom hook for managing student data
 * Automatically fetches students and overview on mount
 */
export function useStudents(): UseStudentsReturn {
  const [state, setState] = useState<UseStudentsState>({
    students: [],
    overview: null,
    loading: true,
    error: null,
  });

  // Helper to handle errors consistently
  const handleError = useCallback((err: unknown): string => {
    if (err instanceof StudentApiError) {
      return err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred';
  }, []);

  // Fetch all students
  const refreshStudents = useCallback(async () => {
    try {
      const students = await getStudents();
      setState((prev) => ({ ...prev, students, error: null }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: handleError(err) }));
    }
  }, [handleError]);

  // Fetch overview statistics
  const refreshOverview = useCallback(async () => {
    try {
      const overview = await getStudentOverview();
      setState((prev) => ({ ...prev, overview, error: null }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: handleError(err) }));
    }
  }, [handleError]);

  // Refresh both students and overview
  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await Promise.all([refreshStudents(), refreshOverview()]);
    setState((prev) => ({ ...prev, loading: false }));
  }, [refreshStudents, refreshOverview]);

  // Fetch a single student by ID
  const fetchStudent = useCallback(
    async (id: number): Promise<Student | null> => {
      try {
        return await getStudent(id);
      } catch (err) {
        setState((prev) => ({ ...prev, error: handleError(err) }));
        return null;
      }
    },
    [handleError],
  );

  // Create a new student
  const addStudent = useCallback(
    async (input: CreateStudentInput): Promise<Student | null> => {
      try {
        const newStudent = await createStudent(input);
        // Refresh the list to include the new student
        await refresh();
        return newStudent;
      } catch (err) {
        setState((prev) => ({ ...prev, error: handleError(err) }));
        return null;
      }
    },
    [refresh, handleError],
  );

  // Update an existing student
  const editStudent = useCallback(
    async (id: number, input: UpdateStudentInput): Promise<Student | null> => {
      try {
        const updatedStudent = await updateStudent(id, input);
        // Refresh the list to reflect changes
        await refresh();
        return updatedStudent;
      } catch (err) {
        setState((prev) => ({ ...prev, error: handleError(err) }));
        return null;
      }
    },
    [refresh, handleError],
  );

  // Delete a student
  const removeStudent = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteStudent(id);
        // Refresh the list to remove the deleted student
        await refresh();
        return true;
      } catch (err) {
        setState((prev) => ({ ...prev, error: handleError(err) }));
        return false;
      }
    },
    [refresh, handleError],
  );

  // Clear error state
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initial data fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    ...state,
    refreshStudents,
    refreshOverview,
    refresh,
    fetchStudent,
    addStudent,
    editStudent,
    removeStudent,
    clearError,
  };
}

/**
 * Hook for fetching only the overview (lighter weight)
 */
export function useStudentOverview() {
  const [overview, setOverview] = useState<StudentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudentOverview();
      setOverview(data);
      setError(null);
    } catch (err) {
      if (err instanceof StudentApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { overview, loading, error, refresh };
}

/**
 * Hook for fetching student dashboard data
 * @param studentId - Student's unique identifier
 */
export function useStudentDashboard(studentId: number | null) {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (studentId === null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getStudentDashboard(studentId);
      setDashboard(data);
      setError(null);
    } catch (err) {
      if (err instanceof StudentApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dashboard, loading, error, refresh };
}
