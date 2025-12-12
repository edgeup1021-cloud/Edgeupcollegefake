"use client";

import {
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Loader2,
  BookOpen,
  FileText,
  Beaker,
} from "lucide-react";
import type { MacroPlanWeek, CurriculumSession } from "@/types/curriculum.types";

interface WeekCardProps {
  week: MacroPlanWeek;
  sessions: CurriculumSession[];
  isExpanded: boolean;
  onToggle: () => void;
  onGenerateSessions: () => void;
  isGenerating: boolean;
  onViewSession: (sessionId: number) => void;
}

const difficultyColors = {
  low: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    bar: "bg-green-500",
  },
  medium: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    bar: "bg-yellow-500",
  },
  high: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    bar: "bg-red-500",
  },
};

const sessionStatusIcons = {
  GENERATED: <CheckCircle className="w-4 h-4 text-blue-500" />,
  REVIEWED: <CheckCircle className="w-4 h-4 text-green-500" />,
  SCHEDULED: <Clock className="w-4 h-4 text-purple-500" />,
  TAUGHT: <CheckCircle className="w-4 h-4 text-green-600" />,
  NEEDS_REVISION: <AlertTriangle className="w-4 h-4 text-orange-500" />,
};

export default function WeekCard({
  week,
  sessions,
  isExpanded,
  onToggle,
  onGenerateSessions,
  isGenerating,
  onViewSession,
}: WeekCardProps) {
  const difficulty = difficultyColors[week.difficultyLevel];
  const hasAllSessions = sessions.length >= week.sessionCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-brand-primary/10 rounded-lg">
            <span className="text-brand-primary font-bold">{week.weekNumber}</span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {week.theme}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {week.sessionCount} sessions
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {week.totalHours}h total
              </span>
              {week.hasAssessment && (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {week.assessmentType}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Badge */}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficulty.bg} ${difficulty.text}`}>
            {week.difficultyLevel}
          </span>

          {/* Session Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all"
                style={{ width: `${(sessions.length / week.sessionCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {sessions.length}/{week.sessionCount}
            </span>
          </div>

          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Difficulty Bar */}
      <div className={`h-1 ${difficulty.bar}`} />

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Topics */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {week.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Learning Objectives
            </h4>
            <ul className="space-y-1">
              {week.learningObjectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Lab Component */}
          {week.labComponent && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Beaker className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Lab: {week.labComponent.title}
                </h4>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {week.labComponent.description}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                Duration: {week.labComponent.duration} minutes
              </p>
            </div>
          )}

          {/* Teacher Notes */}
          {week.teacherNotes && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                Teacher Notes
              </h4>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                {week.teacherNotes}
              </p>
            </div>
          )}

          {/* Sessions List */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sessions
              </h4>
              {!hasAllSessions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateSessions();
                  }}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Sessions
                    </>
                  )}
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sessions generated yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onViewSession(session.id)}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {sessionStatusIcons[session.status]}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {session.blueprint.sessionTitle}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Session {session.sessionNumber} • {session.blueprint.duration} min
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}

                {/* Placeholder for missing sessions */}
                {Array.from({ length: week.sessionCount - sessions.length }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      <div>
                        <p className="font-medium text-gray-400 dark:text-gray-500 text-sm">
                          Session {sessions.length + index + 1}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Not generated yet
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
