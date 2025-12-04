import { CheckCircle, XCircle, Clock, Coffee } from "lucide-react";
import type { AttendanceHistory } from "@/types/student-attendance.types";

interface RecentAttendanceProps {
  records: AttendanceHistory[];
}

export function RecentAttendance({ records }: RecentAttendanceProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent attendance records
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "excused":
        return <Coffee className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 dark:text-green-400";
      case "absent":
        return "text-red-600 dark:text-red-400";
      case "late":
        return "text-yellow-600 dark:text-yellow-400";
      case "excused":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {records.map((record, index) => {
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border dark:border-gray-700 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(record.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{record.sessionTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {formattedDate} • {record.sessionTime}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${getStatusColor(
                    record.status
                  )}`}
                >
                  {getStatusLabel(record.status)}
                </span>
              </div>
              {record.remarks && (
                <p className="text-xs text-muted-foreground mt-1">
                  {record.remarks}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
