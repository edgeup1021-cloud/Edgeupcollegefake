"use client";

import { useState } from "react";
import { CourseWizardState } from "@/types/course.types";
import { Check } from "lucide-react";
import StepUniversity from "./steps/StepUniversity";
import StepPrograms from "./steps/StepPrograms";
import StepDepartments from "./steps/StepDepartments";
import StepSemesters from "./steps/StepSemesters";
import StepTypes from "./steps/StepTypes";
import StepSubjects from "./steps/StepSubjects";
import StepTopics from "./steps/StepTopics";
import StepSubtopics from "./steps/StepSubtopics";

const STEPS = [
  { id: 1, name: "University", description: "Curriculum authority (e.g., Anna Univ)" },
  { id: 2, name: "Programs", description: "Add multiple programs" },
  { id: 3, name: "Departments", description: "Departments per program" },
  { id: 4, name: "Semesters", description: "Define semesters" },
  { id: 5, name: "Types", description: "Core/Elective types" },
  { id: 6, name: "Subjects", description: "Course subjects" },
  { id: 7, name: "Topics", description: "Topics per subject" },
  { id: 8, name: "Sub-topics", description: "Sub-topics with content" },
];

export default function CourseWizard() {
  const [wizardState, setWizardState] = useState<CourseWizardState>({
    currentStep: 1,
    university: null,
    programs: [],
    departments: {},
    semesters: {},
    types: [],
    subjects: [],
    topics: {},
    subtopics: {},
  });

  const updateWizardState = (updates: Partial<CourseWizardState>) => {
    setWizardState((prev) => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    if (wizardState.currentStep < STEPS.length) {
      updateWizardState({ currentStep: wizardState.currentStep + 1 });
    }
  };

  const goToPreviousStep = () => {
    if (wizardState.currentStep > 1) {
      updateWizardState({ currentStep: wizardState.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      updateWizardState({ currentStep: step });
    }
  };

  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 1:
        return (
          <StepUniversity
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <StepPrograms
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <StepDepartments
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <StepSemesters
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <StepTypes
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 6:
        return (
          <StepSubjects
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 7:
        return (
          <StepTopics
            state={wizardState}
            updateState={updateWizardState}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 8:
        return (
          <StepSubtopics
            state={wizardState}
            updateState={updateWizardState}
            onBack={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => goToStep(step.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  wizardState.currentStep === step.id
                    ? "border-brand-primary bg-brand-primary text-white"
                    : wizardState.currentStep > step.id
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                }`}
              >
                {wizardState.currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </button>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    wizardState.currentStep >= step.id
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-full mx-4 ${
                    wizardState.currentStep > step.id
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        {renderStep()}
      </div>
    </div>
  );
}
