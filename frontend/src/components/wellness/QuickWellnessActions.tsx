"use client";

import { Wind, NotePencil, MusicNotes, ChatCircleDots, CaretRight } from "@phosphor-icons/react";

interface QuickActionProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onClick?: () => void;
}

function QuickActionCard({ icon: Icon, title, description, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="group block bg-white dark:bg-gray-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:shadow-brand-primary/5 hover:border-brand-primary/20 dark:hover:border-brand-primary/30 hover:scale-[1.02] transition-all duration-300 text-left w-full"
    >
      <div className="relative">
        {/* Glassmorphism hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <div className="relative p-2.5 rounded-lg bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 group-hover:from-brand-secondary group-hover:to-brand-primary transition-all duration-300">
              <Icon className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors duration-300" weight="duotone" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors mb-1">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-primary/10 dark:group-hover:bg-brand-primary/20 transition-all duration-300 flex-shrink-0 mt-1">
            <CaretRight
              className="w-3 h-3 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-300"
              weight="bold"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

interface QuickWellnessActionsProps {
  onBreathingExercise?: () => void;
  onGratitudeJournal?: () => void;
  onCalmingMusic?: () => void;
  onReachOut?: () => void;
}

export default function QuickWellnessActions({
  onBreathingExercise,
  onGratitudeJournal,
  onCalmingMusic,
  onReachOut,
}: QuickWellnessActionsProps) {
  const actions = [
    {
      icon: Wind,
      title: "1-Min Breathing",
      description: "Quick relaxation exercise",
      onClick: onBreathingExercise,
    },
    {
      icon: NotePencil,
      title: "Gratitude Entry",
      description: "Log something positive",
      onClick: onGratitudeJournal,
    },
    {
      icon: MusicNotes,
      title: "Calming Playlist",
      description: "Soothing background music",
      onClick: onCalmingMusic,
    },
    {
      icon: ChatCircleDots,
      title: "Reach Out",
      description: "Talk to someone",
      onClick: onReachOut,
    },
  ];

  return (
    <div className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-1">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Take care of yourself in seconds
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}
