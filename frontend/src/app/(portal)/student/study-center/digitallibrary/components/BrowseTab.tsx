"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "./ResourceCard";
import { browseResources } from "@/services/digital-library.service";
import type { Resource, ResourceType, ResourceCategory, LibraryFilters } from "@/types/digital-library.types";

interface BrowseTabProps {
  onRefresh?: () => void;
}

export function BrowseTab({ onRefresh }: BrowseTabProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<LibraryFilters>({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await browseResources(filters);
      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    loadResources();
  };

  const handleFilterChange = (key: keyof LibraryFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadResources();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ sortBy: "date", sortOrder: "desc" });
    loadResources();
  };

  const resourceTypes: ResourceType[] = ["book", "paper", "video", "article", "presentation", "document"];
  const categories: ResourceCategory[] = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Arts",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title, author, or description..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={filters.type || ""}
                  onChange={(e) =>
                    handleFilterChange("type", e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">All Types</option>
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={filters.category || ""}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <select
                  value={filters.sortBy || "date"}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="date">Date Added</option>
                  <option value="title">Title</option>
                  <option value="views">Views</option>
                  <option value="downloads">Downloads</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <select
                  value={filters.sortOrder || "desc"}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="col-span-full">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No resources found. Try adjusting your search or filters.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {resources.length} resource{resources.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRefresh={() => {
                  loadResources();
                  onRefresh?.();
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
