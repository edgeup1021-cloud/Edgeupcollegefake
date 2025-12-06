// Mock Wellness Data for Development

import type { WellnessDashboardData } from "@/types/wellness.types";

export const mockWellnessData: WellnessDashboardData = {
  score: {
    overall: 78,
    mentalHealth: 75,
    stressLevel: 40, // Lower is better
    physicalActivity: 80,
    socialConnection: 75,
  },
  currentMood: {
    level: 4, // Good
    lastCheckedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  currentStress: {
    level: 5,
    status: "moderate",
  },
  trendData: [
    { date: "2024-12-02", dayLabel: "Mon", mood: 3, energy: 3 },
    { date: "2024-12-03", dayLabel: "Tue", mood: 3.5, energy: 3.5 },
    { date: "2024-12-04", dayLabel: "Wed", mood: 4, energy: 4 },
    { date: "2024-12-05", dayLabel: "Thu", mood: 4, energy: 3.5 },
    { date: "2024-12-06", dayLabel: "Fri", mood: 4.5, energy: 4.5 },
    { date: "2024-12-07", dayLabel: "Sat", mood: 5, energy: 5 },
    { date: "2024-12-08", dayLabel: "Sun", mood: 4, energy: 4 },
  ],
  goals: [
    {
      id: "1",
      title: "Log morning mood",
      type: "mood",
      completed: true,
      completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Take a 10-min walk",
      type: "activity",
      completed: true,
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "15 minutes of reading",
      type: "mindfulness",
      completed: false,
    },
    {
      id: "4",
      title: "Connect with a friend",
      type: "social",
      completed: false,
    },
  ],
  recommendations: [
    {
      id: "1",
      icon: "ChartLine",
      title: "Your mood tends to drop on Mondays",
      description: "Try scheduling something enjoyable for Monday mornings",
      actionLabel: "Try This Tip",
      type: "pattern",
    },
    {
      id: "2",
      icon: "Activity",
      title: "You feel better after physical activity",
      description: "Consider adding a 15-min walk to your routine",
      actionLabel: "Set Reminder",
      type: "suggestion",
    },
    {
      id: "3",
      icon: "CalendarWarning",
      title: "High stress period detected ahead",
      description: "You have 4 deadlines next week. Plan breaks between tasks.",
      actionLabel: "View Schedule",
      type: "upcoming",
    },
  ],
  recentCheckIns: [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      mood: 4,
      energy: "high",
      stress: 5,
      note: "Finished my project early!",
    },
    {
      id: "2",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      mood: 4,
      energy: "moderate",
      stress: 5,
      note: "Long day but productive",
    },
    {
      id: "3",
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      mood: 3,
      energy: "low",
      stress: 7,
      note: "Exam stress building up",
    },
  ],
  streakDays: 12,
};
