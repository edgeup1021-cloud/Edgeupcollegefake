"use client";

import { useState } from "react";
import { Paper } from "../lib/types";
import PaperCard from "./PaperCard";

interface PaperListProps {
  papers: Paper[];
  keywords: string[];
  total: number;
}

export default function PaperList({ papers, keywords, total }: PaperListProps) {
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  if (papers.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg">No papers found matching your research topic.</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try describing your topic differently or using broader terms.</p>
      </div>
    );
  }

  const displayedPapers = openAccessOnly
    ? papers.filter((p) => p.openAccessPdf !== null)
    : papers;

  const openAccessCount = papers.filter((p) => p.openAccessPdf !== null).length;
  const highlyCited = displayedPapers.filter((p) => p.citationCount >= 100);
  const recentPapers = displayedPapers.filter((p) => p.year && p.year >= 2023);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {openAccessOnly ? (
                <>Showing {displayedPapers.length} open access papers</>
              ) : (
                <>Found {total.toLocaleString()} papers</>
              )}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {openAccessOnly ? (
                <>Filtered from {papers.length} results</>
              ) : (
                <>Showing top {papers.length} results by relevance</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 dark:text-green-400 bg-white dark:bg-slate-800 border-green-300 dark:border-green-700 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Open Access Only ({openAccessCount})
              </span>
            </label>

            {highlyCited.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {highlyCited.length} highly cited
                </span>
              </div>
            )}
            {recentPapers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {recentPapers.length} recent (2023+)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">Search keywords</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {displayedPapers.length > 0 ? (
        <div className="grid gap-4">
          {displayedPapers.map((paper, index) => (
            <PaperCard key={paper.paperId} paper={paper} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">No open access papers found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Try turning off the filter to see all {papers.length} papers
          </p>
          <button
            onClick={() => setOpenAccessOnly(false)}
            className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            Show All Papers
          </button>
        </div>
      )}

      <div className="text-center pt-8 pb-4">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Papers sourced from Semantic Scholar. Click "View Paper" to read the full publication.
        </p>
      </div>
    </div>
  );
}
