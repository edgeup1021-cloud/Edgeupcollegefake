"use client";

import { CheckCircle, XCircle, Clock, CheckSquare } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { RecentAttendance } from "@/types/mentorship.types";

interface RecentAttendanceTableProps {
  attendance: RecentAttendance[];
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "present":
      return {
        icon: CheckCircle,
        label: "Present",
        color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
      };
    case "absent":
      return {
        icon: XCircle,
        label: "Absent",
        color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
      };
    case "late":
      return {
        icon: Clock,
        label: "Late",
        color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
      };
    case "excused":
      return {
        icon: CheckSquare,
        label: "Excused",
        color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
      };
    default:
      return {
        icon: XCircle,
        label: status,
        color: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30",
      };
  }
};

export function RecentAttendanceTable({ attendance }: RecentAttendanceTableProps) {
  if (attendance.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No recent attendance records</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Course
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record, index) => {
            const statusConfig = getStatusConfig(record.status);
            const StatusIcon = statusConfig.icon;

            return (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {record.courseTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.courseCode}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium",
                      statusConfig.color
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
