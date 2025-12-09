"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import type { JobDescriptionData, DifficultyLevel } from "@/types/mock-interview.types";

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobDescriptionData) => void;
}

export default function JobDescriptionModal({ isOpen, onClose, onSubmit }: JobDescriptionModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [fullJD, setFullJD] = useState("");
  const [keyTechnologies, setKeyTechnologies] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);

  const [errors, setErrors] = useState({
    jobTitle: "",
    fullJD: "",
    keyTechnologies: "",
    difficulty: "",
  });

  if (!isOpen) return null;

  const validateJobTitle = (value: string): string => {
    if (!value.trim()) return "Job title is required";
    if (value.length < 3) return "Job title must be at least 3 characters";
    if (value.length > 100) return "Job title must be less than 100 characters";
    return "";
  };

  const validateFullJD = (value: string): string => {
    if (!value.trim()) return "Job description is required";
    if (value.length < 50) return "Job description must be at least 50 characters";
    if (value.length > 5000) return "Job description must be less than 5000 characters";
    return "";
  };

  const validateKeyTechnologies = (value: string): string => {
    if (!value.trim()) return "At least one technology is required";
    const techs = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (techs.length === 0) return "At least one technology is required";
    if (techs.length > 10) return "Maximum 10 technologies allowed";
    return "";
  };

  const handleSubmit = () => {
    // Validate all fields
    const jobTitleError = validateJobTitle(jobTitle);
    const fullJDError = validateFullJD(fullJD);
    const keyTechnologiesError = validateKeyTechnologies(keyTechnologies);
    const difficultyError = !difficulty ? "Please select a difficulty level" : "";

    setErrors({
      jobTitle: jobTitleError,
      fullJD: fullJDError,
      keyTechnologies: keyTechnologiesError,
      difficulty: difficultyError,
    });

    // If any errors, don't submit
    if (jobTitleError || fullJDError || keyTechnologiesError || difficultyError) {
      return;
    }

    // Parse technologies
    const technologies = keyTechnologies.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Submit data
    onSubmit({
      jobTitle: jobTitle.trim(),
      fullJD: fullJD.trim(),
      keyTechnologies: technologies,
      difficulty: difficulty!,
    });

    // Reset form
    setJobTitle("");
    setFullJD("");
    setKeyTechnologies("");
    setDifficulty(null);
    setErrors({ jobTitle: "", fullJD: "", keyTechnologies: "", difficulty: "" });
  };

  const isFormValid =
    jobTitle.trim().length >= 3 &&
    jobTitle.trim().length <= 100 &&
    fullJD.trim().length >= 50 &&
    fullJD.trim().length <= 5000 &&
    keyTechnologies.trim().length > 0 &&
    difficulty !== null;

  const difficultyOptions: { value: DifficultyLevel; label: string; description: string }[] = [
    { value: "easy", label: "Easy", description: "Entry-level questions, basic algorithms" },
    { value: "medium", label: "Medium", description: "Mid-level complexity, data structures" },
    { value: "hard", label: "Hard", description: "Advanced problems, system design" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Interview Setup
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tell us about the role you're preparing for
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  setErrors({ ...errors, jobTitle: "" });
                }}
                onBlur={() => setErrors({ ...errors, jobTitle: validateJobTitle(jobTitle) })}
                placeholder="e.g., Senior Full Stack Developer"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.jobTitle}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {jobTitle.length}/100 characters
              </p>
            </div>

            {/* Full Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={fullJD}
                onChange={(e) => {
                  setFullJD(e.target.value);
                  setErrors({ ...errors, fullJD: "" });
                }}
                onBlur={() => setErrors({ ...errors, fullJD: validateFullJD(fullJD) })}
                placeholder="Paste the full job description here. Include responsibilities, requirements, and qualifications..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={8}
                maxLength={5000}
              />
              {errors.fullJD && (
                <p className="mt-1 text-sm text-red-500">{errors.fullJD}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {fullJD.length}/5000 characters
              </p>
            </div>

            {/* Key Technologies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Key Technologies <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={keyTechnologies}
                onChange={(e) => {
                  setKeyTechnologies(e.target.value);
                  setErrors({ ...errors, keyTechnologies: "" });
                }}
                onBlur={() => setErrors({ ...errors, keyTechnologies: validateKeyTechnologies(keyTechnologies) })}
                placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.keyTechnologies && (
                <p className="mt-1 text-sm text-red-500">{errors.keyTechnologies}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate technologies with commas (max 10)
              </p>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Interview Difficulty <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDifficulty(option.value);
                      setErrors({ ...errors, difficulty: "" });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      difficulty === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
              {errors.difficulty && (
                <p className="mt-2 text-sm text-red-500">{errors.difficulty}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-600 hover:scale-105 shadow-lg"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
