"use client";

import { ChevronDown, Eye, Edit, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SubtopicItem from "./SubtopicItem";

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

interface TopicCardProps {
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddSubtopic: (topicId: number) => void;
  onViewSubtopic: (id: number) => void;
  onEditSubtopic: (id: number) => void;
  onDeleteSubtopic: (id: number) => void;
}

export default function TopicCard({
  topic,
  isExpanded,
  onToggle,
  onView,
  onEdit,
  onDelete,
  onAddSubtopic,
  onViewSubtopic,
  onEditSubtopic,
  onDeleteSubtopic,
}: TopicCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/30">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-light dark:bg-brand-primary/20 text-xs font-semibold text-brand-primary">
            {topic.orderIndex}
          </span>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {topic.name}
          </h4>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
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
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Topic Description */}
              {topic.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {topic.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(topic.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(topic.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(topic.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubtopic(topic.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ml-auto"
                >
                  <Plus className="w-3 h-3" />
                  Add Subtopic
                </button>
              </div>

              {/* Subtopics List */}
              {topic.subtopics && topic.subtopics.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Subtopics ({topic.subtopics.length})
                  </p>
                  {topic.subtopics.map((subtopic) => (
                    <SubtopicItem
                      key={subtopic.id}
                      subtopic={subtopic}
                      onView={onViewSubtopic}
                      onEdit={onEditSubtopic}
                      onDelete={onDeleteSubtopic}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No subtopics yet
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
