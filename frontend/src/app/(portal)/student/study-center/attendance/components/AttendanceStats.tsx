import { CheckCircle, XCircle, Clock, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AttendanceStatistics } from "@/types/student-attendance.types";

interface AttendanceStatsProps {
  statistics: AttendanceStatistics;
}

export function AttendanceStats({ statistics }: AttendanceStatsProps) {
  const stats = [
    {
      label: "Days Present",
      value: statistics.daysPresent,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Days Absent",
      value: statistics.daysAbsent,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Days Late",
      value: statistics.daysLate,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      label: "Attendance %",
      value: `${statistics.attendancePercentage}%`,
      icon: Coffee,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
