import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAttendanceHistory } from "@/services/student-attendance.service";
import { useAuth } from "@/contexts/AuthContext";
import type { AttendanceDay } from "@/types/student-attendance.types";

interface AttendanceCalendarProps {
  calendar: {
    month: number;
    year: number;
    days: AttendanceDay[];
  };
  onMonthChange?: () => void;
}

export function AttendanceCalendar({ calendar: initialCalendar }: AttendanceCalendarProps) {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(initialCalendar.month);
  const [currentYear, setCurrentYear] = useState(initialCalendar.year);
  const [days, setDays] = useState<AttendanceDay[]>(initialCalendar.days);
  const [loading, setLoading] = useState(false);

  // Load attendance data when month/year changes
  useEffect(() => {
    if (user?.id && (currentMonth !== initialCalendar.month || currentYear !== initialCalendar.year)) {
      loadAttendanceForMonth();
    }
  }, [currentMonth, currentYear, user]);

  const loadAttendanceForMonth = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const history = await getAttendanceHistory(user.id, currentMonth, currentYear);
      const attendanceDays: AttendanceDay[] = history.map(record => ({
        date: record.date,
        status: record.status,
        sessionTitle: record.sessionTitle,
        sessionTime: record.sessionTime,
        markedBy: record.markedBy,
      }));
      setDays(attendanceDays);
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Month name
  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Create attendance map for quick lookup
  const attendanceMap = new Map<string, AttendanceDay>();
  days.forEach((day) => {
    const date = new Date(day.date).getDate();
    attendanceMap.set(date.toString(), day);
  });

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-14 md:h-16" />);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const attendance = attendanceMap.get(day.toString());
    const date = new Date(currentYear, currentMonth - 1, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    let bgColor = "bg-gray-100 dark:bg-gray-800";
    let textColor = "text-gray-400 dark:text-gray-600";
    let borderClass = "";
    let title = "";

    if (attendance) {
      switch (attendance.status) {
        case "present":
          bgColor = "bg-green-100 dark:bg-green-900/30";
          borderClass = "border-2 border-green-500";
          textColor = "text-green-700 dark:text-green-300 font-semibold";
          title = `Present - ${attendance.sessionTitle}`;
          break;
        case "absent":
          bgColor = "bg-red-100 dark:bg-red-900/30";
          borderClass = "border-2 border-red-500";
          textColor = "text-red-700 dark:text-red-300 font-semibold";
          title = `Absent - ${attendance.sessionTitle}`;
          break;
        case "late":
          bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
          borderClass = "border-2 border-yellow-500";
          textColor = "text-yellow-700 dark:text-yellow-300 font-semibold";
          title = `Late - ${attendance.sessionTitle}`;
          break;
        case "excused":
          bgColor = "bg-blue-100 dark:bg-blue-900/30";
          borderClass = "border-2 border-blue-500";
          textColor = "text-blue-700 dark:text-blue-300 font-semibold";
          title = `Excused - ${attendance.sessionTitle}`;
          break;
      }
    } else if (isWeekend) {
      bgColor = "bg-gray-50 dark:bg-gray-900";
      textColor = "text-gray-300 dark:text-gray-700";
    }

    if (isToday && !attendance) {
      borderClass = "border-2 border-primary";
    }

    calendarDays.push(
      <div
        key={day}
        className={`h-14 md:h-16 flex items-center justify-center rounded ${bgColor} ${textColor} ${borderClass} text-sm md:text-base cursor-pointer transition-all hover:scale-105`}
        title={title}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          disabled={loading}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <h3 className="text-xl font-semibold">{monthName}</h3>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          disabled={loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs md:text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">{calendarDays}</div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t dark:border-gray-700 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-red-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500" />
              <span className="text-xs md:text-sm text-muted-foreground">Excused</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
