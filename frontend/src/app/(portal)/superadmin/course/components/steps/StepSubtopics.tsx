"use client";

import { useState } from "react";
import { CourseWizardState, CourseSubtopic } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface StepSubtopicsProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onBack: () => void;
}

interface SubtopicFormData {
  name: string;
  orderIndex: number;
  content: string;
}

export default function StepSubtopics({
  state,
  updateState,
  onBack,
}: StepSubtopicsProps) {
  // Get all topics across all subjects
  const allTopics = Object.values(state.topics).flat();

  // Initialize subtopics state for each topic
  const [subtopicsByTopic, setSubtopicsByTopic] = useState<
    Record<number, SubtopicFormData[]>
  >(() => {
    const initial: Record<number, SubtopicFormData[]> = {};
    allTopics.forEach((topic) => {
      const existingSubtopics = state.subtopics[topic.id || 0] || [];
      initial[topic.id || 0] = existingSubtopics.length > 0
        ? existingSubtopics.map(st => ({
            name: st.name,
            orderIndex: st.orderIndex,
            content: st.content || ""
          }))
        : [];
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const addSubtopic = (topicId: number) => {
    const currentSubtopics = subtopicsByTopic[topicId] || [];
    const nextOrderIndex = currentSubtopics.length > 0
      ? Math.max(...currentSubtopics.map(st => st.orderIndex)) + 1
      : 1;

    setSubtopicsByTopic((prev) => ({
      ...prev,
      [topicId]: [
        ...currentSubtopics,
        { name: "", orderIndex: nextOrderIndex, content: "" },
      ],
    }));
  };

  const removeSubtopic = (topicId: number, index: number) => {
    setSubtopicsByTopic((prev) => ({
      ...prev,
      [topicId]: prev[topicId].filter((_, i) => i !== index),
    }));
  };

  const updateSubtopic = (
    topicId: number,
    index: number,
    field: keyof SubtopicFormData,
    value: string | number
  ) => {
    setSubtopicsByTopic((prev) => ({
      ...prev,
      [topicId]: prev[topicId].map((subtopic, i) =>
        i === index ? { ...subtopic, [field]: value } : subtopic
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(subtopicsByTopic).forEach(([topicId, subtopics]) => {
      subtopics.forEach((subtopic, index) => {
        if (!subtopic.name.trim()) {
          newErrors[`${topicId}_${index}_name`] = "Subtopic name required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Convert form data to subtopic entities
    const subtopics: Record<number, CourseSubtopic[]> = {};
    let globalId = 1;

    Object.entries(subtopicsByTopic).forEach(([topicId, topicSubtopics]) => {
      subtopics[parseInt(topicId)] = topicSubtopics.map((subtopic) => ({
        id: globalId++,
        topicId: parseInt(topicId),
        name: subtopic.name,
        orderIndex: subtopic.orderIndex,
        content: subtopic.content || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    updateState({ subtopics });
    setSaved(true);

    // Show success message
    setTimeout(() => {
      alert("Course structure completed! (Backend API integration pending)");
    }, 500);
  };

  const handleSkip = () => {
    updateState({ subtopics: {} });
    setSaved(true);
    setTimeout(() => {
      alert("Course structure completed without subtopics! (Backend API integration pending)");
    }, 500);
  };

  // Group topics by subject for better organization
  const topicsBySubject: Record<number, typeof allTopics> = {};
  state.subjects.forEach((subject) => {
    topicsBySubject[subject.id || 0] = state.topics[subject.id || 0] || [];
  });

  const hasAnyTopics = allTopics.length > 0;

  if (!hasAnyTopics) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 8: Add Sub-topics (Final Step)
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            No topics were defined in Step 7. You can complete the course structure without subtopics.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t dark:border-gray-700">
          <Button onClick={onBack} variant="outline">
            Back to Topics
          </Button>
          <Button
            onClick={handleSkip}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Course Structure
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 8: Add Sub-topics (Final Step)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Break down topics into detailed sub-topics with content
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Optional:</strong> Add sub-topics to provide granular content for each topic. You can skip this step and complete the course structure.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-green-800 dark:text-green-200 font-medium">
            Course structure saved successfully!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {state.subjects.map((subject) => {
          const subjectTopics = topicsBySubject[subject.id || 0] || [];
          if (subjectTopics.length === 0) return null;

          return (
            <div
              key={subject.id}
              className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subject.code}
                </p>
              </div>

              {subjectTopics
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((topic) => {
                  const topicId = topic.id || 0;
                  const topicSubtopics = subtopicsByTopic[topicId] || [];

                  return (
                    <div
                      key={topicId}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Topic: {topic.name}
                          </h4>
                          {topic.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {topic.description}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => addSubtopic(topicId)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Sub-topic
                        </Button>
                      </div>

                      {topicSubtopics.length > 0 ? (
                        <div className="space-y-2">
                          {topicSubtopics
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((subtopic, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-3 p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700"
                              >
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Order
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={subtopic.orderIndex}
                                    onChange={(e) =>
                                      updateSubtopic(
                                        topicId,
                                        index,
                                        "orderIndex",
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                  />
                                </div>

                                <div className="col-span-4">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Sub-topic Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={subtopic.name}
                                    onChange={(e) =>
                                      updateSubtopic(topicId, index, "name", e.target.value)
                                    }
                                    className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="e.g., Dynamic Arrays"
                                  />
                                  {errors[`${topicId}_${index}_name`] && (
                                    <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                                      {errors[`${topicId}_${index}_name`]}
                                    </p>
                                  )}
                                </div>

                                <div className="col-span-5">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content/Notes
                                  </label>
                                  <input
                                    type="text"
                                    value={subtopic.content}
                                    onChange={(e) =>
                                      updateSubtopic(
                                        topicId,
                                        index,
                                        "content",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Optional content"
                                  />
                                </div>

                                <div className="col-span-1 flex items-end justify-center">
                                  <Button
                                    onClick={() => removeSubtopic(topicId, index)}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No sub-topics added yet
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <div className="flex gap-3">
          <Button onClick={handleSkip} variant="outline">
            Skip Sub-topics
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Course Structure
          </Button>
        </div>
      </div>
    </div>
  );
}
