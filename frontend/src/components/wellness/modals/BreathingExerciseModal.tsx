"use client";

import { useState, useEffect } from "react";
import { X, Play, Pause, ArrowCounterClockwise } from "@phosphor-icons/react";

interface BreathingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = "breathe-in" | "hold" | "breathe-out" | "rest";

const phaseConfig = {
  "breathe-in": { duration: 4000, label: "Breathe In", color: "from-blue-500 to-cyan-500" },
  "hold": { duration: 2000, label: "Hold", color: "from-purple-500 to-pink-500" },
  "breathe-out": { duration: 4000, label: "Breathe Out", color: "from-emerald-500 to-teal-500" },
  "rest": { duration: 2000, label: "Rest", color: "from-amber-500 to-orange-500" },
};

export default function BreathingExerciseModal({ isOpen, onClose }: BreathingExerciseModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("breathe-in");
  const [cycleCount, setCycleCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const totalCycles = 4;
  const phases: BreathingPhase[] = ["breathe-in", "hold", "breathe-out", "rest"];

  useEffect(() => {
    if (!isOpen) {
      // Reset when modal closes
      setIsRunning(false);
      setCurrentPhase("breathe-in");
      setCycleCount(0);
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const phaseData = phaseConfig[currentPhase];
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / phaseData.duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= phaseData.duration) {
        // Move to next phase
        const currentIndex = phases.indexOf(currentPhase);
        const nextIndex = (currentIndex + 1) % phases.length;

        if (nextIndex === 0) {
          // Completed a full cycle
          const newCycleCount = cycleCount + 1;
          setCycleCount(newCycleCount);

          if (newCycleCount >= totalCycles) {
            // Exercise complete
            setIsRunning(false);
            setProgress(0);
            return;
          }
        }

        setCurrentPhase(phases[nextIndex]);
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase, cycleCount, isOpen]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setCurrentPhase("breathe-in");
    setCycleCount(0);
    setProgress(0);
    setTimeout(() => setIsRunning(true), 100);
  };

  if (!isOpen) return null;

  const phaseData = phaseConfig[currentPhase];
  const overallProgress = ((cycleCount * 4 + phases.indexOf(currentPhase)) / (totalCycles * 4)) * 100;
  const isComplete = cycleCount >= totalCycles && !isRunning;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Breathing Exercise
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              1-minute guided breathing to calm your mind
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Breathing Animation Circle */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-64 h-64">
                {/* Animated Circle */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseData.color} transition-all duration-1000 ease-in-out`}
                  style={{
                    transform: currentPhase === "breathe-in" && isRunning
                      ? "scale(1)"
                      : currentPhase === "breathe-out" && isRunning
                      ? "scale(0.6)"
                      : "scale(0.8)",
                    opacity: 0.3,
                  }}
                />

                {/* Inner Circle with Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseData.color} flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ease-in-out`}
                    style={{
                      transform: currentPhase === "breathe-in" && isRunning
                        ? "scale(1.1)"
                        : currentPhase === "breathe-out" && isRunning
                        ? "scale(0.7)"
                        : "scale(0.9)",
                    }}
                  >
                    {isComplete ? (
                      <>
                        <span className="text-5xl mb-2">✓</span>
                        <span className="text-xl font-semibold">Complete!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-display font-bold mb-2">
                          {phaseData.label}
                        </span>
                        <span className="text-sm opacity-80">
                          {Math.ceil((phaseData.duration * (100 - progress)) / 1000)}s
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Cycle {Math.min(cycleCount + 1, totalCycles)} of {totalCycles}
              </p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning && !isComplete && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all"
                >
                  <Play className="w-5 h-5" weight="fill" />
                  {cycleCount === 0 ? "Start" : "Resume"}
                </button>
              )}

              {isRunning && (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all"
                >
                  <Pause className="w-5 h-5" weight="fill" />
                  Pause
                </button>
              )}

              {(cycleCount > 0 || isComplete) && (
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                >
                  <ArrowCounterClockwise className="w-5 h-5" weight="bold" />
                  Restart
                </button>
              )}
            </div>

            {/* Instructions */}
            {cycleCount === 0 && !isRunning && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                  <span className="font-semibold">Tip:</span> Find a comfortable position, close your eyes, and focus on your breath
                </p>
              </div>
            )}

            {isComplete && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-300 text-center">
                  <span className="font-semibold">Well done!</span> Take a moment to notice how you feel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
