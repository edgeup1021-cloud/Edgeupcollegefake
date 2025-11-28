'use client';

import { useStudentOverview } from '@/hooks/useStudents';

export default function StudentOverviewPage() {
  const { overview, loading, error, refresh } = useStudentOverview();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Failed to load overview data: {error}
          </p>
          <button
            onClick={refresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Students',
      value: overview?.totalStudents ?? 0,
      icon: '👥',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active Students',
      value: overview?.activeStudents ?? 0,
      icon: '✅',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Suspended',
      value: overview?.suspendedStudents ?? 0,
      icon: '⚠️',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Graduated',
      value: overview?.graduatedStudents ?? 0,
      icon: '🎓',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Overview
        </h1>
        <button
          onClick={refresh}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Welcome to your student dashboard. Here&apos;s an overview of student statistics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Statistics
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Active Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {overview && overview.totalStudents > 0
                ? `${((overview.activeStudents / overview.totalStudents) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Graduation Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {overview && overview.totalStudents > 0
                ? `${((overview.graduatedStudents / overview.totalStudents) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Suspension Rate</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {overview && overview.totalStudents > 0
                ? `${((overview.suspendedStudents / overview.totalStudents) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
