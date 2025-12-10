"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search } from "lucide-react";
import { Student } from "@/services/messaging.service";

interface AddParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  existingParticipantIds: number[];
  onAddParticipants: (studentIds: number[]) => Promise<void>;
}

export function AddParticipantsDialog({
  open,
  onOpenChange,
  students,
  existingParticipantIds,
  onAddParticipants,
}: AddParticipantsDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStudents = students.filter(
    (student) => !existingParticipantIds.includes(student.id)
  );

  const filteredStudents = availableStudents.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) return;

    setIsSubmitting(true);
    try {
      await onAddParticipants(selectedStudents);
      setSelectedStudents([]);
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add participants:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedStudents([]);
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Students to Conversation</DialogTitle>
          <DialogDescription>
            Select additional students to add to this conversation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 pb-4">
            <div>
              <Label>Select Students ({selectedStudents.length} selected)</Label>
              <div className="mt-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto border rounded-md p-4 space-y-2 min-h-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {availableStudents.length === 0
                  ? "All students are already in this conversation"
                  : "No students found"}
              </div>
            ) : (
              filteredStudents.map((student) => {
                const numericStudentId = Number(student.id);
                const isChecked = selectedStudents.includes(numericStudentId);
                return (
                  <label
                    key={student.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    htmlFor={`add-student-${student.id}`}
                  >
                    <Checkbox
                      id={`add-student-${student.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleToggleStudent(numericStudentId)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedStudents.length === 0 || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Students
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
