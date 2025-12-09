"use client";

import { CourseWithCounts } from "@/types/curriculum.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: CourseWithCounts;
  onEdit: (course: CourseWithCounts) => void;
  onDelete: (course: CourseWithCounts) => void;
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Icon and Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{course.iconUrl || "📚"}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {course.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course.code}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onEdit(course);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete(course);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>{course.subjectCount} Subjects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{course.topicCount} Topics</span>
          </div>
        </div>

        {/* View Button */}
        <Link href={`/superadmin/curriculum/${course.id}`}>
          <Button
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
          >
            View Course
          </Button>
        </Link>
      </div>
    </Card>
  );
}
