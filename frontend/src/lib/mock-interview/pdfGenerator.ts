import { jsPDF } from "jspdf";
import { InterviewReport } from "./reportTypes";

// Colors
const PRIMARY_COLOR = [59, 130, 246] as const; // Blue
const TEXT_COLOR = [31, 41, 55] as const; // Dark gray
const LIGHT_GRAY = [156, 163, 175] as const;
const SUCCESS_COLOR = [34, 197, 94] as const; // Green
const WARNING_COLOR = [234, 179, 8] as const; // Yellow
const DANGER_COLOR = [239, 68, 68] as const; // Red

export function generateInterviewPDF(report: InterviewReport): void {
  const doc = new jsPDF();
  let yPos = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; color?: readonly [number, number, number]; bold?: boolean; maxWidth?: number }) => {
    const { fontSize = 12, color = TEXT_COLOR, bold = false } = options || {};
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", bold ? "bold" : "normal");

    if (options?.maxWidth) {
      const lines = doc.splitTextToSize(text, options.maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.4);
    }
    doc.text(text, x, y);
    return fontSize * 0.4;
  };

  const addSection = (title: string) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 10;
    addText(title, 20, yPos, { fontSize: 14, color: PRIMARY_COLOR, bold: true });
    yPos += 8;
    // Underline
    doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
  };

  const addParagraph = (text: string) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    const height = addText(text, 20, yPos, { maxWidth: 170 });
    yPos += height + 6;
  };

  const addBulletPoint = (text: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFillColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.circle(23, yPos - 1.5, 1, "F");
    const height = addText(text, 28, yPos, { maxWidth: 160 });
    yPos += height + 4;
  };

  const getScoreColor = (score: number): readonly [number, number, number] => {
    if (score >= 7) return SUCCESS_COLOR;
    if (score >= 5) return WARNING_COLOR;
    return DANGER_COLOR;
  };

  // === HEADER ===
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, 210, 40, "F");

  addText("INTERVIEW ASSESSMENT REPORT", 20, 18, { fontSize: 20, color: [255, 255, 255], bold: true });
  addText(`Generated: ${new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, 20, 28, { fontSize: 10, color: [200, 220, 255] });
  addText(`Duration: ${report.duration} | Language: ${report.language}`, 20, 35, { fontSize: 10, color: [200, 220, 255] });

  yPos = 55;

  // === SCORES SECTION ===
  addSection("Performance Scores");

  const scoreWidth = 40;
  const scoreStartX = 25;
  const scores = [
    { label: "Technical", value: report.scores.technical },
    { label: "Communication", value: report.scores.communication },
    { label: "Problem Solving", value: report.scores.problemSolving },
    { label: "Overall", value: report.scores.overall },
  ];

  scores.forEach((score, index) => {
    const x = scoreStartX + (index * scoreWidth);

    // Score box
    const color = getScoreColor(score.value);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x, yPos, 35, 25, 3, 3, "F");

    // Score value
    addText(score.value.toString(), x + 12, yPos + 15, { fontSize: 18, color: [255, 255, 255], bold: true });
    addText("/10", x + 22, yPos + 15, { fontSize: 10, color: [255, 255, 255] });

    // Label
    addText(score.label, x + 2, yPos + 32, { fontSize: 9, color: LIGHT_GRAY });
  });

  yPos += 45;

  // === OVERALL ASSESSMENT ===
  addSection("Overall Assessment");
  addParagraph(report.overallAssessment);

  // === EXECUTIVE SUMMARY ===
  addSection("Executive Summary");
  addParagraph(report.executiveSummary);

  // === STRENGTHS ===
  addSection("Strengths");
  report.strengths.forEach((strength) => {
    addBulletPoint(strength);
  });

  // === AREAS FOR IMPROVEMENT ===
  addSection("Areas for Improvement");
  report.areasForImprovement.forEach((area) => {
    addBulletPoint(area);
  });

  // === TECHNICAL ANALYSIS ===
  addSection("Technical Skills Analysis");
  addParagraph(report.technicalAnalysis);

  // === COMMUNICATION ANALYSIS ===
  addSection("Communication Analysis");
  addParagraph(report.communicationAnalysis);

  // === CODING PERFORMANCE ===
  if (report.codingPerformance.challengesAttempted > 0) {
    addSection("Coding Challenge Performance");
    addText(`Challenges Attempted: ${report.codingPerformance.challengesAttempted}`, 20, yPos, { fontSize: 11 });
    yPos += 6;
    addText(`Challenges Passed: ${report.codingPerformance.challengesPassed}`, 20, yPos, { fontSize: 11 });
    yPos += 10;
    addParagraph(report.codingPerformance.details);
  }

  // === KEY HIGHLIGHTS ===
  if (report.keyHighlights.length > 0) {
    addSection("Key Highlights");
    report.keyHighlights.forEach((highlight) => {
      addBulletPoint(highlight);
    });
  }

  // === RECOMMENDATIONS ===
  addSection("Recommendations");
  report.recommendations.forEach((rec, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    addText(`${index + 1}.`, 20, yPos, { fontSize: 11, bold: true });
    const height = addText(rec, 28, yPos, { maxWidth: 160 });
    yPos += height + 6;
  });

  // === FOOTER ===
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2]);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
    doc.text("EdgeUp College - Mock Interview Report", 105, 295, { align: "center" });
  }

  // Save the PDF
  const fileName = `interview-report-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
