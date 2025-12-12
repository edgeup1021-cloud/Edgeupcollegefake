"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Calendar,
  Users,
  Target,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateMacroPlan } from "@/services/curriculum-planner.service";
import type {
  CreateCurriculumCourseInput,
  CurriculumSessionType,
  ClassVibe,
  TeacherChallenge,
} from "@/types/curriculum.types";

const STEPS = [
  { id: "basic", title: "Basic Info", icon: BookOpen },
  { id: "schedule", title: "Schedule", icon: Calendar },
  { id: "class", title: "Class Details", icon: Users },
  { id: "outcomes", title: "Learning Outcomes", icon: Target },
  { id: "challenge", title: "Your Challenge", icon: AlertCircle },
  { id: "review", title: "Review & Generate", icon: Sparkles },
];

const SESSION_TYPES: { value: CurriculumSessionType; label: string }[] = [
  { value: "LECTURE" as CurriculumSessionType, label: "Lecture" },
  { value: "LAB" as CurriculumSessionType, label: "Lab" },
  { value: "TUTORIAL" as CurriculumSessionType, label: "Tutorial" },
  { value: "SEMINAR" as CurriculumSessionType, label: "Seminar" },
  { value: "HYBRID" as CurriculumSessionType, label: "Hybrid" },
  { value: "WORKSHOP" as CurriculumSessionType, label: "Workshop" },
];

const CLASS_VIBES: { value: ClassVibe; label: string; icon: string; description: string }[] = [
  { value: "HIGH_ENGAGEMENT" as ClassVibe, label: "High Engagement", icon: "🔥", description: "Students are eager and participate actively" },
  { value: "MIXED" as ClassVibe, label: "Mixed", icon: "⚡", description: "Some engaged, some passive" },
  { value: "LOW_ENGAGEMENT" as ClassVibe, label: "Low Engagement", icon: "😴", description: "Mostly passive, need motivation" },
  { value: "ADVANCED" as ClassVibe, label: "Advanced", icon: "🎯", description: "High achievers wanting depth" },
  { value: "STRUGGLING" as ClassVibe, label: "Struggling", icon: "🆘", description: "Many students need extra support" },
];

const CHALLENGES: { value: TeacherChallenge; label: string }[] = [
  { value: "STUDENTS_DISENGAGED" as TeacherChallenge, label: "Students are disengaged" },
  { value: "TOO_MUCH_CONTENT" as TeacherChallenge, label: "Too much content to cover" },
  { value: "WEAK_FUNDAMENTALS" as TeacherChallenge, label: "Students have weak fundamentals" },
  { value: "MIXED_SKILL_LEVELS" as TeacherChallenge, label: "Mixed skill levels in class" },
  { value: "TIME_MANAGEMENT" as TeacherChallenge, label: "Time management in sessions" },
  { value: "ASSESSMENT_ALIGNMENT" as TeacherChallenge, label: "Assessment alignment" },
  { value: "PRACTICAL_APPLICATION" as TeacherChallenge, label: "Making content practical/applied" },
];

const SUBJECTS = [
  "Mechanical Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electronics Engineering",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Business Administration",
  "Economics",
  "Other",
];

const PROGRESS_MESSAGES = [
  "Analyzing your course structure...",
  "Designing week-by-week progression...",
  "Optimizing assessment placement...",
  "Balancing difficulty across weeks...",
  "Finalizing your curriculum plan...",
];

export default function CreateCurriculumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCurriculumCourseInput>({
    courseName: "",
    courseCode: "",
    subject: "",
    department: "",
    totalWeeks: 16,
    hoursPerWeek: 3,
    sessionDuration: 60,
    sessionsPerWeek: 3,
    sessionType: "LECTURE" as CurriculumSessionType,
    classSize: 40,
    classVibe: "MIXED" as ClassVibe,
    studentLevel: "Undergraduate",
    outcomes: [""],
    primaryChallenge: undefined,
    additionalNotes: "",
  });

  const updateFormData = (updates: Partial<CreateCurriculumCourseInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addOutcome = () => {
    setFormData((prev) => ({
      ...prev,
      outcomes: [...prev.outcomes, ""],
    }));
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData((prev) => ({ ...prev, outcomes: newOutcomes }));
  };

  const removeOutcome = (index: number) => {
    if (formData.outcomes.length > 1) {
      const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, outcomes: newOutcomes }));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.courseName.length >= 3 && formData.subject.length > 0;
      case 1:
        return formData.totalWeeks > 0 && formData.sessionsPerWeek > 0;
      case 2:
        return formData.classSize > 0;
      case 3:
        return formData.outcomes.filter((o) => o.trim().length > 0).length >= 1;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
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

      // Filter out empty outcomes
      const cleanedData = {
        ...formData,
        outcomes: formData.outcomes.filter((o) => o.trim().length > 0),
      };

      const result = await generateMacroPlan({ courseData: cleanedData });

      clearInterval(messageInterval);

      // Navigate to the generated plan
      router.push(`/teacher/curriculum-planner/${result.curriculumPlanId}`);
    } catch (err) {
      console.error("Failed to generate curriculum:", err);
      setError("Failed to generate curriculum plan. Please try again.");
      setIsGenerating(false);
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
            Generating Your Curriculum
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {progressMessage}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-brand-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Curriculum Plan
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tell us about your course and we&apos;ll generate a complete curriculum plan
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
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 lg:w-24 h-0.5 mx-2 ${
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
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => updateFormData({ courseName: e.target.value })}
                  placeholder="e.g., Introduction to Machine Learning"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Code (optional)
                </label>
                <input
                  type="text"
                  value={formData.courseCode || ""}
                  onChange={(e) => updateFormData({ courseCode: e.target.value })}
                  placeholder="e.g., CS301"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject / Department *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => updateFormData({ subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Level
                </label>
                <select
                  value={formData.studentLevel}
                  onChange={(e) => updateFormData({ studentLevel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    value={formData.totalWeeks}
                    onChange={(e) => updateFormData({ totalWeeks: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={52}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sessions per Week *
                  </label>
                  <input
                    type="number"
                    value={formData.sessionsPerWeek}
                    onChange={(e) => updateFormData({ sessionsPerWeek: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={10}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Duration (minutes) *
                </label>
                <select
                  value={formData.sessionDuration}
                  onChange={(e) => updateFormData({ sessionDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={75}>75 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SESSION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateFormData({ sessionType: type.value })}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        formData.sessionType === type.value
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hours per Week
                </label>
                <p className="text-2xl font-bold text-brand-primary">
                  {((formData.sessionsPerWeek * formData.sessionDuration) / 60).toFixed(1)} hours
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Calculated from sessions × duration
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Class Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Size *
                </label>
                <input
                  type="number"
                  value={formData.classSize}
                  onChange={(e) => updateFormData({ classSize: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={500}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Class Vibe *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CLASS_VIBES.map((vibe) => (
                    <button
                      key={vibe.value}
                      onClick={() => updateFormData({ classVibe: vibe.value })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.classVibe === vibe.value
                          ? "border-brand-primary bg-brand-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{vibe.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {vibe.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {vibe.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Learning Outcomes */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Outcomes *
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  What should students be able to do by the end of this course?
                </p>
                <div className="space-y-3">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mt-2">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => updateOutcome(index, e.target.value)}
                        placeholder="e.g., Students will be able to implement basic ML algorithms"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      />
                      {formData.outcomes.length > 1 && (
                        <button
                          onClick={() => removeOutcome(index)}
                          className="mt-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOutcome}
                  className="mt-4 text-brand-primary hover:text-brand-primary/80 text-sm font-medium"
                >
                  + Add another outcome
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Challenge */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What&apos;s your biggest challenge? (optional)
                </label>
                <div className="space-y-3">
                  {CHALLENGES.map((challenge) => (
                    <button
                      key={challenge.value}
                      onClick={() =>
                        updateFormData({
                          primaryChallenge:
                            formData.primaryChallenge === challenge.value
                              ? undefined
                              : challenge.value,
                        })
                      }
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        formData.primaryChallenge === challenge.value
                          ? "border-brand-primary bg-brand-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {challenge.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.additionalNotes || ""}
                  onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
                  placeholder="Any specific requirements, constraints, or context we should know about..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review Your Course Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Course Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.courseName}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.subject}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.totalWeeks} weeks</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sessions</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.sessionsPerWeek} per week × {formData.sessionDuration} min
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Class Size</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.classSize} students</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Class Vibe</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {CLASS_VIBES.find((v) => v.value === formData.classVibe)?.label}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Learning Outcomes</p>
                <ul className="space-y-2">
                  {formData.outcomes.filter((o) => o.trim()).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-900 dark:text-white">
                      <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

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
                    Generate My Curriculum
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
