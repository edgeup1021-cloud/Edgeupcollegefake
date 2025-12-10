"use client";

import { useState } from "react";
import { CourseWizardState, CourseSubject } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface StepSubjectsProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SubjectFormData {
  name: string;
  code: string;
  credits: number;
  typeId: number | null;
  description: string;
}

export default function StepSubjects({
  state,
  updateState,
  onNext,
  onBack,
}: StepSubjectsProps) {
  // Track which programs/semesters are expanded
  const [expandedPrograms, setExpandedPrograms] = useState<Set<number>>(new Set());

  // Initialize subjects state for each semester
  const [subjectsBySemester, setSubjectsBySemester] = useState<
    Record<number, SubjectFormData[]>
  >(() => {
    const initial: Record<number, SubjectFormData[]> = {};
    state.programs.forEach((program) => {
      const programSemesters = state.semesters[program.id || 0] || [];
      programSemesters.forEach((semester) => {
        const existingSubjects = state.subjects.filter(s => s.semesterId === semester.id) || [];
        initial[semester.id || 0] = existingSubjects.length > 0
          ? existingSubjects.map(s => ({
              name: s.name,
              code: s.code,
              credits: s.credits,
              typeId: s.typeId ?? null,
              description: s.description || ""
            }))
          : [];
      });
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleProgram = (programId: number) => {
    const newExpanded = new Set(expandedPrograms);
    if (newExpanded.has(programId)) {
      newExpanded.delete(programId);
    } else {
      newExpanded.add(programId);
    }
    setExpandedPrograms(newExpanded);
  };

  const addSubject = (semesterId: number) => {
    setSubjectsBySemester((prev) => ({
      ...prev,
      [semesterId]: [
        ...(prev[semesterId] || []),
        { name: "", code: "", credits: 3, typeId: null, description: "" },
      ],
    }));
  };

  const removeSubject = (semesterId: number, index: number) => {
    setSubjectsBySemester((prev) => ({
      ...prev,
      [semesterId]: prev[semesterId].filter((_, i) => i !== index),
    }));
  };

  const updateSubject = (
    semesterId: number,
    index: number,
    field: keyof SubjectFormData,
    value: string | number | null
  ) => {
    setSubjectsBySemester((prev) => ({
      ...prev,
      [semesterId]: prev[semesterId].map((subj, i) =>
        i === index ? { ...subj, [field]: value } : subj
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // At least one subject should be defined across all semesters
    const totalSubjects = Object.values(subjectsBySemester).reduce(
      (sum, subjects) => sum + subjects.length,
      0
    );

    if (totalSubjects === 0) {
      newErrors.general = "At least one subject must be defined";
      isValid = false;
    }

    Object.entries(subjectsBySemester).forEach(([semId, subjects]) => {
      subjects.forEach((subj, index) => {
        if (!subj.name.trim()) {
          newErrors[`${semId}_${index}_name`] = "Subject name required";
          isValid = false;
        }
        if (!subj.code.trim()) {
          newErrors[`${semId}_${index}_code`] = "Subject code required";
          isValid = false;
        }
        if (!subj.credits || subj.credits < 1) {
          newErrors[`${semId}_${index}_credits`] = "Valid credits required";
          isValid = false;
        }
        if (!subj.typeId) {
          newErrors[`${semId}_${index}_type`] = "Course type required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Convert form data to subject entities
    const subjects: CourseSubject[] = [];
    let globalId = 1;

    Object.entries(subjectsBySemester).forEach(([semId, semSubjects]) => {
      semSubjects.forEach((subj) => {
        subjects.push({
          id: globalId++,
          semesterId: parseInt(semId),
          name: subj.name,
          code: subj.code,
          credits: subj.credits,
          typeId: subj.typeId!,
          description: subj.description || null,
        });
      });
    });

    updateState({ subjects });
    onNext();
  };

  if (state.types.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 6: Add Subjects
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please define at least one course type in Step 5 before adding subjects.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t dark:border-gray-700">
          <Button onClick={onBack} variant="outline">
            Back to Types
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 6: Add Subjects
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add subjects for each semester across all programs
        </p>
      </div>

      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{errors.general}</p>
        </div>
      )}

      <div className="space-y-4">
        {state.programs.map((program) => {
          const programId = program.id || 0;
          const programSemesters = state.semesters[programId] || [];
          const isExpanded = expandedPrograms.has(programId);

          return (
            <div
              key={programId}
              className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
            >
              <button
                onClick={() => toggleProgram(programId)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {program.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {programSemesters.length} semester(s) · {program.code}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {programSemesters.reduce(
                    (total, sem) =>
                      total + (subjectsBySemester[sem.id || 0]?.length || 0),
                    0
                  )}{" "}
                  subject(s)
                </div>
              </button>

              {isExpanded && (
                <div className="border-t dark:border-gray-700 p-4 space-y-4">
                  {programSemesters.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No semesters defined for this program. Go back to Step 4 to add semesters.
                    </p>
                  ) : (
                    programSemesters
                      .sort((a, b) => a.semesterNumber - b.semesterNumber)
                      .map((semester) => {
                        const semesterId = semester.id || 0;
                        const semesterSubjects = subjectsBySemester[semesterId] || [];

                        return (
                          <div
                            key={semesterId}
                            className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Semester {semester.semesterNumber}
                                </h4>
                                {semester.academicYear && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {semester.academicYear}
                                  </p>
                                )}
                              </div>
                              <Button
                                onClick={() => addSubject(semesterId)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Subject
                              </Button>
                            </div>

                            {semesterSubjects.length > 0 ? (
                              <div className="space-y-2">
                                {semesterSubjects.map((subj, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700"
                                  >
                                    <div className="col-span-3">
                                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Subject Name *
                                      </label>
                                      <input
                                        type="text"
                                        value={subj.name}
                                        onChange={(e) =>
                                          updateSubject(
                                            semesterId,
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="e.g., Data Structures"
                                      />
                                      {errors[`${semesterId}_${index}_name`] && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                                          {errors[`${semesterId}_${index}_name`]}
                                        </p>
                                      )}
                                    </div>

                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Code *
                                      </label>
                                      <input
                                        type="text"
                                        value={subj.code}
                                        onChange={(e) =>
                                          updateSubject(
                                            semesterId,
                                            index,
                                            "code",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="CS201"
                                      />
                                      {errors[`${semesterId}_${index}_code`] && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                                          {errors[`${semesterId}_${index}_code`]}
                                        </p>
                                      )}
                                    </div>

                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Credits *
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={subj.credits}
                                        onChange={(e) =>
                                          updateSubject(
                                            semesterId,
                                            index,
                                            "credits",
                                            parseInt(e.target.value) || 1
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                      />
                                      {errors[`${semesterId}_${index}_credits`] && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                                          {errors[`${semesterId}_${index}_credits`]}
                                        </p>
                                      )}
                                    </div>

                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Type *
                                      </label>
                                      <select
                                        value={subj.typeId || ""}
                                        onChange={(e) =>
                                          updateSubject(
                                            semesterId,
                                            index,
                                            "typeId",
                                            parseInt(e.target.value) || null
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                      >
                                        <option value="">Select</option>
                                        {state.types.map((type) => (
                                          <option key={type.id} value={type.id}>
                                            {type.name}
                                          </option>
                                        ))}
                                      </select>
                                      {errors[`${semesterId}_${index}_type`] && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                                          {errors[`${semesterId}_${index}_type`]}
                                        </p>
                                      )}
                                    </div>

                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                      </label>
                                      <input
                                        type="text"
                                        value={subj.description}
                                        onChange={(e) =>
                                          updateSubject(
                                            semesterId,
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Optional"
                                      />
                                    </div>

                                    <div className="col-span-1 flex items-end justify-center">
                                      <Button
                                        onClick={() => removeSubject(semesterId, index)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No subjects added yet
                              </p>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          Next: Topics
        </Button>
      </div>
    </div>
  );
}
