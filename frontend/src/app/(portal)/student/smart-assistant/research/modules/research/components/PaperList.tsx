"use client";

import React, { useState } from "react";
import PaperCard from "./PaperCard";
import { Paper } from "../lib/types";

interface PaperListProps {
  papers: Paper[];
  keywords?: string[];
  total?: number;
  isLoading?: boolean;
  error?: string | null;
}

export default function PaperList({ papers = [], isLoading = false, error = null }: PaperListProps) {
  const [sortBy, setSortBy] = useState<"relevance" | "citations" | "recent">("relevance");
  const [filterMinCitations, setFilterMinCitations] = useState(0);

  // Sort papers based on selected criteria
  const sortedPapers = React.useMemo(() => {
    const filtered = papers.filter((p) => (p.citationCount || 0) >= filterMinCitations);

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "citations":
          return (b.citationCount || 0) - (a.citationCount || 0);
        case "recent":
          return (b.year || 0) - (a.year || 0);
        case "relevance":
        default:
          return 0;
      }
    });
  }, [papers, sortBy, filterMinCitations]);

  if (error) {
    return (
      <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-200">Error Loading Papers</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-600 dark:text-slate-400">No papers found. Try a different search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Results Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Found <span className="text-blue-600 dark:text-blue-400">{sortedPapers.length}</span> Papers
          </h3>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Sorted by {sortBy === "relevance" ? "Relevance" : sortBy === "citations" ? "Citations" : "Newest"}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        {/* Sort Dropdown */}
        <div className="flex gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 py-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <option value="relevance">Relevance</option>
            <option value="citations">Most Cited</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* Citation Filter */}
        <div className="flex gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 py-2">Min Citations:</label>
          <input
            type="number"
            min="0"
            value={filterMinCitations}
            onChange={(e) => setFilterMinCitations(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
          />
        </div>

        {/* Active Filter Badge */}
        {filterMinCitations > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Filtering: {papers.filter((p) => (p.citationCount || 0) >= filterMinCitations).length} of {papers.length}
            </span>
          </div>
        )}
      </div>

      {/* Papers Grid */}
      <div className="grid gap-4 auto-rows-max">
        {sortedPapers.map((paper, index) => (
          <div
            key={paper.paperId}
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
            }}
          >
            <PaperCard paper={paper} index={index} />
          </div>
        ))}
      </div>

      {/* No Results After Filter */}
      {sortedPapers.length === 0 && papers.length > 0 && (
        <div className="w-full text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            No papers match your filter. Try adjusting the minimum citations threshold.
          </p>
        </div>
      )}

      {/* Styles for animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
