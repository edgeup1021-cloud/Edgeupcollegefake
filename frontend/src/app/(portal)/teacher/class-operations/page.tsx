"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassCard } from "./components/ClassCard";
import { getCourseOfferings } from "@/services/class-operations.service";
import { useAuth } from "@/contexts/AuthContext";
import type { CourseOffering } from "@/types/class-operations.types";

export default function ClassOperationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);

  // Load offerings on mount
  useEffect(() => {
    if (user?.id) {
      loadOfferings();
    }
  }, [user]);

  const loadOfferings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Ensure user.id is a number
      const teacherId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const data = await getCourseOfferings(teacherId);
      setOfferings(data);
    } catch (error) {
      console.error('Failed to load course offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (sessionId: number) => {
    router.push(`/teacher/class-operations/attendance/${sessionId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Class Operations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your classes and mark attendance
          </p>
        </div>
        <Button onClick={() => router.push('/teacher/class-operations/create')} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : offerings.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">No classes yet</h3>
              <p className="text-muted-foreground max-w-md">
                Create your first class to get started with managing attendance and tracking student progress.
              </p>
            </div>
            <Button onClick={() => router.push('/teacher/class-operations/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Class Cards Grid */
        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {offerings.length} {offerings.length === 1 ? 'class' : 'classes'} total
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offering) => (
              <ClassCard
                key={offering.id}
                offering={offering}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
