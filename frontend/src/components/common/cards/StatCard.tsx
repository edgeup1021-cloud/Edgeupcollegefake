"use client";

import { Icon as PhosphorIcon } from "@phosphor-icons/react";

interface StatCardProps {
  icon: PhosphorIcon;
  label: string;
  value: number;
  total: number;
  unit?: string;
  variant?: "default" | "success" | "warning";
}

// Circular Progress Ring Component
function CircularProgress({
  percentage,
  color,
  size = 64,
  strokeWidth = 6
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100 dark:text-gray-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  total,
  unit = "",
  variant = "default",
}: StatCardProps) {
  // Safely calculate percentage, handling edge cases
  const percentage = total > 0 ? Math.min(Math.max((value / total) * 100, 0), 100) : 0;

  const variantStyles = {
    default: {
      bg: "bg-white dark:bg-gray-800",
      gradient: "from-brand-primary/5 to-transparent",
      ring: "#094d88",
      ringDark: "#4a90c9",
      icon: "text-brand-primary",
      iconBg: "bg-brand-primary/10",
    },
    success: {
      bg: "bg-white dark:bg-gray-800",
      gradient: "from-brand-secondary/5 to-transparent",
      ring: "#10ac8b",
      ringDark: "#3fc9ad",
      icon: "text-brand-secondary",
      iconBg: "bg-brand-secondary/10",
    },
    warning: {
      bg: "bg-white dark:bg-gray-800",
      gradient: "from-amber-500/5 to-transparent",
      ring: "#f59e0b",
      ringDark: "#fbbf24",
      icon: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${styles.iconBg} ${styles.icon}`}>
              <Icon className="w-5 h-5" weight="duotone" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </span>
          </div>
        </div>

        {/* Stats with circular progress */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">
                {value}
              </span>
              <span className="text-lg text-gray-400 dark:text-gray-500 font-medium">
                /{total}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          </div>

          {/* Circular Progress */}
          <div className="relative">
            <CircularProgress
              percentage={percentage}
              color={`var(--color-${variant === 'default' ? 'brand-primary' : variant === 'success' ? 'brand-secondary' : 'amber-500'})`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
