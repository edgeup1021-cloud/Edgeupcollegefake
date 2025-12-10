"use client";

import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function PlaceholderPage({
  icon: Icon,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-light dark:bg-brand-primary/20 mb-6">
          <Icon className="w-10 h-10 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        <div className="inline-flex px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
