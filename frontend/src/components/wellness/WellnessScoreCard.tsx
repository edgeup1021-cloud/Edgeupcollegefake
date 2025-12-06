"use client";

import { Heart, Brain, Heartbeat, Users } from "@phosphor-icons/react";
import type { WellnessScore } from "@/types/wellness.types";
import { getWellnessScoreStatus } from "@/types/wellness.types";

interface WellnessScoreCardProps {
  score: WellnessScore;
}

// Large circular progress ring
function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 10,
}: {
  percentage: number;
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
        className="text-white/20"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="text-white transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export default function WellnessScoreCard({ score }: WellnessScoreCardProps) {
  const status = getWellnessScoreStatus(score.overall);

  const motivationalMessages = {
    "Excellent": "Outstanding! Keep up the healthy habits",
    "Good": "Great progress! You're doing well",
    "Fair": "You're on the right track",
    "Needs Attention": "Let's focus on your wellbeing",
  };

  const components = [
    {
      icon: Brain,
      label: "Mental Health",
      value: score.mentalHealth,
      color: "text-blue-300",
      bgColor: "bg-blue-400/20",
    },
    {
      icon: Heart,
      label: "Stress Level",
      value: score.stressLevel,
      color: "text-amber-300",
      bgColor: "bg-amber-400/20",
      inverted: true, // Lower is better
    },
    {
      icon: Heartbeat,
      label: "Physical Activity",
      value: score.physicalActivity,
      color: "text-emerald-300",
      bgColor: "bg-emerald-400/20",
    },
    {
      icon: Users,
      label: "Social Connection",
      value: score.socialConnection,
      color: "text-purple-300",
      bgColor: "bg-purple-400/20",
    },
  ];

  return (
    <div className="col-span-full lg:col-span-2 bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-primary/20">
      {/* Animated background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/30 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10">
        {/* Header */}
        <p className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
          Overall Wellness
        </p>
        <h2 className="font-display text-2xl font-bold mb-6 tracking-tight">
          Your Wellness Score
        </h2>

        {/* Score Display */}
        <div className="flex items-center gap-8 mb-8">
          {/* Circular Progress */}
          <div className="relative">
            <CircularProgress percentage={score.overall} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold">{score.overall}</span>
              <span className="text-sm text-white/70">/100</span>
            </div>
          </div>

          {/* Status and Message */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/10 mb-3">
              <Heart className="w-5 h-5" weight="fill" />
              <span className="font-semibold">{status}</span>
            </div>
            <p className="text-white/80 text-base">
              {motivationalMessages[status as keyof typeof motivationalMessages]}
            </p>
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-2.5">
          <p className="text-sm text-white/60 font-medium mb-3">Component Breakdown</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {components.map((component) => {
              const Icon = component.icon;
              const displayValue = component.inverted ? 100 - component.value : component.value;

              return (
                <div
                  key={component.label}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg ${component.bgColor}`}>
                    <Icon className={`w-4 h-4 ${component.color}`} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70">{component.label}</p>
                    <p className="font-semibold">
                      {component.value}/100
                      {component.inverted && (
                        <span className="text-xs text-white/60 ml-1">(lower is better)</span>
                      )}
                    </p>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${component.bgColor.replace('/20', '')} transition-all duration-700`}
                      style={{ width: `${displayValue}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
