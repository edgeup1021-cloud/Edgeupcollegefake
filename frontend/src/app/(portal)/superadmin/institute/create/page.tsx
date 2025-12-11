"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
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

interface InstitutionData {
  name: string;
  institutionType: "College" | "University";
  collegeType: string;
  location: string;
  establishedYear: string;
  description: string;
}

interface HeadData {
  assignHead: boolean;
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

export default function CreateInstitutePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Institution Data
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    name: "",
    institutionType: "College",
    collegeType: "",
    location: "",
    establishedYear: "",
    description: "",
  });

  // Step 2: Head Data
  const [headData, setHeadData] = useState<HeadData>({
    assignHead: false,
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

  // Validate Step 1
  const validateStep1 = (): boolean => {
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

  // Validate Step 2
  const validateStep2 = (): boolean => {
    if (headData.assignHead) {
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

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleCancel = () => {
    if (
      institutionData.name ||
      institutionData.location ||
      institutionData.description ||
      headData.headName ||
      headData.headEmail
    ) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/superadmin/institute");
      }
    } else {
      router.push("/superadmin/institute");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

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

      // Add institutional head data if assignHead is checked
      if (headData.assignHead) {
        payload.institutionalHead = {
          name: headData.headName,
          email: headData.headEmail,
          phone: headData.headPhone,
          address: headData.headAddress || null,
        };
      }

      const response = await fetch("http://localhost:3001/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create institution");
      }

      showToast(
        headData.assignHead
          ? "Institution and head created successfully! Admin account has been set up."
          : "Institution created successfully",
        "success"
      );

      // Redirect after short delay to show toast
      setTimeout(() => {
        router.push("/superadmin/institute");
      }, 1500);
    } catch (error) {
      console.error("Error creating institution:", error);
      showToast("Failed to create institution", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create New Institute
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add a new college or university to the system
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                currentStep >= 1
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep >= 1
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Institution Details
            </span>
          </div>

          <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-700" />

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                currentStep >= 2
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep >= 2
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Institutional Head
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {currentStep === 1 ? (
            // Step 1: Institution Details
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
                  placeholder="e.g., ABC College of Engineering"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                          collegeType: e.target.value === "University" ? "" : institutionData.collegeType,
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
                          collegeType: e.target.value === "University" ? "" : institutionData.collegeType,
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
                  placeholder="e.g., Chennai, Tamil Nadu"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                  placeholder="e.g., 1949"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                  placeholder="Brief description about the institution..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          ) : (
            // Step 2: Institutional Head
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Institutional Head
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Would you like to assign an institutional head now?
              </p>

              {/* Radio Options */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
                  <input
                    type="radio"
                    checked={headData.assignHead === true}
                    onChange={() => setHeadData({ ...headData, assignHead: true })}
                    className="mt-0.5 w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Yes, assign institutional head now
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Create an admin account for the institutional head
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
                  <input
                    type="radio"
                    checked={headData.assignHead === false}
                    onChange={() => setHeadData({ ...headData, assignHead: false })}
                    className="mt-0.5 w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      No, I'll assign a head later
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      You can add an institutional head from the edit page
                    </div>
                  </div>
                </label>
              </div>

              {/* Head Fields (conditional) */}
              {headData.assignHead && (
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
                      placeholder="e.g., Dr. John Smith"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                      placeholder="e.g., principal@college.edu"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                      placeholder="e.g., +91 9876543210"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                      placeholder="Residential address..."
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>ℹ️ Note:</strong> An admin account will be created automatically for
                      this institutional head with login credentials sent to their email.
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

          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {currentStep === 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                Next: Add Head
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Institute"}
              </button>
            )}
          </div>
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
