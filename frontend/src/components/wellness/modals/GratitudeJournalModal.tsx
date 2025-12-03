"use client";

import { useState } from "react";
import { X, Heart, Sparkle } from "@phosphor-icons/react";

interface GratitudeJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (entry: string) => void;
}

const prompts = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's something small that brought you joy?",
  "What's a skill or ability you're thankful for?",
  "What's something beautiful you noticed today?",
  "What challenge helped you grow?",
  "What comfort or luxury do you appreciate?",
];

export default function GratitudeJournalModal({ isOpen, onClose, onSubmit }: GratitudeJournalModalProps) {
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentPrompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (entry.trim()) {
      onSubmit?.(entry.trim());
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setEntry("");
      }, 2000);
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false);
    setEntry("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            /* Success State */
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 animate-bounce">
                <Heart className="w-10 h-10" weight="fill" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Thank you for sharing!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Practicing gratitude helps improve your wellbeing
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10">
                    <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" weight="duotone" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                    Gratitude Journal
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Take a moment to reflect on something positive
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Random Prompt */}
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800/50">
                  <div className="flex items-start gap-2">
                    <Sparkle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" weight="fill" />
                    <p className="text-amber-900 dark:text-amber-200 font-medium">
                      {currentPrompt}
                    </p>
                  </div>
                </div>

                {/* Text Area */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    I'm grateful for...
                  </label>
                  <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Write your thoughts here..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    maxLength={300}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.length}/300 characters
                    </p>
                    {entry.length >= 10 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Looking good!
                      </p>
                    )}
                  </div>
                </div>

                {/* Benefits Info */}
                <div className="mb-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <span className="font-semibold">Did you know?</span> Studies show that regular gratitude practice can improve mood and reduce stress.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={entry.trim().length === 0}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      entry.trim().length > 0
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
