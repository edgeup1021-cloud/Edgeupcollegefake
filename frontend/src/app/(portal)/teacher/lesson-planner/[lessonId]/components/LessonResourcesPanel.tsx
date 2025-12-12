"use client";

import { useState, useEffect } from "react";
import {
  Youtube,
  FileText,
  Globe,
  Play,
  ExternalLink,
  RefreshCw,
  Star,
  EyeOff,
  Loader2,
  Sparkles,
  BookOpen,
  Lightbulb,
  Presentation,
} from "lucide-react";
import type { LessonResource, LessonResourceType } from "@/types/lesson-planner.types";
import {
  getLessonResources,
  generateLessonResources,
  refreshLessonResources,
  updateLessonResource,
} from "@/services/lesson-planner.service";

const resourceTypeConfig: Record<
  LessonResourceType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  YOUTUBE_VIDEO: {
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    label: "Video",
  },
  ARTICLE: {
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    label: "Article",
  },
  PDF: {
    icon: BookOpen,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    label: "PDF",
  },
  PRESENTATION: {
    icon: Presentation,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    label: "Slides",
  },
  INTERACTIVE_TOOL: {
    icon: Play,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    label: "Interactive",
  },
  WEBSITE: {
    icon: Globe,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    label: "Website",
  },
};

interface Props {
  lessonId: number;
}

export function LessonResourcesPanel({ lessonId }: Props) {
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<LessonResourceType | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, [lessonId]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getLessonResources(lessonId);
      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const data = await generateLessonResources(lessonId);
      setResources(data);
    } catch (err: any) {
      console.error("Failed to generate resources:", err);
      const message = err?.response?.data?.message || err?.message || "Failed to generate resources";
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setGenerating(true);
      const data = await refreshLessonResources(lessonId);
      setResources(data);
    } catch (error) {
      console.error("Failed to refresh resources:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleRate = async (resourceId: number, rating: number) => {
    try {
      await updateLessonResource(resourceId, { teacherRating: rating });
      setResources((prev) =>
        prev.map((r) => (r.id === resourceId ? { ...r, teacherRating: rating } : r))
      );
    } catch (error) {
      console.error("Failed to rate resource:", error);
    }
  };

  const handleHide = async (resourceId: number) => {
    try {
      await updateLessonResource(resourceId, { isHidden: true });
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (error) {
      console.error("Failed to hide resource:", error);
    }
  };

  const filteredResources =
    activeFilter === "ALL"
      ? resources
      : resources.filter((r) => r.resourceType === activeFilter);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          <span className="ml-2 text-gray-500">Loading resources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            AI-Suggested Teaching Resources
          </h2>
          <div className="flex items-center gap-2">
            {resources.length > 0 ? (
              <button
                onClick={handleRefresh}
                disabled={generating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Find Resources
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {resources.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <FilterButton
              active={activeFilter === "ALL"}
              onClick={() => setActiveFilter("ALL")}
            >
              All ({resources.length})
            </FilterButton>
            {(Object.keys(resourceTypeConfig) as LessonResourceType[]).map((type) => {
              const count = resources.filter((r) => r.resourceType === type).length;
              if (count === 0) return null;
              const config = resourceTypeConfig[type];
              const Icon = config.icon;
              return (
                <FilterButton
                  key={type}
                  active={activeFilter === type}
                  onClick={() => setActiveFilter(type)}
                >
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  {config.label} ({count})
                </FilterButton>
              );
            })}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Resource List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredResources.length === 0 && !error ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium mb-1">No resources yet</p>
            <p className="text-sm">
              Click &quot;Find Resources&quot; to search for relevant YouTube videos,
              articles, and interactive tools for this lesson.
            </p>
          </div>
        ) : filteredResources.length === 0 && error ? null : (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onRate={handleRate}
              onHide={handleHide}
            />
          ))
        )}
      </div>

      {/* Generating overlay */}
      {generating && resources.length > 0 && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span>Searching for resources...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
        active
          ? "bg-brand-primary text-white"
          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

function ResourceCard({
  resource,
  onRate,
  onHide,
}: {
  resource: LessonResource;
  onRate: (id: number, rating: number) => void;
  onHide: (id: number) => void;
}) {
  const config = resourceTypeConfig[resource.resourceType];
  const Icon = config.icon;

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex gap-4">
        {/* Thumbnail */}
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt=""
            className="w-36 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
          />
        ) : (
          <div
            className={`w-36 h-24 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
          >
            <Icon className={`w-10 h-10 ${config.color}`} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
                {resource.duration && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.duration}
                  </span>
                )}
                {resource.relevanceScore && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {Math.round(resource.relevanceScore * 100)}% match
                  </span>
                )}
                {resource.isFree && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Free
                  </span>
                )}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mt-1.5 line-clamp-1">
                {resource.title}
              </h3>
              {resource.sourceName && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {resource.sourceName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onHide(resource.id)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Hide this resource"
              >
                <EyeOff className="w-4 h-4" />
              </button>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-brand-primary hover:text-brand-primary/80 transition-colors"
                title="Open resource"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {resource.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {resource.description}
            </p>
          )}

          {resource.aiReasoning && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-start gap-1.5 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
              <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{resource.aiReasoning}</span>
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Rate this:
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(resource.id, star)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-4 h-4 ${
                      resource.teacherRating && star <= resource.teacherRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonResourcesPanel;
