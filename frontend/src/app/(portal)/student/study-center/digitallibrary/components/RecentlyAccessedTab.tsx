"use client";

import { useState, useEffect } from "react";
import { Loader2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceCard } from "./ResourceCard";
import { getRecentlyAccessedResources } from "@/services/digital-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { RecentlyAccessedResource } from "@/types/digital-library.types";

interface RecentlyAccessedTabProps {
  onRefresh?: () => void;
}

export function RecentlyAccessedTab({ onRefresh }: RecentlyAccessedTabProps) {
  const { user } = useAuth();
  const [recentResources, setRecentResources] = useState<RecentlyAccessedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRecentResources();
    }
  }, [user]);

  const loadRecentResources = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getRecentlyAccessedResources(user.id);
      setRecentResources(data);
    } catch (error) {
      console.error("Failed to load recent resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRecentResources();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (recentResources.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No recently accessed resources</h3>
            <p className="text-muted-foreground max-w-md">
              Resources you view or download will appear here for quick access.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        {recentResources.length} recently accessed resource{recentResources.length !== 1 ? "s" : ""}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onRefresh={handleRefresh}
            showAccessDate={true}
            accessDate={resource.accessedAt}
          />
        ))}
      </div>
    </div>
  );
}
