"use client";

import { useState } from "react";

interface ResearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function ResearchInput({ onSearch, isLoading }: ResearchInputProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const charCount = query.length;
  const maxChars = 500;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Input Container */}
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        focused 
          ? "ring-2 ring-blue-500 ring-opacity-50" 
          : "ring-1 ring-slate-200 dark:ring-slate-700"
      }`}>
        {/* Background gradient on focus */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent transition-opacity ${
          focused ? "opacity-100" : "opacity-0"
        }`} />

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, maxChars))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe your research topic...&#10;&#10;Example: Impact of artificial intelligence on healthcare diagnosis accuracy"
          className={`
            relative w-full h-40 px-6 py-5 text-base
            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none resize-none
            transition-all duration-300
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
          disabled={isLoading}
        />

        {/* Character Counter */}
        <div className="absolute bottom-4 right-6 text-xs font-medium">
          <span className={charCount > maxChars * 0.9 ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}>
            {charCount}
          </span>
          <span className="text-slate-400 dark:text-slate-500">/{maxChars}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`
            flex-1 py-3 px-6 rounded-lg font-semibold
            flex items-center justify-center gap-2
            transition-all duration-300
            ${!query.trim() || isLoading
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>{isLoading ? "Searching..." : "Search Papers"}</span>
        </button>

        {query.trim() && !isLoading && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Clear"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hint Text */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        💡 Tip: Be specific with your keywords for better results. Include concepts, methodologies, or subjects you're interested in.
      </p>
    </form>
  );
}
