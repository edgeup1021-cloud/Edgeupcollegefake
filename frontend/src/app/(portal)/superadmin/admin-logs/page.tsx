"use client";

import { ScrollText } from "lucide-react";

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
          <ScrollText className="w-6 h-6 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Activity Logs
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center py-12">
          <ScrollText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Admin Activity Logs
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            View and monitor all administrative actions and system activities.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            This feature is coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
