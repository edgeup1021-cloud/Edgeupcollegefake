"use client";

import { useState } from "react";
import { CourseWizardState, ProgramSemester } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepSemestersProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SemesterFormData {
  semesterNumber: number;
  academicYear: string;
  description: string;
}

export default function StepSemesters({
  state,
  updateState,
  onNext,
  onBack,
}: StepSemestersProps) {
  // Initialize semesters state for each program
  const [semestersByProgram, setSemestersByProgram] = useState<
    Record<number, SemesterFormData[]>
  >(() => {
    const initial: Record<number, SemesterFormData[]> = {};
    state.programs.forEach((program) => {
      const existingSems = state.semesters[program.id || 0] || [];
      initial[program.id || 0] = existingSems.length > 0
        ? existingSems.map(s => ({
            semesterNumber: s.semesterNumber,
            academicYear: s.academicYear || "",
            description: s.description || ""
          }))
        : [{ semesterNumber: 1, academicYear: "", description: "" }];
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSemester = (programId: number) => {
    const currentSemesters = semestersByProgram[programId] || [];
    const nextSemesterNumber = currentSemesters.length > 0
      ? Math.max(...currentSemesters.map(s => s.semesterNumber)) + 1
      : 1;

    setSemestersByProgram((prev) => ({
      ...prev,
      [programId]: [
        ...currentSemesters,
        { semesterNumber: nextSemesterNumber, academicYear: "", description: "" },
      ],
    }));
  };

  const removeSemester = (programId: number, index: number) => {
    setSemestersByProgram((prev) => ({
      ...prev,
      [programId]: prev[programId].filter((_, i) => i !== index),
    }));
  };

  const updateSemester = (
    programId: number,
    index: number,
    field: keyof SemesterFormData,
    value: string | number
  ) => {
    setSemestersByProgram((prev) => ({
      ...prev,
      [programId]: prev[programId].map((sem, i) =>
        i === index ? { ...sem, [field]: value } : sem
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    state.programs.forEach((program) => {
      const programId = program.id || 0;
      const semesters = semestersByProgram[programId] || [];

      if (semesters.length === 0) {
        newErrors[`program_${programId}`] = `At least one semester required for ${program.name}`;
        isValid = false;
      }

      // Check for duplicate semester numbers
      const semesterNumbers = semesters.map(s => s.semesterNumber);
      const hasDuplicates = semesterNumbers.some((num, idx) =>
        semesterNumbers.indexOf(num) !== idx
      );
      if (hasDuplicates) {
        newErrors[`program_${programId}_duplicates`] = "Duplicate semester numbers found";
        isValid = false;
      }

      semesters.forEach((sem, index) => {
        if (!sem.semesterNumber || sem.semesterNumber < 1) {
          newErrors[`${programId}_${index}_number`] = "Valid semester number required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Convert form data to semester entities
    const semesters: Record<number, ProgramSemester[]> = {};
    state.programs.forEach((program) => {
      const programId = program.id || 0;
      semesters[programId] = (semestersByProgram[programId] || []).map((sem, index) => ({
        id: index + 1,
        programId,
        semesterNumber: sem.semesterNumber,
        academicYear: sem.academicYear || null,
        description: sem.description || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    updateState({ semesters });
    onNext();
  };

  if (state.programs.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 4: Add Semesters
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please add at least one program in Step 2 before adding semesters.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t dark:border-gray-700">
          <Button onClick={onBack} variant="outline">
            Back to Departments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 4: Add Semesters
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Define semesters for each program
        </p>
      </div>

      {state.programs.map((program) => {
        const programId = program.id || 0;
        const programSems = semestersByProgram[programId] || [];

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
                  {program.durationYears} years · {program.code}
                </p>
              </div>
              <Button
                onClick={() => addSemester(programId)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Semester
              </Button>
            </div>

            {errors[`program_${programId}`] && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors[`program_${programId}`]}
              </p>
            )}
            {errors[`program_${programId}_duplicates`] && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors[`program_${programId}_duplicates`]}
              </p>
            )}

            <div className="space-y-3">
              {programSems
                .sort((a, b) => a.semesterNumber - b.semesterNumber)
                .map((sem, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Semester Number *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={sem.semesterNumber}
                        onChange={(e) =>
                          updateSemester(
                            programId,
                            index,
                            "semesterNumber",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="1"
                      />
                      {errors[`${programId}_${index}_number`] && (
                        <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                          {errors[`${programId}_${index}_number`]}
                        </p>
                      )}
                    </div>

                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={sem.academicYear}
                        onChange={(e) =>
                          updateSemester(
                            programId,
                            index,
                            "academicYear",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g., 2024-2025"
                      />
                    </div>

                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={sem.description}
                        onChange={(e) =>
                          updateSemester(
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
                        onClick={() => removeSemester(programId, index)}
                        variant="outline"
                        size="sm"
                        disabled={programSems.length === 1}
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
          Next: Course Types
        </Button>
      </div>
    </div>
  );
}
