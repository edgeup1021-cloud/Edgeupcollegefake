"use client";

import { FileCheck } from "lucide-react";

export default function SmartAssessmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gray-200 dark:bg-gray-700">
                <FileCheck className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Assessment Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Content coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
