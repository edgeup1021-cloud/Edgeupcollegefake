"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AttendanceHistoryTable } from "./AttendanceHistoryTable";
import { getAttendanceHistory } from "@/services/student-attendance.service";
import { useAuth } from "@/contexts/AuthContext";
import type { AttendanceHistory } from "@/types/student-attendance.types";

export function HistoryTab() {
  const { user } = useAuth();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1); // 1-12
  const [year, setYear] = useState(currentDate.getFullYear());
  const [history, setHistory] = useState<AttendanceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user, month, year]);

  const loadHistory = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getAttendanceHistory(user.id, month, year);
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance history");
    } finally {
      setLoading(false);
    }
  };

  // Generate month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate year options (current year and 2 years back)
  const years = [];
  for (let i = 0; i < 3; i++) {
    years.push(currentDate.getFullYear() - i);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filter by Month & Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing day-wise attendance for{" "}
            {months.find((m) => m.value === month)?.label} {year}
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">{error}</Alert>
          ) : (
            <AttendanceHistoryTable history={history} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
