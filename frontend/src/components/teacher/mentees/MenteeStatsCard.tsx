"use client";

import { cn } from "@/lib/utils";

interface MenteeStatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export function MenteeStatsCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = "bg-brand-primary/10 text-brand-primary",
}: MenteeStatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {subtext && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}
