"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Toast, { ToastType } from "@/components/ui/toast";

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

interface InstitutionData {
  name: string;
  institutionType: "College" | "University";
  collegeType: string;
  location: string;
  establishedYear: string;
  description: string;
}

interface HeadData {
  hasHead: boolean;
  headName: string;
  headEmail: string;
  headPhone: string;
  headAddress: string;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function EditInstitutePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"institution" | "head">("institution");
  const [university, setUniversity] = useState<University | null>(null);

  // Institution Data
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    name: "",
    institutionType: "College",
    collegeType: "",
    location: "",
    establishedYear: "",
    description: "",
  });

  // Head Data
  const [headData, setHeadData] = useState<HeadData>({
    hasHead: false,
    headName: "",
    headEmail: "",
    headPhone: "",
    headAddress: "",
  });

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

  // Fetch university data
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/universities/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch university");
        }
        const data = await response.json();
        setUniversity(data);

        // Populate institution data
        setInstitutionData({
          name: data.name,
          institutionType: data.institutionType,
          collegeType: data.collegeType || "",
          location: data.location || "",
          establishedYear: data.establishedYear?.toString() || "",
          description: data.description || "",
        });

        // Populate head data
        if (data.institutionalHead) {
          setHeadData({
            hasHead: true,
            headName: data.institutionalHead.name,
            headEmail: data.institutionalHead.email,
            headPhone: data.institutionalHead.phone || "",
            headAddress: data.institutionalHead.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching university:", error);
        showToast("Failed to load institution", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUniversity();
    }
  }, [id]);

  const validateInstitution = (): boolean => {
    if (!institutionData.name.trim()) {
      showToast("Please enter institution name", "error");
      return false;
    }

    if (institutionData.institutionType === "College" && !institutionData.collegeType) {
      showToast("Please select college type", "error");
      return false;
    }

    return true;
  };

  const validateHead = (): boolean => {
    if (headData.hasHead) {
      if (!headData.headName.trim()) {
        showToast("Please enter head name", "error");
        return false;
      }

      if (!headData.headEmail.trim()) {
        showToast("Please enter head email", "error");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(headData.headEmail)) {
        showToast("Please enter a valid email address", "error");
        return false;
      }

      if (!headData.headPhone.trim()) {
        showToast("Please enter head phone number", "error");
        return false;
      }
    }

    return true;
  };

  const handleSaveInstitution = async () => {
    if (!validateInstitution()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: institutionData.name,
        institutionType: institutionData.institutionType,
        collegeType:
          institutionData.institutionType === "College" ? institutionData.collegeType : null,
        location: institutionData.location || null,
        establishedYear: institutionData.establishedYear
          ? parseInt(institutionData.establishedYear)
          : null,
        description: institutionData.description || null,
      };

      const response = await fetch(`http://localhost:3001/api/universities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update institution");
      }

      showToast("Institution updated successfully", "success");
    } catch (error) {
      console.error("Error updating institution:", error);
      showToast("Failed to update institution", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveHead = async () => {
    if (!validateHead()) return;

    try {
      setIsSubmitting(true);

      const payload: any = {
        name: institutionData.name,
        institutionType: institutionData.institutionType,
        collegeType:
          institutionData.institutionType === "College" ? institutionData.collegeType : null,
        location: institutionData.location || null,
        establishedYear: institutionData.establishedYear
          ? parseInt(institutionData.establishedYear)
          : null,
        description: institutionData.description || null,
      };

      // Add institutional head data if hasHead is true
      if (headData.hasHead) {
        payload.institutionalHead = {
          name: headData.headName,
          email: headData.headEmail,
          phone: headData.headPhone,
          address: headData.headAddress || null,
        };
      }

      const response = await fetch(`http://localhost:3001/api/universities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update institutional head");
      }

      showToast("Institutional head updated successfully", "success");

      // Refresh data
      const updatedResponse = await fetch(`http://localhost:3001/api/universities/${id}`);
      const updatedData = await updatedResponse.json();
      setUniversity(updatedData);
    } catch (error) {
      console.error("Error updating institutional head:", error);
      showToast("Failed to update institutional head", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/superadmin/institute");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">Institution not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/superadmin/institute")}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Institutions
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Institute: {university.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Update institution details and institutional head information
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("institution")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "institution"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Institution Details
            </button>
            <button
              onClick={() => setActiveTab("head")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "head"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Institutional Head
            </button>
          </nav>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === "institution" ? (
            // Institution Tab
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Institution Information
              </h2>

              {/* Institution Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={institutionData.name}
                  onChange={(e) =>
                    setInstitutionData({ ...institutionData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Institution Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="College"
                      checked={institutionData.institutionType === "College"}
                      onChange={(e) =>
                        setInstitutionData({
                          ...institutionData,
                          institutionType: e.target.value as "College" | "University",
                          collegeType:
                            e.target.value === "University" ? "" : institutionData.collegeType,
                        })
                      }
                      className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">College</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="University"
                      checked={institutionData.institutionType === "University"}
                      onChange={(e) =>
                        setInstitutionData({
                          ...institutionData,
                          institutionType: e.target.value as "College" | "University",
                          collegeType:
                            e.target.value === "University" ? "" : institutionData.collegeType,
                        })
                      }
                      className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">University</span>
                  </label>
                </div>
              </div>

              {/* College Type (only if College) */}
              {institutionData.institutionType === "College" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    College Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={institutionData.collegeType}
                    onChange={(e) =>
                      setInstitutionData({ ...institutionData, collegeType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={institutionData.location}
                  onChange={(e) =>
                    setInstitutionData({ ...institutionData, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  value={institutionData.establishedYear}
                  onChange={(e) =>
                    setInstitutionData({ ...institutionData, establishedYear: e.target.value })
                  }
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={institutionData.description}
                  onChange={(e) =>
                    setInstitutionData({ ...institutionData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          ) : (
            // Institutional Head Tab
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Institutional Head
                </h2>
                {university.institutionalHead && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Current: {university.institutionalHead.name}
                  </span>
                )}
              </div>

              {/* Toggle Head Assignment */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
                  <input
                    type="radio"
                    checked={headData.hasHead === true}
                    onChange={() => setHeadData({ ...headData, hasHead: true })}
                    className="mt-0.5 w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {university.institutionalHead ? "Edit institutional head" : "Assign institutional head"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {university.institutionalHead
                        ? "Update the current head's information"
                        : "Add an institutional head to this institution"}
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
                  <input
                    type="radio"
                    checked={headData.hasHead === false}
                    onChange={() => setHeadData({ ...headData, hasHead: false })}
                    className="mt-0.5 w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      No institutional head
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Leave without an assigned head
                    </div>
                  </div>
                </label>
              </div>

              {/* Head Fields (conditional) */}
              {headData.hasHead && (
                <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Head Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Head Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={headData.headName}
                      onChange={(e) => setHeadData({ ...headData, headName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={headData.headEmail}
                      onChange={(e) => setHeadData({ ...headData, headEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={headData.headPhone}
                      onChange={(e) => setHeadData({ ...headData, headPhone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={headData.headAddress}
                      onChange={(e) => setHeadData({ ...headData, headAddress: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>⚠️ Note:</strong> {university.institutionalHead ? "Changes will also update the associated admin account." : "An admin account will be created for this institutional head."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={activeTab === "institution" ? handleSaveInstitution : handleSaveHead}
            disabled={isSubmitting}
            className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

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
