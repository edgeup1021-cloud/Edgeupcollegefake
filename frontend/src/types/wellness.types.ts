// Wellness Types and Interfaces

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = "low" | "moderate" | "high";
export type StressLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MoodEntry {
  id: string;
  date: string;
  timestamp: string;
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  note?: string;
}

export interface WellnessScore {
  overall: number; // 0-100
  mentalHealth: number; // 0-100
  stressLevel: number; // 0-100 (lower is better)
  physicalActivity: number; // 0-100
  socialConnection: number; // 0-100
}

export interface MoodTrendData {
  date: string;
  dayLabel: string;
  mood: number; // 1-5
  energy: number; // 1-5 (converted from low/moderate/high)
}

export interface WellnessGoal {
  id: string;
  title: string;
  type: "mood" | "activity" | "mindfulness" | "social" | "creative" | "custom";
  completed: boolean;
  completedAt?: string;
}

export interface WellnessRecommendation {
  id: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl?: string;
  type: "pattern" | "upcoming" | "suggestion";
}

export interface SupportResource {
  id: string;
  title: string;
  type: "counseling" | "peer" | "crisis" | "resource";
  description: string;
  availability?: string;
  contact?: string;
  actionLabel: string;
}

export interface WellnessDashboardData {
  score: WellnessScore;
  currentMood: {
    level: MoodLevel;
    lastCheckedAt: string;
  };
  currentStress: {
    level: StressLevel;
    status: "low" | "moderate" | "high" | "very-high";
  };
  trendData: MoodTrendData[];
  goals: WellnessGoal[];
  recommendations: WellnessRecommendation[];
  recentCheckIns: MoodEntry[];
  streakDays: number;
}

export interface DailyCheckInInput {
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  note?: string;
}

// Helper functions for type conversions
export function getMoodLabel(level: MoodLevel): string {
  const labels = {
    1: "Very Low",
    2: "Low",
    3: "Neutral",
    4: "Good",
    5: "Great",
  };
  return labels[level];
}

export function getStressStatus(level: StressLevel): "low" | "moderate" | "high" | "very-high" {
  if (level <= 3) return "low";
  if (level <= 6) return "moderate";
  if (level <= 8) return "high";
  return "very-high";
}

export function getStressLabel(level: StressLevel): string {
  const status = getStressStatus(level);
  const labels = {
    "low": "Low - You're calm",
    "moderate": "Moderate - Manageable stress",
    "high": "High - Elevated stress",
    "very-high": "Very High - Consider taking a break",
  };
  return labels[status];
}

export function getEnergyNumeric(energy: EnergyLevel): number {
  const map = { low: 2, moderate: 3.5, high: 5 };
  return map[energy];
}

export function getWellnessScoreStatus(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Attention";
}

// Self-Assessment Types
export type QuestionType = "likert" | "yesno" | "multiple-choice";

export interface AssessmentQuestion {
  id: string;
  category: "mental-health" | "stress" | "lifestyle" | "academic";
  question: string;
  type: QuestionType;
  options?: string[]; // For multiple-choice
  helpText?: string;
  reverse?: boolean; // For reverse-scored questions (higher = worse)
}

export interface AssessmentResponse {
  questionId: string;
  value: number; // 1-5 for likert, 0/1 for yes/no, index for multiple-choice
  timestamp: string;
}

export interface AssessmentResult {
  id: string;
  userId?: string;
  completedAt: string;
  responses: AssessmentResponse[];
  scores: {
    overall: number;
    mentalHealth: number;
    stress: number;
    lifestyle: number;
    academic: number;
  };
  recommendations: string[];
}

export interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: AssessmentQuestion[];
}
