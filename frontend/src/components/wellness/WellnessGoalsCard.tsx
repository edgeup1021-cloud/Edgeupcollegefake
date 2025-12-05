"use client";

import { Target, CheckCircle, Circle, Heart, Heartbeat, Book, Users, Palette, Plus } from "@phosphor-icons/react";
import type { WellnessGoal } from "@/types/wellness.types";
import { formatDistanceToNow } from "date-fns";

interface WellnessGoalsCardProps {
  goals: WellnessGoal[];
  onToggleGoal?: (goalId: string) => void;
  onAddGoal?: () => void;
}

const goalTypeIcons = {
  mood: Heart,
  activity: Heartbeat,
  mindfulness: Book,
  social: Users,
  creative: Palette,
  custom: Target,
};

export default function WellnessGoalsCard({ goals, onToggleGoal, onAddGoal }: WellnessGoalsCardProps) {
  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10">
            <Target className="w-5 h-5 text-brand-primary dark:text-brand-secondary" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Today's Goals
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Small steps, big impact
            </p>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress: {completedCount}/{totalCount} completed
          </span>
          <span className="text-sm font-semibold text-brand-primary dark:text-brand-secondary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3 mb-4">
        {goals.map((goal) => {
          const Icon = goalTypeIcons[goal.type];

          return (
            <button
              key={goal.id}
              onClick={() => onToggleGoal?.(goal.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 group text-left"
            >
              {/* Checkbox Icon */}
              {goal.completed ? (
                <CheckCircle className="w-5 h-5 text-brand-secondary flex-shrink-0" weight="fill" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-primary transition-colors flex-shrink-0" weight="regular" />
              )}

              {/* Goal Icon */}
              <div
                className={`p-1.5 rounded-lg ${
                  goal.completed
                    ? "bg-brand-secondary/10 text-brand-secondary"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                } transition-all duration-300 flex-shrink-0`}
              >
                <Icon className="w-4 h-4" weight="duotone" />
              </div>

              {/* Goal Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium transition-all duration-300 ${
                    goal.completed
                      ? "text-gray-500 dark:text-gray-400 line-through"
                      : "text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary"
                  }`}
                >
                  {goal.title}
                </p>
                {goal.completedAt && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Completed {formatDistanceToNow(new Date(goal.completedAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Goal Button */}
      <button
        onClick={onAddGoal}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-primary dark:hover:border-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all duration-300 font-medium text-sm"
      >
        <Plus className="w-4 h-4" weight="bold" />
        Add Custom Goal
      </button>
    </div>
  );
}
