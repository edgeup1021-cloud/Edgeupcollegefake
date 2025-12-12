"use client";

import type { MCQQuestion } from "@/types/question-generator.types";
import { CheckCircle2, Circle } from "lucide-react";

interface MCQQuestionCardProps {
  question: MCQQuestion;
  questionNumber: number;
}

export default function MCQQuestionCard({ question, questionNumber }: MCQQuestionCardProps) {
  const options = question.options || {};
  const correctAnswer = question.correct_answer;

  // Convert options object to array of [key, value] pairs
  const optionEntries = Object.entries(options);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {questionNumber}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                MCQ
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

      {/* Options */}
      <div className="ml-11 space-y-3">
        {optionEntries.map(([key, value]) => {
          const isCorrect = key.toLowerCase() === correctAnswer?.toLowerCase();

          return (
            <div
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600"
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    {key}.
                  </span>
                  <span className={`flex-1 ${isCorrect ? "font-medium text-green-900 dark:text-green-100" : "text-gray-700 dark:text-gray-300"}`}>
                    {value}
                  </span>
                  {isCorrect && (
                    <span className="text-xs font-medium px-2 py-0.5 bg-green-600 dark:bg-green-500 text-white rounded">
                      Correct
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="ml-11 mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Explanation:
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
