import React from 'react';
import { CheckCircle, XCircle, Clock, Coffee } from 'lucide-react';

interface AttendanceStatisticsProps {
  statistics: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
}

export function AttendanceStatistics({ statistics }: AttendanceStatisticsProps) {
  const stats = [
    {
      label: 'Present',
      value: statistics.present,
      icon: CheckCircle,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400',
      iconColor: 'text-green-600 dark:text-green-500',
    },
    {
      label: 'Absent',
      value: statistics.absent,
      icon: XCircle,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-400',
      iconColor: 'text-red-600 dark:text-red-500',
    },
    {
      label: 'Late',
      value: statistics.late,
      icon: Clock,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      iconColor: 'text-yellow-600 dark:text-yellow-500',
    },
    {
      label: 'Leave',
      value: statistics.excused,
      icon: Coffee,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-4 flex items-center gap-3`}
          >
            <div className={`${stat.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
