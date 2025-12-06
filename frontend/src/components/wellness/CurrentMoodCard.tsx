"use client";

import { Heart, ArrowsClockwise } from "@phosphor-icons/react";
import type { MoodLevel } from "@/types/wellness.types";
import { getMoodLabel } from "@/types/wellness.types";
import { formatDistanceToNow } from "date-fns";

interface CurrentMoodCardProps {
  level: MoodLevel;
  lastCheckedAt: string;
  onUpdate?: () => void;
}

const moodConfig = {
  1: { label: "Very Low", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-500" },
  2: { label: "Low", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-500" },
  3: { label: "Neutral", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", icon: "text-yellow-500" },
  4: { label: "Good", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-500" },
  5: { label: "Great", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-500" },
};

export default function CurrentMoodCard({ level, lastCheckedAt, onUpdate }: CurrentMoodCardProps) {
  const config = moodConfig[level];
  const timeAgo = formatDistanceToNow(new Date(lastCheckedAt), { addSuffix: true });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 relative overflow-hidden group">
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${config.bg}`}>
              <Heart className={`w-5 h-5 ${config.icon}`} weight="duotone" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Mood
            </span>
          </div>
        </div>

        {/* Mood Display */}
        <div className="mb-4">
          <div className={`font-display text-3xl font-bold ${config.color} mb-1`}>
            {config.label}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last checked: {timeAgo}
          </p>
        </div>

        {/* Quick Update Button */}
        <button
          onClick={onUpdate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 hover:from-brand-secondary hover:to-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 hover:border-transparent transition-all duration-300 font-medium text-sm"
        >
          <ArrowsClockwise className="w-4 h-4" weight="bold" />
          Quick Update
        </button>
      </div>
    </div>
  );
}
