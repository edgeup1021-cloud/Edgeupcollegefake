"use client";

import { InterviewReport } from "@/types/mock-interview.types";
import { generateInterviewPDF } from "@/lib/mock-interview/pdfGenerator";

interface ReportPreviewProps {
  report: InterviewReport;
  visible: boolean;
  onClose: () => void;
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 7) return "bg-green-500";
    if (s >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${getScoreColor(score)} w-16 h-16 rounded-xl flex items-center justify-center`}>
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
      <span className="text-sm text-slate-600 mt-2">{label}</span>
    </div>
  );
}

export default function ReportPreview({ report, visible, onClose }: ReportPreviewProps) {
  if (!visible) return null;

  const handleDownloadPDF = () => {
    generateInterviewPDF(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Interview Complete!</h2>
          <p className="text-blue-100 mt-1">
            Duration: {report.duration} | Language: {report.language}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scores */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Scores</h3>
            <div className="flex justify-around">
              <ScoreCard label="Technical" score={report.scores.technical} />
              <ScoreCard label="Communication" score={report.scores.communication} />
              <ScoreCard label="Problem Solving" score={report.scores.problemSolving} />
              <ScoreCard label="Overall" score={report.scores.overall} />
            </div>
          </div>

          {/* Overall Assessment */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Overall Assessment</h3>
            <p className="text-slate-600">{report.overallAssessment}</p>
          </div>

          {/* Strengths */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Strengths</h3>
            <ul className="space-y-2">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  <span className="text-slate-600">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Areas for Improvement</h3>
            <ul className="space-y-2">
              {report.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">&#9679;</span>
                  <span className="text-slate-600">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Executive Summary</h3>
            <p className="text-slate-600 whitespace-pre-line">{report.executiveSummary}</p>
          </div>

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Recommendations</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="text-slate-600">{rec}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
