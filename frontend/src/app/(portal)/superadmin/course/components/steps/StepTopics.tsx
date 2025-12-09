"use client";

import { useState } from "react";
import { CourseWizardState, CourseTopic } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepTopicsProps {
  state: CourseWizardState;
  updateState: (updates: Partial<CourseWizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface TopicFormData {
  name: string;
  orderIndex: number;
  description: string;
}

export default function StepTopics({
  state,
  updateState,
  onNext,
  onBack,
}: StepTopicsProps) {
  // Initialize topics state for each subject
  const [topicsBySubject, setTopicsBySubject] = useState<
    Record<number, TopicFormData[]>
  >(() => {
    const initial: Record<number, TopicFormData[]> = {};
    state.subjects.forEach((subject) => {
      const existingTopics = state.topics[subject.id || 0] || [];
      initial[subject.id || 0] = existingTopics.length > 0
        ? existingTopics.map(t => ({
            name: t.name,
            orderIndex: t.orderIndex,
            description: t.description || ""
          }))
        : [];
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTopic = (subjectId: number) => {
    const currentTopics = topicsBySubject[subjectId] || [];
    const nextOrderIndex = currentTopics.length > 0
      ? Math.max(...currentTopics.map(t => t.orderIndex)) + 1
      : 1;

    setTopicsBySubject((prev) => ({
      ...prev,
      [subjectId]: [
        ...currentTopics,
        { name: "", orderIndex: nextOrderIndex, description: "" },
      ],
    }));
  };

  const removeTopic = (subjectId: number, index: number) => {
    setTopicsBySubject((prev) => ({
      ...prev,
      [subjectId]: prev[subjectId].filter((_, i) => i !== index),
    }));
  };

  const updateTopic = (
    subjectId: number,
    index: number,
    field: keyof TopicFormData,
    value: string | number
  ) => {
    setTopicsBySubject((prev) => ({
      ...prev,
      [subjectId]: prev[subjectId].map((topic, i) =>
        i === index ? { ...topic, [field]: value } : topic
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(topicsBySubject).forEach(([subjId, topics]) => {
      topics.forEach((topic, index) => {
        if (!topic.name.trim()) {
          newErrors[`${subjId}_${index}_name`] = "Topic name required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Convert form data to topic entities
    const topics: Record<number, CourseTopic[]> = {};
    let globalId = 1;

    Object.entries(topicsBySubject).forEach(([subjId, subjTopics]) => {
      topics[parseInt(subjId)] = subjTopics.map((topic) => ({
        id: globalId++,
        subjectId: parseInt(subjId),
        name: topic.name,
        orderIndex: topic.orderIndex,
        description: topic.description || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    updateState({ topics });
    onNext();
  };

  const handleSkip = () => {
    updateState({ topics: {} });
    onNext();
  };

  if (state.subjects.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 7: Add Topics
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please add at least one subject in Step 6 before adding topics.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t dark:border-gray-700">
          <Button onClick={onBack} variant="outline">
            Back to Subjects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Step 7: Add Topics (Optional)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Break down subjects into topics for better organization
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Optional:</strong> You can skip this step if you don't need to organize subjects into topics. Click "Skip" to proceed.
        </p>
      </div>

      <div className="space-y-4">
        {state.subjects.map((subject) => {
          const subjectId = subject.id || 0;
          const subjectTopics = topicsBySubject[subjectId] || [];

          return (
            <div
              key={subjectId}
              className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subject.code} · {subject.credits} credits
                  </p>
                </div>
                <Button
                  onClick={() => addTopic(subjectId)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </Button>
              </div>

              {subjectTopics.length > 0 ? (
                <div className="space-y-2">
                  {subjectTopics
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((topic, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Order
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={topic.orderIndex}
                            onChange={(e) =>
                              updateTopic(
                                subjectId,
                                index,
                                "orderIndex",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="col-span-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic Name *
                          </label>
                          <input
                            type="text"
                            value={topic.name}
                            onChange={(e) =>
                              updateTopic(subjectId, index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="e.g., Arrays and Lists"
                          />
                          {errors[`${subjectId}_${index}_name`] && (
                            <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                              {errors[`${subjectId}_${index}_name`]}
                            </p>
                          )}
                        </div>

                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={topic.description}
                            onChange={(e) =>
                              updateTopic(
                                subjectId,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Optional description"
                          />
                        </div>

                        <div className="col-span-1 flex items-end">
                          <Button
                            onClick={() => removeTopic(subjectId, index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No topics added yet
                </p>
              )}
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
            Skip Topics
          </Button>
          <Button
            onClick={handleNext}
            className="bg-brand-primary text-white hover:bg-brand-primary/90"
          >
            Next: Sub-topics
          </Button>
        </div>
      </div>
    </div>
  );
}
