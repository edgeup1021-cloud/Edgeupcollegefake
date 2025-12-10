"use client";

import { BookOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No Subjects Found
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        Start by creating your first subject with topics and subtopics
      </p>
    </div>
  );
}
