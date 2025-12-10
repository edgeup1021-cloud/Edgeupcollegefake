"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
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
  onSearch,
}: CourseFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.query || "");

  useEffect(() => {
    setSearchValue(filters.query || "");
  }, [filters.query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, query: searchValue });
  };

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

  const clearSearch = () => {
    setSearchValue("");
    onFiltersChange({ ...filters, query: "" });
  };

  const hasActiveFilters = !!(filters.query || filters.category);

  const clearAllFilters = () => {
    setSearchValue("");
    onFiltersChange({
      maxResults: filters.maxResults || 20,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search courses by topic (e.g., teaching methods, mathematics, programming...)"
            className="w-full pl-10 pr-24 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </form>

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
