"use client";

import { BookOpen } from "lucide-react";
import CourseWizard from "./components/CourseWizard";

export default function CoursePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
          <BookOpen className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Curriculum Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage university curriculum structures
          </p>
        </div>
      </div>

      <CourseWizard />
    </div>
  );
}
