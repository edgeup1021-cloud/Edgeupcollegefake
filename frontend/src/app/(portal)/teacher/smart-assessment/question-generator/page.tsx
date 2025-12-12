"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionGeneratorSchema } from "@/lib/validations/question-generator";
import { generateQuestions } from "@/services/question-generator.service";
import type {
  QuestionGeneratorFormData,
  GeneratedQuestion,
} from "@/types/question-generator.types";
import { Sparkles, AlertCircle } from "lucide-react";
import QuestionGeneratorForm from "./components/QuestionGeneratorForm";
import QuestionsList from "./components/QuestionsList";

export default function QuestionGeneratorPage() {
  const { user } = useAuth();
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuestionGeneratorFormData>({
    resolver: zodResolver(questionGeneratorSchema),
    defaultValues: {
      // College Information
      university: "",
      course: "",
      department: "",
      semester: undefined as any,
      paper_type: undefined as any,

      // Question Parameters
      subject: "",
      topic: "",
      subtopic: "",

      // Question Configuration
      question_type: "descriptive",
      descriptive_type: undefined,
      num_questions: 5,
      instructions: "",
    },
  });

  const onSubmit = async (data: QuestionGeneratorFormData) => {
    if (!user?.id) {
      setError("You must be logged in to generate questions");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);

    try {
      const response = await generateQuestions(user.id, data);

      if (response.success && response.questions.length > 0) {
        setGeneratedQuestions(response.questions);
      } else {
        setError("No questions were generated. Please try again with different parameters.");
      }
    } catch (err: any) {
      console.error("Question generation error:", err);

      if (err.status === 503) {
        setError("AI service is temporarily unavailable. Please try again in a few moments.");
      } else if (err.status === 408) {
        setError("Request timed out. Try reducing the number of questions or simplifying the topic.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Question Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate MCQ and descriptive questions powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mb-8">
          <QuestionGeneratorForm
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            isLoading={isGenerating}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                    Generation Failed
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {generatedQuestions.length > 0 && (
          <div>
            <QuestionsList questions={generatedQuestions} />
          </div>
        )}

        {/* Empty State - Only show if not generating and no questions */}
        {!isGenerating && generatedQuestions.length === 0 && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Generate Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Fill in the form above and click "Generate Questions" to create AI-powered
              assessment questions for your students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
