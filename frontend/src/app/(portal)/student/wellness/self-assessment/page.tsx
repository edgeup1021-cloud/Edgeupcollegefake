"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardText, Brain, Lightning, Heartbeat, GraduationCap } from "@phosphor-icons/react";
import AssessmentQuestion from "@/components/wellness/assessment/AssessmentQuestion";
import AssessmentResultsModal from "@/components/wellness/assessment/AssessmentResultsModal";
import {
  clinicalAssessments,
  getAllClinicalQuestions,
  calculatePHQ9Score,
  calculateGAD7Score,
  calculatePSS10Score,
  generateClinicalRecommendations,
} from "@/lib/mock/clinicalAssessments";

type AssessmentType = "phq9" | "gad7" | "pss10" | null;

export default function SelfAssessmentPage() {
  const [currentStep, setCurrentStep] = useState<"selection" | "intro" | "questions" | "results">("selection");
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState({
    overall: 0,
    mentalHealth: 0,
    stress: 0,
    lifestyle: 0,
    academic: 0,
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [clinicalResult, setClinicalResult] = useState<{
    score: number;
    severity: string;
    description: string;
  } | null>(null);

  const currentAssessmentData = selectedAssessment
    ? clinicalAssessments.find(a => a.id === selectedAssessment)
    : null;
  const allQuestions = currentAssessmentData?.questions || [];
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0;

  const handleAnswer = (value: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate results based on selected assessment
      let result;
      if (selectedAssessment === "phq9") {
        result = calculatePHQ9Score(responses);
      } else if (selectedAssessment === "gad7") {
        result = calculateGAD7Score(responses);
      } else if (selectedAssessment === "pss10") {
        result = calculatePSS10Score(responses);
      }

      if (result) {
        setClinicalResult(result);

        // Generate clinical recommendations
        const clinicalScores = {
          phq9: selectedAssessment === "phq9" ? result : { score: 0, severity: "N/A" },
          gad7: selectedAssessment === "gad7" ? result : { score: 0, severity: "N/A" },
          pss10: selectedAssessment === "pss10" ? result : { score: 0, severity: "N/A" },
        };
        const generatedRecommendations = generateClinicalRecommendations(clinicalScores);

        setRecommendations(generatedRecommendations);
        setShowResults(true);

        // Save to localStorage for dashboard sync
        localStorage.setItem(`${selectedAssessment}Assessment`, JSON.stringify({
          completedAt: new Date().toISOString(),
          assessmentType: selectedAssessment,
          result: result,
          recommendations: generatedRecommendations,
        }));
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSelectAssessment = (assessmentType: AssessmentType) => {
    setSelectedAssessment(assessmentType);
    setCurrentStep("intro");
  };

  const handleStartAssessment = () => {
    setCurrentStep("questions");
  };

  const currentQuestionValue = responses[currentQuestion?.id] ?? null;
  const canProceed = currentQuestionValue !== null;

  // Assessment Selection Screen
  if (currentStep === "selection") {
    const assessmentOptions = [
      {
        id: "phq9" as const,
        name: "PHQ-9",
        fullName: "Patient Health Questionnaire-9",
        description: "A validated tool that screens for depression. It evaluates the presence and severity of depressive symptoms over the past 2 weeks.",
        icon: Brain,
        color: "from-purple-500 to-pink-500",
        questions: 9,
        duration: "2-3 minutes",
        measures: ["Depressive symptoms", "Low mood", "Loss of interest", "Sleep changes", "Energy levels"],
      },
      {
        id: "gad7" as const,
        name: "GAD-7",
        fullName: "Generalized Anxiety Disorder-7",
        description: "A validated screening tool for anxiety disorders. It measures the frequency of anxiety symptoms over the past 2 weeks.",
        icon: Lightning,
        color: "from-orange-500 to-red-500",
        questions: 7,
        duration: "1-2 minutes",
        measures: ["Anxiety symptoms", "Excessive worry", "Restlessness", "Difficulty relaxing", "Fear and nervousness"],
      },
      {
        id: "pss10" as const,
        name: "PSS-10",
        fullName: "Perceived Stress Scale-10",
        description: "Measures the degree to which situations in your life are appraised as stressful. It assesses how unpredictable, uncontrollable, and overloaded you find your life over the past month.",
        icon: Heartbeat,
        color: "from-emerald-500 to-teal-500",
        questions: 10,
        duration: "2-3 minutes",
        measures: ["Stress levels", "Ability to cope", "Control over life events", "Feeling overwhelmed", "Confidence in handling problems"],
      },
    ];

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary">
              <ClipboardText className="w-8 h-8 text-white" weight="duotone" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Self-Assessments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose an assessment to evaluate your mental health
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <ClipboardText className="w-5 h-5" weight="duotone" />
            About Assessments
          </h2>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
            These are standardized, clinically validated tools used by mental health professionals worldwide. They provide a structured way to assess specific aspects of mental health and wellbeing.
          </p>
          <ul className="space-y-1.5 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Each assessment focuses on a specific area (depression, anxiety, or stress)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Your responses are confidential and stored securely</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Results include severity levels and personalized recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>These are screening tools, not diagnostic instruments</span>
            </li>
          </ul>
        </div>

        {/* Assessment Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {assessmentOptions.map((assessment) => {
            const Icon = assessment.icon;
            return (
              <div
                key={assessment.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${assessment.color}`}>
                    <Icon className="w-6 h-6 text-white" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {assessment.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {assessment.fullName}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {assessment.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{assessment.questions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{assessment.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    What it measures:
                  </p>
                  <ul className="space-y-1">
                    {assessment.measures.map((measure, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectAssessment(assessment.id)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  <span>Start {assessment.name}</span>
                  <ArrowRight className="w-5 h-5" weight="bold" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto">
          These assessments are screening tools and not diagnostic instruments. If you're experiencing severe distress, please contact campus counseling services or emergency resources immediately.
        </p>
      </div>
    );
  }

  // Assessment Intro Screen
  if (currentStep === "intro" && currentAssessmentData) {
    const iconMap = {
      phq9: Brain,
      gad7: Lightning,
      pss10: Heartbeat,
    };

    const colorMap = {
      phq9: "from-purple-500 to-pink-500",
      gad7: "from-orange-500 to-red-500",
      pss10: "from-emerald-500 to-teal-500",
    };

    const Icon = iconMap[selectedAssessment as keyof typeof iconMap];
    const colorClass = colorMap[selectedAssessment as keyof typeof colorMap];

    return (
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => {
            setCurrentStep("selection");
            setSelectedAssessment(null);
            setResponses({});
            setCurrentQuestionIndex(0);
          }}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" weight="bold" />
          <span>Back to Assessment Selection</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass}`}>
              <Icon className="w-8 h-8 text-white" weight="duotone" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                {currentAssessmentData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentAssessmentData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About {currentAssessmentData.name.split(":")[0]}
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} flex-shrink-0`}>
                <ClipboardText className="w-5 h-5 text-white" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Clinical Use
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentAssessmentData.name.includes("PHQ-9") &&
                    "The PHQ-9 is one of the most widely used instruments for screening, diagnosing, monitoring and measuring the severity of depression. It is based on the diagnostic criteria for Major Depressive Disorder in the DSM-IV."}
                  {currentAssessmentData.name.includes("GAD-7") &&
                    "The GAD-7 is a widely used and validated instrument for assessing generalized anxiety disorder. It is also sensitive to change and can be used to monitor treatment response."}
                  {currentAssessmentData.name.includes("PSS-10") &&
                    "The PSS-10 is the most widely used psychological instrument for measuring the perception of stress. It is a reliable measure of the degree to which situations in one's life are appraised as stressful."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Number of Questions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentAssessmentData.questions.length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentAssessmentData.questions.length <= 7 ? "1-2" : "2-3"} min
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} flex-shrink-0`}>
                <Brain className="w-5 h-5 text-white" weight="duotone" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  What You'll Be Asked
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentAssessmentData.name.includes("PHQ-9") &&
                    "Questions about how often you've experienced symptoms like low mood, loss of interest, sleep problems, fatigue, and difficulty concentrating over the past 2 weeks."}
                  {currentAssessmentData.name.includes("GAD-7") &&
                    "Questions about how often you've felt nervous, worried, or unable to control your anxiety over the past 2 weeks."}
                  {currentAssessmentData.name.includes("PSS-10") &&
                    "Questions about how often you've felt stressed, overwhelmed, or unable to cope with situations in the past month."}
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <ClipboardText className="w-5 h-5" weight="duotone" />
              Before You Begin
            </h3>
            <ul className="space-y-1.5 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Answer based on how you've actually been feeling, not how you think you should feel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>There are no right or wrong answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Your responses are confidential and stored securely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Results include your score, severity level, and personalized recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartAssessment}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-semibold text-lg transition-all duration-300 flex items-center gap-2"
          >
            Begin Assessment
            <ArrowRight className="w-5 h-5" weight="bold" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 max-w-2xl mx-auto">
          This is a screening tool, not a diagnostic instrument. If you're experiencing severe distress or thoughts of self-harm, please contact campus counseling services or emergency resources immediately.
        </p>
      </div>
    );
  }

  // Questions Screen
  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Self-Assessment
            </h1>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentQuestionIndex + 1} / {allQuestions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <AssessmentQuestion
            question={currentQuestion}
            value={currentQuestionValue}
            onChange={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={allQuestions.length}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentQuestionIndex === 0
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            <ArrowLeft className="w-5 h-5" weight="bold" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canProceed
                ? "bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {currentQuestionIndex === allQuestions.length - 1 ? "Complete Assessment" : "Next"}
            <ArrowRight className="w-5 h-5" weight="bold" />
          </button>
        </div>

        {/* Current Assessment Indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Assessment: <span className="font-semibold text-brand-primary">
              {currentAssessmentData?.name.split(":")[0]}
            </span>
          </p>
        </div>
      </div>

      {/* Results Modal */}
      {clinicalResult && (
        <AssessmentResultsModal
          isOpen={showResults}
          onClose={() => {
            setShowResults(false);
            // Reset for new assessment
            setCurrentStep("selection");
            setSelectedAssessment(null);
            setCurrentQuestionIndex(0);
            setResponses({});
            setClinicalResult(null);
          }}
          scores={scores}
          recommendations={recommendations}
          clinicalResult={clinicalResult}
          assessmentType={selectedAssessment || "phq9"}
        />
      )}
    </>
  );
}
