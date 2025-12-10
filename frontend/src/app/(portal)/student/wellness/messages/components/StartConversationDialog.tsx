"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Loader2, Search } from "lucide-react";
import { Teacher } from "@/services/student-messaging.service";

interface StartConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: Teacher[];
  onStartConversation: (teacherId: number, title: string) => Promise<void>;
}

export function StartConversationDialog({
  open,
  onOpenChange,
  teachers,
  onStartConversation,
}: StartConversationDialogProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower)
      );
    });
  }, [teachers, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    setIsSubmitting(true);
    try {
      await onStartConversation(selectedTeacher, "");
      setSelectedTeacher(null);
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedTeacher(null);
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={open ? 'open' : 'closed'}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Select a teacher to start a conversation with them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 flex-1 min-h-0 flex flex-col">
            {/* Teachers List */}
            <div className="space-y-2 flex-1 min-h-0 flex flex-col">
              <Label>Select Teacher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex-1 border rounded-md overflow-y-auto min-h-0">
                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No teachers found" : "No teachers available"}
                  </div>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const numericTeacherId = Number(teacher.id);
                    const isSelected = selectedTeacher === numericTeacherId;
                    return (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() => setSelectedTeacher(numericTeacherId)}
                        className={`w-full flex items-center space-x-3 p-3 hover:bg-muted transition-colors ${
                          isSelected ? "bg-muted" : ""
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-input"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">
                            {teacher.firstName} {teacher.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {teacher.email}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
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
            <Button type="submit" disabled={isSubmitting || !selectedTeacher}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Conversation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
