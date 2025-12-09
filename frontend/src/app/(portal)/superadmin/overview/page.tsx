"use client";

import { Users, GraduationCap, Building2, BookOpen } from "lucide-react";
import WelcomeCard from "@/components/common/cards/WelcomeCard";
import StatCard from "@/components/common/cards/StatCard";
import QuickAccessCard from "@/components/common/cards/QuickAccessCard";
import { useAuth } from "@/hooks/useAuth";

// Temporary mock data - will be replaced with API call
const userData = {
  name: "System Administrator",
  course: "Super Administrator",
  college: "EdgeUp College System",
};

const stats = {
  totalStudents: { label: "Total Students", value: 0, total: 0 },
  totalTeachers: { label: "Total Teachers", value: 0, total: 0 },
  totalInstitutes: { label: "Total Institutes", value: 0, total: 0 },
  totalCourses: { label: "Total Courses", value: 0, total: 0 },
};

const quickAccessItems = [
  {
    icon: BookOpen,
    title: "Course Management",
    href: "/superadmin/course",
    description: "Manage courses and curriculum",
  },
  {
    icon: Users,
    title: "Role Management",
    href: "/superadmin/role",
    description: "Configure user roles and permissions",
  },
  {
    icon: Building2,
    title: "Institute Management",
    href: "/superadmin/institute",
    description: "Manage institutions and campuses",
  },
  {
    icon: GraduationCap,
    title: "Admin Logs",
    href: "/superadmin/admin-logs",
    description: "View system activity logs",
  },
];

export default function SuperadminOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Superadmin Overview
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

  const displayUserData = user ? {
    name: `${user.firstName} ${user.lastName}`,
    course: "Super Administrator",
    college: "EdgeUp College System",
  } : userData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Row 1: Welcome Card (span 3) + Total Students Stat (span 1) */}
      <div className="col-span-full md:col-span-2 lg:col-span-3">
        <WelcomeCard
          name={displayUserData.name}
          course={displayUserData.course}
          college={displayUserData.college}
        />
      </div>
      <StatCard
        icon={Users}
        label={stats.totalStudents.label}
        value={stats.totalStudents.value}
        total={stats.totalStudents.total}
        variant="default"
      />

      {/* Row 2: Statistics Cards */}
      <StatCard
        icon={GraduationCap}
        label={stats.totalTeachers.label}
        value={stats.totalTeachers.value}
        total={stats.totalTeachers.total}
        variant="default"
      />
      <StatCard
        icon={Building2}
        label={stats.totalInstitutes.label}
        value={stats.totalInstitutes.value}
        total={stats.totalInstitutes.total}
        variant="success"
      />
      <StatCard
        icon={BookOpen}
        label={stats.totalCourses.label}
        value={stats.totalCourses.value}
        total={stats.totalCourses.total}
        variant="warning"
      />

      {/* Row 3: Quick Access Cards */}
      {quickAccessItems.map((item) => (
        <QuickAccessCard
          key={item.href}
          icon={item.icon}
          title={item.title}
          href={item.href}
          description={item.description}
        />
      ))}
    </div>
  );
}
