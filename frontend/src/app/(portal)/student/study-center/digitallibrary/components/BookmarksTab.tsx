"use client";

import { useState, useEffect } from "react";
import { Loader2, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceCard } from "./ResourceCard";
import { getBookmarkedResources } from "@/services/digital-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { BookmarkResource } from "@/types/digital-library.types";

interface BookmarksTabProps {
  onRefresh?: () => void;
}

export function BookmarksTab({ onRefresh }: BookmarksTabProps) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getBookmarkedResources(user.id);
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadBookmarks();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Bookmark className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-md">
              Start bookmarking resources from the Browse tab to access them quickly later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        {bookmarks.length} bookmarked resource{bookmarks.length !== 1 ? "s" : ""}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <ResourceCard
            key={bookmark.resourceId}
            resource={{ ...bookmark.resource, isBookmarked: true }}
            onRefresh={handleRefresh}
          />
        ))}
      </div>
    </div>
  );
}
