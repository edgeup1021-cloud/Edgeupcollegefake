"use client";

import { useState } from "react";
import { X, Fire } from "@phosphor-icons/react";
import type { MoodLevel, EnergyLevel, StressLevel, DailyCheckInInput } from "@/types/wellness.types";

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DailyCheckInInput) => void;
  streakDays?: number;
}

export default function DailyCheckInModal({ isOpen, onClose, onSubmit, streakDays = 0 }: DailyCheckInModalProps) {
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [stress, setStress] = useState<StressLevel | null>(null);
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mood && energy && stress) {
      onSubmit({ mood, energy, stress, note: note.trim() || undefined });
      // Reset form
      setMood(null);
      setEnergy(null);
      setStress(null);
      setNote("");
      onClose();
    }
  };

  const moodOptions: { value: MoodLevel; label: string }[] = [
    { value: 1, label: "Very Low" },
    { value: 2, label: "Low" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Good" },
    { value: 5, label: "Great" },
  ];

  const energyOptions: { value: EnergyLevel; label: string }[] = [
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
  ];

  const isComplete = mood !== null && energy !== null && stress !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Daily Check-in
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Take a moment to reflect on your wellbeing
            </p>

            {/* Streak Badge */}
            {streakDays > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <Fire className="w-4 h-4 text-amber-500" weight="fill" />
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {streakDays} day streak!
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMood(option.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      mood === option.value
                        ? "border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{option.value}</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Energy Level?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {energyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setEnergy(option.value)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                      energy === option.value
                        ? "border-brand-secondary bg-brand-secondary/10 dark:bg-brand-secondary/20 text-brand-secondary"
                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Stress Level? {stress && <span className="text-brand-primary">({stress}/10)</span>}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress || 5}
                onChange={(e) => setStress(parseInt(e.target.value) as StressLevel)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: stress
                    ? `linear-gradient(to right, #10ac8b 0%, #10ac8b ${(stress / 10) * 100}%, #e5e7eb ${(stress / 10) * 100}%, #e5e7eb 100%)`
                    : undefined,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                What's on your mind? <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {note.length}/200
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                isComplete
                  ? "bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Submit Check-in
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10ac8b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10ac8b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
