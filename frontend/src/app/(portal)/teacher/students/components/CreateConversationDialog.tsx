"use client";

import { useState, useEffect, useMemo, memo } from "react";
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

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  onCreateConversation: (title: string, studentIds: number[]) => Promise<void>;
}

export const CreateConversationDialog = memo(function CreateConversationDialog({
  open,
  onOpenChange,
  students,
  onCreateConversation,
}: CreateConversationDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    });
  }, [students, searchTerm]);

  const handleToggleStudent = (studentId: number) => {
    const numericId = Number(studentId);
    console.log('Toggle student:', numericId);
    setSelectedStudents((prev) => {
      const newState = prev.includes(numericId)
        ? prev.filter((id) => id !== numericId)
        : [...prev, numericId];
      console.log('Selected students:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) return;

    setIsSubmitting(true);
    try {
      // Ensure all IDs are numbers and filter out any invalid values
      const studentIdsAsNumbers = selectedStudents
        .map(id => Number(id))
        .filter(id => !isNaN(id) && id > 0);

      if (studentIdsAsNumbers.length === 0) {
        console.error("No valid student IDs selected");
        return;
      }

      console.log("Submitting with student IDs:", studentIdsAsNumbers);
      await onCreateConversation("", studentIdsAsNumbers);
      setSelectedStudents([]);
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
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
    <Dialog open={open} onOpenChange={onOpenChange} key={open ? 'open' : 'closed'}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Select students to start a conversation with them.
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
                No students found
              </div>
            ) : (
              filteredStudents.map((student) => {
                // Ensure we're comparing the same type
                const numericStudentId = Number(student.id);
                const isChecked = selectedStudents.includes(numericStudentId);
                console.log(`Student ${student.id} (${numericStudentId}) checked:`, isChecked, 'Selected:', selectedStudents);
                return (
                  <label
                    key={student.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    htmlFor={`student-${student.id}`}
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        console.log('Checkbox changed:', student.id, checked);
                        handleToggleStudent(numericStudentId);
                      }}
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
              Start Conversation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
