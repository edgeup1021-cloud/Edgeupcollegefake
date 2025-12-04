import { CheckCircle, XCircle, Clock, Coffee } from "lucide-react";
import type { AttendanceHistory } from "@/types/student-attendance.types";

interface AttendanceHistoryTableProps {
  history: AttendanceHistory[];
}

export function AttendanceHistoryTable({ history }: AttendanceHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No attendance records found for this period
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "late":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "excused":
        return <Coffee className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <span className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Present
          </span>
        );
      case "absent":
        return (
          <span className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Absent
          </span>
        );
      case "late":
        return (
          <span className="px-3 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            Late
          </span>
        );
      case "excused":
        return (
          <span className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Excused
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Day
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Session
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Marked By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted dark:divide-gray-700">
            {history.map((record, index) => (
              <tr
                key={index}
                className="hover:bg-muted/50 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {formatDate(record.date)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {record.day}
                </td>
                <td className="px-4 py-3 text-sm">{record.sessionTitle}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {record.sessionTime}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    {getStatusBadge(record.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {record.markedBy}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {record.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
