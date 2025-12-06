import type { AssessmentCategory } from "@/types/wellness.types";

// PHQ-9: Patient Health Questionnaire for Depression
// Scoring: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-19 (moderately severe), 20-27 (severe)
export const phq9: AssessmentCategory = {
  id: "phq9",
  name: "PHQ-9: Depression Screening",
  description: "The Patient Health Questionnaire (PHQ-9) is a validated tool that screens for the presence and severity of depression. It asks about symptoms you've experienced over the past 2 weeks.",
  icon: "Brain",
  questions: [
    {
      id: "phq1",
      category: "mental-health",
      question: "Little interest or pleasure in doing things",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false, // PHQ-9 uses direct scoring (0=not at all, 3=nearly every day)
    },
    {
      id: "phq2",
      category: "mental-health",
      question: "Feeling down, depressed, or hopeless",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq3",
      category: "mental-health",
      question: "Trouble falling or staying asleep, or sleeping too much",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq4",
      category: "mental-health",
      question: "Feeling tired or having little energy",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq5",
      category: "mental-health",
      question: "Poor appetite or overeating",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq6",
      category: "mental-health",
      question: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq7",
      category: "mental-health",
      question: "Trouble concentrating on things, such as reading or watching television",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq8",
      category: "mental-health",
      question: "Moving or speaking so slowly that other people could have noticed, or being fidgety or restless",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "phq9",
      category: "mental-health",
      question: "Thoughts that you would be better off dead or of hurting yourself in some way",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
  ],
};

// GAD-7: Generalized Anxiety Disorder Scale
// Scoring: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-21 (severe)
export const gad7: AssessmentCategory = {
  id: "gad7",
  name: "GAD-7: Anxiety Screening",
  description: "The Generalized Anxiety Disorder scale (GAD-7) is a validated screening tool for anxiety disorders. It measures the frequency of anxiety symptoms you've experienced over the past 2 weeks.",
  icon: "Lightning",
  questions: [
    {
      id: "gad1",
      category: "stress",
      question: "Feeling nervous, anxious, or on edge",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad2",
      category: "stress",
      question: "Not being able to stop or control worrying",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad3",
      category: "stress",
      question: "Worrying too much about different things",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad4",
      category: "stress",
      question: "Trouble relaxing",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad5",
      category: "stress",
      question: "Being so restless that it's hard to sit still",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad6",
      category: "stress",
      question: "Becoming easily annoyed or irritable",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
    {
      id: "gad7",
      category: "stress",
      question: "Feeling afraid as if something awful might happen",
      type: "likert",
      helpText: "Over the last 2 weeks, how often have you been bothered by this?",
      reverse: false,
    },
  ],
};

// PSS-10: Perceived Stress Scale
// Scoring: 0-13 (low stress), 14-26 (moderate stress), 27-40 (high stress)
export const pss10: AssessmentCategory = {
  id: "pss10",
  name: "PSS-10: Perceived Stress Scale",
  description: "The Perceived Stress Scale (PSS-10) measures the degree to which situations in your life are appraised as stressful. It assesses how unpredictable, uncontrollable, and overloaded you find your life over the past month.",
  icon: "Heartbeat",
  questions: [
    {
      id: "pss1",
      category: "lifestyle",
      question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
    {
      id: "pss2",
      category: "lifestyle",
      question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
    {
      id: "pss3",
      category: "lifestyle",
      question: "In the last month, how often have you felt nervous and stressed?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
    {
      id: "pss4",
      category: "lifestyle",
      question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: true, // This is a positive question, needs reverse scoring
    },
    {
      id: "pss5",
      category: "lifestyle",
      question: "In the last month, how often have you felt that things were going your way?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: true,
    },
    {
      id: "pss6",
      category: "lifestyle",
      question: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
    {
      id: "pss7",
      category: "lifestyle",
      question: "In the last month, how often have you been able to control irritations in your life?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: true,
    },
    {
      id: "pss8",
      category: "lifestyle",
      question: "In the last month, how often have you felt that you were on top of things?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: true,
    },
    {
      id: "pss9",
      category: "lifestyle",
      question: "In the last month, how often have you been angered because of things that happened that were outside of your control?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
    {
      id: "pss10",
      category: "lifestyle",
      question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
      type: "likert",
      helpText: "Rate from 1 (Never) to 5 (Very often)",
      reverse: false,
    },
  ],
};

// Combined assessment categories
export const clinicalAssessments = [phq9, gad7, pss10];

// Helper function to get all questions
export function getAllClinicalQuestions() {
  return clinicalAssessments.flatMap((cat) => cat.questions);
}

// Clinical scoring functions
export function calculatePHQ9Score(responses: Record<string, number>): { score: number; severity: string; description: string } {
  let total = 0;
  for (let i = 1; i <= 9; i++) {
    const value = responses[`phq${i}`];
    if (value !== undefined) {
      // Convert from 1-5 scale to 0-3 scale for PHQ-9
      total += Math.max(0, value - 1);
    }
  }

  let severity = "";
  let description = "";

  if (total <= 4) {
    severity = "Minimal";
    description = "Minimal or no depression symptoms";
  } else if (total <= 9) {
    severity = "Mild";
    description = "Mild depression symptoms";
  } else if (total <= 14) {
    severity = "Moderate";
    description = "Moderate depression symptoms - consider counseling";
  } else if (total <= 19) {
    severity = "Moderately Severe";
    description = "Moderately severe depression - counseling recommended";
  } else {
    severity = "Severe";
    description = "Severe depression - professional help strongly recommended";
  }

  return { score: total, severity, description };
}

export function calculateGAD7Score(responses: Record<string, number>): { score: number; severity: string; description: string } {
  let total = 0;
  for (let i = 1; i <= 7; i++) {
    const value = responses[`gad${i}`];
    if (value !== undefined) {
      // Convert from 1-5 scale to 0-3 scale for GAD-7
      total += Math.max(0, value - 1);
    }
  }

  let severity = "";
  let description = "";

  if (total <= 4) {
    severity = "Minimal";
    description = "Minimal anxiety symptoms";
  } else if (total <= 9) {
    severity = "Mild";
    description = "Mild anxiety symptoms";
  } else if (total <= 14) {
    severity = "Moderate";
    description = "Moderate anxiety - consider counseling";
  } else {
    severity = "Severe";
    description = "Severe anxiety - professional help recommended";
  }

  return { score: total, severity, description };
}

export function calculatePSS10Score(responses: Record<string, number>): { score: number; severity: string; description: string } {
  let total = 0;
  const pss10Questions = pss10.questions;

  pss10Questions.forEach((question) => {
    const value = responses[question.id];
    if (value !== undefined) {
      // Convert from 1-5 scale to 0-4 scale
      let score = value - 1;
      // Reverse scoring for positive questions
      if (question.reverse) {
        score = 4 - score;
      }
      total += score;
    }
  });

  let severity = "";
  let description = "";

  if (total <= 13) {
    severity = "Low";
    description = "Low perceived stress - good coping ability";
  } else if (total <= 26) {
    severity = "Moderate";
    description = "Moderate stress levels - manageable with support";
  } else {
    severity = "High";
    description = "High perceived stress - stress management recommended";
  }

  return { score: total, severity, description };
}

// Generate recommendations based on clinical scores
export function generateClinicalRecommendations(scores: {
  phq9: { score: number; severity: string };
  gad7: { score: number; severity: string };
  pss10: { score: number; severity: string };
}): string[] {
  const recommendations: string[] = [];

  // PHQ-9 based recommendations
  if (scores.phq9.score >= 15) {
    recommendations.push("Your depression screening indicates moderately severe to severe symptoms. We strongly recommend speaking with a mental health professional.");
    recommendations.push("Consider booking an appointment with campus counseling services as soon as possible.");
  } else if (scores.phq9.score >= 10) {
    recommendations.push("Your results suggest moderate depression symptoms. Speaking with a counselor could be beneficial.");
  } else if (scores.phq9.score >= 5) {
    recommendations.push("You're experiencing mild depression symptoms. Engaging in regular physical activity and maintaining social connections may help.");
  }

  // GAD-7 based recommendations
  if (scores.gad7.score >= 15) {
    recommendations.push("Your anxiety screening indicates severe symptoms. Professional support is strongly recommended.");
    recommendations.push("Try relaxation techniques like deep breathing exercises while seeking professional help.");
  } else if (scores.gad7.score >= 10) {
    recommendations.push("You're experiencing moderate anxiety. Consider learning stress management and relaxation techniques.");
  } else if (scores.gad7.score >= 5) {
    recommendations.push("Mild anxiety detected. Regular exercise and mindfulness practices may help manage symptoms.");
  }

  // PSS-10 based recommendations
  if (scores.pss10.score >= 27) {
    recommendations.push("Your stress levels are high. Consider speaking with a counselor about stress management strategies.");
    recommendations.push("Prioritize self-care activities and don't hesitate to reach out for support.");
  } else if (scores.pss10.score >= 14) {
    recommendations.push("Moderate stress detected. Regular breaks, exercise, and time management strategies can help.");
  }

  // General recommendations if all scores are low
  if (scores.phq9.score < 5 && scores.gad7.score < 5 && scores.pss10.score < 14) {
    recommendations.push("You're doing well! Continue your current self-care practices and healthy habits.");
    recommendations.push("Regular check-ins with yourself can help maintain your mental wellness.");
  }

  // Crisis recommendation if severe
  if (scores.phq9.score >= 20 || scores.gad7.score >= 15) {
    recommendations.push("If you're experiencing thoughts of self-harm, please contact emergency services or a crisis helpline immediately.");
  }

  return recommendations;
}
