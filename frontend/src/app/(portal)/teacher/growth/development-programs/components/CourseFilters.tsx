"use client";

import type {
  CourseSearchFilters,
  EducationalChannel,
} from "@/types/development-programs.types";

interface CourseFiltersProps {
  filters: CourseSearchFilters;
  channels: EducationalChannel[];
  onFiltersChange: (filters: CourseSearchFilters) => void;
  onSearch: () => void;
}

export default function CourseFilters({
  filters,
  channels,
  onFiltersChange,
}: CourseFiltersProps) {
  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      onFiltersChange({
        ...filters,
        category: undefined,
        channelId: undefined,
      });
    } else {
      const channel = channels.find((ch) => ch.name === category);
      onFiltersChange({
        ...filters,
        category,
        channelId: channel?.channelId,
      });
    }
  };

  const hasActiveFilters = !!filters.category;

  const clearAllFilters = () => {
    onFiltersChange({
      maxResults: filters.maxResults || 20,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Channel/Category Pills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Educational Channel
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !filters.category
                ? "bg-brand-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            All Channels
          </button>
          {channels.map((channel) => (
            <button
              key={channel.channelId}
              onClick={() => handleCategoryChange(channel.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === channel.name
                  ? "bg-brand-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {channel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Max Results */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Results per search:
        </label>
        <select
          value={filters.maxResults || 20}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              maxResults: parseInt(e.target.value),
            })
          }
          className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={clearAllFilters}
            className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
