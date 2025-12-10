"use client";

import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

interface SimpleSubjectCardProps {
  subject: Subject;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function SimpleSubjectCard({
  subject,
  onEdit,
  onDelete,
}: SimpleSubjectCardProps) {
  const router = useRouter();

  const handleViewTopics = () => {
    router.push(`/superadmin/curriculum/subjects/${subject.id}/topics`);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Subject Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {subject.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {subject.code}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                subject.isActive
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
              }`}
            >
              {subject.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {subject.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {subject.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleViewTopics}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-light dark:bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/30 transition-colors text-xs font-medium whitespace-nowrap"
          >
            View Topics
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject.id);
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subject.id);
            }}
            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
