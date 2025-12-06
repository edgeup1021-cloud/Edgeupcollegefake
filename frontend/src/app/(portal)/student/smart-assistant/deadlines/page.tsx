"use client";

import { useState } from "react";
import {
  Clock,
  CalendarCheck,
  Warning,
  CheckCircle,
  Plus,
  Target,
  Lightbulb,
  TrendUp,
  BookOpen,
  Fire,
  X,
  Sparkle,
  Timer,
  FileText,
  Folder,
  Exam,
  PresentationChart,
  Flask,
  Article,
  Question,
  Play,
  Pause,
  ArrowLeft,
  Lightning,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============ TYPES ============
type DeadlineType =
  | "assignment"
  | "project"
  | "exam"
  | "quiz"
  | "presentation"
  | "lab"
  | "research";

type DeadlineStatus = "not-started" | "in-progress" | "completed" | "overdue";
type DeadlinePriority = "high" | "medium" | "low";

interface Deadline {
  id: number;
  title: string;
  subject: string;
  type: DeadlineType;
  dueDate: string;
  dueTime: string;
  status: DeadlineStatus;
  priority: DeadlinePriority;
  description: string;
  estimatedHours: number;
  completedPercentage: number;
  isSystemGenerated: boolean;
  aiInsights: {
    suggestedStartDate: string;
    timeToComplete: string;
    priorityReason: string;
    tips: string[];
    resources?: string[];
  };
}

interface FocusStep {
  id: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  isCompleted: boolean;
}

// ============ MOCK DATA ============
const mockDeadlines: Deadline[] = [
  {
    id: 1,
    title: "Calculus Assignment 5",
    subject: "Mathematics",
    type: "assignment",
    dueDate: "Dec 5, 2025",
    dueTime: "11:59 PM",
    status: "in-progress",
    priority: "high",
    description: "Complete problems 1-20 from Chapter 5 on Integration",
    estimatedHours: 4,
    completedPercentage: 35,
    isSystemGenerated: true,
    aiInsights: {
      suggestedStartDate: "Dec 3, 2025",
      timeToComplete: "4-5 hours",
      priorityReason: "Due in 3 days with moderate complexity",
      tips: [
        "Break into 2 sessions of 2 hours each",
        "Review integration by parts before starting",
        "Problems 15-20 are more challenging - allocate extra time",
      ],
      resources: ["Khan Academy - Integration", "Professor's lecture notes"],
    },
  },
  {
    id: 2,
    title: "Data Structures Project",
    subject: "Computer Science",
    type: "project",
    dueDate: "Dec 10, 2025",
    dueTime: "5:00 PM",
    status: "in-progress",
    priority: "high",
    description: "Implement a balanced BST with AVL rotations",
    estimatedHours: 12,
    completedPercentage: 60,
    isSystemGenerated: true,
    aiInsights: {
      suggestedStartDate: "Dec 1, 2025",
      timeToComplete: "10-12 hours",
      priorityReason: "Complex project requiring multiple sessions",
      tips: [
        "Test each rotation function separately",
        "Draw tree diagrams to visualize rotations",
        "Start with insertion before deletion logic",
      ],
      resources: ["Visualgo.net - BST Visualization", "GeeksForGeeks AVL Trees"],
    },
  },
  {
    id: 3,
    title: "Physics Mid-term Exam",
    subject: "Physics",
    type: "exam",
    dueDate: "Dec 8, 2025",
    dueTime: "10:00 AM",
    status: "not-started",
    priority: "high",
    description: "Covers Chapters 1-6: Mechanics and Thermodynamics",
    estimatedHours: 15,
    completedPercentage: 0,
    isSystemGenerated: true,
    aiInsights: {
      suggestedStartDate: "Dec 2, 2025",
      timeToComplete: "15+ hours of study",
      priorityReason: "Major exam worth 25% of grade",
      tips: [
        "Create a study schedule: 2.5 hours per chapter",
        "Focus on problem-solving, not just theory",
        "Review past exam papers if available",
        "Get adequate sleep the night before",
      ],
      resources: ["Physics textbook Ch 1-6", "Practice problems set"],
    },
  },
  {
    id: 4,
    title: "Chemistry Quiz 3",
    subject: "Chemistry",
    type: "quiz",
    dueDate: "Dec 4, 2025",
    dueTime: "2:00 PM",
    status: "not-started",
    priority: "medium",
    description: "Quiz on Organic Chemistry - Alkanes and Alkenes",
    estimatedHours: 3,
    completedPercentage: 0,
    isSystemGenerated: true,
    aiInsights: {
      suggestedStartDate: "Dec 3, 2025",
      timeToComplete: "2-3 hours",
      priorityReason: "Short quiz but tomorrow",
      tips: [
        "Focus on naming conventions",
        "Practice drawing structural formulas",
        "Review reaction mechanisms",
      ],
    },
  },
 
  {
    id: 8,
    title: "Math Practice Problems",
    subject: "Mathematics",
    type: "assignment",
    dueDate: "Dec 3, 2025",
    dueTime: "8:00 AM",
    status: "overdue",
    priority: "high",
    description: "Complete practice set for derivatives",
    estimatedHours: 2,
    completedPercentage: 80,
    isSystemGenerated: false,
    aiInsights: {
      suggestedStartDate: "Dec 1, 2025",
      timeToComplete: "30 minutes remaining",
      priorityReason: "OVERDUE - Complete immediately",
      tips: [
        "Focus on remaining 20%",
        "Submit partial work if needed",
        "Contact instructor about extension",
      ],
    },
  },
];

const mockFocusSteps: FocusStep[] = [
  {
    id: 1,
    title: "Review Chapter 5 Notes",
    description: "Go through your class notes on integration techniques",
    estimatedMinutes: 20,
    isCompleted: true,
  },
  {
    id: 2,
    title: "Watch Khan Academy Video",
    description: "Integration by Parts tutorial (15 min)",
    estimatedMinutes: 15,
    isCompleted: true,
  },
  {
    id: 3,
    title: "Complete Problems 1-5",
    description: "Basic integration problems to warm up",
    estimatedMinutes: 30,
    isCompleted: false,
  },
  {
    id: 4,
    title: "Complete Problems 6-10",
    description: "Intermediate difficulty problems",
    estimatedMinutes: 40,
    isCompleted: false,
  },
  {
    id: 5,
    title: "Take a Break",
    description: "Rest for 10-15 minutes",
    estimatedMinutes: 10,
    isCompleted: false,
  },
  {
    id: 6,
    title: "Complete Problems 11-15",
    description: "More challenging integration problems",
    estimatedMinutes: 45,
    isCompleted: false,
  },
  {
    id: 7,
    title: "Complete Problems 16-20",
    description: "Most difficult problems - take your time",
    estimatedMinutes: 60,
    isCompleted: false,
  },
  {
    id: 8,
    title: "Review & Submit",
    description: "Double-check your work and submit",
    estimatedMinutes: 20,
    isCompleted: false,
  },
];

// ============ HELPER FUNCTIONS ============
const getTypeIcon = (type: DeadlineType) => {
  switch (type) {
    case "assignment":
      return FileText;
    case "project":
      return Folder;
    case "exam":
      return Exam;
    case "quiz":
      return Question;
    case "presentation":
      return PresentationChart;
    case "lab":
      return Flask;
    case "research":
      return Article;
    default:
      return FileText;
  }
};

const getTypeLabel = (type: DeadlineType) => {
  const labels: Record<DeadlineType, string> = {
    assignment: "Assignment",
    project: "Project",
    exam: "Exam",
    quiz: "Quiz",
    presentation: "Presentation",
    lab: "Lab Work",
    research: "Research",
  };
  return labels[type];
};

const getTypeColor = (type: DeadlineType) => {
  const colors: Record<DeadlineType, string> = {
    assignment: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    project: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    exam: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    quiz: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    presentation: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    lab: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    research: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  };
  return colors[type];
};

const getPriorityColor = (priority: DeadlinePriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    case "medium":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    case "low":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
  }
};

const getStatusColor = (status: DeadlineStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "in-progress":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "not-started":
      return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    case "overdue":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  }
};

const getStatusLabel = (status: DeadlineStatus) => {
  const labels: Record<DeadlineStatus, string> = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
    overdue: "Overdue",
  };
  return labels[status];
};

// ============ SUB-COMPONENTS ============

// Stat Card
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Deadline Item
function DeadlineItem({
  deadline,
  isSelected,
  onClick,
}: {
  deadline: Deadline;
  isSelected: boolean;
  onClick: () => void;
}) {
  const TypeIcon = getTypeIcon(deadline.type);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-left transition-all",
        "border",
        "hover:bg-gray-100 dark:hover:bg-gray-700/50",
        isSelected
          ? "bg-brand-primary/10 dark:bg-brand-primary/20 border-brand-primary"
          : "bg-gray-50/80 dark:bg-gray-700/30 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", getTypeColor(deadline.type))}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {deadline.title}
            </h4>
            <span className={cn("text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium capitalize", getPriorityColor(deadline.priority))}>
              {deadline.priority}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">{deadline.subject}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{deadline.dueDate}</span>
            {deadline.status !== "completed" && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className={cn("text-xs px-2 py-0.5 rounded font-medium", getStatusColor(deadline.status))}>
                  {deadline.completedPercentage}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// AI Insights Panel
function AIInsightsPanel({ deadline }: { deadline: Deadline }) {
  return (
    <div className="space-y-4">
      {/* AI Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
        <Sparkle className="w-5 h-5 text-brand-secondary" />
        <span className="text-base font-semibold text-gray-900 dark:text-white">AI Insights</span>
      </div>

      {/* Start Date + Time + Priority Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarCheck className="w-4 h-4 text-brand-primary" />
            <span className="text-xs text-brand-primary font-medium">Start By</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {deadline.aiInsights.suggestedStartDate.replace(", 2025", "")}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Time</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {deadline.aiInsights.timeToComplete}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendUp className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Priority</span>
          </div>
          <p className={cn("text-sm font-semibold capitalize",
            deadline.priority === "high" ? "text-red-600 dark:text-red-400" :
            deadline.priority === "medium" ? "text-amber-600 dark:text-amber-400" :
            "text-green-600 dark:text-green-400"
          )}>
            {deadline.priority}
          </p>
        </div>
      </div>

      {/* Priority Reason */}
      <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Why this priority?</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {deadline.aiInsights.priorityReason}
        </p>
      </div>

      {/* Tips */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-brand-secondary" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tips</span>
        </div>
        <ul className="space-y-2">
          {deadline.aiInsights.tips.slice(0, 3).map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-5 h-5 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs flex items-center justify-center flex-shrink-0 font-medium">
                {index + 1}
              </span>
              <span className="line-clamp-2">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      {deadline.aiInsights.resources && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Resources</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {deadline.aiInsights.resources.map((resource, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Workload Warning
function WorkloadWarning() {
  return (
    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3 h-full">
      <Warning className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <p className="text-sm text-amber-700 dark:text-amber-400">
        <span className="font-semibold">Heavy Workload:</span> 4 deadlines between Dec 4-8. Start Physics exam prep today.
      </p>
    </div>
  );
}

// Focus Mode View
function FocusModeView({
  deadline,
  steps,
  onExit,
}: {
  deadline: Deadline;
  steps: FocusStep[];
  onExit: () => void;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    steps.findIndex((s) => !s.isCompleted) || 0
  );
  const [isPaused, setIsPaused] = useState(false);
  const [localSteps, setLocalSteps] = useState(steps);

  const currentStep = localSteps[currentStepIndex];
  const completedSteps = localSteps.filter((s) => s.isCompleted).length;
  const totalMinutes = localSteps.reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const completedMinutes = localSteps
    .filter((s) => s.isCompleted)
    .reduce((acc, s) => acc + s.estimatedMinutes, 0);

  const handleCompleteStep = () => {
    const newSteps = [...localSteps];
    newSteps[currentStepIndex].isCompleted = true;
    setLocalSteps(newSteps);
    if (currentStepIndex < localSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onExit} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Exit Focus Mode
          </Button>
          <div className="flex items-center gap-2">
            <Lightning className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Focus Mode</span>
          </div>
        </div>

        {/* Deadline Info */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {deadline.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {deadline.subject} • Due: {deadline.dueDate} at {deadline.dueTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-primary">
                  {completedSteps}/{localSteps.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Steps Complete</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Overall Progress</span>
                <span>{completedMinutes} / {totalMinutes} min</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${(completedMinutes / totalMinutes) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-xs text-brand-secondary font-medium mb-2">
              <Fire className="w-4 h-4" />
              CURRENT STEP ({currentStepIndex + 1} of {localSteps.length})
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentStep?.title || "All steps completed!"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStep?.description || "Great job! You've completed all steps."}
            </p>
            {currentStep && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Timer className="w-4 h-4" />
                  Est. {currentStep.estimatedMinutes} minutes
                </div>
              </div>
            )}

            {currentStep && (
              <div className="flex items-center gap-3 mt-6">
                <Button
                  onClick={handleCompleteStep}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPaused(!isPaused)}
                  className="gap-2"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps List */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-base">All Steps</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {localSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    index === currentStepIndex
                      ? "bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary"
                      : "bg-gray-50/80 dark:bg-gray-700/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                      step.isCompleted
                        ? "bg-green-500 text-white"
                        : index === currentStepIndex
                        ? "bg-brand-primary text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.isCompleted ? (
                      <CheckCircle className="w-4 h-4" weight="bold" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        step.isCompleted
                          ? "text-gray-400 dark:text-gray-500 line-through"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.estimatedMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Create Deadline Modal
function CreateDeadlineModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<DeadlineType>("assignment");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<DeadlinePriority>("medium");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Deadline
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Chapter 5 Problems"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics"
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DeadlineType)}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              >
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
                <option value="quiz">Quiz</option>
                <option value="presentation">Presentation</option>
                <option value="lab">Lab Work</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Time *</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <div className="flex gap-2 mt-1">
              {(["low", "medium", "high"] as DeadlinePriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border",
                    priority === p
                      ? p === "high"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800"
                        : p === "medium"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                        : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or details..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
            Add Deadline
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function DeadlinesPage() {
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(mockDeadlines[0]);
  const [filterType, setFilterType] = useState<DeadlineType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<DeadlineStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Calculate stats
  const stats = {
    total: mockDeadlines.length,
    dueThisWeek: mockDeadlines.filter(
      (d) => d.status !== "completed" && d.status !== "overdue"
    ).length,
    overdue: mockDeadlines.filter((d) => d.status === "overdue").length,
    completed: mockDeadlines.filter((d) => d.status === "completed").length,
  };

  // Filter deadlines
  const filteredDeadlines = mockDeadlines.filter((d) => {
    if (filterType !== "all" && d.type !== filterType) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    return true;
  });

  if (isFocusMode && selectedDeadline) {
    return (
      <FocusModeView
        deadline={selectedDeadline}
        steps={mockFocusSteps}
        onExit={() => setIsFocusMode(false)}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 flex items-center justify-center">
            <Clock className="w-7 h-7 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deadline Tracker</h1>
            <p className="text-base text-gray-500 dark:text-gray-400">AI-powered task management</p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="bg-brand-primary hover:bg-brand-primary/90 text-white text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Deadline
        </Button>
      </div>

      {/* Stats Cards + Warning Row */}
      <div className="flex flex-col lg:flex-row gap-3 flex-shrink-0">
        <div className="grid grid-cols-4 gap-3 flex-1">
          <StatCard
            icon={CalendarCheck}
            label="Total"
            value={stats.total}
            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={Clock}
            label="This Week"
            value={stats.dueThisWeek}
            color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Warning}
            label="Overdue"
            value={stats.overdue}
            color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          />
          <StatCard
            icon={CheckCircle}
            label="Done"
            value={stats.completed}
            color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          />
        </div>
        <div className="lg:w-96 flex-shrink-0">
          <WorkloadWarning />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
        {/* Deadlines List */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col flex-1 min-h-0">
            <CardHeader className="py-4 px-5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">All Deadlines</CardTitle>
                <div className="flex items-center gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as DeadlineType | "all")}
                    className="px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="presentation">Presentation</option>
                    <option value="lab">Lab</option>
                    <option value="research">Research</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as DeadlineStatus | "all")}
                    className="px-4 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-auto">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {filteredDeadlines.length === 0 ? (
                  <div className="text-center py-12 col-span-2">
                    <CalendarCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-base text-gray-500 dark:text-gray-400">No deadlines found</p>
                  </div>
                ) : (
                  filteredDeadlines.map((deadline) => (
                    <DeadlineItem
                      key={deadline.id}
                      deadline={deadline}
                      isSelected={selectedDeadline?.id === deadline.id}
                      onClick={() => setSelectedDeadline(deadline)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:w-96 flex-shrink-0 flex flex-col min-h-0">
          {selectedDeadline ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex-1 flex flex-col">
              <CardContent className="p-5 flex-1 overflow-hidden">
                <AIInsightsPanel deadline={selectedDeadline} />

                {/* Focus Mode Button */}
                {selectedDeadline.status !== "completed" && (
                  <Button
                    onClick={() => setIsFocusMode(true)}
                    size="lg"
                    className="w-full mt-5 bg-gradient-to-r from-brand-secondary to-brand-primary hover:opacity-90 text-white gap-2 text-base"
                  >
                    <Lightning className="w-5 h-5" />
                    Focus Mode
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex-1">
              <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                <Sparkle className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Select a deadline for AI insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Deadline Modal */}
      <CreateDeadlineModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
