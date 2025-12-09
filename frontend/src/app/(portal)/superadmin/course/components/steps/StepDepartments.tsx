"use client";

import { useState } from "react";
import { CourseWizardState, ProgramDepartment } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepDepartmentsProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
}

export default function StepDepartments({
  state,
  updateState,
  onNext,
  onBack,
}: StepDepartmentsProps) {
  // Initialize departments state for each program
  const [departmentsByProgram, setDepartmentsByProgram] = useState<
    Record<number, DepartmentFormData[]>
  >(() => {
    const initial: Record<number, DepartmentFormData[]> = {};
    state.programs.forEach((program) => {
      const existingDepts = state.departments[program.id || 0] || [];
      initial[program.id || 0] = existingDepts.length > 0
        ? existingDepts.map(d => ({ name: d.name, code: d.code, description: d.description || "" }))
        : [{ name: "", code: "", description: "" }];
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addDepartment = (programId: number) => {
    setDepartmentsByProgram((prev) => ({
      ...prev,
      [programId]: [
        ...(prev[programId] || []),
        { name: "", code: "", description: "" },
      ],
    }));
  };

  const removeDepartment = (programId: number, index: number) => {
    setDepartmentsByProgram((prev) => ({
      ...prev,
      [programId]: prev[programId].filter((_, i) => i !== index),
    }));
  };

  const updateDepartment = (
    programId: number,
    index: number,
    field: keyof DepartmentFormData,
    value: string
  ) => {
    setDepartmentsByProgram((prev) => ({
      ...prev,
      [programId]: prev[programId].map((dept, i) =>
        i === index ? { ...dept, [field]: value } : dept
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    state.programs.forEach((program) => {
      const programId = program.id || 0;
      const departments = departmentsByProgram[programId] || [];

      if (departments.length === 0) {
        newErrors[`program_${programId}`] = `At least one department required for ${program.name}`;
        isValid = false;
      }

      departments.forEach((dept, index) => {
        if (!dept.name.trim()) {
          newErrors[`${programId}_${index}_name`] = "Department name is required";
          isValid = false;
        }
        if (!dept.code.trim()) {
          newErrors[`${programId}_${index}_code`] = "Department code is required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Convert form data to department entities
    const departments: Record<number, ProgramDepartment[]> = {};
    state.programs.forEach((program) => {
      const programId = program.id || 0;
      departments[programId] = (departmentsByProgram[programId] || []).map((dept, index) => ({
        id: index + 1,
        programId,
        name: dept.name,
        code: dept.code,
        description: dept.description || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    updateState({ departments });
    onNext();
  };

  if (state.programs.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 3: Add Departments
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please add at least one program in Step 2 before adding departments.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t dark:border-gray-700">
          <Button onClick={onBack} variant="outline">
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 3: Add Departments
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add departments for each program
        </p>
      </div>

      {state.programs.map((program) => {
        const programId = program.id || 0;
        const programDepts = departmentsByProgram[programId] || [];

        return (
          <div
            key={programId}
            className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {program.code}
                </p>
              </div>
              <Button
                onClick={() => addDepartment(programId)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </div>

            {errors[`program_${programId}`] && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors[`program_${programId}`]}
              </p>
            )}

            <div className="space-y-3">
              {programDepts.map((dept, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) =>
                        updateDepartment(programId, index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Computer Science"
                    />
                    {errors[`${programId}_${index}_name`] && (
                      <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                        {errors[`${programId}_${index}_name`]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={dept.code}
                      onChange={(e) =>
                        updateDepartment(programId, index, "code", e.target.value)
                      }
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., CS"
                    />
                    {errors[`${programId}_${index}_code`] && (
                      <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                        {errors[`${programId}_${index}_code`]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={dept.description}
                      onChange={(e) =>
                        updateDepartment(
                          programId,
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Optional description"
                    />
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      onClick={() => removeDepartment(programId, index)}
                      variant="outline"
                      size="sm"
                      disabled={programDepts.length === 1}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          Next: Semesters
        </Button>
      </div>
    </div>
  );
}
