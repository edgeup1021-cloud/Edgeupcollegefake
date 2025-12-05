"use client";

import { useState } from "react";
import CitationInput from "./components/CitationInput";
import CitationResult from "./components/CitationResult";
import { CitationStyle, CitationMetadata, FormattedCitation } from "./lib/types";

type Step = "input" | "loading" | "result";

const CITATION_STYLES: Array<{ id: CitationStyle; name: string; description: string; icon: string }> = [
  { id: "apa", name: "APA", description: "American Psychological Association", icon: "📋" },
  { id: "mla", name: "MLA", description: "Modern Language Association", icon: "📚" },
  { id: "chicago", name: "Chicago", description: "Chicago Manual of Style", icon: "📖" },
  { id: "harvard", name: "Harvard", description: "Harvard Referencing Style", icon: "🎓" },
  { id: "ieee", name: "IEEE", description: "Institute of Electrical and Electronics Engineers", icon: "⚡" },
];

export default function CitationPage() {
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<CitationMetadata | null>(null);
  const [citation, setCitation] = useState<FormattedCitation | null>(null);
  const [currentStyle, setCurrentStyle] = useState<CitationStyle>("apa");
  const [selectedStyles, setSelectedStyles] = useState<CitationStyle[]>(["apa"]);

  const handleGenerate = async (input: string, style: CitationStyle) => {
    setError(null);
    setCurrentStyle(style);
    setStep("loading");

    try {
      const response = await fetch("/student/study-center/research/modules/citation/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, style }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate citation");
      }

      setMetadata(data.metadata);
      setCitation(data.citation);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  };

  const handleReset = () => {
    setStep("input");
    setError(null);
    setMetadata(null);
    setCitation(null);
  };

  const toggleStyle = (style: CitationStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg">
              📚
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              Citation Formatter
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Format Your Citations</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Generate properly formatted citations in APA, MLA, Chicago, Harvard, or IEEE styles instantly.</p>
        </div>


        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {step === "input" && (
            <div className="p-8">
              <CitationInput onGenerate={handleGenerate} isLoading={false} styles={selectedStyles} />
            </div>
          )}

          {step === "loading" && (
            <div className="space-y-6 text-center py-16">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full animate-spin" />
                  <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600 dark:text-slate-400 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.75L10.5 1.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Formatting Citation</h3>
                <p className="text-slate-600 dark:text-slate-400">Generating {currentStyle.toUpperCase()} formatted citation...</p>
              </div>
            </div>
          )}

          {step === "result" && citation && (
            <div className="p-8 space-y-6">
              {metadata && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Source Information</h3>
                  <div className="space-y-2 text-sm">
                    {metadata.authors && metadata.authors.length > 0 && (
                      <div>
                        <span className="font-medium text-blue-700 dark:text-blue-300">Authors:</span>
                        <p className="text-blue-600 dark:text-blue-400">{metadata.authors.join(", ")}</p>
                      </div>
                    )}
                    {metadata.title && (
                      <div>
                        <span className="font-medium text-blue-700 dark:text-blue-300">Title:</span>
                        <p className="text-blue-600 dark:text-blue-400">{metadata.title}</p>
                      </div>
                    )}
                    {metadata.year && (
                      <div>
                        <span className="font-medium text-blue-700 dark:text-blue-300">Year:</span>
                        <p className="text-blue-600 dark:text-blue-400">{metadata.year}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <CitationResult citation={citation} style={currentStyle} />

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Multiple Formats</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generate citations in 5 different academic formats.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Generation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get properly formatted citations in seconds.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Easy Copy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Copy citations to clipboard with a single click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
