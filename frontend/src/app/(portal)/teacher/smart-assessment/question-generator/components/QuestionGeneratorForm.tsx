"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import type { QuestionGeneratorFormData, DescriptiveTypeLabels } from "@/types/question-generator.types";
import { Loader2, RotateCcw } from "lucide-react";
import {
  getSubjects,
  getTopics,
  getSubtopics,
  getDepartments,
} from "@/services/question-generator.service";
import { DescriptiveTypeLabels as descriptiveLabels } from "@/types/question-generator.types";

interface QuestionGeneratorFormProps {
  form: UseFormReturn<QuestionGeneratorFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function QuestionGeneratorForm({
  form,
  onSubmit,
  isLoading,
}: QuestionGeneratorFormProps) {
  const { register, watch, setValue, formState: { errors }, reset } = form;

  // Watch for cascading dropdown changes
  const selectedCourse = watch("course");
  const selectedSubject = watch("subject");
  const selectedTopic = watch("topic");
  const questionType = watch("question_type");
  const numQuestions = watch("num_questions");

  // State for dropdown options
  const [departments, setDepartments] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState({
    departments: false,
    subjects: false,
    topics: false,
    subtopics: false,
  });

  // Fetch departments when course changes
  useEffect(() => {
    if (selectedCourse) {
      loadDepartments(selectedCourse);
      loadSubjects(selectedCourse);
      // Reset dependent fields
      setValue('department', '');
      setValue('subject', '');
      setValue('topic', '');
      setValue('subtopic', '');
      setTopics([]);
      setSubtopics([]);
    } else {
      setDepartments([]);
      setSubjects([]);
      setTopics([]);
      setSubtopics([]);
    }
  }, [selectedCourse]);

  // Fetch topics when subject changes
  useEffect(() => {
    if (selectedCourse && selectedSubject) {
      loadTopics(selectedCourse, selectedSubject);
      // Reset dependent fields
      setValue('topic', '');
      setValue('subtopic', '');
      setSubtopics([]);
    } else {
      setTopics([]);
      setSubtopics([]);
    }
  }, [selectedSubject]);

  // Fetch subtopics when topic changes
  useEffect(() => {
    if (selectedCourse && selectedSubject && selectedTopic) {
      loadSubtopics(selectedCourse, selectedSubject, selectedTopic);
      // Reset subtopic
      setValue('subtopic', '');
    } else {
      setSubtopics([]);
    }
  }, [selectedTopic]);

  // Load functions
  const loadDepartments = async (course: string) => {
    setLoadingDropdowns(prev => ({ ...prev, departments: true }));
    try {
      const data = await getDepartments(course);
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDropdowns(prev => ({ ...prev, departments: false }));
    }
  };

  const loadSubjects = async (course: string) => {
    setLoadingDropdowns(prev => ({ ...prev, subjects: true }));
    try {
      const data = await getSubjects(course);
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingDropdowns(prev => ({ ...prev, subjects: false }));
    }
  };

  const loadTopics = async (course: string, subject: string) => {
    setLoadingDropdowns(prev => ({ ...prev, topics: true }));
    try {
      const data = await getTopics(course, subject);
      setTopics(data);
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics([]);
    } finally {
      setLoadingDropdowns(prev => ({ ...prev, topics: false }));
    }
  };

  const loadSubtopics = async (course: string, subject: string, topic: string) => {
    setLoadingDropdowns(prev => ({ ...prev, subtopics: true }));
    try {
      const data = await getSubtopics(course, subject, topic);
      setSubtopics(data);
    } catch (error) {
      console.error('Error loading subtopics:', error);
      setSubtopics([]);
    } finally {
      setLoadingDropdowns(prev => ({ ...prev, subtopics: false }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* College Information Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          College Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              University <span className="text-red-500">*</span>
            </label>
            <select
              {...register("university")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select University</option>
              <option value="Bharathiyar University">Bharathiyar University</option>
              <option value="University of Madras">University of Madras</option>
            </select>
            {errors.university && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.university.message}
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              {...register("course")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Course</option>
              <option value="B.Com">B.Com</option>
              <option value="Ba English Literature">Ba English Literature</option>
            </select>
            {errors.course && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.course.message}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              {...register("department")}
              disabled={!selectedCourse || loadingDropdowns.departments}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingDropdowns.departments ? 'Loading...' : 'Select Department'}
              </option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              {...register("semester", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.semester.message}
              </p>
            )}
          </div>

          {/* Paper Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paper Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("paper_type")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Paper Type</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
            </select>
            {errors.paper_type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.paper_type.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Question Parameters Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Question Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              {...register("subject")}
              disabled={!selectedCourse || loadingDropdowns.subjects}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingDropdowns.subjects ? 'Loading...' : 'Select Subject'}
              </option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <select
              {...register("topic")}
              disabled={!selectedSubject || loadingDropdowns.topics}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingDropdowns.topics ? 'Loading...' : 'Select Topic'}
              </option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.topic.message}
              </p>
            )}
          </div>

          {/* Subtopic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtopic (Optional)
            </label>
            <select
              {...register("subtopic")}
              disabled={!selectedTopic || loadingDropdowns.subtopics}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingDropdowns.subtopics ? 'Loading...' : 'Select Subtopic (Optional)'}
              </option>
              {subtopics.map(subtopic => (
                <option key={subtopic} value={subtopic}>{subtopic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Question Settings Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Question Settings
        </h2>
        <div className="space-y-4">
          {/* Question Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Format <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("question_type")}
                  value="descriptive"
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Descriptive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("question_type")}
                  value="mcq"
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">MCQ</span>
              </label>
            </div>
            {errors.question_type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.question_type.message}
              </p>
            )}
          </div>

          {/* Descriptive Type (conditional) */}
          {questionType === "descriptive" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("descriptive_type")}
                    value="very_short"
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {descriptiveLabels.very_short}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("descriptive_type")}
                    value="short"
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {descriptiveLabels.short}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("descriptive_type")}
                    value="long_essay"
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {descriptiveLabels.long_essay}
                  </span>
                </label>
              </div>
              {errors.descriptive_type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.descriptive_type.message}
                </p>
              )}
            </div>
          )}

          {/* Number of Questions - Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Questions <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                {...register("num_questions", { valueAsNumber: true })}
                min={1}
                max={20}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                  accentColor: 'var(--brand-primary, #3b82f6)',
                }}
              />
              <span className="text-sm font-medium w-12 text-center text-gray-900 dark:text-white">
                {numQuestions || 5}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Slide to select 1-20 questions
            </p>
            {errors.num_questions && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.num_questions.message}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Instructions (Optional)
            </label>
            <textarea
              {...register("instructions")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter any specific instructions for question generation..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Max 500 characters
            </p>
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.instructions.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => reset()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            "Generate Questions"
          )}
        </button>
      </div>
    </form>
  );
}
