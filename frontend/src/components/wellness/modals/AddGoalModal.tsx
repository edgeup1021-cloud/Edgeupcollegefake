"use client";

import { useState } from "react";
import { X, Target, Heart, Heartbeat, Book, Users, Palette } from "@phosphor-icons/react";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: { title: string; type: "mood" | "activity" | "mindfulness" | "social" | "creative" | "custom" }) => void;
}

const goalTypes = [
  { value: "mood" as const, label: "Mood", icon: Heart, color: "from-pink-500 to-rose-500" },
  { value: "activity" as const, label: "Physical Activity", icon: Heartbeat, color: "from-orange-500 to-red-500" },
  { value: "mindfulness" as const, label: "Mindfulness", icon: Book, color: "from-purple-500 to-indigo-500" },
  { value: "social" as const, label: "Social Connection", icon: Users, color: "from-blue-500 to-cyan-500" },
  { value: "creative" as const, label: "Creative Outlet", icon: Palette, color: "from-emerald-500 to-teal-500" },
  { value: "custom" as const, label: "Custom Goal", icon: Target, color: "from-gray-500 to-slate-500" },
];

export default function AddGoalModal({ isOpen, onClose, onSubmit }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<typeof goalTypes[number]["value"]>("custom");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a goal title");
      return;
    }

    onSubmit({
      title: title.trim(),
      type: selectedType,
    });

    // Reset form
    setTitle("");
    setSelectedType("custom");
  };

  const handleClose = () => {
    setTitle("");
    setSelectedType("custom");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10">
                <Target className="w-6 h-6 text-brand-primary" weight="duotone" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                  Add Custom Goal
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set a new wellness goal to track
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Goal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Meditate for 10 minutes daily"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-primary dark:focus:border-brand-primary outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* Goal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Goal Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? `bg-gradient-to-br ${type.color} border-transparent text-white shadow-lg scale-105`
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-2 ${isSelected ? "text-white" : "text-gray-600 dark:text-gray-400"}`}
                        weight="duotone"
                      />
                      <div className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                        {type.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all"
              >
                Add Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
