// Types for interview report generation

export interface InterviewScores {
  technical: number;
  communication: number;
  problemSolving: number;
  overall: number;
}

export interface CodingPerformance {
  challengesAttempted: number;
  challengesPassed: number;
  details: string;
}

export interface InterviewAssessment {
  spokenOutro: string;
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
}

export interface InterviewReport {
  // Metadata
  generatedAt: string;
  duration: string;
  language: string;

  // Scores
  scores: InterviewScores;

  // From AI end_interview tool call
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];

  // From report generation API (AI-generated analysis)
  executiveSummary: string;
  technicalAnalysis: string;
  communicationAnalysis: string;
  codingPerformance: CodingPerformance;
  keyHighlights: string[];
  recommendations: string[];
}

// Request body for report generation API
export interface GenerateReportRequest {
  messages: { role: string; content: string }[];
  assessment: InterviewAssessment;
  language: string;
  startTime: string;
}
