"use client";

import { useState } from "react";
import { CourseWizardState, CourseType } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepTypesProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface TypeFormData {
  name: string;
  code: string;
  description: string;
}

export default function StepTypes({
  state,
  updateState,
  onNext,
  onBack,
}: StepTypesProps) {
  const [types, setTypes] = useState<TypeFormData[]>(() => {
    if (state.types.length > 0) {
      return state.types.map(t => ({
        name: t.name,
        code: t.code,
        description: t.description || ""
      }));
    }
    // Default course types
    return [
      { name: "Core", code: "CORE", description: "Mandatory core subjects" },
      { name: "Elective", code: "ELECT", description: "Optional elective subjects" },
      { name: "Lab", code: "LAB", description: "Laboratory/practical subjects" },
    ];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addType = () => {
    setTypes([...types, { name: "", code: "", description: "" }]);
  };

  const removeType = (index: number) => {
    setTypes(types.filter((_, i) => i !== index));
  };

  const updateType = (
    index: number,
    field: keyof TypeFormData,
    value: string
  ) => {
    setTypes(types.map((type, i) =>
      i === index ? { ...type, [field]: value } : type
    ));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (types.length === 0) {
      newErrors.general = "At least one course type is required";
      isValid = false;
    }

    types.forEach((type, index) => {
      if (!type.name.trim()) {
        newErrors[`${index}_name`] = "Type name is required";
        isValid = false;
      }
      if (!type.code.trim()) {
        newErrors[`${index}_code`] = "Type code is required";
        isValid = false;
      }
    });

    // Check for duplicate codes
    const codes = types.map(t => t.code.trim().toUpperCase());
    const hasDuplicates = codes.some((code, idx) => code && codes.indexOf(code) !== idx);
    if (hasDuplicates) {
      newErrors.duplicates = "Duplicate type codes found";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;

    const courseTypes: CourseType[] = types.map((type, index) => ({
      id: index + 1,
      name: type.name,
      code: type.code.toUpperCase(),
      description: type.description || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    updateState({ types: courseTypes });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 5: Define Course Types
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Define types of courses (e.g., Core, Elective, Lab)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course Types
          </h3>
          <Button
            onClick={addType}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </Button>
        </div>

        {errors.general && (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.general}
          </p>
        )}
        {errors.duplicates && (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.duplicates}
          </p>
        )}

        <div className="space-y-3">
          {types.map((type, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type Name *
                </label>
                <input
                  type="text"
                  value={type.name}
                  onChange={(e) => updateType(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., Core"
                />
                {errors[`${index}_name`] && (
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                    {errors[`${index}_name`]}
                  </p>
                )}
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={type.code}
                  onChange={(e) =>
                    updateType(index, "code", e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., CORE"
                />
                {errors[`${index}_code`] && (
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                    {errors[`${index}_code`]}
                  </p>
                )}
              </div>

              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={type.description}
                  onChange={(e) =>
                    updateType(index, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Optional description"
                />
              </div>

              <div className="col-span-1 flex items-end">
                <Button
                  onClick={() => removeType(index)}
                  variant="outline"
                  size="sm"
                  disabled={types.length === 1}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Common course types include Core (mandatory), Elective (optional), Lab (practical), Optional (non-credit), and Research Project.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          Next: Subjects
        </Button>
      </div>
    </div>
  );
}
