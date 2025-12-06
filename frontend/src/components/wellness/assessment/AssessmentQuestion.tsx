"use client";

import { Info } from "@phosphor-icons/react";
import type { AssessmentQuestion as QuestionType } from "@/types/wellness.types";

interface AssessmentQuestionProps {
  question: QuestionType;
  value: number | null;
  onChange: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function AssessmentQuestion({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: AssessmentQuestionProps) {
  const renderLikertScale = () => {
    const labels = ["1", "2", "3", "4", "5"];
    const descriptions = ["Not at all", "Slightly", "Moderately", "Very", "Extremely"];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          {labels.map((label, index) => (
            <button
              key={label}
              onClick={() => onChange(index + 1)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                value === index + 1
                  ? "border-brand-primary bg-brand-primary/10 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 bg-white dark:bg-gray-800"
              }`}
            >
              <div className={`text-2xl font-bold mb-1 ${
                value === index + 1 ? "text-brand-primary" : "text-gray-700 dark:text-gray-300"
              }`}>
                {label}
              </div>
              <div className={`text-xs ${
                value === index + 1 ? "text-brand-primary font-medium" : "text-gray-500 dark:text-gray-400"
              }`}>
                {descriptions[index]}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderYesNo = () => {
    return (
      <div className="flex gap-4">
        <button
          onClick={() => onChange(1)}
          className={`flex-1 p-6 rounded-xl border-2 transition-all duration-200 ${
            value === 1
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 bg-white dark:bg-gray-800"
          }`}
        >
          <div className={`text-xl font-semibold ${
            value === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"
          }`}>
            Yes
          </div>
        </button>
        <button
          onClick={() => onChange(0)}
          className={`flex-1 p-6 rounded-xl border-2 transition-all duration-200 ${
            value === 0
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-red-500/50 bg-white dark:bg-gray-800"
          }`}
        >
          <div className={`text-xl font-semibold ${
            value === 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
          }`}>
            No
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Question Number */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
          Question {questionNumber} of {totalQuestions}
        </span>
        {question.helpText && (
          <div className="group relative">
            <Info className="w-5 h-5 text-gray-400 hover:text-brand-primary cursor-help transition-colors" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg z-10">
              {question.helpText}
              <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {question.question}
      </h3>

      {/* Answer Options */}
      <div className="mb-6">
        {question.type === "likert" && renderLikertScale()}
        {question.type === "yesno" && renderYesNo()}
      </div>

      {/* Help Text */}
      {question.helpText && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {question.helpText}
          </p>
        </div>
      )}
    </div>
  );
}
