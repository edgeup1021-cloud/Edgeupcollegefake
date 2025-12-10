"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import type { SearchFilters as FiltersType, IdeaType, IdeaCategory, SortBy } from "@/types/idea-sandbox.types";
import { IDEA_CATEGORIES } from "@/lib/validations/idea-sandbox";

interface SearchFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleTypeChange = (type: IdeaType | "all") => {
    onFiltersChange({
      ...filters,
      type: type === "all" ? undefined : type,
    });
  };

  const handleCategoryChange = (category: IdeaCategory | "all") => {
    onFiltersChange({
      ...filters,
      category: category === "all" ? undefined : category,
    });
  };

  const handleSortChange = (sortBy: SortBy) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({ sortBy: "recent" });
  };

  const hasActiveFilters =
    filters.search || filters.type || filters.category || filters.sortBy !== "recent";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search ideas and questions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFiltersChange({ ...filters, search: undefined });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Type
            </label>
            <select
              value={filters.type || "all"}
              onChange={(e) => handleTypeChange(e.target.value as IdeaType | "all")}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">All Types</option>
              <option value="idea">Ideas</option>
              <option value="question">Questions</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={filters.category || "all"}
              onChange={(e) =>
                handleCategoryChange(e.target.value as IdeaCategory | "all")
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">All Categories</option>
              {IDEA_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy || "recent"}
              onChange={(e) => handleSortChange(e.target.value as SortBy)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="most_commented">Most Discussed</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
