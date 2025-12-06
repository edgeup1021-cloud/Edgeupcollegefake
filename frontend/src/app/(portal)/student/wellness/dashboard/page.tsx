"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardText } from "@phosphor-icons/react";
import WellnessScoreCard from "@/components/wellness/WellnessScoreCard";
import CurrentMoodCard from "@/components/wellness/CurrentMoodCard";
import StressLevelCard from "@/components/wellness/StressLevelCard";
import MoodTrendChart from "@/components/wellness/MoodTrendChart";
import QuickWellnessActions from "@/components/wellness/QuickWellnessActions";
import WellnessGoalsCard from "@/components/wellness/WellnessGoalsCard";
import RecommendationsCard from "@/components/wellness/RecommendationsCard";
import SOSSupportCard from "@/components/wellness/SOSSupportCard";
import RecentCheckinsCard from "@/components/wellness/RecentCheckinsCard";
import DailyCheckInModal from "@/components/wellness/DailyCheckInModal";
import GratitudeJournalModal from "@/components/wellness/modals/GratitudeJournalModal";
import AppointmentBookingModal from "@/components/wellness/modals/AppointmentBookingModal";
import EmergencyResourcesModal from "@/components/wellness/modals/EmergencyResourcesModal";
import CounselingContactModal from "@/components/wellness/modals/CounselingContactModal";
import AddGoalModal from "@/components/wellness/modals/AddGoalModal";
import { mockWellnessData } from "@/lib/mock/wellnessData";
import type { DailyCheckInInput } from "@/types/wellness.types";

export default function WellnessDashboardPage() {
  const router = useRouter();
  const [wellnessData, setWellnessData] = useState(mockWellnessData);

  // Sync with clinical assessment data from localStorage
  useEffect(() => {
    try {
      // Load individual clinical assessments
      const phq9Data = localStorage.getItem("phq9Assessment");
      const gad7Data = localStorage.getItem("gad7Assessment");
      const pss10Data = localStorage.getItem("pss10Assessment");

      const phq9 = phq9Data ? JSON.parse(phq9Data) : null;
      const gad7 = gad7Data ? JSON.parse(gad7Data) : null;
      const pss10 = pss10Data ? JSON.parse(pss10Data) : null;

      // If at least one assessment is completed, update the dashboard
      if (phq9 || gad7 || pss10) {
        // Calculate wellness scores from clinical assessments
        // Convert clinical scores to 0-100 scale for dashboard display
        const mentalHealthScore = phq9
          ? Math.max(0, 100 - (phq9.result.score / 27) * 100) // PHQ-9: lower is better
          : 70;

        const stressScore = gad7
          ? Math.max(0, 100 - (gad7.result.score / 21) * 100) // GAD-7: lower is better
          : 70;

        const lifestyleScore = pss10
          ? Math.max(0, 100 - (pss10.result.score / 40) * 100) // PSS-10: lower is better
          : 70;

        const overall = Math.round((mentalHealthScore + stressScore + lifestyleScore) / 3);

        // Collect all recommendations
        const allRecommendations: string[] = [];
        if (phq9?.recommendations) allRecommendations.push(...phq9.recommendations);
        if (gad7?.recommendations) allRecommendations.push(...gad7.recommendations);
        if (pss10?.recommendations) allRecommendations.push(...pss10.recommendations);

        setWellnessData((prev) => ({
          ...prev,
          score: {
            overall,
            mentalHealth: Math.round(mentalHealthScore),
            stressLevel: Math.round(stressScore),
            physicalActivity: Math.round(lifestyleScore),
            socialConnection: Math.round(lifestyleScore),
          },
          // Add clinical assessment-based recommendations
          recommendations: [
            // Add assessment summary card
            {
              id: "clinical-summary",
              icon: "ChartLine",
              title: "Clinical Assessment Results",
              description: `${phq9 ? 'Depression: ' + phq9.result.severity : ''}${phq9 && (gad7 || pss10) ? ' • ' : ''}${gad7 ? 'Anxiety: ' + gad7.result.severity : ''}${gad7 && pss10 ? ' • ' : ''}${pss10 ? 'Stress: ' + pss10.result.severity : ''}`,
              actionLabel: "View Details",
              type: "insight" as const,
            },
            // Keep original recommendations (filter out any old assessment-based ones to avoid duplicates)
            ...prev.recommendations
              .filter(rec => !rec.id.startsWith('clinical-') && !rec.id.startsWith('assessment-'))
              .slice(0, 3),
          ].slice(0, 5), // Limit to 5 total recommendations
        }));
      }
    } catch (error) {
      console.error("Error loading clinical assessment data:", error);
    }
  }, []);

  // Modal states
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isGratitudeModalOpen, setIsGratitudeModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEmergencyResourcesModalOpen, setIsEmergencyResourcesModalOpen] = useState(false);
  const [isCounselingContactModalOpen, setIsCounselingContactModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // Handler for daily check-in submission
  const handleCheckInSubmit = (data: DailyCheckInInput) => {
    console.log("Check-in submitted:", data);
    // TODO: Send to backend API when ready
    // Update local state with new mood entry
    const newEntry = {
      id: `${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      mood: data.mood,
      energy: data.energy,
      stress: data.stress,
      note: data.note,
    };

    setWellnessData((prev) => ({
      ...prev,
      currentMood: {
        level: data.mood,
        lastCheckedAt: new Date().toISOString(),
      },
      currentStress: {
        level: data.stress,
        status: data.stress <= 3 ? "low" : data.stress <= 6 ? "moderate" : data.stress <= 8 ? "high" : "very-high",
      },
      recentCheckIns: [newEntry, ...prev.recentCheckIns],
      streakDays: prev.streakDays + 1,
    }));

    setIsCheckInModalOpen(false);
  };

  // Handler for toggling wellness goals
  const handleToggleGoal = (goalId: string) => {
    setWellnessData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              completed: !goal.completed,
              completedAt: !goal.completed ? new Date().toISOString() : undefined,
            }
          : goal
      ),
    }));
  };

  // Quick Actions handlers
  const handleBreathingExercise = () => {
    router.push('/student/wellness/mood-booster');
  };

  const handleGratitudeJournal = () => {
    setIsGratitudeModalOpen(true);
  };

  const handleGratitudeSubmit = (entry: string) => {
    console.log("Gratitude entry:", entry);
    // TODO: Send to backend API when ready
  };

  const handleCalmingMusic = () => {
    // Open Spotify/YouTube playlist
    window.open("https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u", "_blank");
  };

  const handleReachOut = () => {
    // For now, open the counseling contact modal
    setIsCounselingContactModalOpen(true);
  };

  const handleAddGoal = () => {
    setIsAddGoalModalOpen(true);
  };

  const handleAddGoalSubmit = (goalData: { title: string; type: "mood" | "activity" | "mindfulness" | "social" | "creative" | "custom" }) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      description: "",
      type: goalData.type,
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    };

    setWellnessData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));

    setIsAddGoalModalOpen(false);
  };

  const handleViewAllCheckIns = () => {
    console.log("Viewing all check-ins...");
    // TODO: Navigate to check-ins history page
    alert("Full check-in history coming soon!");
  };

  // Support Actions handlers
  const handleCallCounseling = () => {
    setIsCounselingContactModalOpen(true);
  };

  const handleBookAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleAppointmentBook = (appointment: any) => {
    console.log("Appointment booked:", appointment);
    // TODO: Send to backend API when ready
  };

  const handleStartPeerChat = () => {
    console.log("Starting peer chat...");
    // TODO: Implement peer chat interface
    alert("Peer chat feature coming soon! This will connect you with trained peer supporters.");
  };

  const handleEmergencyResources = () => {
    setIsEmergencyResourcesModalOpen(true);
  };

  // Recommendation Actions handler
  const handleRecommendationAction = (recommendation: any) => {
    console.log("Recommendation action:", recommendation);

    // Handle clinical assessment results view - Navigate to self-assessment page
    if (recommendation.id === "clinical-summary") {
      router.push('/student/wellness/self-assessment');
      return;
    }

    // Handle clinical recommendations - Open counseling contact
    if (recommendation.id?.startsWith("clinical-rec-")) {
      setIsCounselingContactModalOpen(true);
      return;
    }

    // Handle different recommendation actions based on actionLabel
    if (recommendation.actionLabel === "Try This Tip") {
      // Navigate to mood booster page for wellness activities
      router.push('/student/wellness/mood-booster');
    } else if (recommendation.actionLabel === "Set Reminder") {
      // Add as a wellness goal
      const newGoal = {
        id: `goal-${Date.now()}`,
        title: recommendation.title,
        description: recommendation.description,
        type: "activity" as const, // Use activity type for wellness recommendations
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      };

      setWellnessData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal],
      }));

      // Show success feedback
      alert(`Added "${recommendation.title}" to your wellness goals! Check the Wellness Goals section below.`);
    } else if (recommendation.actionLabel === "View Schedule") {
      // Navigate to timetable/schedule page
      router.push('/student/timetable');
    } else if (recommendation.actionLabel === "Learn More") {
      // For general "Learn More" - open counseling contact
      setIsCounselingContactModalOpen(true);
    } else {
      // Default action - open mood booster
      router.push('/student/wellness/mood-booster');
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Wellness Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your mental health and wellbeing journey
          </p>
        </div>

        {/* Assessment CTA Banner */}
        {(() => {
          if (typeof window === "undefined") return null;

          // Check if any clinical assessments have been completed
          const phq9Data = localStorage.getItem("phq9Assessment");
          const gad7Data = localStorage.getItem("gad7Assessment");
          const pss10Data = localStorage.getItem("pss10Assessment");

          const hasAnyAssessment = phq9Data || gad7Data || pss10Data;
          const hasAllAssessments = phq9Data && gad7Data && pss10Data;

          // Show CTA if no assessments completed
          if (!hasAnyAssessment) {
            return (
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/10 border-2 border-brand-primary/30 dark:border-brand-primary/20">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Take a Clinical Assessment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get personalized insights using validated clinical tools (PHQ-9, GAD-7, PSS-10). Takes only 1-3 minutes per assessment.
                    </p>
                    <a
                      href="/student/wellness/self-assessment"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all"
                    >
                      <span>Start Assessment</span>
                      <ArrowRight className="w-5 h-5" weight="bold" />
                    </a>
                  </div>
                  <div className="hidden lg:block">
                    <ClipboardText className="w-24 h-24 text-brand-primary opacity-20" weight="duotone" />
                  </div>
                </div>
              </div>
            );
          }

          // Show progress banner if some but not all assessments completed
          if (!hasAllAssessments) {
            const completed: string[] = [];
            const pending: string[] = [];

            if (phq9Data) completed.push("PHQ-9"); else pending.push("PHQ-9");
            if (gad7Data) completed.push("GAD-7"); else pending.push("GAD-7");
            if (pss10Data) completed.push("PSS-10"); else pending.push("PSS-10");

            return (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Complete Your Assessment Suite
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      You've completed: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completed.join(", ")}</span>
                      <br />
                      Still available: <span className="font-semibold text-blue-600 dark:text-blue-400">{pending.join(", ")}</span>
                    </p>
                    <a
                      href="/student/wellness/self-assessment"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      <span>Continue Assessments</span>
                      <ArrowRight className="w-4 h-4" weight="bold" />
                    </a>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1: Wellness Score (span 2) + Current Mood + Stress Level */}
          <WellnessScoreCard score={wellnessData.score} />
          <CurrentMoodCard
            level={wellnessData.currentMood.level}
            lastCheckedAt={wellnessData.currentMood.lastCheckedAt}
            onUpdate={() => setIsCheckInModalOpen(true)}
          />
          <StressLevelCard
            level={wellnessData.currentStress.level}
            status={wellnessData.currentStress.status}
          />

          {/* Row 2: 7-Day Mood Trend (full width) */}
          <MoodTrendChart data={wellnessData.trendData} />

          {/* Row 3: Quick Actions (span 2) + Wellness Goals (span 2) */}
          <QuickWellnessActions
            onBreathingExercise={handleBreathingExercise}
            onGratitudeJournal={handleGratitudeJournal}
            onCalmingMusic={handleCalmingMusic}
            onReachOut={handleReachOut}
          />
          <WellnessGoalsCard
            goals={wellnessData.goals}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
          />

          {/* Row 4: Recommendations (full width) */}
          <RecommendationsCard
            recommendations={wellnessData.recommendations}
            onAction={handleRecommendationAction}
          />

          {/* Row 5: SOS Support (span 2) + Recent Check-ins (span 2) */}
          <SOSSupportCard
            onCallCounseling={handleCallCounseling}
            onBookAppointment={handleBookAppointment}
            onStartPeerChat={handleStartPeerChat}
            onEmergencyResources={handleEmergencyResources}
          />
          <RecentCheckinsCard
            checkIns={wellnessData.recentCheckIns}
            onViewAll={handleViewAllCheckIns}
          />
        </div>
      </div>

      {/* All Modals */}
      <DailyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSubmit={handleCheckInSubmit}
        streakDays={wellnessData.streakDays}
      />

      <GratitudeJournalModal
        isOpen={isGratitudeModalOpen}
        onClose={() => setIsGratitudeModalOpen(false)}
        onSubmit={handleGratitudeSubmit}
      />

      <AppointmentBookingModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onBook={handleAppointmentBook}
      />

      <EmergencyResourcesModal
        isOpen={isEmergencyResourcesModalOpen}
        onClose={() => setIsEmergencyResourcesModalOpen(false)}
      />

      <CounselingContactModal
        isOpen={isCounselingContactModalOpen}
        onClose={() => setIsCounselingContactModalOpen(false)}
      />

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onSubmit={handleAddGoalSubmit}
      />
    </>
  );
}
