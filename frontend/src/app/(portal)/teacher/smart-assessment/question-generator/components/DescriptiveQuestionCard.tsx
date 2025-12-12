"use client";

import type { DescriptiveQuestion } from "@/types/question-generator.types";
import { FileText } from "lucide-react";

interface DescriptiveQuestionCardProps {
  question: DescriptiveQuestion;
  questionNumber: number;
}

export default function DescriptiveQuestionCard({
  question,
  questionNumber,
}: DescriptiveQuestionCardProps) {
  const getDescriptiveTypeLabel = (type?: string) => {
    switch (type) {
      case "very_short":
        return "Very Short Answer";
      case "short":
        return "Short Answer";
      case "long_essay":
        return "Long Essay";
      default:
        return "Descriptive";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {questionNumber}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {getDescriptiveTypeLabel(question.descriptive_type)}
              </span>
              {question.difficulty && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    question.difficulty === "EASY"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : question.difficulty === "MEDIUM"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {question.difficulty}
                </span>
              )}
            </div>
            <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
              {question.question}
            </p>
          </div>
        </div>
      </div>

      {/* Expected Answer */}
      {question.expected_answer && (
        <div className="ml-11 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-brand-primary" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Expected Answer / Key Points:
            </h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {question.expected_answer}
          </p>
        </div>
      )}

      {/* Marking Rubric */}
      {question.marking_rubric && (
        <div className="ml-11 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Marking Rubric:
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {question.marking_rubric}
          </div>
        </div>
      )}

      {/* Metadata */}
      {(question.subject || question.topic || question.subtopic) && (
        <div className="ml-11 mt-4 flex items-center gap-2 flex-wrap">
          {question.subject && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              {question.subject}
            </span>
          )}
          {question.topic && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              {question.topic}
            </span>
          )}
          {question.subtopic && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              {question.subtopic}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
