"use client";

import { useState, useEffect } from "react";
import { X, MagnifyingGlass, UserPlus, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { AvailableStudent } from "@/types/mentorship.types";

interface AddMenteeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: AvailableStudent[];
  onAssign: (studentIds: number[], notes?: string) => Promise<void>;
  currentCount: number;
  maxCount?: number;
}

export function AddMenteeDialog({
  isOpen,
  onClose,
  availableStudents,
  onAssign,
  currentCount,
  maxCount = 20,
}: AddMenteeDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedStudents([]);
      setNotes("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) return;

    setIsSubmitting(true);
    try {
      await onAssign(selectedStudents, notes || undefined);
      onClose();
    } catch (error) {
      console.error("Failed to assign mentees:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingSlots = maxCount - currentCount;
  const canAssign = selectedStudents.length <= remainingSlots;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-brand-primary" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Mentees
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentCount}/{maxCount} mentees • {remainingSlots} slots available
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search students by name, admission no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {/* Bulk Actions */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleAll}
              className="text-sm text-brand-primary hover:underline"
            >
              {selectedStudents.length === filteredStudents.length
                ? "Clear All"
                : "Select All"}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedStudents.length} selected
            </span>
          </div>

          {/* Student Items */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No students found
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {student.admissionNo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {student.email}
                      </p>
                      {student.program && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {student.program} {student.batch}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedStudents.includes(student.id) && (
                    <Check className="w-5 h-5 text-brand-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about these mentees..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none h-20"
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            {!canAssign && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Cannot assign {selectedStudents.length} mentees. Only {remainingSlots} slots available.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedStudents.length === 0 || !canAssign || isSubmitting}
            >
              {isSubmitting ? "Assigning..." : `Assign ${selectedStudents.length} Mentee${selectedStudents.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
