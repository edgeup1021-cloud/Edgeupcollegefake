"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AttendanceCalendar } from "./AttendanceCalendar";
import { AttendanceStats } from "./AttendanceStats";
import { getAttendanceOverview } from "@/services/student-attendance.service";
import { useAuth } from "@/contexts/AuthContext";
import type { AttendanceOverview } from "@/types/student-attendance.types";

export function OverviewTab() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<AttendanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadOverview();
    }
  }, [user]);

  const loadOverview = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getAttendanceOverview(user.id);
      setOverview(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance overview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  if (!overview) {
    return <Alert>No attendance data available</Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <AttendanceStats statistics={overview.statistics} />

      {/* Calendar - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceCalendar
            calendar={overview.calendar}
            onMonthChange={loadOverview}
          />
        </CardContent>
      </Card>
    </div>
  );
}
