"use client";

import { ChevronDown, Eye, Edit, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopicCard from "./TopicCard";

interface Subtopic {
  id: number;
  name: string;
  orderIndex: number;
  content: string | null;
}

interface Topic {
  id: number;
  name: string;
  orderIndex: number;
  description: string | null;
  subtopics: Subtopic[];
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  topics: Topic[];
}

interface SubjectCardProps {
  subject: Subject;
  isExpanded: boolean;
  expandedTopic: number | null;
  onToggle: () => void;
  onToggleTopic: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddTopic: (subjectId: number) => void;
  onViewTopic: (id: number) => void;
  onEditTopic: (id: number) => void;
  onDeleteTopic: (id: number) => void;
  onAddSubtopic: (topicId: number) => void;
  onViewSubtopic: (id: number) => void;
  onEditSubtopic: (id: number) => void;
  onDeleteSubtopic: (id: number) => void;
}

export default function SubjectCard({
  subject,
  isExpanded,
  expandedTopic,
  onToggle,
  onToggleTopic,
  onView,
  onEdit,
  onDelete,
  onAddTopic,
  onViewTopic,
  onEditTopic,
  onDeleteTopic,
  onAddSubtopic,
  onViewSubtopic,
  onEditSubtopic,
  onDeleteSubtopic,
}: SubjectCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex flex-col items-start">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {subject.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {subject.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              subject.isActive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
            }`}
          >
            {subject.isActive ? "Active" : "Inactive"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-4">
              {/* Description */}
              {subject.description && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {subject.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(subject.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(subject.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(subject.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTopic(subject.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-light dark:bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/30 transition-colors text-xs font-medium ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Topic
                </button>
              </div>

              {/* Topics List */}
              {subject.topics && subject.topics.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Topics ({subject.topics.length})
                  </p>
                  {subject.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      isExpanded={expandedTopic === topic.id}
                      onToggle={() => onToggleTopic(topic.id)}
                      onView={onViewTopic}
                      onEdit={onEditTopic}
                      onDelete={onDeleteTopic}
                      onAddSubtopic={onAddSubtopic}
                      onViewSubtopic={onViewSubtopic}
                      onEditSubtopic={onEditSubtopic}
                      onDeleteSubtopic={onDeleteSubtopic}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No topics yet. Click "Add Topic" to get started.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
