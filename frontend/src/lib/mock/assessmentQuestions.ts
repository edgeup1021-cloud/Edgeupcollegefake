import type { AssessmentCategory } from "@/types/wellness.types";

export const assessmentCategories: AssessmentCategory[] = [
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Understanding your emotional wellbeing and mood patterns",
    icon: "Brain",
    questions: [
      {
        id: "mh1",
        category: "mental-health",
        question: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
        type: "likert",
        helpText: "Rate from 1 (Not at all) to 5 (Nearly every day)",
        reverse: true,
      },
      {
        id: "mh2",
        category: "mental-health",
        question: "How often do you feel anxious or worried?",
        type: "likert",
        helpText: "Rate from 1 (Rarely) to 5 (Very often)",
        reverse: true,
      },
      {
        id: "mh3",
        category: "mental-health",
        question: "How satisfied are you with your overall mood and emotional state?",
        type: "likert",
        helpText: "Rate from 1 (Very dissatisfied) to 5 (Very satisfied)",
      },
    ],
  },
  {
    id: "stress",
    name: "Stress & Coping",
    description: "Assessing your stress levels and how you handle pressure",
    icon: "Lightning",
    questions: [
      {
        id: "st1",
        category: "stress",
        question: "How would you rate your current stress level?",
        type: "likert",
        helpText: "Rate from 1 (Very low) to 5 (Very high)",
        reverse: true,
      },
      {
        id: "st2",
        category: "stress",
        question: "How often do you engage in stress-relief activities (exercise, meditation, hobbies)?",
        type: "likert",
        helpText: "Rate from 1 (Never) to 5 (Daily)",
      },
      {
        id: "st3",
        category: "stress",
        question: "How well do you handle pressure during exams or deadlines?",
        type: "likert",
        helpText: "Rate from 1 (Not well) to 5 (Very well)",
      },
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Balance",
    description: "Evaluating your daily habits and life balance",
    icon: "Heartbeat",
    questions: [
      {
        id: "ls1",
        category: "lifestyle",
        question: "How would you rate the quality of your sleep?",
        type: "likert",
        helpText: "Rate from 1 (Very poor) to 5 (Excellent)",
      },
      {
        id: "ls2",
        category: "lifestyle",
        question: "How often do you engage in physical activity or exercise?",
        type: "likert",
        helpText: "Rate from 1 (Never) to 5 (Daily)",
      },
      {
        id: "ls3",
        category: "lifestyle",
        question: "How satisfied are you with your social life and relationships?",
        type: "likert",
        helpText: "Rate from 1 (Very dissatisfied) to 5 (Very satisfied)",
      },
    ],
  },
  {
    id: "academic",
    name: "Academic Wellbeing",
    description: "Understanding your academic experience and motivation",
    icon: "GraduationCap",
    questions: [
      {
        id: "ac1",
        category: "academic",
        question: "How motivated do you feel about your studies?",
        type: "likert",
        helpText: "Rate from 1 (Not motivated) to 5 (Very motivated)",
      },
      {
        id: "ac2",
        category: "academic",
        question: "How often do you feel burned out from academic work?",
        type: "likert",
        helpText: "Rate from 1 (Never) to 5 (Very often)",
        reverse: true,
      },
      {
        id: "ac3",
        category: "academic",
        question: "How well do you manage your time and meet deadlines?",
        type: "likert",
        helpText: "Rate from 1 (Not well) to 5 (Very well)",
      },
    ],
  },
];

// Helper function to get all questions in order
export function getAllQuestions() {
  return assessmentCategories.flatMap((cat) => cat.questions);
}

// Helper function to calculate scores
export function calculateAssessmentScores(responses: Record<string, number>) {
  const allQuestions = getAllQuestions();
  const categoryScores: Record<string, { total: number; count: number }> = {
    "mental-health": { total: 0, count: 0 },
    stress: { total: 0, count: 0 },
    lifestyle: { total: 0, count: 0 },
    academic: { total: 0, count: 0 },
  };

  // Calculate raw scores for each category
  Object.entries(responses).forEach(([questionId, value]) => {
    const question = allQuestions.find((q) => q.id === questionId);
    if (!question) return;

    let score = value;

    // Handle different question types
    if (question.type === "yesno") {
      score = value === 1 ? 5 : 1; // Convert yes/no to 5/1 scale
    }

    // Reverse score if needed (for negative questions)
    if (question.reverse) {
      score = 6 - score; // Reverse: 1->5, 2->4, 3->3, 4->2, 5->1
    }

    categoryScores[question.category].total += score;
    categoryScores[question.category].count += 1;
  });

  // Convert to 0-100 scale
  const scores = {
    mentalHealth: Math.round((categoryScores["mental-health"].total / (categoryScores["mental-health"].count * 5)) * 100),
    stress: Math.round((categoryScores.stress.total / (categoryScores.stress.count * 5)) * 100),
    lifestyle: Math.round((categoryScores.lifestyle.total / (categoryScores.lifestyle.count * 5)) * 100),
    academic: Math.round((categoryScores.academic.total / (categoryScores.academic.count * 5)) * 100),
    overall: 0,
  };

  // Calculate overall as weighted average
  scores.overall = Math.round((scores.mentalHealth + scores.stress + scores.lifestyle + scores.academic) / 4);

  return scores;
}

// Generate recommendations based on scores
export function generateRecommendations(scores: {
  mentalHealth: number;
  stress: number;
  lifestyle: number;
  academic: number;
}): string[] {
  const recommendations: string[] = [];

  if (scores.mentalHealth < 50) {
    recommendations.push("Consider speaking with a campus counselor about your mental health");
    recommendations.push("Practice daily mood check-ins to track your emotional patterns");
  } else if (scores.mentalHealth < 70) {
    recommendations.push("Explore mindfulness or meditation practices for emotional balance");
  }

  if (scores.stress < 50) {
    recommendations.push("Your stress levels are elevated. Try the breathing exercises on your dashboard");
    recommendations.push("Consider booking an appointment with campus counseling services");
  } else if (scores.stress < 70) {
    recommendations.push("Regular stress-relief activities can help maintain your wellbeing");
  }

  if (scores.lifestyle < 50) {
    recommendations.push("Focus on improving sleep quality and maintaining a regular sleep schedule");
    recommendations.push("Try to incorporate 20-30 minutes of physical activity into your daily routine");
  } else if (scores.lifestyle < 70) {
    recommendations.push("Continue building healthy lifestyle habits for sustained wellbeing");
  }

  if (scores.academic < 50) {
    recommendations.push("Consider meeting with an academic advisor to discuss time management strategies");
    recommendations.push("Break large tasks into smaller, manageable chunks to reduce overwhelm");
  } else if (scores.academic < 70) {
    recommendations.push("Maintain your current study habits and seek help when needed");
  }

  // Add positive reinforcement for good scores
  if (scores.overall >= 70) {
    recommendations.push("You're doing well! Continue your current wellness practices");
  }

  return recommendations;
}
