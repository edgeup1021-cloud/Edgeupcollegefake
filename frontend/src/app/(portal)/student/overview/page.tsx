"use client";

import { Crosshair, ClipboardText, CalendarCheck, BookOpen, Robot, Briefcase, Heart } from "@phosphor-icons/react";
import WelcomeCard from "@/src/components/cards/WelcomeCard";
import StatCard from "@/src/components/cards/StatCard";
import QuickAccessCard from "@/src/components/cards/QuickAccessCard";
import ScheduleCard from "@/src/components/cards/ScheduleCard";
import DeadlinesCard from "@/src/components/cards/DeadlinesCard";

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
