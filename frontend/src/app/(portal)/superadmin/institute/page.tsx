"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Loader2, Edit, Trash2, Search } from "lucide-react";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface InstitutionalHead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface University {
  id: number;
  name: string;
  institutionType: "College" | "University";
  collegeType: string | null;
  location: string | null;
  establishedYear: number | null;
  description: string | null;
  institutionalHead: InstitutionalHead | null;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function InstitutePage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState<University | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/universities");
      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
      showToast("Failed to fetch institutions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleCreate = () => {
    router.push("/superadmin/institute/create");
  };

  const handleEdit = (id: number) => {
    router.push(`/superadmin/institute/${id}/edit`);
  };

  const handleDelete = (university: University) => {
    setUniversityToDelete(university);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!universityToDelete) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `http://localhost:3001/api/universities/${universityToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete institution");
      }

      showToast("Institution deleted successfully", "success");
      fetchUniversities();
    } catch (error) {
      console.error("Error deleting institution:", error);
      showToast("Failed to delete institution", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUniversityToDelete(null);
    }
  };

  // Filter universities based on search query
  const filteredUniversities = universities.filter((university) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      university.name.toLowerCase().includes(searchLower) ||
      university.institutionType.toLowerCase().includes(searchLower) ||
      (university.collegeType?.toLowerCase().includes(searchLower) || false) ||
      (university.location?.toLowerCase().includes(searchLower) || false) ||
      (university.institutionalHead?.name.toLowerCase().includes(searchLower) || false)
    );
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
              <Building2 className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Institutions
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage colleges, universities, and institutional heads
              </p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Institute
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : filteredUniversities.length === 0 ? (
            // Empty State
            <div className="py-16 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No institutions found" : "No institutions yet"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Get started by creating your first institution"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Institute
                </button>
              )}
            </div>
          ) : (
            // Table View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Institution Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Institutional Head
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUniversities.map((university) => (
                    <tr
                      key={university.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {university.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {university.institutionType}
                        </div>
                        {university.collegeType && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {university.collegeType}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {university.location || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {university.institutionalHead ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {university.institutionalHead.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {university.institutionalHead.email}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(university.id)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(university)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Institution"
        description={`Are you sure you want to delete "${universityToDelete?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}
