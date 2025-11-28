"use client";

import { Crosshair, ClipboardText, CalendarCheck, BookOpen, Robot, Briefcase, Heart } from "@phosphor-icons/react";
import WelcomeCard from "@/src/components/common/cards/WelcomeCard";
import StatCard from "@/src/components/common/cards/StatCard";
import QuickAccessCard from "@/src/components/common/cards/QuickAccessCard";
import ScheduleCard from "@/src/components/common/cards/ScheduleCard";
import DeadlinesCard from "@/src/components/common/cards/DeadlinesCard";
import { useStudentOverview } from "@/src/hooks/student/useStudents";

// Mock data - replace with real data from API
const userData = {
  name: "Aravind Kumar",
  course: "B.Tech Computer Science - Year 3",
  college: "MIT College of Engineering",
};

const stats = {
  dailyGoal: { value: 3, total: 4, unit: "hours" },
  testsToday: { value: 2, total: 3, unit: "tests" },
  attendance: { value: 92, total: 100, unit: "%" },
};

const scheduleItems = [
  {
    time: "9",
    period: "AM" as const,
    title: "Data Structures & Algorithms",
    type: "Lecture" as const,
    duration: "1 hour",
    room: "Room 301",
  },
  {
    time: "11",
    period: "AM" as const,
    title: "Database Management Systems Lab",
    type: "Lab" as const,
    duration: "2 hours",
    room: "Computer Lab 2",
  },
  {
    time: "3",
    period: "PM" as const,
    title: "Software Engineering",
    type: "Lecture" as const,
    duration: "1 hour",
    room: "Room 205",
  },
];

const deadlineItems = [
  {
    title: "DSA Assignment - Graph Algorithms",
    type: "Assignment" as const,
    date: "December 18, 2024",
    description: "Implement BFS and DFS algorithms",
    daysLeft: 3,
  },
  {
    title: "DBMS Project Submission",
    type: "Project" as const,
    date: "December 22, 2024",
    description: "Library management system with SQL",
    daysLeft: 7,
  },
  {
    title: "Internal Assessment - Operating Systems",
    type: "Exam" as const,
    date: "January 5, 2025",
    description: "Covers Process Management & Scheduling",
    daysLeft: 21,
  },
  {
    title: "Internship Application - TechCorp",
    type: "Career" as const,
    date: "January 15, 2025",
    description: "Summer internship opportunity",
    daysLeft: 31,
  },
];

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

export default function StudentOverviewPage() {
  const { overview, loading, error, refresh } = useStudentOverview();

  if (loading) {
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
            Failed to load overview data: {error}
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

  const stats = [
    {
      label: 'Total Students',
      value: overview?.totalStudents ?? 0,
      icon: '👥',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active Students',
      value: overview?.activeStudents ?? 0,
      icon: '✅',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Suspended',
      value: overview?.suspendedStudents ?? 0,
      icon: '⚠️',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Graduated',
      value: overview?.graduatedStudents ?? 0,
      icon: '🎓',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

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
