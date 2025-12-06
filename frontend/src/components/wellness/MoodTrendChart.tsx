"use client";

import { TrendUp, TrendDown } from "@phosphor-icons/react";
import type { MoodTrendData } from "@/types/wellness.types";

interface MoodTrendChartProps {
  data: MoodTrendData[];
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
  // Calculate trend percentage
  const firstMood = data[0]?.mood || 0;
  const lastMood = data[data.length - 1]?.mood || 0;
  const trendPercentage = firstMood > 0 ? Math.round(((lastMood - firstMood) / firstMood) * 100) : 0;
  const isPositiveTrend = trendPercentage >= 0;

  // Chart dimensions
  const chartWidth = 100; // percentage
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xStep = plotWidth / (data.length - 1 || 1);
  const yMax = 5;
  const yScale = (value: number) => {
    return chartHeight - padding.bottom - (value / yMax) * plotHeight;
  };

  // Generate path for line chart
  const generatePath = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = padding.left + index * xStep;
        const y = yScale(value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const moodPath = generatePath(data.map((d) => d.mood));
  const energyPath = generatePath(data.map((d) => d.energy));

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10">
            {isPositiveTrend ? (
              <TrendUp className="w-5 h-5 text-brand-primary dark:text-brand-secondary" weight="duotone" />
            ) : (
              <TrendDown className="w-5 h-5 text-amber-600 dark:text-amber-400" weight="duotone" />
            )}
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Weekly Trends
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your emotional patterns
            </p>
          </div>
        </div>

        {/* Trend Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            isPositiveTrend
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isPositiveTrend ? (
            <TrendUp className="w-4 h-4" weight="bold" />
          ) : (
            <TrendDown className="w-4 h-4" weight="bold" />
          )}
          <span className="text-sm font-semibold">
            {isPositiveTrend ? "+" : ""}
            {trendPercentage}%
          </span>
        </div>
      </div>

      {/* Chart Area - Simplified for better rendering */}
      <div className="relative h-64 mb-4">
        {/* Simple grid background */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-t border-gray-100 dark:border-gray-700/50" />
          ))}
        </div>

        {/* Chart visualization using bars instead of complex SVG */}
        <div className="relative h-full flex items-end justify-between gap-2 px-4">
          {data.map((item, index) => {
            const moodHeight = (item.mood / 5) * 100;
            const energyHeight = (item.energy / 5) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                {/* Mood Bar */}
                <div className="w-full flex justify-center gap-1">
                  <div className="w-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary transition-all duration-700 rounded-full"
                      style={{ height: `${moodHeight}%` }}
                    />
                  </div>
                  <div className="w-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 transition-all duration-700 rounded-full"
                      style={{ height: `${energyHeight}%` }}
                    />
                  </div>
                </div>
                {/* Day Label */}
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {item.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Energy Level</span>
        </div>
      </div>

      {/* Key Insight */}
      {Math.abs(trendPercentage) > 5 && (
        <div className="mt-4 p-4 rounded-xl bg-brand-light/50 dark:bg-brand-primary/10 border border-brand-primary/10 dark:border-brand-primary/20">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Key Insight:</span> Your mood {isPositiveTrend ? "improved" : "decreased"} by{" "}
            {Math.abs(trendPercentage)}% this week!
          </p>
        </div>
      )}
    </div>
  );
}
