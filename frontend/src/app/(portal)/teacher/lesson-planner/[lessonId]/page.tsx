"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Target,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Users,
  Clipboard,
  Monitor,
  AlertCircle,
  Loader2,
  Wand2,
  Calendar,
  Edit3,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getLessonById,
  generateBlueprint,
  generateToolkit,
  updateLesson,
  deleteLesson,
} from "@/services/lesson-planner.service";
import type { StandaloneLesson, LessonStatus } from "@/types/lesson-planner.types";
import { LESSON_STATUS_CONFIG } from "@/types/lesson-planner.types";
import type { SessionSection, EngagementToolkit } from "@/types/curriculum.types";
import { LessonResourcesPanel } from "./components/LessonResourcesPanel";

const sectionTypeConfig = {
  hook: {
    color: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
    icon: Lightbulb,
    label: "Hook",
  },
  core: {
    color: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: BookOpen,
    label: "Core Content",
  },
  activity: {
    color: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
    icon: Users,
    label: "Activity",
  },
  application: {
    color: "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: Target,
    label: "Application",
  },
  checkpoint: {
    color: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: CheckCircle,
    label: "Checkpoint",
  },
  close: {
    color: "bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
    icon: Clock,
    label: "Close",
  },
};


export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const lessonId = parseInt(params.lessonId as string);

  const [lesson, setLesson] = useState<StandaloneLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [generatingBlueprint, setGeneratingBlueprint] = useState(false);
  const [generatingToolkit, setGeneratingToolkit] = useState(false);
  const [showToolkit, setShowToolkit] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLessonById(lessonId);
      setLesson(data);
      if (data.toolkit) {
        setShowToolkit(true);
      }
    } catch (err) {
      console.error("Failed to fetch lesson:", err);
      setError("Failed to load lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleGenerateBlueprint = async () => {
    if (!lesson) return;
    try {
      setGeneratingBlueprint(true);
      const result = await generateBlueprint(lesson.id);
      setLesson((prev) => prev ? { ...prev, blueprint: result.blueprint, status: "GENERATED" as LessonStatus } : null);
    } catch (err) {
      console.error("Failed to generate blueprint:", err);
    } finally {
      setGeneratingBlueprint(false);
    }
  };

  const handleGenerateToolkit = async () => {
    if (!lesson) return;
    try {
      setGeneratingToolkit(true);
      const result = await generateToolkit(lesson.id);
      setLesson((prev) => prev ? { ...prev, toolkit: result.toolkit } : null);
      setShowToolkit(true);
    } catch (err) {
      console.error("Failed to generate toolkit:", err);
    } finally {
      setGeneratingToolkit(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson) return;
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(lesson.id);
      router.push("/teacher/lesson-planner");
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
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
          <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Lesson
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

  const blueprint = lesson.blueprint;
  const toolkit = lesson.toolkit;
  const statusConfig = LESSON_STATUS_CONFIG[lesson.status];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/teacher/lesson-planner")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {lesson.curriculumSessionId && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full">
                    Imported
                  </span>
                )}
                {lesson.isSubstituteLesson && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full">
                    Substitute
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{lesson.subject} • {lesson.topic}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration} minutes
                </span>
                {lesson.classSize && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {lesson.classSize} students
                  </span>
                )}
                {lesson.scheduledDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(lesson.scheduledDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!blueprint ? (
                <button
                  onClick={handleGenerateBlueprint}
                  disabled={generatingBlueprint}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {generatingBlueprint ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Blueprint
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGenerateToolkit}
                  disabled={generatingToolkit}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {generatingToolkit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      {toolkit ? "Regenerate" : "Generate"} Toolkit
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete lesson"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* No Blueprint State */}
        {!blueprint && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-light dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Blueprint Generated Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Generate an AI-powered lesson blueprint to get a complete teaching plan with timeline, activities, and resources.
            </p>
            <button
              onClick={handleGenerateBlueprint}
              disabled={generatingBlueprint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {generatingBlueprint ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Blueprint
                </>
              )}
            </button>

            {/* Learning Objectives Summary */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-left max-w-lg mx-auto">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Learning Objectives</h4>
              <ul className="space-y-2">
                {lesson.learningObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Blueprint Content */}
        {blueprint && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
                <p className="text-gray-600 dark:text-gray-400">{blueprint.overview}</p>

                {/* Key Concepts */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blueprint.keyConceptsCovered.map((concept, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Lesson Timeline</h2>

                {/* Visual Timeline Bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-6">
                  {blueprint.sections.map((section, index) => {
                    const config = sectionTypeConfig[section.type as keyof typeof sectionTypeConfig];
                    const widthPercent = (section.duration / blueprint.duration) * 100;
                    return (
                      <div
                        key={index}
                        className={`${config?.color?.split(' ')[0] || 'bg-gray-200'} cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{ width: `${widthPercent}%` }}
                        title={`${section.title} (${section.duration} min)`}
                        onClick={() => toggleSection(index)}
                      />
                    );
                  })}
                </div>

                {/* Sections */}
                <div className="space-y-3">
                  {blueprint.sections.map((section, index) => {
                    const config = sectionTypeConfig[section.type as keyof typeof sectionTypeConfig] || sectionTypeConfig.core;
                    const Icon = config.icon;
                    const isExpanded = expandedSections.has(index);

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg overflow-hidden ${config.color}`}
                      >
                        <div
                          onClick={() => toggleSection(index)}
                          className="flex items-center justify-between p-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${config.textColor}`} />
                            <div>
                              <p className={`font-medium ${config.textColor}`}>
                                {section.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {config.label} • {section.duration} min • {section.interactionType}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {isExpanded && (
                          <div className="p-4 pt-0 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Content
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {section.content}
                              </p>
                            </div>

                            {section.teacherScript && (
                              <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Teacher Script
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                  &ldquo;{section.teacherScript}&rdquo;
                                </p>
                              </div>
                            )}

                            {section.materials.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Materials
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                                  {section.materials.map((material, i) => (
                                    <li key={i}>{material}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {section.tips.length > 0 && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4" />
                                  Tips
                                </h4>
                                <ul className="text-sm text-yellow-600 dark:text-yellow-400">
                                  {section.tips.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Common Misconceptions */}
              {blueprint.commonMisconceptions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Common Misconceptions
                  </h2>
                  <div className="space-y-4">
                    {blueprint.commonMisconceptions.map((item, index) => (
                      <div key={index} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <p className="font-medium text-orange-700 dark:text-orange-300 mb-2">
                          {item.misconception}
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                          <strong>Correction:</strong> {item.correction}
                        </p>
                        <p className="text-sm text-orange-500 dark:text-orange-500">
                          <strong>Prevention:</strong> {item.howToPrevent}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Checkpoint Question */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Checkpoint Question
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {blueprint.checkpointQuestion.question}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Correct:</strong> {blueprint.checkpointQuestion.correctAnswer}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  <strong>Why students get it wrong:</strong> {blueprint.checkpointQuestion.whyStudentsGetItWrong}
                </p>
              </div>

              {/* Preparation Checklist */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-blue-500" />
                  Preparation Checklist
                </h2>
                <ul className="space-y-2">
                  {blueprint.preparationChecklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <input type="checkbox" className="mt-1 rounded" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Needed */}
              {blueprint.technologyNeeded.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-purple-500" />
                    Technology Needed
                  </h2>
                  <ul className="space-y-1">
                    {blueprint.technologyNeeded.map((tech, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emergency Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Emergency Plan
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">If running behind:</p>
                    <p className="text-gray-600 dark:text-gray-400">{blueprint.emergencyPlan.ifRunningBehind}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">If running ahead:</p>
                    <p className="text-gray-600 dark:text-gray-400">{blueprint.emergencyPlan.ifRunningAhead}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">If students struggling:</p>
                    <p className="text-gray-600 dark:text-gray-400">{blueprint.emergencyPlan.ifStudentsStruggling}</p>
                  </div>
                </div>
              </div>

              {/* Board Work */}
              {blueprint.boardWork && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Board Work
                  </h2>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm text-green-400">
                    {blueprint.boardWork}
                  </div>
                </div>
              )}

              {/* Next Session Preview */}
              <div className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 dark:from-brand-primary/20 dark:to-brand-primary/10 rounded-xl p-6 border border-brand-primary/20">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Next Session Preview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {blueprint.nextSessionPreview}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Toolkit Section */}
        {blueprint && toolkit && showToolkit && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-primary" />
                Engagement Toolkit
              </h2>
              <button
                onClick={() => setShowToolkit(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Hide Toolkit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Analogies */}
              {toolkit.analogies.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Analogies</h3>
                  <div className="space-y-4">
                    {toolkit.analogies.map((item, index) => (
                      <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                          {item.analogy}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          {item.howToPresent}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real World Examples */}
              {toolkit.realWorldExamples.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Real World Examples</h3>
                  <div className="space-y-4">
                    {toolkit.realWorldExamples.map((item, index) => (
                      <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                          {item.example}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {item.industry} {item.company && `• ${item.company}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Activities */}
              {toolkit.quickActivities.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Activities</h3>
                  <div className="space-y-4">
                    {toolkit.quickActivities.map((item, index) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-green-700 dark:text-green-300">
                            {item.name}
                          </p>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {item.duration} min
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Memory Hooks */}
              {toolkit.memoryHooks.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Memory Hooks</h3>
                  <div className="space-y-4">
                    {toolkit.memoryHooks.map((item, index) => (
                      <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                          {item.hook}
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Helps remember: {item.whatItHelpsRemember}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion Questions */}
              {toolkit.discussionQuestions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Discussion Questions</h3>
                  <div className="space-y-4">
                    {toolkit.discussionQuestions.map((item, index) => (
                      <div key={index} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                        <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                          {item.question}
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                          Purpose: {item.purpose}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Connections */}
              {toolkit.industryConnections.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Industry Connections</h3>
                  <div className="space-y-4">
                    {toolkit.industryConnections.map((item, index) => (
                      <div key={index} className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                        <p className="font-medium text-teal-700 dark:text-teal-300 mb-1">
                          {item.company}
                        </p>
                        <p className="text-sm text-teal-600 dark:text-teal-400">
                          {item.howTheyUseThis}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teaching Resources Section */}
        {blueprint && (
          <div className="mt-8">
            <LessonResourcesPanel lessonId={lessonId} />
          </div>
        )}
      </div>
    </div>
  );
}
