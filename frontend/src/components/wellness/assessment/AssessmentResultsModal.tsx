"use client";

import { X, CheckCircle, TrendUp, Lightbulb, Brain, Lightning, Heartbeat, GraduationCap } from "@phosphor-icons/react";
import Link from "next/link";

interface AssessmentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: {
    overall: number;
    mentalHealth: number;
    stress: number;
    lifestyle: number;
    academic: number;
  };
  recommendations: string[];
  clinicalResult?: {
    score: number;
    severity: string;
    description: string;
  };
  assessmentType?: string;
}

export default function AssessmentResultsModal({
  isOpen,
  onClose,
  scores,
  recommendations,
  clinicalResult,
  assessmentType,
}: AssessmentResultsModalProps) {
  if (!isOpen) return null;

  // Use clinical result if available, otherwise use old scores
  const isClinicalAssessment = !!clinicalResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getClinicalSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes("minimal") || severityLower.includes("low")) {
      return "text-emerald-600 dark:text-emerald-400";
    }
    if (severityLower.includes("mild")) {
      return "text-blue-600 dark:text-blue-400";
    }
    if (severityLower.includes("moderate")) {
      return "text-amber-600 dark:text-amber-400";
    }
    return "text-red-600 dark:text-red-400";
  };

  const getClinicalSeverityBgColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower.includes("minimal") || severityLower.includes("low")) {
      return "bg-emerald-500";
    }
    if (severityLower.includes("mild")) {
      return "bg-blue-500";
    }
    if (severityLower.includes("moderate")) {
      return "bg-amber-500";
    }
    return "bg-red-500";
  };

  const getAssessmentName = (type: string) => {
    const names: Record<string, string> = {
      phq9: "PHQ-9",
      gad7: "GAD-7",
      pss10: "PSS-10",
    };
    return names[type] || type;
  };

  const getAssessmentMaxScore = (type: string) => {
    const maxScores: Record<string, number> = {
      phq9: 27,
      gad7: 21,
      pss10: 40,
    };
    return maxScores[type] || 100;
  };

  const categories = [
    {
      name: "Mental Health",
      score: scores.mentalHealth,
      icon: Brain,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Stress & Coping",
      score: scores.stress,
      icon: Lightning,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Lifestyle Balance",
      score: scores.lifestyle,
      icon: Heartbeat,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Academic Wellbeing",
      score: scores.academic,
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <CheckCircle className="w-8 h-8 text-white" weight="fill" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                  Assessment Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here's your wellness profile
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Clinical Score or Overall Score */}
            {isClinicalAssessment && clinicalResult ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary relative mb-4">
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <div>
                      <div className={`text-4xl font-bold ${getClinicalSeverityColor(clinicalResult.severity)}`}>
                        {clinicalResult.score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        / {assessmentType ? getAssessmentMaxScore(assessmentType) : 100}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {assessmentType ? getAssessmentName(assessmentType) : "Assessment"} Score
                </h3>
                <p className={`text-lg font-semibold ${getClinicalSeverityColor(clinicalResult.severity)} mb-2`}>
                  {clinicalResult.severity}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {clinicalResult.description}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary relative mb-4">
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <div>
                      <div className={`text-4xl font-bold ${getScoreColor(scores.overall)}`}>
                        {scores.overall}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Overall Wellness Score
                </h3>
                <p className={`text-lg font-semibold ${getScoreColor(scores.overall)}`}>
                  {getScoreLabel(scores.overall)}
                </p>
              </div>
            )}

            {/* Category Breakdown - Only for non-clinical assessments */}
            {!isClinicalAssessment && (
              <div>
                <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendUp className="w-6 h-6 text-brand-primary" weight="duotone" />
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={category.name}
                        className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                            <Icon className="w-5 h-5 text-white" weight="duotone" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className={`text-sm font-medium ${getScoreColor(category.score)}`}>
                              {category.score}/100 - {getScoreLabel(category.score)}
                            </div>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getScoreBgColor(category.score)} transition-all duration-500`}
                            style={{ width: `${category.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clinical Assessment Information */}
            {isClinicalAssessment && clinicalResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                  Understanding Your Score
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    {assessmentType === "phq9" && (
                      <>
                        The PHQ-9 score ranges from 0-27. Your score of <strong>{clinicalResult.score}</strong> indicates <strong>{clinicalResult.severity.toLowerCase()}</strong> depression symptoms.
                      </>
                    )}
                    {assessmentType === "gad7" && (
                      <>
                        The GAD-7 score ranges from 0-21. Your score of <strong>{clinicalResult.score}</strong> indicates <strong>{clinicalResult.severity.toLowerCase()}</strong> anxiety symptoms.
                      </>
                    )}
                    {assessmentType === "pss10" && (
                      <>
                        The PSS-10 score ranges from 0-40. Your score of <strong>{clinicalResult.score}</strong> indicates <strong>{clinicalResult.severity.toLowerCase()}</strong> perceived stress.
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    This is a screening tool and not a diagnosis. Please consult with a mental health professional for a comprehensive evaluation.
                  </p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-500" weight="duotone" />
                  Personalized Recommendations
                </h3>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Your results have been saved and will reflect on your wellness dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Check your dashboard for updated recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Consider retaking this assessment in 2-4 weeks to track your progress
                </li>
              </ul>
              <Link
                href="/student/wellness/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                Close
              </button>
              <Link
                href="/student/wellness/dashboard"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all text-center"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
