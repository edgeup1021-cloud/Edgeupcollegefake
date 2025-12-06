"use client";

import { Lightning } from "@phosphor-icons/react";
import type { StressLevel } from "@/types/wellness.types";
import { getStressStatus } from "@/types/wellness.types";

interface StressLevelCardProps {
  level: StressLevel;
  status: "low" | "moderate" | "high" | "very-high";
}

const stressConfig = {
  "low": {
    label: "Low",
    description: "You're calm",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    barColor: "bg-emerald-500",
    icon: "text-emerald-500",
  },
  "moderate": {
    label: "Moderate",
    description: "Manageable stress",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    barColor: "bg-amber-500",
    icon: "text-amber-500",
  },
  "high": {
    label: "High",
    description: "Elevated stress",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    barColor: "bg-orange-500",
    icon: "text-orange-500",
  },
  "very-high": {
    label: "Very High",
    description: "Consider a break",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    barColor: "bg-red-500",
    icon: "text-red-500",
  },
};

export default function StressLevelCard({ level, status }: StressLevelCardProps) {
  const config = stressConfig[status];
  const percentage = (level / 10) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 relative overflow-hidden group">
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${config.bg}`}>
              <Lightning className={`w-5 h-5 ${config.icon}`} weight="duotone" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Stress Level
            </span>
          </div>
        </div>

        {/* Stress Display */}
        <div className="mb-4">
          <div className={`font-display text-3xl font-bold ${config.color} mb-1`}>
            {config.label}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Level: {level}/10 • {config.description}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.barColor} transition-all duration-700 ease-out rounded-full`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Tip */}
        {status !== "low" && (
          <div className={`text-xs ${config.color} ${config.bg} rounded-lg px-3 py-2 border border-current/20`}>
            {status === "very-high"
              ? "Take a break - Try a breathing exercise"
              : status === "high"
              ? "Consider taking a short break"
              : "You're managing well"}
          </div>
        )}
      </div>
    </div>
  );
}
