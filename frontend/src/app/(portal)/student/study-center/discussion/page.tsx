"use client";

import { useState, useEffect } from "react";
import { Plus, Grid3x3, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPosts } from "@/services/discussion.service";
import type { DiscussionPost, SearchFilters } from "@/types/discussion.types";
import CreateDiscussionModal from "./components/CreateDiscussionModal";
import DiscussionCard from "./components/DiscussionCard";
import DiscussionListItem from "./components/DiscussionListItem";
import SearchFiltersComponent from "./components/SearchFilters";
import DiscussionDetailView from "./components/DiscussionDetailView";

export default function DiscussionForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "recent",
  });

  // Fetch posts on mount and when filters change
  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const studentId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const data = await getPosts(filters, studentId);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load discussions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: DiscussionPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  // If viewing a specific post, show detail view
  if (selectedPostId) {
    return (
      <DiscussionDetailView
        postId={selectedPostId}
        studentId={user?.id}
        onBack={() => setSelectedPostId(null)}
      />
    );
  }

  // Show loading if no user yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Discussion Forum
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ask questions and share knowledge with your peers
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filters */}
        <div className="mb-6">
          <SearchFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-brand-primary text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-brand-primary text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No discussions found. Be the first to start a conversation!
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create First Post
            </button>
          </div>
        )}

        {/* Posts Grid/List */}
        {!loading && !error && posts.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {posts.map((post) =>
              viewMode === "grid" ? (
                <DiscussionCard
                  key={post.id}
                  post={post}
                  studentId={user.id}
                  onClick={() => setSelectedPostId(post.id)}
                  onUpdate={handlePostUpdate}
                />
              ) : (
                <DiscussionListItem
                  key={post.id}
                  post={post}
                  studentId={user.id}
                  onClick={() => setSelectedPostId(post.id)}
                  onUpdate={handlePostUpdate}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateDiscussionModal
        isOpen={createModalOpen}
        studentId={user.id}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}
