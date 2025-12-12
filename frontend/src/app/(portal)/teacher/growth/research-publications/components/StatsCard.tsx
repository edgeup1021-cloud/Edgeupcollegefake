import React from "react";
import { Icon } from "@phosphor-icons/react";

interface StatsCardProps {
  icon: Icon;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export function StatsCard({
  icon: IconComponent,
  label,
  value,
  subtext,
  color = "bg-brand-primary/10 text-brand-primary",
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6" weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
