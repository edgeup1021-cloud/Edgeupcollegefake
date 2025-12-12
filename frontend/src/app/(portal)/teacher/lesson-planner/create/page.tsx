"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Users,
  Target,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Clock,
  Import,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createLesson,
  generateBlueprint,
  getAvailableCurriculumSessions,
  importFromCurriculum,
} from "@/services/lesson-planner.service";
import type { CreateLessonInput, LessonClassVibe } from "@/types/lesson-planner.types";
import {
  CLASS_VIBE_OPTIONS,
  GRADE_LEVEL_OPTIONS,
  COMMON_SUBJECTS,
} from "@/types/lesson-planner.types";
import type { CurriculumSession } from "@/types/curriculum.types";

const STEPS = [
  { id: "basics", title: "Lesson Basics", icon: BookOpen },
  { id: "context", title: "Class Context", icon: Users },
  { id: "objectives", title: "Learning Objectives", icon: Target },
  { id: "review", title: "Review & Generate", icon: Sparkles },
];

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 75, label: "75 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "2 hours" },
];

const PROGRESS_MESSAGES = [
  "Analyzing your lesson context...",
  "Designing engaging activities...",
  "Creating assessment checkpoints...",
  "Optimizing time allocation...",
  "Finalizing your lesson blueprint...",
];

export default function CreateLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Import mode
  const isImportMode = searchParams.get("mode") === "import";
  const [curriculumSessions, setCurriculumSessions] = useState<CurriculumSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<CurriculumSession | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [formData, setFormData] = useState<CreateLessonInput>({
    title: "",
    subject: "",
    topic: "",
    gradeLevel: "2nd Year",
    duration: 60,
    classSize: 40,
    classVibe: "MIXED" as LessonClassVibe,
    learningObjectives: [""],
    prerequisites: [],
    additionalNotes: "",
    isSubstituteLesson: false,
  });

  // Load curriculum sessions for import mode
  useEffect(() => {
    if (isImportMode) {
      loadCurriculumSessions();
    }
  }, [isImportMode]);

  const loadCurriculumSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessions = await getAvailableCurriculumSessions();
      setCurriculumSessions(sessions);
    } catch (err) {
      console.error("Failed to load curriculum sessions:", err);
      setError("Failed to load curriculum sessions");
    } finally {
      setLoadingSessions(false);
    }
  };

  const updateFormData = (updates: Partial<CreateLessonInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }));
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }));
  };

  const removeObjective = (index: number) => {
    if (formData.learningObjectives.length > 1) {
      const newObjectives = formData.learningObjectives.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, learningObjectives: newObjectives }));
    }
  };

  const addPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), ""],
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    const newPrerequisites = [...(formData.prerequisites || [])];
    newPrerequisites[index] = value;
    setFormData((prev) => ({ ...prev, prerequisites: newPrerequisites }));
  };

  const removePrerequisite = (index: number) => {
    const newPrerequisites = (formData.prerequisites || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, prerequisites: newPrerequisites }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.title.length >= 3 &&
          formData.subject.length > 0 &&
          formData.topic.length > 0
        );
      case 1:
        return formData.duration > 0;
      case 2:
        return formData.learningObjectives.filter((o) => o.trim().length > 0).length >= 1;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleImportSession = (session: CurriculumSession) => {
    setSelectedSession(session);
    const course = session.curriculumPlan?.course;
    const blueprint = session.blueprint;
    // Pre-fill form data from session
    setFormData({
      title: blueprint?.sessionTitle || `Week ${session.weekNumber} Session ${session.sessionNumber}`,
      subject: course?.subject || "",
      topic: blueprint?.keyConceptsCovered?.join(", ") || "",
      gradeLevel: course?.studentLevel || "2nd Year",
      duration: blueprint?.duration || course?.sessionDuration || 60,
      classSize: course?.classSize || 30,
      classVibe: (course?.classVibe as LessonClassVibe) || "MIXED",
      learningObjectives: course?.outcomes || [""],
      prerequisites: [],
      additionalNotes: "",
      isSubstituteLesson: false,
    });
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Animate through progress messages
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setProgressMessage(PROGRESS_MESSAGES[messageIndex]);
        messageIndex = (messageIndex + 1) % PROGRESS_MESSAGES.length;
      }, 2000);

      setProgressMessage(PROGRESS_MESSAGES[0]);

      let lessonId: number;

      if (selectedSession) {
        // Import from curriculum
        const result = await importFromCurriculum({
          curriculumSessionId: selectedSession.id,
        });
        lessonId = result.id;
      } else {
        // Create new lesson
        const cleanedData = {
          ...formData,
          learningObjectives: formData.learningObjectives.filter((o) => o.trim().length > 0),
          prerequisites: (formData.prerequisites || []).filter((p) => p.trim().length > 0),
        };

        const lesson = await createLesson(cleanedData);
        lessonId = lesson.id;

        // Generate blueprint
        await generateBlueprint(lessonId);
      }

      clearInterval(messageInterval);

      // Navigate to the lesson detail page
      router.push(`/teacher/lesson-planner/${lessonId}`);
    } catch (err) {
      console.error("Failed to generate lesson:", err);
      setError("Failed to generate lesson. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setError(null);

      const cleanedData = {
        ...formData,
        learningObjectives: formData.learningObjectives.filter((o) => o.trim().length > 0),
        prerequisites: (formData.prerequisites || []).filter((p) => p.trim().length > 0),
      };

      const lesson = await createLesson(cleanedData);
      router.push(`/teacher/lesson-planner/${lesson.id}`);
    } catch (err) {
      console.error("Failed to save draft:", err);
      setError("Failed to save draft. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // Generating state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center max-w-md mx-4">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Generating Your Lesson
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{progressMessage}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Import mode - session selection
  if (isImportMode && !selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Import className="w-7 h-7 text-brand-primary" />
              Import from Curriculum
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a curriculum session to import as a standalone lesson
            </p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loadingSessions ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : curriculumSessions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No curriculum sessions available to import.
              </p>
              <button
                onClick={() => router.push("/teacher/lesson-planner/create")}
                className="text-brand-primary hover:text-brand-primary/80"
              >
                Create a new lesson instead
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {curriculumSessions.map((session) => {
                const course = session.curriculumPlan?.course;
                const blueprint = session.blueprint;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleImportSession(session)}
                    className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-left hover:border-brand-primary hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {blueprint?.sessionTitle || `Week ${session.weekNumber} Session ${session.sessionNumber}`}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {course?.courseName || "Unknown Course"} • {blueprint?.keyConceptsCovered?.join(", ") || "No topics"}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {blueprint?.duration || course?.sessionDuration || 60} min
                          </span>
                          {blueprint && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <Sparkles className="w-4 h-4" />
                              Blueprint Ready
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => {
              if (selectedSession) {
                setSelectedSession(null);
              } else {
                router.back();
              }
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedSession ? "Import Lesson" : "Create New Lesson"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedSession
              ? "Customize and generate your imported lesson"
              : "Tell us about your lesson and we'll create a complete teaching blueprint"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-brand-primary bg-brand-primary text-white"
                        : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 lg:w-32 h-0.5 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {STEPS[currentStep].title}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {/* Step 1: Lesson Basics */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g., Introduction to Newton's Laws of Motion"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => updateFormData({ subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    {COMMON_SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade Level *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => updateFormData({ gradeLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    {GRADE_LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => updateFormData({ topic: e.target.value })}
                  placeholder="e.g., Force and Motion, Thermodynamics"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Duration *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {DURATION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData({ duration: option.value })}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        formData.duration === option.value
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Class Context */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Size (optional)
                </label>
                <input
                  type="number"
                  value={formData.classSize || ""}
                  onChange={(e) =>
                    updateFormData({ classSize: parseInt(e.target.value) || undefined })
                  }
                  min={1}
                  max={500}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Class Vibe
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CLASS_VIBE_OPTIONS.map((vibe) => (
                    <button
                      key={vibe.value}
                      onClick={() => updateFormData({ classVibe: vibe.value })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.classVibe === vibe.value
                          ? "border-brand-primary bg-brand-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{vibe.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vibe.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prerequisites (optional)
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  What should students know before this lesson?
                </p>
                <div className="space-y-3">
                  {(formData.prerequisites || []).map((prereq, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={prereq}
                        onChange={(e) => updatePrerequisite(index, e.target.value)}
                        placeholder="e.g., Basic algebra knowledge"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      />
                      <button
                        onClick={() => removePrerequisite(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addPrerequisite}
                  className="mt-3 flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add prerequisite
                </button>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSubstituteLesson}
                    onChange={(e) => updateFormData({ isSubstituteLesson: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      This is a substitute lesson
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      I&apos;m covering for another teacher
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Learning Objectives */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Objectives *
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  What should students be able to do by the end of this lesson?
                </p>
                <div className="space-y-3">
                  {formData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mt-2">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder="e.g., Students will be able to identify Newton's three laws"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      />
                      {formData.learningObjectives.length > 1 && (
                        <button
                          onClick={() => removeObjective(index)}
                          className="mt-2 p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addObjective}
                  className="mt-4 flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add another objective
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.additionalNotes || ""}
                  onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                  placeholder="Any specific requirements, teaching preferences, or context for this lesson..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review Your Lesson Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lesson Title</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.title}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.subject}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Topic</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.topic}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.duration} minutes
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Grade Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.gradeLevel}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Class Vibe</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {CLASS_VIBE_OPTIONS.find((v) => v.value === formData.classVibe)?.label ||
                      "Mixed"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Learning Objectives</p>
                <ul className="space-y-2">
                  {formData.learningObjectives
                    .filter((o) => o.trim())
                    .map((objective, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-900 dark:text-white"
                      >
                        <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                </ul>
              </div>

              {selectedSession && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Importing from: {selectedSession.course?.courseName} - {selectedSession.title}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep === STEPS.length - 1 && !selectedSession && (
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Save as Draft
                </button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Lesson Blueprint
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
