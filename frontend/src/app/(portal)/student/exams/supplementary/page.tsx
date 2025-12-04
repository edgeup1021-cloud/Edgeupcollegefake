"use client";

import { useState } from "react";
import {
  Warning,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Receipt,
  Info,
  CheckSquare,
  Square,
  CalendarPlus,
  Download,
  FilePdf,
  FileImage,
  Printer,
  MapPin,
  Phone,
  ArrowRight,
  CaretRight,
  Ticket,
  Books,
  Scales,
  Calendar,
  X,
  QrCode,
  GraduationCap,
  HourglassHigh,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============ TYPES ============
interface FailedSubject {
  id: number;
  subjectCode: string;
  subjectName: string;
  semester: string;
  credits: number;
  originalMarks: number;
  grade: string;
  examFee: number;
  attempts: number;
}

interface SupplementaryExam {
  id: number;
  subject: FailedSubject;
  examDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  roomNumber: string;
  seatNumber: string;
}

interface SupplementaryResult {
  id: number;
  subjectCode: string;
  subjectName: string;
  originalMarks: number;
  supplementaryMarks: number | null;
  newGrade: string | null;
  status: "awaiting" | "passed" | "failed";
  resultDate?: string;
}

interface EligibilityStatus {
  attendance: { passed: boolean; value: string };
  feesClear: { passed: boolean };
  noDisciplinary: { passed: boolean };
  isEligible: boolean;
}

interface ExamCenter {
  name: string;
  building: string;
  address: string;
  seatNumber: string;
  contact: string;
  mapLink: string;
}

interface HallTicket {
  ticketNumber: string;
  studentName: string;
  rollNumber: string;
  program: string;
  exams: SupplementaryExam[];
  center: ExamCenter;
}

// ============ MOCK DATA ============
const failedSubjects: FailedSubject[] = [
  {
    id: 1,
    subjectCode: "MA101",
    subjectName: "Engineering Mathematics III",
    semester: "Semester 3",
    credits: 3,
    originalMarks: 37,
    grade: "F",
    examFee: 1500,
    attempts: 1,
  },
  {
    id: 2,
    subjectCode: "CS103",
    subjectName: "Data Communication",
    semester: "Semester 3",
    credits: 3,
    originalMarks: 35,
    grade: "F",
    examFee: 1500,
    attempts: 1,
  },
];

const eligibility: EligibilityStatus = {
  attendance: { passed: true, value: "82%" },
  feesClear: { passed: true },
  noDisciplinary: { passed: true },
  isEligible: true,
};

const examCenter: ExamCenter = {
  name: "Main Campus",
  building: "Block A - Examination Hall",
  address: "123 University Road, Academic City, 560001",
  seatNumber: "A-15",
  contact: "+91-9876543210",
  mapLink: "https://maps.google.com",
};

const supplementaryExams: SupplementaryExam[] = [
  {
    id: 1,
    subject: failedSubjects[0],
    examDate: "Jan 15, 2026",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    venue: "Block A",
    roomNumber: "101",
    seatNumber: "A-15",
  },
  {
    id: 2,
    subject: failedSubjects[1],
    examDate: "Jan 18, 2026",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    venue: "Block A",
    roomNumber: "205",
    seatNumber: "A-15",
  },
];

const supplementaryResults: SupplementaryResult[] = [
  {
    id: 1,
    subjectCode: "MA101",
    subjectName: "Engineering Mathematics III",
    originalMarks: 37,
    supplementaryMarks: null,
    newGrade: null,
    status: "awaiting",
  },
  {
    id: 2,
    subjectCode: "CS103",
    subjectName: "Data Communication",
    originalMarks: 35,
    supplementaryMarks: null,
    newGrade: null,
    status: "awaiting",
  },
];

const hallTicket: HallTicket = {
  ticketNumber: "SUP-2026-0042",
  studentName: "John Doe",
  rollNumber: "2022CS001",
  program: "B.Tech Computer Science",
  exams: supplementaryExams,
  center: examCenter,
};

const registrationDeadline = {
  date: "Dec 15, 2025",
  daysLeft: 5,
};

const PROCESSING_FEE = 100;

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

// Failed Subject Row (Registration View)
function FailedSubjectRow({
  subject,
  isSelected,
  onToggle,
  isLast,
}: {
  subject: FailedSubject;
  isSelected: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors",
        isSelected ? "bg-brand-primary/5 dark:bg-brand-primary/10" : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        !isLast && "border-b border-gray-100 dark:border-gray-700"
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckSquare className="w-5 h-5 text-brand-primary" weight="fill" />
        ) : (
          <Square className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Subject Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
            {subject.subjectCode}
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded">
            {subject.credits} Cr
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{subject.semester}</span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {subject.subjectName}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Marks: {subject.originalMarks}/100</span>
          <span className="text-red-500 font-medium">Grade: {subject.grade}</span>
          <span>Attempt: {subject.attempts}</span>
        </div>
      </div>

      {/* Fee */}
      <div className="text-right flex-shrink-0">
        <p className="text-base font-bold text-gray-900 dark:text-white">₹{subject.examFee.toLocaleString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Exam Fee</p>
      </div>
    </div>
  );
}

// Exam Schedule Row (Registered View)
function ExamScheduleRow({
  exam,
  isLast,
}: {
  exam: SupplementaryExam;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "px-4 py-4",
        !isLast && "border-b border-gray-100 dark:border-gray-700"
      )}
    >
      {/* Date Badge */}
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-brand-primary" />
        <span className="text-sm font-semibold text-brand-primary">{exam.examDate}</span>
      </div>

      {/* Subject */}
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {exam.subject.subjectCode} - {exam.subject.subjectName}
      </h4>

      {/* Time & Venue */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{exam.startTime} - {exam.endTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Room {exam.roomNumber}, {exam.venue}</span>
        </div>
      </div>
    </div>
  );
}

// Result Tracking Row
function ResultTrackingRow({
  result,
  isLast,
}: {
  result: SupplementaryResult;
  isLast: boolean;
}) {
  const getStatusIcon = () => {
    switch (result.status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" weight="fill" />;
      default:
        return <HourglassHigh className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusText = () => {
    switch (result.status) {
      case "passed":
        return "PASSED";
      case "failed":
        return "FAILED";
      default:
        return "Awaiting";
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "passed":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  return (
    <div
      className={cn(
        "p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg",
        !isLast && "mb-2"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-900 dark:text-white">{result.subjectCode}</span>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className={cn("text-xs font-semibold", getStatusColor())}>{getStatusText()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">{result.originalMarks}</span>
        <ArrowRight className="w-3 h-3 text-gray-400" />
        {result.supplementaryMarks !== null ? (
          <>
            <span className={cn("font-medium", result.status === "passed" ? "text-green-600" : "text-red-600")}>
              {result.supplementaryMarks}
            </span>
            <span className={cn("text-xs", result.supplementaryMarks > result.originalMarks ? "text-green-500" : "text-red-500")}>
              ({result.supplementaryMarks > result.originalMarks ? "+" : ""}{result.supplementaryMarks - result.originalMarks})
            </span>
            {result.newGrade && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Grade: {result.newGrade}</span>
            )}
          </>
        ) : (
          <span className="text-gray-400">?</span>
        )}
      </div>
    </div>
  );
}

// Hall Ticket Modal
function HallTicketModal({
  ticket,
  onClose,
}: {
  ticket: HallTicket;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Supplementary Exam Hall Ticket</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* University Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">EDGEUP UNIVERSITY</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Supplementary Examination - January 2026</p>
          </div>

          {/* Student Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ticket Number</p>
                <p className="text-sm font-semibold text-brand-primary">{ticket.ticketNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Roll Number</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{ticket.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student Name</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{ticket.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{ticket.program}</p>
              </div>
            </div>

            {/* Photo & QR */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="w-20 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <span className="text-xs text-gray-400">Photo</span>
              </div>
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Exam Schedule */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Exam Schedule</h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.exams.map((exam, index) => (
                    <tr key={exam.id} className={index !== ticket.exams.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{exam.examDate}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {exam.subject.subjectCode} - {exam.subject.subjectName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{exam.startTime} - {exam.endTime}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Room {exam.roomNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Exam Center */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Exam Center</h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.center.name} - {ticket.center.building}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ticket.center.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seat Number: <span className="font-medium text-gray-900 dark:text-white">{ticket.center.seatNumber}</span></p>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Warning className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Important Instructions</h4>
            </div>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 ml-7 list-disc">
              <li>Bring this hall ticket and valid ID proof to the examination center</li>
              <li>Report 30 minutes before the scheduled exam time</li>
              <li>Mobile phones and electronic devices are not allowed</li>
              <li>Use only blue/black ballpoint pen for writing</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <FilePdf className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}

// No Backlogs View
function NoBacklogsView() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Backlogs!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Congratulations! You have cleared all your subjects. Keep up the excellent work!
        </p>
        <Button variant="outline" className="gap-2">
          <ArrowRight className="w-4 h-4" />
          Back to Results
        </Button>
      </div>
    </div>
  );
}

// Registration View
function RegistrationView({
  subjects,
  selectedIds,
  onToggleSubject,
  onSelectAll,
  onClearAll,
  eligibility,
  agreedTerms,
  onToggleTerms,
  onRegister,
}: {
  subjects: FailedSubject[];
  selectedIds: number[];
  onToggleSubject: (id: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  eligibility: EligibilityStatus;
  agreedTerms: boolean;
  onToggleTerms: () => void;
  onRegister: () => void;
}) {
  const selectedSubjects = subjects.filter((s) => selectedIds.includes(s.id));
  const examFee = selectedSubjects.reduce((sum, s) => sum + s.examFee, 0);
  const totalFee = examFee + (selectedSubjects.length > 0 ? PROCESSING_FEE : 0);
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const canRegister = selectedIds.length > 0 && agreedTerms && eligibility.isEligible;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/10 flex items-center justify-center">
            <ArrowsClockwise className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplementary Exams</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Register for supplementary examinations</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
          registrationDeadline.daysLeft <= 3
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : registrationDeadline.daysLeft <= 7
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        )}>
          <Clock className="w-4 h-4" />
          Registration closes in {registrationDeadline.daysLeft} days
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard
          icon={Warning}
          value={subjects.length}
          label="Backlogs"
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={Scales}
          value={totalCredits}
          label="Credits"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={CreditCard}
          value={`₹${subjects[0]?.examFee.toLocaleString() || 0}`}
          label="Per Subject"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          value="Open"
          label="Registration"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Panel - Failed Subjects */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Failed Subjects</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">{subjects.length} subject(s)</span>
          </div>

          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {subjects.map((subject, index) => (
              <FailedSubjectRow
                key={subject.id}
                subject={subject}
                isSelected={selectedIds.includes(subject.id)}
                onToggle={() => onToggleSubject(subject.id)}
                isLast={index === subjects.length - 1}
              />
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex-shrink-0">
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium" onClick={onSelectAll}>
              <CheckSquare className="w-5 h-5" />
              Select All
            </Button>
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium" onClick={onClearAll}>
              <Square className="w-5 h-5" />
              Clear All
            </Button>
          </div>
        </Card>

        {/* Right Panel */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Eligibility Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Eligibility Status</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {eligibility.attendance.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Attendance &gt; 75% ({eligibility.attendance.value})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {eligibility.feesClear.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">Fees Cleared</span>
                </div>
                <div className="flex items-center gap-3">
                  {eligibility.noDisciplinary.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">No Disciplinary Issues</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    eligibility.isEligible
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    {eligibility.isEligible ? (
                      <CheckCircle className="w-5 h-5" weight="fill" />
                    ) : (
                      <XCircle className="w-5 h-5" weight="fill" />
                    )}
                    {eligibility.isEligible ? "You are ELIGIBLE" : "NOT ELIGIBLE"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Summary Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Fee Summary</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Exam Fee ({selectedIds.length}×₹{subjects[0]?.examFee.toLocaleString() || 0})
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{examFee.toLocaleString()}</span>
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{PROCESSING_FEE}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-lg text-brand-primary">₹{totalFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes & Action Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <Warning className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Important Notes</h3>
            </div>

            <div className="p-4">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last date: {registrationDeadline.date}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fees are non-refundable</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bring hall ticket to examination center</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Valid ID proof is mandatory</span>
                </li>
              </ul>
            </div>

            <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={onToggleTerms}
                  className="flex-shrink-0 mt-0.5"
                >
                  {agreedTerms ? (
                    <CheckSquare className="w-5 h-5 text-brand-primary" weight="fill" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the examination rules and understand that registration is final and fees are non-refundable
                </span>
              </label>

              {/* Submit Button */}
              <Button
                className="w-full h-12 gap-2 text-base font-semibold"
                disabled={!canRegister}
                onClick={onRegister}
              >
                <CreditCard className="w-5 h-5" />
                Pay & Register {totalFee > 0 && `₹${totalFee.toLocaleString()}`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Registered View
function RegisteredView({
  exams,
  results,
  ticket,
  center,
  totalPaid,
  onOpenHallTicket,
}: {
  exams: SupplementaryExam[];
  results: SupplementaryResult[];
  ticket: HallTicket;
  center: ExamCenter;
  totalPaid: number;
  onOpenHallTicket: () => void;
}) {
  const nextExam = exams[0];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
            <ArrowsClockwise className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplementary Exams</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your supplementary exam details</p>
          </div>
        </div>
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" weight="fill" />
            Registered
          </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard
          icon={Books}
          value={exams.length}
          label="Registered"
          color="bg-brand-primary/10 text-brand-primary"
        />
        <StatCard
          icon={Calendar}
          value={nextExam?.examDate.split(",")[0] || "-"}
          label="Next Exam"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={CreditCard}
          value={`₹${totalPaid.toLocaleString()}`}
          label="Paid"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={Clock}
          value="Upcoming"
          label="Status"
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Panel - Exam Schedule */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Exam Schedule</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">{exams.length} exam(s)</span>
          </div>

          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {exams.map((exam, index) => (
              <ExamScheduleRow
                key={exam.id}
                exam={exam}
                isLast={index === exams.length - 1}
              />
            ))}
          </div>

        </Card>

        {/* Right Panel */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Hall Ticket Card */}
          <Card
            className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:border-brand-primary transition-colors"
            onClick={onOpenHallTicket}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* QR Code */}
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 flex-shrink-0">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Hall Ticket</h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">{ticket.studentName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.rollNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ticket.ticketNumber}</p>
                </div>

                <CaretRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* Download Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenHallTicket();
                  }}
                >
                  <FilePdf className="w-3.5 h-3.5" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenHallTicket();
                  }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exam Center Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Exam Center</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{center.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{center.building}</p>
                </div>
                <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Seat:</span>
                  <span className="text-brand-primary font-medium">{center.seatNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{center.contact}</span>
                </div>

                <Button variant="outline" className="w-full gap-2 mt-2" asChild>
                  <a href={center.mapLink} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4" />
                    View on Map
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Tracking Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <HourglassHigh className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Results Tracking</h3>
              </div>

              <div>
                {results.map((result, index) => (
                  <ResultTrackingRow
                    key={result.id}
                    result={result}
                    isLast={index === results.length - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function SupplementaryPage() {
  // Mock states - in real app, this would come from API
  const [hasBacklogs] = useState(true); // Set to false to see NoBacklogsView
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showHallTicket, setShowHallTicket] = useState(false);

  // Calculate total paid
  const selectedSubjects = failedSubjects.filter((s) => selectedSubjectIds.includes(s.id));
  const examFee = selectedSubjects.reduce((sum, s) => sum + s.examFee, 0);
  const totalPaid = examFee + (selectedSubjects.length > 0 ? PROCESSING_FEE : 0);

  // Handlers
  const handleToggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSubjectIds(failedSubjects.map((s) => s.id));
  };

  const handleClearAll = () => {
    setSelectedSubjectIds([]);
  };

  const handleRegister = () => {
    // Mock registration - in real app, this would call API
    setIsRegistered(true);
  };

  // No backlogs state
  if (!hasBacklogs) {
    return <NoBacklogsView />;
  }

  // Registration or Registered view
  return (
    <>
      {!isRegistered ? (
        <RegistrationView
          subjects={failedSubjects}
          selectedIds={selectedSubjectIds}
          onToggleSubject={handleToggleSubject}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          eligibility={eligibility}
          agreedTerms={agreedTerms}
          onToggleTerms={() => setAgreedTerms(!agreedTerms)}
          onRegister={handleRegister}
        />
      ) : (
        <RegisteredView
          exams={supplementaryExams}
          results={supplementaryResults}
          ticket={hallTicket}
          center={examCenter}
          totalPaid={totalPaid || 3100} // Use calculated or mock
          onOpenHallTicket={() => setShowHallTicket(true)}
        />
      )}

      {/* Hall Ticket Modal */}
      {showHallTicket && (
        <HallTicketModal
          ticket={hallTicket}
          onClose={() => setShowHallTicket(false)}
        />
      )}
    </>
  );
}
