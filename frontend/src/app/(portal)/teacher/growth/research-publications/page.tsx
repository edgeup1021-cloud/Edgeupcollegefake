"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Quotes,
  Plus,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "./components/StatsCard";
import { PublicationCard } from "./components/PublicationCard";
import { AddPublicationDialog } from "./components/AddPublicationDialog";
import * as publicationService from "@/services/publications.service";
import * as authService from "@/services/auth.service";
import type { Publication, PublicationStatus } from "@/types/publication.types";

export default function ResearchPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | "all">("all");

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  useEffect(() => {
    if (teacherId) {
      loadPublications();
    }
  }, [teacherId]);

  const loadTeacherProfile = async () => {
    try {
      const user = await authService.getProfile();
      console.log("Loaded teacher profile:", user);
      console.log("Teacher ID:", user.id);
      setTeacherId(user.id);
    } catch (error) {
      console.error("Failed to load teacher profile:", error);
      setError("Failed to load profile. Please make sure you're logged in.");
      setLoading(false);
    }
  };

  const loadPublications = async () => {
    if (!teacherId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await publicationService.getPublications(teacherId);
      setPublications(data);
    } catch (err) {
      console.error("Failed to load publications:", err);
      setError("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublication = () => {
    setEditingPublication(null);
    setIsDialogOpen(true);
  };

  const handleEditPublication = (id: number) => {
    const publication = publications.find((p) => {
      const pubId = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
      return pubId === id;
    });
    if (publication) {
      setEditingPublication(publication);
      setIsDialogOpen(true);
    }
  };

  const handleDeletePublication = async (id: number) => {
    if (!teacherId) return;

    if (!confirm("Are you sure you want to delete this publication?")) {
      return;
    }

    try {
      // Optimistic UI update - compare IDs properly (handle string | number)
      setPublications((prev) => prev.filter((p) => {
        const pubId = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
        return pubId !== id;
      }));

      await publicationService.deletePublication(id, teacherId);
    } catch (err) {
      console.error("Failed to delete publication:", err);
      // Revert on error
      await loadPublications();
      alert("Failed to delete publication");
    }
  };

  const handleDialogSuccess = () => {
    loadPublications();
  };

  // Calculate stats - guard against undefined
  const stats = {
    total: publications?.length || 0,
    published: publications?.filter((p) => p.status === "Published").length || 0,
    underReview: publications?.filter((p) => p.status === "Under Review").length || 0,
    totalCitations: publications?.reduce((sum, p) => sum + (p.citationsCount || 0), 0) || 0,
  };

  // Filter publications - guard against undefined
  const filteredPublications = publications?.filter((pub) => {
    const matchesSearch =
      pub.publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.journalConferenceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || pub.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Get unique statuses for filter - guard against undefined
  const uniqueStatuses = publications?.length
    ? Array.from(new Set(publications.map((p) => p.status)))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading publications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-brand-primary" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Research & Publications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your scholarly work and academic contributions
            </p>
          </div>
        </div>
        <Button onClick={handleAddPublication} className="gap-2">
          <Plus className="w-5 h-5" />
          Add New Publication
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatsCard
          icon={BookOpen}
          label="Total Publications"
          value={stats.total}
          color="bg-brand-primary/10 text-brand-primary"
        />
        <StatsCard
          icon={CheckCircle}
          label="Published"
          value={stats.published}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatsCard
          icon={Clock}
          label="Under Review"
          value={stats.underReview}
          color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
        />
        <StatsCard
          icon={Quotes}
          label="Total Citations"
          value={stats.totalCitations}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-shrink-0">
        <div className="flex-1 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search publications by title or journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PublicationStatus | "all")}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
        >
          <option value="all">All Statuses</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 flex-shrink-0">
          {error}
        </div>
      )}

      {/* Publications Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredPublications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" weight="duotone" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {(!publications || publications.length === 0)
                ? "No publications yet"
                : "No publications found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              {(!publications || publications.length === 0)
                ? "Start building your academic portfolio by adding your first publication."
                : "Try adjusting your search or filter criteria."}
            </p>
            {(!publications || publications.length === 0) && (
              <Button onClick={handleAddPublication} className="gap-2">
                <Plus className="w-5 h-5" />
                Add Your First Publication
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {filteredPublications.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                onEdit={handleEditPublication}
                onDelete={handleDeletePublication}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      {teacherId && (
        <AddPublicationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingPublication(null);
          }}
          onSuccess={handleDialogSuccess}
          teacherId={teacherId}
          publicationId={
            editingPublication?.id
              ? (typeof editingPublication.id === 'string'
                  ? parseInt(editingPublication.id, 10)
                  : editingPublication.id)
              : null
          }
          existingPublication={editingPublication}
        />
      )}
    </div>
  );
}
