"use client";

import { ClockCounterClockwise, CaretRight } from "@phosphor-icons/react";
import type { MoodEntry } from "@/types/wellness.types";
import { getMoodLabel } from "@/types/wellness.types";
import { format, formatDistanceToNow } from "date-fns";

interface RecentCheckinsCardProps {
  checkIns: MoodEntry[];
  onViewAll?: () => void;
}

const moodColors = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-emerald-500",
  5: "bg-green-500",
};

const energyLabels = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

export default function RecentCheckinsCard({ checkIns, onViewAll }: RecentCheckinsCardProps) {
  // Show only the 3 most recent
  const displayCheckIns = checkIns.slice(0, 3);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <div className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10">
            <ClockCounterClockwise className="w-5 h-5 text-purple-600 dark:text-purple-400" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Your Wellness Journal
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Past 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Check-ins Timeline */}
      <div className="space-y-4">
        {displayCheckIns.length > 0 ? (
          displayCheckIns.map((checkIn, index) => (
            <div
              key={checkIn.id}
              className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
            >
              {/* Timeline dot */}
              <div className={`absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full ${moodColors[checkIn.mood]} ring-4 ring-white dark:ring-gray-800`} />

              {/* Content */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                {/* Timestamp */}
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {formatTimestamp(checkIn.timestamp)}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Feeling: {getMoodLabel(checkIn.mood)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Energy: {energyLabels[checkIn.energy]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Stress: {checkIn.stress}/10
                  </span>
                </div>

                {/* Note */}
                {checkIn.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    &quot;{checkIn.note}&quot;
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <ClockCounterClockwise className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" weight="duotone" />
            <p className="text-gray-500 dark:text-gray-400 mb-1">No check-ins yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Start logging your mood to track patterns</p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {checkIns.length > 3 && (
        <button
          onClick={onViewAll}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 border border-gray-200 dark:border-gray-700 hover:border-brand-primary/20 dark:hover:border-brand-primary/30 text-brand-primary dark:text-brand-secondary font-medium text-sm transition-all duration-300 group"
        >
          View Full History
          <CaretRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" weight="bold" />
        </button>
      )}
    </div>
  );
}
