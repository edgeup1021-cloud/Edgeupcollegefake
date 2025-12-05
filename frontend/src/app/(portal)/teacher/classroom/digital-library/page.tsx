"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddResourceDialog } from "./components/AddResourceDialog";
import { TeacherResourceCard } from "./components/TeacherResourceCard";
import { getTeacherResources } from "@/services/teacher-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { Resource } from "@/types/digital-library.types";

export default function TeacherDigitalLibraryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadResources();
    }
  }, [user]);

  const loadResources = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getTeacherResources(user.id);
      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Digital Library</h1>
          <p className="text-muted-foreground mt-1">
            Add and manage your educational resources
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Library className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Resources Added</p>
              <p className="text-2xl font-bold">{resources.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Library className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No resources yet</h3>
              <p className="text-muted-foreground max-w-md">
                Start building your digital library by adding educational resources for students.
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {resources.length} resource{resources.length !== 1 ? "s" : ""} added
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <TeacherResourceCard
                key={resource.id}
                resource={resource}
                onRefresh={loadResources}
              />
            ))}
          </div>
        </>
      )}

      {/* Add Resource Dialog */}
      <AddResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadResources}
      />
    </div>
  );
}
