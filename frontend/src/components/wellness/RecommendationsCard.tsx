"use client";

import { Lightbulb, ChartLine, Heartbeat, CalendarX, CaretRight } from "@phosphor-icons/react";
import type { WellnessRecommendation } from "@/types/wellness.types";

interface RecommendationsCardProps {
  recommendations: WellnessRecommendation[];
  onAction?: (recommendation: WellnessRecommendation) => void;
}

const iconMap = {
  ChartLine,
  Activity: Heartbeat,
  CalendarWarning: CalendarX,
  Lightbulb,
};

const typeConfig = {
  pattern: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  suggestion: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  insight: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  upcoming: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

export default function RecommendationsCard({ recommendations, onAction }: RecommendationsCardProps) {
  return (
    <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" weight="duotone" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
            Personalized for You
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on your patterns
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = iconMap[rec.icon as keyof typeof iconMap] || Lightbulb;
          const config = typeConfig[rec.type];

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl ${config.bg} border ${config.border} hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                  <IconComponent className={`w-5 h-5 ${config.iconColor}`} weight="duotone" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {rec.description}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => onAction?.(rec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-all duration-300 group"
                  >
                    {rec.actionLabel}
                    <CaretRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
