"use client";

import { useState } from "react";
import {
  GraduationCap,
  CaretDown,
  CaretRight,
  Download,
  FilePdf,
  Certificate,
  Calculator,
  ArrowsLeftRight,
  Warning,
  CheckCircle,
  X,
  Scales,
  TrendUp,
  FileText,
  Seal,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============ TYPES ============
interface SubjectResult {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
  status: "pass" | "fail";
}

interface SemesterResult {
  id: number;
  semester: string;
  session: string;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  cgpa: number;
  subjects: SubjectResult[];
  resultDate: string;
}

// ============ MOCK DATA ============
const semesterResults: SemesterResult[] = [
  {
    id: 1,
    semester: "Semester 5",
    session: "Dec 2025",
    totalCredits: 18,
    earnedCredits: 18,
    sgpa: 8.72,
    cgpa: 8.45,
    resultDate: "Dec 28, 2025",
    subjects: [
      { id: 1, subjectCode: "CS301", subjectName: "Data Structures & Algorithms", credits: 3, internalMarks: 28, externalMarks: 58, totalMarks: 86, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 2, subjectCode: "CS302", subjectName: "Database Management Systems", credits: 3, internalMarks: 25, externalMarks: 52, totalMarks: 77, maxMarks: 100, grade: "B+", gradePoints: 8, status: "pass" },
      { id: 3, subjectCode: "CS303", subjectName: "Computer Networks", credits: 3, internalMarks: 27, externalMarks: 61, totalMarks: 88, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 4, subjectCode: "CS304", subjectName: "Operating Systems", credits: 3, internalMarks: 22, externalMarks: 45, totalMarks: 67, maxMarks: 100, grade: "B", gradePoints: 7, status: "pass" },
      { id: 5, subjectCode: "CS351", subjectName: "Machine Learning", credits: 3, internalMarks: 29, externalMarks: 65, totalMarks: 94, maxMarks: 100, grade: "A+", gradePoints: 10, status: "pass" },
      { id: 6, subjectCode: "CS352", subjectName: "Software Engineering", credits: 3, internalMarks: 26, externalMarks: 55, totalMarks: 81, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
    ],
  },
  {
    id: 2,
    semester: "Semester 4",
    session: "May 2025",
    totalCredits: 21,
    earnedCredits: 21,
    sgpa: 8.38,
    cgpa: 8.32,
    resultDate: "Jun 15, 2025",
    subjects: [
      { id: 1, subjectCode: "CS201", subjectName: "Object Oriented Programming", credits: 3, internalMarks: 26, externalMarks: 54, totalMarks: 80, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 2, subjectCode: "CS202", subjectName: "Computer Organization", credits: 3, internalMarks: 24, externalMarks: 48, totalMarks: 72, maxMarks: 100, grade: "B+", gradePoints: 8, status: "pass" },
      { id: 3, subjectCode: "CS203", subjectName: "Discrete Mathematics", credits: 3, internalMarks: 27, externalMarks: 58, totalMarks: 85, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 4, subjectCode: "CS204", subjectName: "Theory of Computation", credits: 3, internalMarks: 21, externalMarks: 42, totalMarks: 63, maxMarks: 100, grade: "B", gradePoints: 7, status: "pass" },
      { id: 5, subjectCode: "CS251", subjectName: "Web Development", credits: 3, internalMarks: 28, externalMarks: 60, totalMarks: 88, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 6, subjectCode: "MA201", subjectName: "Probability & Statistics", credits: 3, internalMarks: 25, externalMarks: 52, totalMarks: 77, maxMarks: 100, grade: "B+", gradePoints: 8, status: "pass" },
      { id: 7, subjectCode: "HS201", subjectName: "Professional Ethics", credits: 3, internalMarks: 26, externalMarks: 56, totalMarks: 82, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
    ],
  },
  {
    id: 3,
    semester: "Semester 3",
    session: "Dec 2024",
    totalCredits: 21,
    earnedCredits: 18,
    sgpa: 7.14,
    cgpa: 8.15,
    resultDate: "Jan 10, 2025",
    subjects: [
      { id: 1, subjectCode: "CS101", subjectName: "Programming in C", credits: 3, internalMarks: 25, externalMarks: 50, totalMarks: 75, maxMarks: 100, grade: "B+", gradePoints: 8, status: "pass" },
      { id: 2, subjectCode: "CS102", subjectName: "Digital Logic Design", credits: 3, internalMarks: 23, externalMarks: 45, totalMarks: 68, maxMarks: 100, grade: "B", gradePoints: 7, status: "pass" },
      { id: 3, subjectCode: "CS103", subjectName: "Data Communication", credits: 3, internalMarks: 18, externalMarks: 32, totalMarks: 50, maxMarks: 100, grade: "C", gradePoints: 5, status: "pass" },
      { id: 4, subjectCode: "MA101", subjectName: "Engineering Mathematics III", credits: 3, internalMarks: 15, externalMarks: 22, totalMarks: 37, maxMarks: 100, grade: "F", gradePoints: 0, status: "fail" },
      { id: 5, subjectCode: "EC101", subjectName: "Basic Electronics", credits: 3, internalMarks: 24, externalMarks: 48, totalMarks: 72, maxMarks: 100, grade: "B+", gradePoints: 8, status: "pass" },
      { id: 6, subjectCode: "ME101", subjectName: "Engineering Graphics", credits: 3, internalMarks: 27, externalMarks: 58, totalMarks: 85, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
      { id: 7, subjectCode: "HS101", subjectName: "Technical Communication", credits: 3, internalMarks: 26, externalMarks: 54, totalMarks: 80, maxMarks: 100, grade: "A", gradePoints: 9, status: "pass" },
    ],
  },
];

const gradeScale = [
  { grade: "A+", range: "90-100", points: 10 },
  { grade: "A", range: "80-89", points: 9 },
  { grade: "B+", range: "70-79", points: 8 },
  { grade: "B", range: "60-69", points: 7 },
  { grade: "C+", range: "55-59", points: 6 },
  { grade: "C", range: "50-54", points: 5 },
  { grade: "D", range: "40-49", points: 4 },
  { grade: "F", range: "<40", points: 0 },
];

// ============ HELPER FUNCTIONS ============
const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A+":
    case "A":
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    case "B+":
    case "B":
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    case "C+":
    case "C":
      return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
    case "D":
      return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
    case "F":
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
  }
};

// ============ SUB-COMPONENTS ============

// Stat Card
function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Semester Selector
function SemesterSelector({
  semesters,
  selected,
  onSelect,
}: {
  semesters: SemesterResult[];
  selected: SemesterResult;
  onSelect: (sem: SemesterResult) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-primary transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">{selected.semester}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">({selected.session})</span>
        <CaretDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
            {semesters.map((sem) => (
              <button
                key={sem.id}
                onClick={() => {
                  onSelect(sem);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                  selected.id === sem.id && "bg-brand-primary/5 dark:bg-brand-primary/10"
                )}
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{sem.semester}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sem.session}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-primary">{sem.sgpa.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SGPA</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Subject Result Row
function SubjectResultRow({
  subject,
  isLast,
  onRevaluation,
}: {
  subject: SubjectResult;
  isLast: boolean;
  onRevaluation?: () => void;
}) {
  const showRevaluation = subject.status === "fail" || subject.totalMarks < 50;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
        !isLast && "border-b border-gray-100 dark:border-gray-700"
      )}
    >
      {/* Subject Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
            {subject.subjectCode}
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded">
            {subject.credits} Cr
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">
          {subject.subjectName}
        </h4>
      </div>

      {/* Marks */}
      <div className="text-center w-16">
        <p className="text-xs text-gray-500 dark:text-gray-400">Internal</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.internalMarks}/30</p>
      </div>

      <div className="text-center w-16">
        <p className="text-xs text-gray-500 dark:text-gray-400">External</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.externalMarks}/70</p>
      </div>

      <div className="text-center w-16">
        <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{subject.totalMarks}/{subject.maxMarks}</p>
      </div>

      {/* Grade */}
      <div className="w-14 text-center">
        <span className={cn("inline-block px-2.5 py-1 rounded-lg text-sm font-bold", getGradeColor(subject.grade))}>
          {subject.grade}
        </span>
      </div>

      {/* Status / Revaluation */}
      <div className="w-24 text-right">
        {showRevaluation ? (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1 text-amber-600 border-amber-300 hover:bg-amber-50"
            onClick={onRevaluation}
          >
            <ArrowsLeftRight className="w-3.5 h-3.5" />
            Revalue
          </Button>
        ) : (
          <span className="inline-block px-2 py-1 rounded text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30">
            Passed
          </span>
        )}
      </div>
    </div>
  );
}

// GPA Calculator Modal
function GPACalculatorModal({
  currentSemester,
  onClose,
}: {
  currentSemester: SemesterResult;
  onClose: () => void;
}) {
  const [whatIfGrades, setWhatIfGrades] = useState<Record<number, string>>(
    Object.fromEntries(currentSemester.subjects.map((s) => [s.id, s.grade]))
  );

  const calculateWhatIfSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    currentSemester.subjects.forEach((subject) => {
      const grade = whatIfGrades[subject.id];
      const gradeInfo = gradeScale.find((g) => g.grade === grade);
      if (gradeInfo) {
        totalPoints += gradeInfo.points * subject.credits;
        totalCredits += subject.credits;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">GPA Calculator - What-If Simulator</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[50vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Adjust grades to see how they would affect your SGPA. This is a simulation tool.
          </p>

          <div className="space-y-3">
            {currentSemester.subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.subjectName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{subject.subjectCode} | {subject.credits} Credits</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Current: {subject.grade}</span>
                  <select
                    value={whatIfGrades[subject.id]}
                    onChange={(e) => setWhatIfGrades({ ...whatIfGrades, [subject.id]: e.target.value })}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium"
                  >
                    {gradeScale.map((g) => (
                      <option key={g.grade} value={g.grade}>{g.grade}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current SGPA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentSemester.sgpa.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <TrendUp className="w-8 h-8 text-gray-300 mx-auto" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Simulated SGPA</p>
              <p className="text-2xl font-bold text-brand-primary">{calculateWhatIfSGPA()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Revaluation Modal
function RevaluationModal({
  subject,
  onClose,
  onSubmit,
}: {
  subject: SubjectResult;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowsLeftRight className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for Revaluation</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Subject Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.subjectName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{subject.subjectCode}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{subject.totalMarks}/{subject.maxMarks}</p>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded", getGradeColor(subject.grade))}>
                  Grade: {subject.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Fee Info */}
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-4">
            <span className="text-sm text-amber-700 dark:text-amber-400">Revaluation Fee</span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">₹500 per subject</span>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Revaluation (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm resize-none h-20"
            />
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              I understand that the revaluation fee is non-refundable and the new marks (higher or lower) will be final.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={!agreed}
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Pay ₹500 & Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

// Semester Comparison Modal
function SemesterComparisonModal({
  semesters,
  onClose,
}: {
  semesters: SemesterResult[];
  onClose: () => void;
}) {
  const [leftSem, setLeftSem] = useState(semesters[0]);
  const [rightSem, setRightSem] = useState(semesters[1] || semesters[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scales className="w-6 h-6 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Compare Semesters</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Semester Selectors */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <select
              value={leftSem.id}
              onChange={(e) => setLeftSem(semesters.find((s) => s.id === Number(e.target.value)) || semesters[0])}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>{s.semester} ({s.session})</option>
              ))}
            </select>
            <span className="text-sm font-medium text-gray-500">vs</span>
            <select
              value={rightSem.id}
              onChange={(e) => setRightSem(semesters.find((s) => s.id === Number(e.target.value)) || semesters[0])}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>{s.semester} ({s.session})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-gray-500 dark:text-gray-400">Metric</div>
            <div className="text-center font-semibold text-gray-900 dark:text-white">{leftSem.semester}</div>
            <div className="text-center font-semibold text-gray-900 dark:text-white">{rightSem.semester}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">SGPA</div>
            <div className="text-center font-bold text-brand-primary py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.sgpa.toFixed(2)}</div>
            <div className="text-center font-bold text-brand-primary py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.sgpa.toFixed(2)}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">CGPA</div>
            <div className="text-center font-bold text-green-600 dark:text-green-400 py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.cgpa.toFixed(2)}</div>
            <div className="text-center font-bold text-green-600 dark:text-green-400 py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.cgpa.toFixed(2)}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">Credits</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.earnedCredits}/{leftSem.totalCredits}</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.earnedCredits}/{rightSem.totalCredits}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">Subjects</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.subjects.length}</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.subjects.length}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">Passed</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.subjects.filter((s) => s.status === "pass").length}</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.subjects.filter((s) => s.status === "pass").length}</div>

            <div className="text-gray-500 dark:text-gray-400 py-2 border-t border-gray-100 dark:border-gray-700">Failed</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{leftSem.subjects.filter((s) => s.status === "fail").length}</div>
            <div className="text-center text-gray-900 dark:text-white py-2 border-t border-gray-100 dark:border-gray-700">{rightSem.subjects.filter((s) => s.status === "fail").length}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// Grade Scale Card
function GradeScaleCard() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {gradeScale.map((g) => (
        <div key={g.grade} className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-bold mb-1", getGradeColor(g.grade))}>
            {g.grade}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">{g.range}</p>
        </div>
      ))}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function ResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState(semesterResults[0]);
  const [showGPACalculator, setShowGPACalculator] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [revaluationSubject, setRevaluationSubject] = useState<SubjectResult | null>(null);

  const failedSubjects = selectedSemester.subjects.filter((s) => s.status === "fail").length;
  const passedSubjects = selectedSemester.subjects.filter((s) => s.status === "pass").length;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">View your academic performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SemesterSelector
            semesters={semesterResults}
            selected={selectedSemester}
            onSelect={setSelectedSemester}
          />
          <Button variant="outline" className="gap-2" onClick={() => setShowComparison(true)}>
            <Scales className="w-4 h-4" />
            Compare
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowGPACalculator(true)}>
            <Calculator className="w-4 h-4" />
            GPA Calc
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <StatCard
          icon={GraduationCap}
          value={selectedSemester.sgpa.toFixed(2)}
          label="SGPA"
          color="bg-brand-primary/10 text-brand-primary"
        />
        <StatCard
          icon={TrendUp}
          value={selectedSemester.cgpa.toFixed(2)}
          label="CGPA"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={CheckCircle}
          value={passedSubjects}
          label="Passed"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Scales}
          value={`${selectedSemester.earnedCredits}/${selectedSemester.totalCredits}`}
          label="Credits"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Warning}
          value={failedSubjects}
          label="Failed"
          color={failedSubjects > 0 ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"}
        />
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Panel - Results Table */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Subject-wise Results</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Result Date: {selectedSemester.resultDate}
            </span>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedSemester.subjects.map((subject, index) => (
              <SubjectResultRow
                key={subject.id}
                subject={subject}
                isLast={index === selectedSemester.subjects.length - 1}
                onRevaluation={() => setRevaluationSubject(subject)}
              />
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex-shrink-0">
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium">
              <FilePdf className="w-5 h-5" />
              Download Marksheet
            </Button>
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium">
              <Certificate className="w-5 h-5" />
              Grade Card
            </Button>
          </div>
        </Card>

        {/* Right Panel */}
        <div className="w-[340px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Semester Summary Card */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Semester Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Subjects</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedSemester.subjects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Credits</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedSemester.totalCredits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Credits Earned</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedSemester.earnedCredits}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">SGPA</span>
                    <span className="text-lg font-bold text-brand-primary">{selectedSemester.sgpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">CGPA</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{selectedSemester.cgpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grade Scale Card */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Seal className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Grade Scale</h3>
              </div>
              <GradeScaleCard />
            </CardContent>
          </Card>

          {/* Download Documents Card */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Documents</h3>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <FilePdf className="w-5 h-5 text-red-500" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Marksheet (PDF)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Digitally signed</p>
                  </div>
                  <CaretRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <Certificate className="w-5 h-5 text-amber-500" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Grade Card</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Official transcript</p>
                  </div>
                  <CaretRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Consolidated Report</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">All semesters</p>
                  </div>
                  <CaretRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showGPACalculator && (
        <GPACalculatorModal
          currentSemester={selectedSemester}
          onClose={() => setShowGPACalculator(false)}
        />
      )}

      {showComparison && (
        <SemesterComparisonModal
          semesters={semesterResults}
          onClose={() => setShowComparison(false)}
        />
      )}

      {revaluationSubject && (
        <RevaluationModal
          subject={revaluationSubject}
          onClose={() => setRevaluationSubject(null)}
          onSubmit={() => {
            console.log("Revaluation submitted for:", revaluationSubject.subjectCode);
          }}
        />
      )}
    </div>
  );
}
