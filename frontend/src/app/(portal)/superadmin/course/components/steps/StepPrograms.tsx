"use client";

import { useState } from "react";
import { CourseWizardState, Program } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface StepProgramsProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPrograms({
  state,
  updateState,
  onNext,
  onBack,
}: StepProgramsProps) {
  const [programs, setPrograms] = useState<Program[]>(
    state.programs.length > 0
      ? state.programs
      : [
          {
            name: "",
            code: "",
            durationYears: 4,
            degreeType: "",
            description: "",
          },
        ]
  );

  const addProgram = () => {
    setPrograms([
      ...programs,
      {
        name: "",
        code: "",
        durationYears: 4,
        degreeType: "",
        description: "",
      },
    ]);
  };

  const removeProgram = (index: number) => {
    if (programs.length > 1) {
      setPrograms(programs.filter((_, i) => i !== index));
    }
  };

  const updateProgram = (index: number, field: keyof Program, value: any) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const handleNext = () => {
    // Filter out empty programs
    const validPrograms = programs.filter(
      (p) => p.name.trim() && p.code.trim()
    );
    if (validPrograms.length === 0) {
      alert("Please add at least one program");
      return;
    }
    updateState({ programs: validPrograms });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-light dark:bg-brand-primary/20">
            <GraduationCap className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Programs
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add multiple programs for {state.university?.name}
            </p>
          </div>
        </div>
        <Button
          onClick={addProgram}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </Button>
      </div>

      <div className="space-y-6">
        {programs.map((program, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Program {index + 1}
              </h3>
              {programs.length > 1 && (
                <button
                  onClick={() => removeProgram(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) =>
                    updateProgram(index, "name", e.target.value)
                  }
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Program Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Program Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={program.code}
                  onChange={(e) =>
                    updateProgram(index, "code", e.target.value)
                  }
                  placeholder="e.g., BSC-CS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (Years)
                </label>
                <input
                  type="number"
                  value={program.durationYears}
                  onChange={(e) =>
                    updateProgram(index, "durationYears", parseInt(e.target.value))
                  }
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Degree Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree Type
                </label>
                <select
                  value={program.degreeType}
                  onChange={(e) =>
                    updateProgram(index, "degreeType", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select degree type</option>
                  <option value="BSc">Bachelor of Science (BSc)</option>
                  <option value="BA">Bachelor of Arts (BA)</option>
                  <option value="BBA">Bachelor of Business Administration (BBA)</option>
                  <option value="BTech">Bachelor of Technology (BTech)</option>
                  <option value="MSc">Master of Science (MSc)</option>
                  <option value="MA">Master of Arts (MA)</option>
                  <option value="MBA">Master of Business Administration (MBA)</option>
                  <option value="MTech">Master of Technology (MTech)</option>
                  <option value="PhD">Doctor of Philosophy (PhD)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={program.description || ''}
                onChange={(e) =>
                  updateProgram(index, "description", e.target.value)
                }
                rows={2}
                placeholder="Brief description of the program..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onBack} variant="outline" className="px-8">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8"
        >
          Next: Add Departments
        </Button>
      </div>
    </div>
  );
}
