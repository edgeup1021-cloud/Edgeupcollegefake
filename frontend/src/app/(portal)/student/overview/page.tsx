"use client";

import { Crosshair, ClipboardText, CalendarCheck, BookOpen, Robot, Briefcase, Heart } from "@phosphor-icons/react";
import WelcomeCard from "@/components/common/cards/WelcomeCard";
import StatCard from "@/components/common/cards/StatCard";
import QuickAccessCard from "@/components/common/cards/QuickAccessCard";
import ScheduleCard from "@/components/common/cards/ScheduleCard";
import DeadlinesCard from "@/components/common/cards/DeadlinesCard";
import { useStudentDashboard } from "@/hooks/student/useStudents";
import { useAuth } from "@/hooks/useAuth";
import type { StudentDashboardScheduleItem, StudentDashboardDeadline } from "@/types/student.types";

const quickAccessItems = [
  {
    icon: BookOpen,
    title: "Study Center",
    href: "/student/study-center",
    description: "Access courses",
  },
  {
    icon: Robot,
    title: "Smart Assistant",
    href: "/student/smart-assistant",
    description: "AI-powered help",
  },
  {
    icon: Briefcase,
    title: "Career Guide",
    href: "/student/career-placement-guide",
    description: "Plan your career",
  },
  {
    icon: Heart,
    title: "Wellness",
    href: "/student/mental-health-wellness",
    description: "Mental health",
  },
];

// Get formatted date
const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Helper to format deadline date
function formatDeadlineDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Map schedule item to component props
function mapScheduleItem(item: StudentDashboardScheduleItem) {
  // Map backend session types to frontend component types
  const typeMap: Record<string, "Lecture" | "Lab" | "Tutorial"> = {
    Lecture: "Lecture",
    Lab: "Lab",
    Tutorial: "Tutorial",
    Seminar: "Lecture", // Map seminar to lecture as fallback
  };

  return {
    time: item.time,
    period: item.period,
    title: item.title,
    type: typeMap[item.type] || "Lecture",
    duration: item.duration,
    room: item.room || "TBD",
  };
}

// Map deadline item to component props
function mapDeadlineItem(item: StudentDashboardDeadline) {
  // Map backend assignment types to frontend component types
  const typeMap: Record<string, "Assignment" | "Project" | "Exam" | "Career"> = {
    assignment: "Assignment",
    Assignment: "Assignment",
    project: "Project",
    Project: "Project",
    exam: "Exam",
    Exam: "Exam",
    quiz: "Exam",
    Quiz: "Exam",
    career: "Career",
    Career: "Career",
  };

  return {
    title: item.title,
    type: typeMap[item.type] || "Assignment",
    date: formatDeadlineDate(item.dueDate),
    description: item.description || "",
    daysLeft: item.daysLeft,
  };
}

export default function StudentOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { dashboard, loading, error, refresh } = useStudentDashboard(user?.id ?? null);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Failed to load dashboard data: {error}
          </p>
          <button
            onClick={refresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400">
            Please log in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Extract data from dashboard
  const userData = {
    name: `${dashboard.profile.firstName} ${dashboard.profile.lastName}`,
    course: dashboard.profile.program || "Program not set",
    college: dashboard.profile.college || "College not set",
  };

  const stats = {
    dailyGoal: {
      value: dashboard.stats.dailyGoal.current,
      total: dashboard.stats.dailyGoal.target,
      unit: "hours",
    },
    testsToday: {
      value: dashboard.stats.testsToday.completed,
      total: dashboard.stats.testsToday.total,
      unit: "tests",
    },
    attendance: {
      value: dashboard.stats.attendance.percentage,
      total: 100,
      unit: "%",
    },
  };

  const scheduleItems = dashboard.schedule.map(mapScheduleItem);
  const deadlineItems = dashboard.deadlines.map(mapDeadlineItem);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1: Welcome Card (span 3) + Attendance Stat (span 1) */}
      <WelcomeCard
        name={userData.name}
        course={userData.course}
        college={userData.college}
      />
      <StatCard
        icon={CalendarCheck}
        label="Attendance"
        value={stats.attendance.value}
        total={stats.attendance.total}
        unit={stats.attendance.unit}
        variant="success"
      />

      {/* Row 2: Daily Goal + Tests Today + Quick Access (span 2) */}
      <StatCard
        icon={Crosshair}
        label="Daily Goal"
        value={stats.dailyGoal.value}
        total={stats.dailyGoal.total}
        unit={stats.dailyGoal.unit}
      />
      <StatCard
        icon={ClipboardText}
        label="Tests Today"
        value={stats.testsToday.value}
        total={stats.testsToday.total}
        unit={stats.testsToday.unit}
        variant="warning"
      />
      <div className="col-span-full md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickAccessItems.slice(0, 2).map((item) => (
          <QuickAccessCard
            key={item.href}
            icon={item.icon}
            title={item.title}
            href={item.href}
            description={item.description}
          />
        ))}
      </div>

      {/* Row 3-4: Schedule (span 2, row span 2) + Quick Access Cards + Deadlines */}
      <ScheduleCard date={formattedDate} items={scheduleItems} />

      <div className="col-span-full md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickAccessItems.slice(2, 4).map((item) => (
          <QuickAccessCard
            key={item.href}
            icon={item.icon}
            title={item.title}
            href={item.href}
            description={item.description}
          />
        ))}
      </div>

      {/* Row 5: Deadlines */}
      <DeadlinesCard items={deadlineItems} />
    </div>
  );
}
