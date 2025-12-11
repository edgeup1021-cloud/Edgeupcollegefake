"use client";

import { Users, GraduationCap, TrendingUp, Building2, UserCheck } from "lucide-react";
import WelcomeCard from "@/components/common/cards/WelcomeCard";
import StatCard from "@/components/common/cards/StatCard";
import QuickAccessCard from "@/components/common/cards/QuickAccessCard";
import { useAuth } from "@/hooks/useAuth";
import { useManagementDashboard } from "@/hooks/management";

export default function ManagementOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { dashboard, loading: dashboardLoading, error: dashboardError } = useManagementDashboard();

  if (authLoading || dashboardLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Management Overview
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

  if (!user) {
    return null;
  }

  const displayUserData = {
    name: dashboard?.profile?.name || user?.fullName || user?.username || "Loading...",
    course: dashboard?.profile?.designation || (user?.role === 'admin' ? 'Administrator' : user?.role || 'Administrator'),
    college: dashboard?.institution?.name || "Loading...",
  };

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
        label="Total Students"
        value={dashboard?.stats?.totalStudents ?? 0}
        total={0}
        variant="default"
      />

      {/* Row 2: Statistics Cards */}
      <StatCard
        icon={GraduationCap}
        label="Total Faculty"
        value={dashboard?.stats?.totalTeachers ?? 0}
        total={0}
        variant="default"
      />
      <StatCard
        icon={UserCheck}
        label="Attendance Rate"
        value={dashboard?.stats?.attendanceRate ?? 0}
        total={100}
        unit="%"
        variant="success"
      />
      <StatCard
        icon={TrendingUp}
        label="Active Classes"
        value={dashboard?.stats?.activeClasses ?? 0}
        total={0}
        variant="warning"
      />

      {/* Row 3: Quick Access Cards */}
      <QuickAccessCard
        icon={Building2}
        title="Institutional Health"
        href="/management/institutional-health/academic-performance"
        description="Monitor overall institutional metrics"
      />
      <QuickAccessCard
        icon={TrendingUp}
        title="Predictive Intelligence"
        href="/management/predictive-intelligence/enrollment-prediction"
        description="AI-powered insights and predictions"
      />
      <QuickAccessCard
        icon={UserCheck}
        title="Risk Mitigation"
        href="/management/risk-mitigation/risk-dashboard"
        description="Identify and manage potential risks"
      />
      <QuickAccessCard
        icon={GraduationCap}
        title="Financial Management"
        href="/management/financial-management"
        description="Track finances and budgets"
      />
    </div>
  );
}
