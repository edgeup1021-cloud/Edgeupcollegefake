"use client";

import { useState } from "react";
import { CourseWizardState, University } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface StepUniversityProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
}

export default function StepUniversity({
  state,
  updateState,
  onNext,
}: StepUniversityProps) {
  const [formData, setFormData] = useState<University>(
    state.university || {
      name: "",
      code: "",
      stateRegion: "",
      establishedYear: null,
      description: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "University name is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "University code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateState({ university: formData });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
          <Building2 className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Curriculum Authority
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a university that defines official curriculum (e.g., Anna University, VTU, Mumbai University)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Anna University"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* University Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., AU"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.code ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code}</p>
          )}
        </div>

        {/* State/Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State/Region
          </label>
          <input
            type="text"
            name="stateRegion"
            value={formData.stateRegion}
            onChange={handleChange}
            placeholder="e.g., Tamil Nadu, Karnataka, Maharashtra"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Established Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Established Year
          </label>
          <input
            type="number"
            name="establishedYear"
            value={formData.establishedYear || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                establishedYear: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            placeholder="e.g., 1861"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Brief description about the university and its curriculum framework..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleNext}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
        >
          Next: Add Programs
        </Button>
      </div>
    </div>
  );
}
