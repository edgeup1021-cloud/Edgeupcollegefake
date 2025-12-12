"use client";

import { cn } from "@/lib/utils";
import type { RecentGrade } from "@/types/mentorship.types";

interface RecentGradesTableProps {
  grades: RecentGrade[];
}

const getGradeColor = (gradeLetter: string | null) => {
  if (!gradeLetter) return "text-gray-600 dark:text-gray-400";

  switch (gradeLetter) {
    case "A+":
    case "A":
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    case "B+":
    case "B":
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    case "C+":
    case "C":
      return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
    case "D":
      return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
    case "F":
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
  }
};

export function RecentGradesTable({ grades }: RecentGradesTableProps) {
  if (grades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No recent grades available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Course
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Marks
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              %
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Grade
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {grade.courseTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {grade.courseCode}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {grade.grade}/{grade.maxMarks}
                </p>
              </td>
              <td className="py-3 px-4 text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {grade.percentage}%
                </p>
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={cn(
                    "inline-block px-2.5 py-1 rounded-lg text-sm font-bold",
                    getGradeColor(grade.gradeLetter)
                  )}
                >
                  {grade.gradeLetter || "N/A"}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {grade.gradeType}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(grade.date).toLocaleDateString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
