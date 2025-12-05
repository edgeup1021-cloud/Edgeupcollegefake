import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { searchStudents } from '@/services/class-operations.service';
import type { Student } from '@/types/class-operations.types';

interface StudentSearchSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export function StudentSearchSelector({ selectedIds, onChange, error }: StudentSearchSelectorProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all students initially
  useEffect(() => {
    loadStudents("");
  }, []);

  const loadStudents = async (term: string) => {
    setLoading(true);
    try {
      const results = await searchStudents(term);
      setStudents(results);
    } catch (error) {
      console.error('Failed to search students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleStudent = (studentId: number) => {
    if (selectedIds.includes(studentId)) {
      onChange(selectedIds.filter(id => id !== studentId));
    } else {
      onChange([...selectedIds, studentId]);
    }
  };

  const selectAll = () => {
    onChange(students.map(s => s.id));
  };

  const deselectAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Select Students</label>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{selectedIds.length} selected</span>
          {students.length > 0 && (
            <>
              <button
                type="button"
                onClick={selectAll}
                className="text-primary hover:underline"
              >
                Select All
              </button>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-destructive hover:underline"
                >
                  Clear
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or admission number..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Student List */}
      <div className="border rounded-lg max-h-64 overflow-y-auto dark:border-gray-700">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No students found
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {students.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {student.admissionNo}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg dark:bg-gray-800">
          <Users className="w-4 h-4" />
          <span>{selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''} will be enrolled in this class</span>
        </div>
      )}
    </div>
  );
}
