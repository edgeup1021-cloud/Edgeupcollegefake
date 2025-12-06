"use client";

import { BookOpen, ClipboardList, Users, GraduationCap, BarChart3, ClipboardCheck, TrendingUp, LayoutGrid } from "lucide-react";
import WelcomeCard from "@/components/common/cards/WelcomeCard";
import StatCard from "@/components/common/cards/StatCard";
import QuickAccessCard from "@/components/common/cards/QuickAccessCard";
import ScheduleCard from "@/components/common/cards/ScheduleCard";
import DeadlinesCard from "@/components/common/cards/DeadlinesCard";
import { useTeacherDashboard } from "@/hooks/teacher";
import { useAuth } from "@/hooks/useAuth";
import type { TeacherDashboardScheduleItem, TeacherDeadline } from "@/types/teacher.types";

const teacherQuickAccessItems = [
  {
    icon: Users,
    title: "Class Operations",
    href: "/teacher/classroom",
    description: "Manage your classes and schedules",
  },
  {
    icon: ClipboardList,
    title: "Tasks & Assignments",
    href: "/teacher/classroom/tasks-assignments",
    description: "Create and manage student assignments",
  },
  {
    icon: BookOpen,
    title: "Content & Curriculum",
    href: "/teacher/curriculum",
    description: "Manage course content and curriculum",
  },
  {
    icon: GraduationCap,
    title: "Student Development",
    href: "/teacher/students",
    description: "Track and support student progress",
  },
  {
    icon: TrendingUp,
    title: "Professional Learning",
    href: "/teacher/growth",
    description: "Enhance your teaching skills",
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
function mapScheduleItem(item: TeacherDashboardScheduleItem) {
  return {
    time: item.time,
    period: item.period,
    title: item.title,
    type: item.type,
    duration: item.duration,
    room: item.room,
  };
}

// Map deadline item to component props
function mapDeadlineItem(item: TeacherDeadline) {
  // Map backend deadline types to frontend component types
  const typeMap: Record<string, "Assignment" | "Project" | "Exam" | "Career"> = {
    grading: "Assignment",
    administrative: "Project",
    exam: "Exam", 
    meeting: "Career", // Using Career as a general "important" type
  };

  return {
    title: item.title,
    type: typeMap[item.type] || "Assignment",
    date: formatDeadlineDate(item.dueDate),
    description: item.description,
    daysLeft: item.daysLeft,
  };
}

export default function TeacherOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { dashboard, loading, error, refresh } = useTeacherDashboard();

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Teacher Overview
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
          Teacher Overview
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
          Teacher Overview
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
    course: `${dashboard.profile.designation} - ${dashboard.profile.department}`,
    college: dashboard.profile.college,
  };

  const scheduleItems = dashboard.schedule.map(mapScheduleItem);
  const deadlineItems = dashboard.deadlines.map(mapDeadlineItem);

  return (
    <div className="space-y-6">
      {/* Row 1: Welcome Card + Attendance Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <WelcomeCard
            name={userData.name}
            course={userData.course}
            college={userData.college}
          />
        </div>
        <div className="lg:col-span-1">
          <StatCard
            icon={BarChart3}
            label={dashboard.stats.attendanceRate.label}
            value={dashboard.stats.attendanceRate.value}
            total={dashboard.stats.attendanceRate.total}
            unit={dashboard.stats.attendanceRate.unit}
            variant="success"
          />
        </div>
      </div>

      {/* Row 2: Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={GraduationCap}
          label={dashboard.stats.classesToday.label}
          value={dashboard.stats.classesToday.value}
          total={dashboard.stats.classesToday.total}
          variant="default"
        />
        <StatCard
          icon={Users}
          label={dashboard.stats.totalStudents.label}
          value={dashboard.stats.totalStudents.value}
          total={dashboard.stats.totalStudents.total}
          variant="default"
        />
        <StatCard
          icon={ClipboardList}
          label={dashboard.stats.assignmentsToGrade.label}
          value={dashboard.stats.assignmentsToGrade.value}
          total={dashboard.stats.assignmentsToGrade.total}
          variant="warning"
        />
      </div>

      {/* Row 3: Schedule */}
      <div className="grid grid-cols-1">
        <ScheduleCard date={formattedDate} items={scheduleItems} />
      </div>

      {/* Row 4: Quick Access Cards - All 6 in balanced layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacherQuickAccessItems.map((item) => (
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
      <div className="grid grid-cols-1">
        <DeadlinesCard items={deadlineItems} />
      </div>
    </div>
  );
}