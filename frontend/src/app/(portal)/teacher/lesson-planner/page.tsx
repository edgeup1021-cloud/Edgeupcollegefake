"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  BookMarked,
  Clock,
  Users,
  Calendar,
  Loader2,
  Search,
  Import,
  Sparkles,
  MoreVertical,
  Trash2,
  Eye,
} from "lucide-react";
import { getLessons, deleteLesson } from "@/services/lesson-planner.service";
import type { StandaloneLesson } from "@/types/lesson-planner.types";
import { LessonStatus, LESSON_STATUS_CONFIG } from "@/types/lesson-planner.types";

export default function LessonPlannerPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<StandaloneLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteMenuOpen, setDeleteMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await getLessons();
      setLessons(data);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      setDeleteMenuOpen(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  };

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookMarked className="w-7 h-7 text-brand-primary" />
              Lesson Planner
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create and manage standalone lessons for any class
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/teacher/lesson-planner/create?mode=import"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Import className="w-4 h-4" />
              Import from Curriculum
            </Link>
            <Link
              href="/teacher/lesson-planner/create"
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Lesson
            </Link>
          </div>
        </div>

        {/* Search */}
        {lessons.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons by title, subject, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {lessons.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-light dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No lessons yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create your first standalone lesson or import one from your curriculum plans.
              AI will generate a complete lesson blueprint with resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/teacher/lesson-planner/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Lesson
              </Link>
              <Link
                href="/teacher/lesson-planner/create?mode=import"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Import className="w-4 h-4" />
                Import from Curriculum
              </Link>
            </div>
          </div>
        ) : (
          /* Lessons Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onView={() => router.push(`/teacher/lesson-planner/${lesson.id}`)}
                onDelete={() => handleDelete(lesson.id)}
                menuOpen={deleteMenuOpen === lesson.id}
                onMenuToggle={() =>
                  setDeleteMenuOpen(deleteMenuOpen === lesson.id ? null : lesson.id)
                }
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {lessons.length > 0 && filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No lessons found matching &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  onView,
  onDelete,
  menuOpen,
  onMenuToggle,
}: {
  lesson: StandaloneLesson;
  onView: () => void;
  onDelete: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const statusConfig = LESSON_STATUS_CONFIG[lesson.status];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow cursor-pointer group relative"
      onClick={onView}
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle();
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
      >
        {statusConfig.label}
      </span>

      {/* Imported Badge */}
      {lesson.curriculumSessionId && (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
          Imported
        </span>
      )}

      {/* Title */}
      <h3 className="mt-3 font-semibold text-gray-900 dark:text-white line-clamp-2">
        {lesson.title}
      </h3>

      {/* Subject & Topic */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {lesson.subject} • {lesson.topic}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {lesson.duration} min
        </span>
        {lesson.classSize && (
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {lesson.classSize}
          </span>
        )}
        {lesson.scheduledDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(lesson.scheduledDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Learning Objectives Preview */}
      {lesson.learningObjectives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {lesson.learningObjectives.slice(0, 2).join(" • ")}
            {lesson.learningObjectives.length > 2 && " ..."}
          </p>
        </div>
      )}

      {/* Has Blueprint Indicator */}
      {lesson.blueprint && (
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <Sparkles className="w-3 h-3" />
          AI Blueprint Ready
        </div>
      )}
    </div>
  );
}
