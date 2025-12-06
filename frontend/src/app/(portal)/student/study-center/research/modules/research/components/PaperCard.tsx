"use client";

import { useState } from "react";
import { Paper } from "../lib/types";

interface PaperCardProps {
  paper: Paper;
  index: number;
}

function formatAuthors(authors: { name: string }[]): string {
  if (authors.length === 0) return "Unknown authors";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`;
  return `${authors[0].name} et al.`;
}

function getCitationBadgeColor(count: number): string {
  if (count >= 100) return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (count >= 50) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  if (count >= 10) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
}

function getCitationLabel(count: number): string {
  if (count >= 100) return "Highly Cited";
  if (count >= 50) return "Well Cited";
  if (count >= 10) return "Cited";
  return "";
}

export default function PaperCard({ paper, index }: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);

  const abstract = paper.abstract || "No abstract available";
  const shouldTruncate = abstract.length > 250;
  const displayAbstract = expanded || !shouldTruncate
    ? abstract
    : abstract.slice(0, 250) + "...";

  const label = getCitationLabel(paper.citationCount);

  return (
    <div
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 
                 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10
                 dark:hover:shadow-blue-500/20 hover:-translate-y-1
                 transition-all duration-300 ease-out overflow-hidden
                 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
    >
      {/* Left Accent Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-500" />

      <div className="p-6 pl-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {paper.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatAuthors(paper.authors)}
            </p>
          </div>
          {paper.citationCount > 0 && label && (
            <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${getCitationBadgeColor(paper.citationCount)} whitespace-nowrap`}>
              {label}
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          {paper.year && (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {paper.year}
            </div>
          )}
          {paper.venue && (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="line-clamp-1">{paper.venue}</span>
            </div>
          )}
          {paper.citationCount > 0 && (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              {paper.citationCount} citations
            </div>
          )}
          {paper.openAccessPdf && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Open Access
            </div>
          )}
        </div>

        {/* Abstract */}
        <div className="mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {displayAbstract}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            ID: {paper.paperId?.slice(0, 12)}...
          </div>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <span>View Paper</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
