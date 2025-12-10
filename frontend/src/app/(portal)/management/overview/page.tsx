"use client";

import { Users, GraduationCap, TrendingUp, Building2, UserCheck } from "lucide-react";
import WelcomeCard from "@/components/common/cards/WelcomeCard";
import StatCard from "@/components/common/cards/StatCard";
import QuickAccessCard from "@/components/common/cards/QuickAccessCard";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  activeClasses: number;
}

interface Institution {
  id: number;
  name: string;
  code: string;
  institutionType: string;
  collegeType: string;
  location: string;
  establishedYear: number;
}

export default function ManagementOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    attendanceRate: 0,
    activeClasses: 0,
  });
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingInstitution, setIsLoadingInstitution] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingStats(true);
        setIsLoadingInstitution(true);

        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch institution data
        try {
          const institutionResponse = await fetch('http://localhost:3001/api/management/institution', { headers });
          if (institutionResponse.ok) {
            const institutionData = await institutionResponse.json();
            setInstitution(institutionData);
          }
        } catch (error) {
          console.error("Error fetching institution:", error);
        } finally {
          setIsLoadingInstitution(false);
        }

        // Fetch dashboard stats
        try {
          const statsResponse = await fetch('http://localhost:3001/api/management/dashboard', { headers });
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats({
              totalStudents: statsData.totalStudents || 0,
              totalTeachers: statsData.totalTeachers || 0,
              attendanceRate: statsData.attendanceRate || 0,
              activeClasses: statsData.activeClasses || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoadingStats(false);
        setIsLoadingInstitution(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  if (authLoading) {
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
    name: `${user.firstName} ${user.lastName}`,
    course: user.role === 'admin' ? 'Administrator' : user.role,
    college: isLoadingInstitution
      ? "Loading..."
      : institution?.name || "No Institution Assigned",
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
        value={stats.totalStudents}
        total={0}
        variant="default"
      />

      {/* Row 2: Statistics Cards */}
      <StatCard
        icon={GraduationCap}
        label="Total Faculty"
        value={stats.totalTeachers}
        total={0}
        variant="default"
      />
      <StatCard
        icon={UserCheck}
        label="Attendance Rate"
        value={stats.attendanceRate}
        total={100}
        unit="%"
        variant="success"
      />
      <StatCard
        icon={TrendingUp}
        label="Active Classes"
        value={stats.activeClasses}
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
