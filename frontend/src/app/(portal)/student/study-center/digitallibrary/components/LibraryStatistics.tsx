import { BookOpen, Bookmark, Download, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LibraryStatistics as LibraryStats } from "@/types/digital-library.types";

interface LibraryStatisticsProps {
  statistics: LibraryStats;
}

export function LibraryStatistics({ statistics }: LibraryStatisticsProps) {
  const stats = [
    {
      label: "Total Resources",
      value: statistics.totalResources,
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "My Bookmarks",
      value: statistics.bookmarks,
      icon: Bookmark,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "My Downloads",
      value: statistics.downloads,
      icon: Download,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Recently Accessed",
      value: statistics.recentlyAccessed,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
