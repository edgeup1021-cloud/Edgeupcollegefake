"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

type TabType = "research" | "citation";

interface Tab {
  id: TabType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "research",
    label: "Research Assistant",
    description: "Find academic papers with AI-powered search",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
      </svg>
    ),
  },
  {
    id: "citation",
    label: "Citation Generator",
    description: "Generate citations in multiple formats",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// Dynamically load pages to avoid SSR issues
const ResearchPage = dynamic(() => import("./modules/research/page"), { ssr: false });
const CitationPage = dynamic(() => import("./modules/citation/page"), { ssr: false });

export default function StudyCenterResearchPage() {
  const [activeTab, setActiveTab] = useState<TabType>("research");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Enhanced Header with Gradient */}
      <div className="bg-white dark:bg-slate-900/80 dark:backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-slate-600 dark:text-slate-400">Study Center</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Research Tools</span>
          </div>

          {/* Main Title */}
          <div className="mb-2">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
              Research & Citation Tools
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Harness the power of AI to enhance your academic journey with intelligent research discovery 
              and citation management.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Available Papers</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">200M+</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Citation Styles</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">5 Formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Sticky */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900/95 dark:backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content - Full Width */}
      {activeTab === "research" && <ResearchPage />}
      {activeTab === "citation" && <CitationPage />}
    </div>
  );
}
