"use client";

import { useState } from "react";

interface ResearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function ResearchInput({ onSearch, isLoading }: ResearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your research topic in detail...

Example: I'm researching how social media usage affects mental health in teenagers, particularly focusing on anxiety and depression rates"
          className={`
            w-full h-40 px-6 py-5 text-base
            bg-white border-2 border-slate-200 rounded-2xl dark:bg-slate-800 dark:border-slate-700
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30
            transition-all duration-300 resize-none
            text-slate-900 dark:text-white
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
          disabled={isLoading}
        />
        <div className="absolute bottom-4 left-6 text-xs text-slate-400 dark:text-slate-500">
          {query.length} characters
        </div>
      </div>

      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        className={`
          mt-4 w-full py-4 px-6 rounded-xl
          font-semibold text-white
          transition-all duration-300
          flex items-center justify-center gap-3
          ${query.trim() && !isLoading
            ? "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 dark:bg-purple-600 dark:hover:bg-purple-700"
            : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Research Papers
          </>
        )}
      </button>
    </form>
  );
}
