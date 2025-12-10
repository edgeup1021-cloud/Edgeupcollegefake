"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import {
  searchCourses,
  getEducationalChannels,
  getPersonalizedCourses
} from "@/services/development-programs.service";
import type {
  DevelopmentCourse,
  CourseSearchFilters,
  EducationalChannel,
} from "@/types/development-programs.types";
import { useAuth } from "@/contexts/AuthContext";

import CourseCard from "./components/CourseCard";
import CourseFilters from "./components/CourseFilters";

export default function DevelopmentProgramsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<DevelopmentCourse[]>([]);
  const [personalizedCourses, setPersonalizedCourses] = useState<DevelopmentCourse[]>([]);
  const [channels, setChannels] = useState<EducationalChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingPersonalized, setShowingPersonalized] = useState(true);
  const [filters, setFilters] = useState<CourseSearchFilters>({
    maxResults: 20,
  });

  // Fetch personalized courses and channels on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Wait for user to be loaded
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch channels
        const channelsData = await getEducationalChannels();
        setChannels(channelsData);

        // Fetch personalized courses using the logged-in teacher's ID
        const personalizedData = await getPersonalizedCourses(user.id);
        setPersonalizedCourses(personalizedData);
        setCourses(personalizedData);
        setShowingPersonalized(true);
      } catch (err) {
        console.error("Failed to fetch personalized courses:", err);
        setError("Failed to load personalized recommendations. Try selecting a channel to explore courses.");
        // Fallback to exploratory search
        try {
          const fallbackData = await searchCourses({ query: "education", maxResults: 20 });
          setCourses(fallbackData);
          setShowingPersonalized(false);
        } catch {
          setError("Failed to load courses. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const handleFiltersChange = async (newFilters: CourseSearchFilters) => {
    setFilters(newFilters);

    // If category/channel is selected, fetch filtered courses
    if (newFilters.category || newFilters.channelId) {
      try {
        setLoading(true);
        setError(null);
        setShowingPersonalized(false);

        const data = await searchCourses(newFilters);
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
    } else {
      // No filters, show personalized
      handleBackToRecommendations();
    }
  };

  const handleBackToRecommendations = () => {
    setShowingPersonalized(true);
    setCourses(personalizedCourses);
    setFilters({ maxResults: 20 });
    setError(null);
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
                {showingPersonalized ? "Recommended for You" : "Development Programs"}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {showingPersonalized
                  ? "Courses tailored to your department and subjects"
                  : "Discover professional development courses from top educational platforms"}
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
        {/* Back to Recommendations Button */}
        {!showingPersonalized && personalizedCourses.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleBackToRecommendations}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white border border-brand-primary rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Your Recommendations
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <CourseFilters
            filters={filters}
            channels={channels}
            onFiltersChange={handleFiltersChange}
            onSearch={() => {}}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading courses...
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
              onClick={handleBackToRecommendations}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Recommendations
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try selecting a different educational channel to explore courses
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
