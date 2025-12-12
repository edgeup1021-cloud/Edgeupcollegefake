"use client";

import type { GeneratedQuestion } from "@/types/question-generator.types";
import MCQQuestionCard from "./MCQQuestionCard";
import DescriptiveQuestionCard from "./DescriptiveQuestionCard";
import { CheckCircle } from "lucide-react";

interface QuestionsListProps {
  questions: GeneratedQuestion[];
}

export default function QuestionsList({ questions }: QuestionsListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Questions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {questions.length} {questions.length === 1 ? "question" : "questions"} created successfully
            </p>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {questions.map((question, index) => (
            <div key={index}>
              {question.question_type === "mcq" ? (
                <MCQQuestionCard question={question} questionNumber={index + 1} />
              ) : (
                <DescriptiveQuestionCard question={question} questionNumber={index + 1} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
