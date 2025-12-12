"use client";

import { ExternalLink, Clock, Eye, Youtube } from "lucide-react";
import type { DevelopmentCourse } from "@/types/development-programs.types";

interface CourseCardProps {
  course: DevelopmentCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const handleStartStudying = () => {
    window.open(course.courseUrl, "_blank", "noopener,noreferrer");
  };

  // Format duration
  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours.toFixed(1)} hrs`;
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Intermediate':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Advanced':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-primary dark:hover:border-brand-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Source Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded flex items-center gap-1">
            <Youtube className="w-3 h-3" />
            {course.source}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {course.instructorName}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 flex-grow">
          {course.description}
        </p>

        {/* Category */}
        {course.category && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
              {course.category}
            </span>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDuration(course.durationHours)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatViews(course.viewCount)} views</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartStudying}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg transition-all text-sm font-medium"
        >
          Start Learning
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
