"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LibraryStatistics } from "./components/LibraryStatistics";
import { BrowseTab } from "./components/BrowseTab";
import { BookmarksTab } from "./components/BookmarksTab";
import { DownloadsTab } from "./components/DownloadsTab";
import { RecentlyAccessedTab } from "./components/RecentlyAccessedTab";
import { getLibraryStatistics } from "@/services/digital-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { LibraryStatistics as LibraryStats } from "@/types/digital-library.types";

export default function DigitalLibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [statistics, setStatistics] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const stats = await getLibraryStatistics(user.id);
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to load library statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Digital Library</h1>
        <p className="text-muted-foreground mt-1">
          Access educational resources, manage bookmarks, and track your downloads
        </p>
      </div>

      {/* Statistics */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : statistics ? (
        <LibraryStatistics statistics={statistics} />
      ) : null}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="bookmarks">
            My Bookmarks
            {statistics && statistics.bookmarks > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {statistics.bookmarks}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="downloads">
            My Downloads
            {statistics && statistics.downloads > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {statistics.downloads}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="recent">Recently Accessed</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <BrowseTab onRefresh={loadStatistics} />
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <BookmarksTab onRefresh={loadStatistics} />
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <DownloadsTab />
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <RecentlyAccessedTab onRefresh={loadStatistics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
