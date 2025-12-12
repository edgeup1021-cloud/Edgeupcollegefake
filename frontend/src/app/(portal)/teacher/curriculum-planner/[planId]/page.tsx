"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Play,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurriculumPlanById,
  getSessionsByPlan,
  generateAllSessions,
  generateSession,
} from "@/services/curriculum-planner.service";
import type {
  CurriculumPlan,
  CurriculumSession,
  MacroPlanWeek,
} from "@/types/curriculum.types";
import WeekCard from "./components/WeekCard";

const difficultyColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function CurriculumPlanPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const planId = parseInt(params.planId as string);

  const [plan, setPlan] = useState<CurriculumPlan | null>(null);
  const [sessions, setSessions] = useState<CurriculumSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [generatingSessions, setGeneratingSessions] = useState(false);
  const [generatingWeek, setGeneratingWeek] = useState<number | null>(null);

  useEffect(() => {
    fetchPlanData();
  }, [planId]);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [planData, sessionsData] = await Promise.all([
        getCurriculumPlanById(planId),
        getSessionsByPlan(planId),
      ]);
      setPlan(planData);
      setSessions(sessionsData);
    } catch (err) {
      console.error("Failed to fetch curriculum plan:", err);
      setError("Failed to load curriculum plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekNumber)) {
        newSet.delete(weekNumber);
      } else {
        newSet.add(weekNumber);
      }
      return newSet;
    });
  };

  const handleGenerateAllSessions = async () => {
    if (!plan) return;
    try {
      setGeneratingSessions(true);
      await generateAllSessions(plan.id);
      // Refresh sessions
      const sessionsData = await getSessionsByPlan(plan.id);
      setSessions(sessionsData);
    } catch (err) {
      console.error("Failed to generate sessions:", err);
    } finally {
      setGeneratingSessions(false);
    }
  };

  const handleGenerateWeekSessions = async (weekNumber: number, sessionCount: number) => {
    if (!plan) return;
    try {
      setGeneratingWeek(weekNumber);
      for (let i = 1; i <= sessionCount; i++) {
        await generateSession({
          curriculumPlanId: plan.id,
          weekNumber,
          sessionNumber: i,
        });
      }
      // Refresh sessions
      const sessionsData = await getSessionsByPlan(plan.id);
      setSessions(sessionsData);
    } catch (err) {
      console.error("Failed to generate week sessions:", err);
    } finally {
      setGeneratingWeek(null);
    }
  };

  const getSessionsForWeek = (weekNumber: number) => {
    return sessions.filter((s) => s.weekNumber === weekNumber);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading curriculum plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const macroplan = plan.macroplan;
  const totalSessions = macroplan.weeks.reduce((sum, w) => sum + w.sessionCount, 0);
  const generatedSessionsCount = sessions.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/teacher/curriculum-planner")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {macroplan.courseName}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {plan.course?.subject} • Version {plan.version}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateAllSessions}
                disabled={generatingSessions}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
              >
                {generatingSessions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate All Sessions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {macroplan.totalWeeks}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weeks</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {generatedSessionsCount}/{totalSessions}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {macroplan.assessmentStrategy.quizCount + macroplan.assessmentStrategy.assignmentCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assessments</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.course?.classSize || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Philosophy */}
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 dark:from-brand-primary/20 dark:to-brand-primary/10 rounded-xl p-6 mb-8 border border-brand-primary/20">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Teaching Philosophy
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{macroplan.teachingPhilosophy}</p>
        </div>

        {/* Course Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Course Overview
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{macroplan.courseOverview}</p>
        </div>

        {/* Week Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Week-by-Week Curriculum
          </h2>

          {macroplan.weeks.map((week) => (
            <WeekCard
              key={week.weekNumber}
              week={week}
              sessions={getSessionsForWeek(week.weekNumber)}
              isExpanded={expandedWeeks.has(week.weekNumber)}
              onToggle={() => toggleWeek(week.weekNumber)}
              onGenerateSessions={() =>
                handleGenerateWeekSessions(week.weekNumber, week.sessionCount)
              }
              isGenerating={generatingWeek === week.weekNumber}
              onViewSession={(sessionId) =>
                router.push(`/teacher/curriculum-planner/${planId}/session/${sessionId}`)
              }
            />
          ))}
        </div>

        {/* Suggested Resources */}
        {macroplan.suggestedResources.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Suggested Resources
            </h3>
            <ul className="space-y-2">
              {macroplan.suggestedResources.map((resource, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                  {resource}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
