import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GenerateReportRequest, InterviewReport } from "@/types/mock-interview.types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REPORT_GENERATION_PROMPT = `You are an interview analysis expert. Based on the interview transcript provided, generate a comprehensive assessment report.

Analyze the conversation and provide:
1. Executive Summary (2-3 paragraphs summarizing the interview and candidate's overall performance)
2. Technical Analysis (detailed assessment of technical skills demonstrated)
3. Communication Analysis (assessment of how well they communicated, articulated thoughts)
4. Coding Performance Details (if coding challenges were attempted, analyze their approach and solution)
5. Key Highlights (3-5 notable moments or responses from the interview)
6. Recommendations (3-5 actionable recommendations for the candidate)

Respond in JSON format:
{
  "executiveSummary": "...",
  "technicalAnalysis": "...",
  "communicationAnalysis": "...",
  "codingPerformanceDetails": "...",
  "keyHighlights": ["...", "..."],
  "recommendations": ["...", "..."]
}`;

export async function POST(request: NextRequest) {
  try {
    const body: GenerateReportRequest = await request.json();
    const { messages, assessment, language, startTime } = body;

    console.log("\n=== GENERATE REPORT API ===");
    console.log("Messages count:", messages.length);
    console.log("Assessment:", assessment);

    // Format conversation for analysis
    const conversationText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    // Generate detailed analysis using OpenAI
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: REPORT_GENERATION_PROMPT },
        {
          role: "user",
          content: `Here is the interview transcript to analyze:\n\n${conversationText}\n\nThe candidate used ${language} for coding challenges.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const analysisContent = analysisResponse.choices[0].message.content;
    let analysis;

    try {
      analysis = JSON.parse(analysisContent || "{}");
    } catch {
      console.error("Failed to parse analysis JSON:", analysisContent);
      analysis = {
        executiveSummary: "Unable to generate detailed analysis.",
        technicalAnalysis: "Analysis unavailable.",
        communicationAnalysis: "Analysis unavailable.",
        codingPerformanceDetails: "Analysis unavailable.",
        keyHighlights: [],
        recommendations: [],
      };
    }

    // Calculate duration
    const start = new Date(startTime);
    const end = new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${minutes}m ${seconds}s`;

    // Calculate overall score (average of the three scores)
    const overallScore = Math.round(
      (assessment.technicalScore + assessment.communicationScore + assessment.problemSolvingScore) / 3
    );

    // Build the report
    const report: InterviewReport = {
      generatedAt: end.toISOString(),
      duration,
      language,

      scores: {
        technical: assessment.technicalScore,
        communication: assessment.communicationScore,
        problemSolving: assessment.problemSolvingScore,
        overall: overallScore,
      },

      overallAssessment: assessment.overallAssessment,
      strengths: assessment.strengths,
      areasForImprovement: assessment.areasForImprovement,

      executiveSummary: analysis.executiveSummary || "",
      technicalAnalysis: analysis.technicalAnalysis || "",
      communicationAnalysis: analysis.communicationAnalysis || "",
      codingPerformance: {
        challengesAttempted: countCodingChallenges(messages),
        challengesPassed: countPassedChallenges(messages),
        details: analysis.codingPerformanceDetails || "",
      },
      keyHighlights: analysis.keyHighlights || [],
      recommendations: analysis.recommendations || [],
    };

    console.log("Report generated successfully");

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

// Helper to count coding challenges from messages
function countCodingChallenges(messages: { role: string; content: string }[]): number {
  return messages.filter(
    (m) => m.role === "assistant" && m.content.includes("coding challenge")
  ).length;
}

// Helper to count passed challenges
function countPassedChallenges(messages: { role: string; content: string }[]): number {
  return messages.filter(
    (m) => m.content.includes("[User completed the coding challenge successfully")
  ).length;
}
