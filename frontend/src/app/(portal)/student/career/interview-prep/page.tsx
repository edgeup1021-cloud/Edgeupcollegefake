"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  InterviewQuestion,
  QuestionCategory,
  QuestionDifficulty,
  IndustryType,
  STARResponse,
  PracticeSession,
  categoryInfo,
  industryLabels,
  difficultyLabels,
  sampleQuestions,
  interviewTips,
} from "@/types/interview.types";

type TabType = "practice" | "mock" | "star" | "tips" | "progress";

// Speech Recognition Types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<TabType>("practice");
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | "all">("all");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | "all">("all");
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [starResponse, setStarResponse] = useState<STARResponse>({
    situation: "",
    task: "",
    action: "",
    result: "",
  });
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  const [selfRating, setSelfRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Mock Interview State
  const [mockStarted, setMockStarted] = useState(false);
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<string[]>([]);
  const [mockCompleted, setMockCompleted] = useState(false);

  // Audio Interview State
  const [audioMode, setAudioMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for Speech Recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interim = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interim += transcript;
            }
          }

          if (finalTranscript) {
            setUserAnswer((prev) => prev + finalTranscript);
          }
          setInterimTranscript(interim);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: { error: string }) => {
          console.error("Speech recognition error:", event.error);
          setAudioError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };
      }

      // Check for Speech Synthesis support
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;

        // Load voices - they may not be immediately available
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            // Filter for English voices and sort by quality
            const englishVoices = voices.filter(v => v.lang.startsWith("en"));
            setAvailableVoices(englishVoices);

            // Auto-select best voice (prioritize natural/premium voices)
            const naturalVoice = englishVoices.find(v =>
              v.name.includes("Natural") ||
              v.name.includes("Neural") ||
              v.name.includes("Premium") ||
              v.name.includes("Enhanced") ||
              v.name.includes("Wavenet") ||
              v.name.includes("Microsoft") && (v.name.includes("Online") || v.name.includes("Natural"))
            ) || englishVoices.find(v =>
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Alex") ||
              v.name.includes("Daniel") ||
              v.name.includes("Karen") ||
              v.name.includes("Moira")
            ) || englishVoices[0];

            if (naturalVoice && !selectedVoice) {
              setSelectedVoice(naturalVoice.name);
            }
          }
        };

        // Voices might be loaded asynchronously
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedVoice]);

  // Load practice history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("interviewPracticeHistory");
    if (saved) {
      setPracticeHistory(JSON.parse(saved));
    }
  }, []);

  // Filter questions based on selected filters
  const filteredQuestions = sampleQuestions.filter((q) => {
    if (selectedCategory !== "all" && q.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
    if (selectedIndustry !== "all" && q.industry !== selectedIndustry) return false;
    return true;
  });

  // Start timer for practice
  const startTimer = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Stop timer
  const stopTimer = () => {
    setIsRecording(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start listening for speech
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setAudioError(null);
      setInterimTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setAudioError("Failed to start speech recognition. Please try again.");
      }
    }
  }, [isListening]);

  // Stop listening for speech
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    }
  }, [isListening]);

  // Speak text using speech synthesis with natural pauses
  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      // Add natural pauses by inserting SSML-like breaks (commas add slight pauses)
      const processedText = text
        .replace(/\. /g, "... ") // Longer pause after sentences
        .replace(/\? /g, "?... ") // Pause after questions
        .replace(/: /g, ":, ") // Slight pause after colons
        .replace(/Here's/g, "Here is") // More natural phrasing
        .replace(/I'll/g, "I will"); // Clearer pronunciation

      const utterance = new SpeechSynthesisUtterance(processedText);

      // Find selected voice or use best available
      const voices = synthRef.current.getVoices();
      const voice = voices.find(v => v.name === selectedVoice) ||
                    voices.find(v => v.lang.startsWith("en") && (
                      v.name.includes("Natural") ||
                      v.name.includes("Neural") ||
                      v.name.includes("Google") ||
                      v.name.includes("Samantha")
                    )) ||
                    voices.find(v => v.lang.startsWith("en"));

      if (voice) {
        utterance.voice = voice;
      }

      // Natural speech parameters
      utterance.rate = 0.92; // Slightly slower for natural feel
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => setIsSpeaking(false);

      // Small delay before speaking for more natural feel
      setTimeout(() => {
        synthRef.current?.speak(utterance);
      }, 200);
    }
  }, [selectedVoice]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Save practice session
  const savePracticeSession = () => {
    if (!selectedQuestion) return;

    const session: PracticeSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      questionId: selectedQuestion.id,
      question: selectedQuestion.question,
      userAnswer,
      starResponse: selectedQuestion.category === "behavioral" ? starResponse : undefined,
      selfRating,
      timeSpent: timer,
    };

    const newHistory = [session, ...practiceHistory];
    setPracticeHistory(newHistory);
    localStorage.setItem("interviewPracticeHistory", JSON.stringify(newHistory));

    // Reset
    setUserAnswer("");
    setStarResponse({ situation: "", task: "", action: "", result: "" });
    setSelfRating(0);
    setTimer(0);
    stopTimer();
    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  // Start mock interview
  const startMockInterview = (withAudio: boolean = false) => {
    const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, 5);
    setMockQuestions(questions);
    setMockStarted(true);
    setCurrentMockIndex(0);
    setMockAnswers([]);
    setMockCompleted(false);
    setAudioMode(withAudio);
    setUserAnswer("");
    setInterimTranscript("");

    // If audio mode, speak introduction and first question
    if (withAudio && synthRef.current) {
      setTimeout(() => {
        speakText(
          "Hello and welcome. Thank you for joining me today for this practice interview. I will be asking you five questions, and please take your time to think through each answer before responding. Ready? Let's begin with the first question. " +
            questions[0].question,
          () => {
            // Auto-start listening after speaking
            if (speechSupported) {
              setTimeout(() => startListening(), 800);
            }
          }
        );
      }, 600);
    }
  };

  // Submit mock answer and move to next
  const submitMockAnswer = () => {
    // Stop listening if active
    stopListening();

    const newAnswers = [...mockAnswers, userAnswer];
    setMockAnswers(newAnswers);
    setUserAnswer("");
    setInterimTranscript("");

    if (currentMockIndex < mockQuestions.length - 1) {
      const nextIndex = currentMockIndex + 1;
      setCurrentMockIndex(nextIndex);

      // If audio mode, speak the next question with varied transitions
      if (audioMode && synthRef.current) {
        const transitions = [
          "Thank you for that response. Moving on to the next question. ",
          "That's helpful to know. Let me ask you another question. ",
          "I appreciate you sharing that. Here is the next question. ",
          "Good. Now, I'd like to explore another topic. ",
          "Thanks for that answer. Let's continue with the next question. ",
        ];
        const transition = transitions[nextIndex % transitions.length];

        setTimeout(() => {
          speakText(
            transition + mockQuestions[nextIndex].question,
            () => {
              // Auto-start listening after speaking
              if (speechSupported) {
                setTimeout(() => startListening(), 800);
              }
            }
          );
        }, 600);
      }
    } else {
      setMockCompleted(true);
      if (audioMode && synthRef.current) {
        setTimeout(() => {
          speakText(
            "That brings us to the end of our interview. Thank you so much for taking the time to speak with me today. You did a great job answering these questions. Keep practicing, and best of luck with your future interviews!"
          );
        }, 600);
      }
    }
  };

  // Reset mock interview
  const resetMockInterview = () => {
    stopListening();
    stopSpeaking();
    setMockStarted(false);
    setMockQuestions([]);
    setCurrentMockIndex(0);
    setMockAnswers([]);
    setMockCompleted(false);
    setUserAnswer("");
    setAudioMode(false);
    setInterimTranscript("");
  };

  // Calculate progress stats
  const calculateStats = () => {
    const total = practiceHistory.length;
    const avgRating = total > 0
      ? practiceHistory.reduce((sum, s) => sum + s.selfRating, 0) / total
      : 0;
    const categoryCount: Record<string, number> = {};
    practiceHistory.forEach((s) => {
      const q = sampleQuestions.find((sq) => sq.id === s.questionId);
      if (q) {
        categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
      }
    });
    return { total, avgRating, categoryCount };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Interview Preparation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice common interview questions and improve your interview skills
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "practice" as TabType, label: "Practice Questions" },
            { id: "mock" as TabType, label: "Mock Interview" },
            { id: "star" as TabType, label: "STAR Method" },
            { id: "tips" as TabType, label: "Tips & Resources" },
            { id: "progress" as TabType, label: "My Progress" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Practice Questions Tab */}
        {activeTab === "practice" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters & Question List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filter Questions
                </h2>

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory | "all")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as QuestionDifficulty | "all")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Difficulties</option>
                    {Object.entries(difficultyLabels).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value as IndustryType | "all")}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Industries</option>
                    {Object.entries(industryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question List */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {filteredQuestions.length} Questions Found
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setSelectedQuestion(q);
                          setShowAnswer(false);
                          setUserAnswer("");
                          setTimer(0);
                          stopTimer();
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedQuestion?.id === q.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                            {q.question}
                          </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  q.difficulty === "easy"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : q.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {difficultyLabels[q.difficulty].label}
                              </span>
                            </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Practice Area */}
            <div className="lg:col-span-2">
              {selectedQuestion ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  {/* Question Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {categoryInfo[selectedQuestion.category].label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedQuestion.difficulty === "easy"
                            ? "bg-green-100 text-green-700"
                            : selectedQuestion.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {difficultyLabels[selectedQuestion.difficulty].label}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedQuestion.question}
                    </h2>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono text-gray-700 dark:text-gray-300">
                        {formatTime(timer)}
                      </span>
                      {!isRecording ? (
                        <button
                          onClick={startTimer}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Start Timer
                        </button>
                      ) : (
                        <button
                          onClick={stopTimer}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  {selectedQuestion.tips && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Tips for this question:
                      </h3>
                      <ul className="space-y-1">
                        {selectedQuestion.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                            <span>•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Answer Area */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here... Try to speak it out loud as you type!"
                      className="w-full h-40 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Self Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rate your answer (1-5 stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelfRating(star)}
                          className={`text-3xl transition-transform hover:scale-110 ${
                            star <= selfRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sample Answer */}
                  {selectedQuestion.sampleAnswer && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                      >
                        {showAnswer ? "Hide Sample Answer" : "Show Sample Answer"}
                      </button>
                      {showAnswer && (
                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {selectedQuestion.sampleAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {selectedQuestion.commonMistakes && showAnswer && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                        Common Mistakes to Avoid:
                      </h4>
                      <ul className="space-y-1">
                        {selectedQuestion.commonMistakes.map((mistake, i) => (
                          <li key={i} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                            <span>✗</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={savePracticeSession}
                    disabled={!userAnswer.trim() || selfRating === 0}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Save Practice Session
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Question to Practice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a question from the list on the left to start practicing
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mock Interview Tab */}
        {activeTab === "mock" && (
          <div className="max-w-3xl mx-auto">
            {!mockStarted ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Mock Interview Session
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Practice answering 5 random interview questions in a simulated interview setting.
                  Choose between text or audio mode for a more realistic experience.
                </p>

                {/* Audio Mode Info */}
                {speechSupported && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <h3 className="font-medium text-purple-800 dark:text-purple-300">Audio Interview Mode</h3>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-400 text-left mb-3">
                      Questions will be read aloud and your voice will be transcribed automatically.
                      Practice speaking clearly like a real phone or video interview!
                    </p>

                    {/* Voice Selector */}
                    {availableVoices.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-3 border-t border-purple-200 dark:border-purple-700">
                        <label className="text-sm font-medium text-purple-700 dark:text-purple-300 whitespace-nowrap">
                          Interviewer Voice:
                        </label>
                        <select
                          value={selectedVoice}
                          onChange={(e) => setSelectedVoice(e.target.value)}
                          className="flex-1 w-full sm:w-auto px-3 py-1.5 text-sm rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                          {availableVoices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                              {voice.name.replace("Microsoft ", "").replace(" Online (Natural)", " (Natural)")}
                              {voice.name.includes("Natural") || voice.name.includes("Neural") ? " (Premium)" : ""}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => speakText("Hello! I will be your interviewer today. Let us begin.")}
                          disabled={isSpeaking}
                          className="px-3 py-1.5 text-sm bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-300 dark:hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                        >
                          {isSpeaking ? "Speaking..." : "Test Voice"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Tips for Mock Interview:</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Treat this like a real interview</li>
                    <li>• Speak your answers out loud</li>
                    <li>• Take 30 seconds to think before answering</li>
                    <li>• Aim for 1-2 minute responses</li>
                  </ul>
                </div>

                {/* Start Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => startMockInterview(false)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Text Mode
                  </button>
                  {speechSupported && (
                    <button
                      onClick={() => startMockInterview(true)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Audio Interview Mode
                    </button>
                  )}
                </div>

                {!speechSupported && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Audio mode is not supported in your browser. Try using Chrome or Edge.
                  </p>
                )}
              </div>
            ) : mockCompleted ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Interview Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Great job completing the mock interview. Review your answers below.
                  </p>
                </div>

                <div className="space-y-6">
                  {mockQuestions.map((q, index) => (
                    <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">{q.question}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            {mockAnswers[index] || "No answer provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetMockInterview}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Start New Mock Interview
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                {/* Audio Mode Indicator */}
                {audioMode && (
                  <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Audio Interview Mode
                    </span>
                    {isSpeaking && (
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <span className="animate-pulse">●</span>
                        <span className="text-xs">Speaking...</span>
                      </span>
                    )}
                    {isListening && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <span className="animate-pulse">●</span>
                        <span className="text-xs">Listening...</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentMockIndex + 1} of {mockQuestions.length}
                  </span>
                  <div className="flex gap-1">
                    {mockQuestions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-2 rounded-full ${
                          i < currentMockIndex
                            ? "bg-green-500"
                            : i === currentMockIndex
                            ? "bg-blue-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {categoryInfo[mockQuestions[currentMockIndex].category].label}
                    </span>
                    {/* Repeat Question Button */}
                    {audioMode && (
                      <button
                        onClick={() => speakText(mockQuestions[currentMockIndex].question)}
                        disabled={isSpeaking}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        Repeat
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mockQuestions[currentMockIndex].question}
                  </h2>
                </div>

                {/* Audio Error */}
                {audioError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                    {audioError}
                  </div>
                )}

                {/* Answer Area with Audio Controls */}
                <div className="mb-6">
                  {audioMode && (
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        disabled={isSpeaking}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                          isListening
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isListening ? (
                          <>
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Start Speaking
                          </>
                        )}
                      </button>
                      {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                          Stop Speaking
                        </button>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={audioMode ? "Your speech will appear here... or type manually" : "Type your answer here..."}
                      className="w-full h-48 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {/* Interim transcript indicator */}
                    {interimTranscript && (
                      <div className="absolute bottom-3 left-4 right-4 text-gray-400 dark:text-gray-500 italic text-sm truncate">
                        {interimTranscript}...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetMockInterview}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    End Interview
                  </button>
                  <button
                    onClick={submitMockAnswer}
                    disabled={isSpeaking}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentMockIndex < mockQuestions.length - 1 ? "Next Question" : "Finish Interview"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAR Method Tab */}
        {activeTab === "star" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  STAR Method Helper
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Structure your behavioral interview answers using the STAR framework
                </p>
              </div>

              {/* STAR Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">S</div>
                  <div className="font-medium text-gray-900 dark:text-white">Situation</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Set the scene and context</div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">T</div>
                  <div className="font-medium text-gray-900 dark:text-white">Task</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Describe your responsibility</div>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">A</div>
                  <div className="font-medium text-gray-900 dark:text-white">Action</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Explain what you did</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">R</div>
                  <div className="font-medium text-gray-900 dark:text-white">Result</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Share the outcome</div>
                </div>
              </div>

              {/* STAR Input Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-blue-600 font-bold">S</span>ituation - Set the scene
                  </label>
                  <textarea
                    value={starResponse.situation}
                    onChange={(e) => setStarResponse({ ...starResponse, situation: e.target.value })}
                    placeholder="Describe the context. Where were you? What was happening?"
                    className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-green-600 font-bold">T</span>ask - What was your responsibility?
                  </label>
                  <textarea
                    value={starResponse.task}
                    onChange={(e) => setStarResponse({ ...starResponse, task: e.target.value })}
                    placeholder="What was your role? What were you trying to achieve?"
                    className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-yellow-600 font-bold">A</span>ction - What did you do?
                  </label>
                  <textarea
                    value={starResponse.action}
                    onChange={(e) => setStarResponse({ ...starResponse, action: e.target.value })}
                    placeholder="Describe the specific actions you took. Use 'I' not 'we'."
                    className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-purple-600 font-bold">R</span>esult - What was the outcome?
                  </label>
                  <textarea
                    value={starResponse.result}
                    onChange={(e) => setStarResponse({ ...starResponse, result: e.target.value })}
                    placeholder="Share the results. Quantify if possible (e.g., increased by 20%)."
                    className="w-full h-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Preview */}
              {(starResponse.situation || starResponse.task || starResponse.action || starResponse.result) && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Your Complete Answer:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {starResponse.situation && `${starResponse.situation} `}
                    {starResponse.task && `${starResponse.task} `}
                    {starResponse.action && `${starResponse.action} `}
                    {starResponse.result && `${starResponse.result}`}
                  </p>
                </div>
              )}

              <button
                onClick={() => setStarResponse({ situation: "", task: "", action: "", result: "" })}
                className="mt-6 px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["preparation", "during", "body-language", "virtual", "after"].map((category) => {
              const categoryTips = interviewTips.filter((t) => t.category === category);
              const titles: Record<string, string> = {
                preparation: "Before the Interview",
                during: "During the Interview",
                "body-language": "Body Language",
                virtual: "Virtual Interviews",
                after: "After the Interview",
              };

              return (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {titles[category]}
                  </h3>
                  <div className="space-y-4">
                    {categoryTips.map((tip) => (
                      <div key={tip.id} className="border-l-2 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tip.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="max-w-4xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Questions Practiced</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {stats.avgRating.toFixed(1)} ★
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Self-Rating</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Object.keys(stats.categoryCount).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories Covered</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {practiceHistory.length > 0
                    ? Math.round(practiceHistory.reduce((sum, s) => sum + s.timeSpent, 0) / 60)
                    : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</div>
              </div>
            </div>

            {/* Practice History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Practice History
              </h2>

              {practiceHistory.length > 0 ? (
                <div className="space-y-4">
                  {practiceHistory.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {session.question}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {session.userAnswer}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                          <span>{formatTime(session.timeSpent)}</span>
                          <span className="text-yellow-500">
                            {"★".repeat(session.selfRating)}
                            {"☆".repeat(5 - session.selfRating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Practice Sessions Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start practicing questions to track your progress
                  </p>
                  <button
                    onClick={() => setActiveTab("practice")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Practicing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
