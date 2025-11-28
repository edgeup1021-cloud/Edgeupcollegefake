"use client";

import { Bell, FileText, FolderOpen, PencilSimple, Briefcase, Icon as PhosphorIcon, CaretRight, Warning } from "@phosphor-icons/react";

type DeadlineType = "Assignment" | "Project" | "Exam" | "Career";

interface DeadlineItem {
  title: string;
  type: DeadlineType;
  date: string;
  description: string;
  daysLeft: number;
}

interface DeadlinesCardProps {
  items: DeadlineItem[];
}

const typeConfig: Record<DeadlineType, { icon: PhosphorIcon; color: string; bg: string; border: string }> = {
  Assignment: {
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  Project: {
    icon: FolderOpen,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-200 dark:border-purple-800/50",
  },
  Exam: {
    icon: PencilSimple,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800/50",
  },
  Career: {
    icon: Briefcase,
    color: "text-brand-secondary dark:text-brand-secondary",
    bg: "bg-brand-light dark:bg-brand-secondary/20",
    border: "border-brand-secondary/20 dark:border-brand-secondary/30",
  },
};

// Circular progress for days remaining
function DaysRing({ daysLeft, maxDays = 30 }: { daysLeft: number; maxDays?: number }) {
  const size = 52;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((daysLeft / maxDays) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (days: number) => {
    if (days <= 3) return "#ef4444";
    if (days <= 7) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(daysLeft)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{daysLeft}</span>
        <span className="text-[9px] text-gray-500 dark:text-gray-400">days</span>
      </div>
    </div>
  );
}

export default function DeadlinesCard({ items }: DeadlinesCardProps) {
  // Sort items by urgency (days left)
  const sortedItems = [...items].sort((a, b) => a.daysLeft - b.daysLeft);
  const urgentCount = items.filter(item => item.daysLeft <= 3).length;

  return (
    <div className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Upcoming Deadlines
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stay on track with your assignments
            </p>
          </div>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <Warning className="w-4 h-4" weight="fill" />
            <span className="text-xs font-semibold">{urgentCount} urgent</span>
          </div>
        )}
      </div>

      {/* Deadline items */}
      <div className="relative space-y-3">
        {sortedItems.map((item, index) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          const isUrgent = item.daysLeft <= 3;

          return (
            <div
              key={index}
              className={`relative flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 cursor-pointer group ${isUrgent ? "ring-1 ring-red-200 dark:ring-red-900/50" : ""}`}
            >
              {/* Urgency pulse indicator */}
              {isUrgent && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`p-2.5 rounded-xl ${config.bg} ${config.border} border`}>
                <Icon className={`w-5 h-5 ${config.color}`} weight="duotone" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {item.date} • {item.description}
                </p>
              </div>

              {/* Days left ring */}
              <DaysRing daysLeft={item.daysLeft} />

              {/* Arrow */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                <CaretRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" weight="bold" />
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
