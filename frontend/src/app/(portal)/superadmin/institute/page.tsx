"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Loader2, Edit, Trash2, UserPlus } from "lucide-react";
import Modal from "@/components/ui/modal";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import Toast, { ToastType } from "@/components/ui/toast";

interface InstitutionalHead {
  id: number;
  name: string;
  email: string;
}

interface University {
  id: number;
  name: string;
  institutionType: "College" | "University";
  collegeType: string | null;
  code: string;
  location: string | null;
  establishedYear: number | null;
  description: string | null;
  institutionalHead: InstitutionalHead | null;
}

interface UniversityFormData {
  name: string;
  institutionType: "College" | "University";
  collegeType: string;
  code: string;
  location: string;
  establishedYear: string;
  description: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const COLLEGE_TYPES = [
  "Engineering",
  "Medical",
  "Law",
  "Arts and Science",
  "Polytechnic",
  "Management",
  "Education",
  "Agriculture",
  "Pharmacy",
  "Nursing",
  "Architecture",
  "Fine Arts",
  "Physical Education",
  "Other",
];

export default function InstitutePage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutionalHeads, setInstitutionalHeads] = useState<InstitutionalHead[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  // Form state
  const [formData, setFormData] = useState<UniversityFormData>({
    name: "",
    institutionType: "College",
    collegeType: "",
    code: "",
    location: "",
    establishedYear: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assignment state
  const [selectedHeadId, setSelectedHeadId] = useState<number | null>(null);

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

  // Fetch institutional heads for assignment
  const fetchInstitutionalHeads = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/institutional-heads");
      if (!response.ok) {
        throw new Error("Failed to fetch institutional heads");
      }
      const data = await response.json();
      setInstitutionalHeads(data);
    } catch (error) {
      console.error("Error fetching institutional heads:", error);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchInstitutionalHeads();
  }, []);

  const handleCreate = () => {
    setFormData({
      name: "",
      institutionType: "College",
      collegeType: "",
      code: "",
      location: "",
      establishedYear: "",
      description: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      institutionType: university.institutionType,
      collegeType: university.collegeType || "",
      code: university.code,
      location: university.location || "",
      establishedYear: university.establishedYear?.toString() || "",
      description: university.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (university: University) => {
    setUniversityToDelete(university);
    setIsDeleteDialogOpen(true);
  };

  const handleAssign = (university: University) => {
    setSelectedUniversity(university);
    setSelectedHeadId(university.institutionalHead?.id || null);
    setIsAssignModalOpen(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (formData.institutionType === "College" && !formData.collegeType) {
      showToast("Please select a college type", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name,
        institutionType: formData.institutionType,
        collegeType: formData.institutionType === "College" ? formData.collegeType : null,
        code: formData.code,
        location: formData.location || null,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        description: formData.description || null,
      };

      const response = await fetch("http://localhost:3001/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create institution");
      }

      showToast("Institution created successfully", "success");
      setIsCreateModalOpen(false);
      fetchUniversities();
    } catch (error) {
      console.error("Error creating institution:", error);
      showToast("Failed to create institution", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUniversity) return;

    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (formData.institutionType === "College" && !formData.collegeType) {
      showToast("Please select a college type", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name,
        institutionType: formData.institutionType,
        collegeType: formData.institutionType === "College" ? formData.collegeType : null,
        code: formData.code,
        location: formData.location || null,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        description: formData.description || null,
      };

      const response = await fetch(
        `http://localhost:3001/api/universities/${selectedUniversity.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update institution");
      }

      showToast("Institution updated successfully", "success");
      setIsEditModalOpen(false);
      fetchUniversities();
    } catch (error) {
      console.error("Error updating institution:", error);
      showToast("Failed to update institution", "error");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUniversity || !selectedHeadId) {
      showToast("Please select an institutional head", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:3001/api/universities/${selectedUniversity.id}/assign-head/${selectedHeadId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign institutional head");
      }

      showToast("Institutional head assigned successfully! Admin user created.", "success");
      setIsAssignModalOpen(false);
      fetchUniversities();
    } catch (error) {
      console.error("Error assigning institutional head:", error);
      showToast("Failed to assign institutional head", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Manage colleges and universities
              </p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Institution
          </button>
        </div>

        {/* Content */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {loading ? (
              // Loading State
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
              </div>
            ) : universities.length === 0 ? (
              // Empty State
              <div className="py-16 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No institutions yet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Get started by adding your first institution
                </p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Institution
                </button>
              </div>
            ) : (
              // Institutions List
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {universities.map((university) => (
                  <div
                    key={university.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* University Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {university.name}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Type:</span>{" "}
                            {university.institutionType}
                            {university.collegeType && ` - ${university.collegeType}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Code:</span> {university.code}
                          </p>
                          {university.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Location:</span> {university.location}
                            </p>
                          )}
                          {university.institutionalHead ? (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              <span className="font-medium">Head:</span>{" "}
                              {university.institutionalHead.name}
                            </p>
                          ) : (
                            <p className="text-sm text-orange-600 dark:text-orange-400">
                              No head assigned
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAssign(university)}
                          className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="Assign Head"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEdit(university)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(university)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Institution"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Type *
            </label>
            <select
              value={formData.institutionType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  institutionType: e.target.value as "College" | "University",
                  collegeType: e.target.value === "University" ? "" : formData.collegeType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            >
              <option value="College">College</option>
              <option value="University">University</option>
            </select>
          </div>

          {formData.institutionType === "College" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                College Type *
              </label>
              <select
                value={formData.collegeType}
                onChange={(e) => setFormData({ ...formData, collegeType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              >
                <option value="">Select college type</option>
                {COLLEGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="e.g., MIT, ANNAUNI"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="e.g., Chennai, Tamil Nadu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Established Year
            </label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="e.g., 1949"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Brief description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal - Same as Create but with handleSubmitEdit */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Institution"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Type *
            </label>
            <select
              value={formData.institutionType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  institutionType: e.target.value as "College" | "University",
                  collegeType: e.target.value === "University" ? "" : formData.collegeType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            >
              <option value="College">College</option>
              <option value="University">University</option>
            </select>
          </div>

          {formData.institutionType === "College" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                College Type *
              </label>
              <select
                value={formData.collegeType}
                onChange={(e) => setFormData({ ...formData, collegeType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                required
              >
                <option value="">Select college type</option>
                {COLLEGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Established Year
            </label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Institutional Head Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Institutional Head"
      >
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution
            </label>
            <input
              type="text"
              value={selectedUniversity?.name || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Institutional Head *
            </label>
            <select
              value={selectedHeadId || ""}
              onChange={(e) => setSelectedHeadId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            >
              <option value="">Choose an institutional head</option>
              {institutionalHeads.map((head) => (
                <option key={head.id} value={head.id}>
                  {head.name} ({head.email})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Assigning an institutional head will automatically create an admin user account in the management system.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Assigning..." : "Assign Head"}
            </button>
          </div>
        </form>
      </Modal>

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
