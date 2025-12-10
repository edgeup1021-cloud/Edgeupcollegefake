"use client";

import { Eye, Edit, Trash2 } from "lucide-react";

interface Subtopic {
  id: number;
  name: string;
  orderIndex: number;
  content: string | null;
}

interface SubtopicItemProps {
  subtopic: Subtopic;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function SubtopicItem({
  subtopic,
  onView,
  onEdit,
  onDelete,
}: SubtopicItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
          {subtopic.orderIndex}
        </span>
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
            {subtopic.name}
          </h5>
          {subtopic.content && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
              {subtopic.content}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(subtopic.id);
          }}
          className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(subtopic.id);
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(subtopic.id);
          }}
          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
