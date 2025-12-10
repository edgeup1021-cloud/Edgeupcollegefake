"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Loader2, Search } from "lucide-react";
import { searchCourses, getEducationalChannels } from "@/services/development-programs.service";
import type {
  DevelopmentCourse,
  CourseSearchFilters,
  EducationalChannel,
} from "@/types/development-programs.types";

import CourseCard from "./components/CourseCard";
import CourseFilters from "./components/CourseFilters";

export default function DevelopmentProgramsPage() {
  const [courses, setCourses] = useState<DevelopmentCourse[]>([]);
  const [channels, setChannels] = useState<EducationalChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CourseSearchFilters>({
    query: "teaching methods",
    maxResults: 20,
  });

  // Fetch educational channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsData = await getEducationalChannels();
        setChannels(channelsData);
      } catch (err) {
        console.error("Failed to fetch channels:", err);
      }
    };

    fetchChannels();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchCourses(filters);
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-brand-primary" />
                Development Programs
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Discover professional development courses from top educational platforms
              </p>
            </div>
            {!loading && courses.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{courses.length}</span>
                <span>courses found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="mb-6">
          <CourseFilters
            filters={filters}
            channels={channels}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Searching for courses...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">
              {error}
            </p>
            <button
              onClick={handleSearch}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or selecting a different channel
            </p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
