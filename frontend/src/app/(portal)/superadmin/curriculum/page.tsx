"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, BookOpen } from "lucide-react";
import CourseCard from "./components/CourseCard";
import { mockCourses } from "@/lib/mock/curriculumData";
import { CourseWithCounts } from "@/types/curriculum.types";

export default function CurriculumPage() {
  const [courses, setCourses] = useState<CourseWithCounts[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditCourse = (course: CourseWithCounts) => {
    console.log("Edit course:", course);
    // TODO: Open CourseFormModal with course data
    setShowAddCourseModal(true);
  };

  const handleDeleteCourse = (course: CourseWithCounts) => {
    if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
      setCourses(courses.filter((c) => c.id !== course.id));
    }
  };

  const handleAddCourse = () => {
    setShowAddCourseModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
            <BookOpen className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Curriculum Library
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage course content for question generation
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddCourse}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* TODO: Add filter dropdown */}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-sm">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by creating your first course to organize subjects and topics"}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleAddCourse}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Course
            </Button>
          )}
        </div>
      )}

      {/* TODO: Add CourseFormModal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add/Edit Course</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              CourseFormModal will be implemented here
            </p>
            <Button
              onClick={() => setShowAddCourseModal(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
