"use client";

import Link from "next/link";
import { Icon as PhosphorIcon, CaretRight } from "@phosphor-icons/react";

interface QuickAccessCardProps {
  icon: PhosphorIcon;
  title: string;
  href: string;
  description?: string;
}

export default function QuickAccessCard({
  icon: Icon,
  title,
  href,
  description,
}: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white dark:bg-gray-800/80 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:shadow-brand-primary/5 hover:border-brand-primary/20 dark:hover:border-brand-primary/30 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
    >
      {/* Glassmorphism hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 group-hover:from-brand-secondary group-hover:to-brand-primary transition-all duration-300">
            <Icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors duration-300" weight="duotone" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-primary/10 dark:group-hover:bg-brand-primary/20 transition-all duration-300">
          <CaretRight
            className="w-4 h-4 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-300"
            weight="bold"
          />
        </div>
      </div>
    </Link>
  );
}
