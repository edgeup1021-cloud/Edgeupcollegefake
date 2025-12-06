"use client";

import { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import JobList from "./components/JobList";
import { ResumeAnalysis, MatchedJob } from "@/lib/job-match/types";

type Step = "upload" | "analyzing" | "searching" | "matching" | "results";

export default function JobMatchPage() {
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);

  const handleUpload = async (file: File) => {
    setError(null);
    setStep("analyzing");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const analyzeRes = await fetch("/api/student/job-match/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analyzeRes.ok) {
        const errorText = await analyzeRes.text();
        throw new Error(`Failed to analyze resume: ${errorText}`);
      }

      const analyzeData = await analyzeRes.json();
      setResumeAnalysis(analyzeData.analysis);
      setStep("searching");

      const searchRes = await fetch("/api/student/job-match/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeAnalysis: analyzeData.analysis }),
      });

      if (!searchRes.ok) {
        const errorText = await searchRes.text();
        throw new Error(`Failed to search jobs: ${errorText}`);
      }

      const searchData = await searchRes.json();
      setStep("matching");

      const matchRes = await fetch("/api/student/job-match/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeAnalysis: analyzeData.analysis,
          jobs: searchData.jobs,
        }),
      });

      if (!matchRes.ok) {
        const errorText = await matchRes.text();
        throw new Error(`Failed to match jobs: ${errorText}`);
      }

      const matchData = await matchRes.json();
      setMatchedJobs(matchData.jobs);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setError(null);
    setResumeAnalysis(null);
    setMatchedJobs([]);
  };

  const steps: Array<{ id: Step; label: string; icon: string }> = [
    { id: "upload", label: "Upload Resume", icon: "📄" },
    { id: "analyzing", label: "Analyzing", icon: "🔍" },
    { id: "searching", label: "Searching Jobs", icon: "🔎" },
    { id: "matching", label: "Matching", icon: "⚙️" },
    { id: "results", label: "Results", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.75L10.5 1.5z" />
                <path d="M10 7v3.5m0 3.5v3m-2.5-5h5" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              Job Match Tool
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Find Your Perfect Job Match</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Upload your resume and we'll match you with relevant job opportunities using AI analysis.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-5 animate-shake">
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

        {/* Progress Indicator */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Process</h3>
            <span className="text-sm text-slate-600 dark:text-slate-400">{currentStepIndex + 1}/{steps.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all mb-2 ${
                    idx < currentStepIndex
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : idx === currentStepIndex
                      ? "bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700/50"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {idx < currentStepIndex ? "✓" : s.icon.charAt(0)}
                </div>
                <span className={`text-xs text-center font-medium ${
                  idx === currentStepIndex
                    ? "text-blue-600 dark:text-blue-400"
                    : idx < currentStepIndex
                    ? "text-green-600 dark:text-green-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          {step === "upload" && (
            <div className="space-y-6">
              <ResumeUploader onUpload={handleUpload} isLoading={false} />
            </div>
          )}

          {step === "analyzing" && (
            <div className="space-y-6 text-center py-12">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Analyzing Your Resume</h3>
                <p className="text-slate-600 dark:text-slate-400">We're extracting skills, experience, and qualifications...</p>
              </div>
            </div>
          )}

          {step === "searching" && (
            <div className="space-y-6 text-center py-12">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full animate-spin" />
                  <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16A8 8 0 108 0a8 8 0 000 16zM9 12H7V8h2v4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Searching for Jobs</h3>
                <p className="text-slate-600 dark:text-slate-400">Finding relevant job opportunities that match your profile...</p>
              </div>
            </div>
          )}

          {step === "matching" && (
            <div className="space-y-6 text-center py-12">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse opacity-50" />
                  <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Matching Jobs</h3>
                <p className="text-slate-600 dark:text-slate-400">Calculating match scores based on your qualifications...</p>
              </div>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-6">
              {resumeAnalysis && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Resume Analysis</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">{resumeAnalysis.skills?.length || 0}</span>
                      <p className="text-blue-600 dark:text-blue-400">Skills Identified</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">{resumeAnalysis.experience_years || "N/A"}</span>
                      <p className="text-blue-600 dark:text-blue-400">Years Experience</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">{matchedJobs.length}</span>
                      <p className="text-blue-600 dark:text-blue-400">Jobs Found</p>
                    </div>
                  </div>
                </div>
              )}

              <JobList jobs={matchedJobs} />

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
