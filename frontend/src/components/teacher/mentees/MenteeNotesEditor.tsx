"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MenteeNotesEditorProps {
  initialNotes: string | null;
  onSave: (notes: string) => Promise<void>;
}

export function MenteeNotesEditor({ initialNotes, onSave }: MenteeNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(notes);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes || "");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Mentorship Notes
          </h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 min-h-[100px]">
          {notes ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {notes}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No notes added yet. Click Edit to add notes about this mentee.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Edit Mentorship Notes
        </h3>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this mentee's progress, areas of concern, goals, etc..."
        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none min-h-[120px]"
      />
      <div className="flex gap-3 mt-3">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
