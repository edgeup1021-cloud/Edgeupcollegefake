"use client";

import { useState } from "react";
import {
  Exam,
  Calendar,
  Clock,
  MapPin,
  Download,
  QrCode,
  CheckCircle,
  Warning,
  CaretRight,
  FileText,
  CalendarCheck,
  Timer,
  Armchair,
  FilePdf,
  FileImage,
  Printer,
  X,
  CalendarPlus,
  Info,
  CreditCard,
  CheckSquare,
  Square,
  Receipt,
  Books,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============ TYPES ============
interface ExamScheduleItem {
  id: number;
  date: string;
  day: string;
  subjectCode: string;
  subjectName: string;
  time: string;
  duration: string;
  venue: string;
  seatNumber: string;
}

interface HallTicketInfo {
  ticketNumber: string;
  studentName: string;
  rollNumber: string;
  program: string;
  semester: string;
  examSession: string;
  issuedDate: string;
  validUntil: string;
}

interface Instruction {
  id: number;
  category: string;
  items: string[];
}

interface AvailableExam {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  date: string;
  day: string;
  time: string;
  fee: number;
}

// ============ MOCK DATA ============

// Available exams for registration
const availableExams: AvailableExam[] = [
  { id: 1, subjectCode: "CS301", subjectName: "Data Structures & Algorithms", credits: 3, date: "15", day: "Mon", time: "10:00 AM", fee: 500 },
  { id: 2, subjectCode: "CS302", subjectName: "Database Management Systems", credits: 3, date: "17", day: "Wed", time: "10:00 AM", fee: 500 },
  { id: 3, subjectCode: "CS303", subjectName: "Computer Networks", credits: 3, date: "19", day: "Fri", time: "2:00 PM", fee: 500 },
  { id: 4, subjectCode: "CS304", subjectName: "Operating Systems", credits: 3, date: "21", day: "Sun", time: "10:00 AM", fee: 500 },
  { id: 5, subjectCode: "CS351", subjectName: "Machine Learning", credits: 3, date: "23", day: "Tue", time: "2:00 PM", fee: 500 },
];

const registrationNotes = [
  "Registration once submitted cannot be modified",
  "Exam fees are non-refundable",
  "Carry valid ID proof to all exams",
  "Hall ticket will be available after registration",
];

const PROCESSING_FEE = 100;

const examSchedule: ExamScheduleItem[] = [
  {
    id: 1,
    date: "15",
    day: "Mon",
    subjectCode: "CS301",
    subjectName: "Data Structures & Algorithms",
    time: "10:00 AM",
    duration: "3 hrs",
    venue: "Block A, Room 101",
    seatNumber: "A-15",
  },
  {
    id: 2,
    date: "17",
    day: "Wed",
    subjectCode: "CS302",
    subjectName: "Database Management Systems",
    time: "10:00 AM",
    duration: "3 hrs",
    venue: "Block A, Room 102",
    seatNumber: "A-22",
  },
  {
    id: 3,
    date: "19",
    day: "Fri",
    subjectCode: "CS303",
    subjectName: "Computer Networks",
    time: "2:00 PM",
    duration: "3 hrs",
    venue: "Block B, Room 201",
    seatNumber: "B-08",
  },
  {
    id: 4,
    date: "21",
    day: "Sun",
    subjectCode: "CS304",
    subjectName: "Operating Systems",
    time: "10:00 AM",
    duration: "3 hrs",
    venue: "Block A, Room 103",
    seatNumber: "A-31",
  },
  {
    id: 5,
    date: "23",
    day: "Tue",
    subjectCode: "CS351",
    subjectName: "Machine Learning",
    time: "2:00 PM",
    duration: "3 hrs",
    venue: "Block C, Room 301",
    seatNumber: "C-12",
  },
];

const hallTicketInfo: HallTicketInfo = {
  ticketNumber: "HT2025DEC001234",
  studentName: "John Doe",
  rollNumber: "2022CS1234",
  program: "B.Tech Computer Science",
  semester: "5th Semester",
  examSession: "December 2025",
  issuedDate: "Dec 1, 2025",
  validUntil: "Dec 25, 2025",
};

const keyInstructions = [
  "Reach exam hall 30 minutes before scheduled time",
  "Carry valid photo ID along with hall ticket",
  "Electronic devices are strictly prohibited",
  "Use only blue or black ink pen for writing",
  "Check seating arrangement outside exam hall",
];

const allInstructions: Instruction[] = [
  {
    id: 1,
    category: "Before the Exam",
    items: [
      "Download and print your hall ticket at least 2 days before the first exam",
      "Verify all details on the hall ticket including photo, name, and roll number",
      "Reach the examination hall at least 30 minutes before the scheduled time",
      "Carry a valid photo ID (College ID/Aadhar/Passport) along with the hall ticket",
      "Check the seating arrangement displayed outside the exam hall",
    ],
  },
  {
    id: 2,
    category: "During the Exam",
    items: [
      "Electronic devices including mobile phones, smartwatches are strictly prohibited",
      "Use only blue or black ink pen for writing answers",
      "Write your roll number on every answer sheet",
      "Do not leave the exam hall without permission from the invigilator",
      "Maintain complete silence throughout the examination",
    ],
  },
  {
    id: 3,
    category: "Permitted Items",
    items: [
      "Hall ticket (mandatory)",
      "Valid photo ID (mandatory)",
      "Blue/Black ink pens",
      "Transparent water bottle",
      "Scientific calculator (only for permitted subjects)",
    ],
  },
  {
    id: 4,
    category: "Prohibited Items",
    items: [
      "Mobile phones and any electronic devices",
      "Smart watches and fitness bands",
      "Notes, books, or any written material",
      "Bags and pouches (must be kept outside)",
    ],
  },
];

// ============ HELPER FUNCTIONS ============
const getDeadlineStatus = () => {
  const deadline = new Date("2025-12-10");
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return { text: "Closed", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", urgent: true };
  if (days <= 3) return { text: `${days} days left`, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", urgent: true };
  if (days <= 7) return { text: `${days} days left`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", urgent: false };
  return { text: `${days} days left`, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", urgent: false };
};

// ============ SUB-COMPONENTS ============

// Compact Stat Card
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
  const IconComponent: any = Icon;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Subject Row for Registration
function SubjectRow({
  exam,
  isSelected,
  onToggle,
  isLast,
}: {
  exam: AvailableExam;
  isSelected: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-4 p-3 cursor-pointer transition-colors",
        isSelected
          ? "bg-brand-primary/5 dark:bg-brand-primary/10"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        !isLast && "border-b border-gray-100 dark:border-gray-700"
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckSquare className="w-6 h-6 text-brand-primary" weight="fill" />
        ) : (
          <Square className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Date Block */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0",
        isSelected
          ? "bg-brand-primary/20 dark:bg-brand-primary/30"
          : "bg-brand-primary/10 dark:bg-brand-primary/20"
      )}>
        <span className="text-lg font-bold text-brand-primary">{exam.date}</span>
        <span className="text-xs text-brand-primary/70">{exam.day}</span>
      </div>

      {/* Subject Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
            {exam.subjectCode}
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded">
            {exam.credits} Credits
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">
          {exam.subjectName}
        </h4>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Dec {exam.date}, {exam.day} | {exam.time}</span>
        </div>
      </div>

      {/* Fee */}
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold text-gray-900 dark:text-white">₹{exam.fee}</span>
      </div>
    </div>
  );
}

// Exam Row
function ExamRow({ exam, isLast }: { exam: ExamScheduleItem; isLast: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
        !isLast && "border-b border-gray-100 dark:border-gray-700"
      )}
    >
      {/* Date Block */}
      <div className="w-14 h-14 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-lg font-bold text-brand-primary">{exam.date}</span>
        <span className="text-xs text-brand-primary/70">{exam.day}</span>
      </div>

      {/* Subject Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
            {exam.subjectCode}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">
          {exam.subjectName}
        </h4>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{exam.venue}</span>
        </div>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{exam.time}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{exam.duration}</span>
      </div>

      {/* Seat */}
      <div className="w-16 flex-shrink-0">
        <div className="bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-lg px-3 py-2 text-center">
          <span className="text-sm font-bold text-brand-secondary">{exam.seatNumber}</span>
        </div>
      </div>
    </div>
  );
}

// Hall Ticket Preview Modal
function HallTicketModal({
  ticket,
  exams,
  onClose,
}: {
  ticket: HallTicketInfo;
  exams: ExamScheduleItem[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hall Ticket</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* University Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">EDGEUP UNIVERSITY</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Semester Examination - {ticket.examSession}</p>
            <p className="text-base font-semibold text-brand-primary mt-1">HALL TICKET</p>
          </div>

          {/* Student Info */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Ticket Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ticket.ticketNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Roll Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ticket.rollNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Student Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ticket.studentName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Program</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ticket.program}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">Photo</span>
              </div>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Exam Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Subject</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Time</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Venue</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">Seat</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr
                    key={exam.id}
                    className={cn(
                      "border-t border-gray-200 dark:border-gray-700",
                      index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
                    )}
                  >
                    <td className="px-3 py-2">
                      <span className="font-medium text-gray-900 dark:text-white">{exam.subjectCode}</span>
                      <br />
                      <span className="text-xs text-gray-500">{exam.subjectName}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">Dec {exam.date}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{exam.time}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{exam.venue}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">{exam.seatNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Warning className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Important</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Carry this hall ticket and a valid photo ID to every exam. Electronic devices are prohibited.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={onClose}>
            <FilePdf className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={onClose}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}

// Instructions Modal
function InstructionsModal({
  instructions,
  onClose,
}: {
  instructions: Instruction[];
  onClose: () => void;
}) {
  const [expandedId, setExpandedId] = useState<number>(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Exam Instructions</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === instruction.id ? 0 : instruction.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {instruction.category}
                </span>
                <CaretRight
                  className={cn(
                    "w-4 h-4 text-gray-400 transition-transform",
                    expandedId === instruction.id && "rotate-90"
                  )}
                />
              </button>
              {expandedId === instruction.id && (
                <div className="px-3 pb-3 pt-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <ul className="space-y-2 pt-3">
                    {instruction.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Registration View Component
function RegistrationView({
  onRegister,
}: {
  onRegister: () => void;
}) {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const deadlineStatus = getDeadlineStatus();

  const toggleSubject = (id: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSubjects(availableExams.map((e) => e.id));
  };

  const clearAll = () => {
    setSelectedSubjects([]);
  };

  const selectedExams = availableExams.filter((e) => selectedSubjects.includes(e.id));
  const examFeeTotal = selectedExams.reduce((sum, e) => sum + e.fee, 0);
  const totalFee = selectedExams.length > 0 ? examFeeTotal + PROCESSING_FEE : 0;
  const totalCredits = selectedExams.reduce((sum, e) => sum + e.credits, 0);

  const canSubmit = selectedSubjects.length > 0 && agreedToTerms;

  const handleRegister = () => {
    if (canSubmit) {
      onRegister();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center">
            <Books className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Registration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">December 2025 Semester Examination</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", deadlineStatus.bg)}>
          <Timer className={cn("w-4 h-4", deadlineStatus.color)} />
          <span className={cn("text-sm font-medium", deadlineStatus.color)}>Registration: {deadlineStatus.text}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard
          icon={FileText}
          value={availableExams.length}
          label="Available Exams"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={CheckSquare}
          value={selectedSubjects.length}
          label="Selected"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={Receipt}
          value={`₹${totalFee}`}
          label="Total Fee"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Timer}
          value={totalCredits}
          label="Total Credits"
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Panel - Subject Selection */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Select Subjects</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedSubjects.length} of {availableExams.length} selected
            </span>
          </div>

          {/* Subject List */}
          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {availableExams.map((exam, index) => (
              <SubjectRow
                key={exam.id}
                exam={exam}
                isSelected={selectedSubjects.includes(exam.id)}
                onToggle={() => toggleSubject(exam.id)}
                isLast={index === availableExams.length - 1}
              />
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex items-center gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex-shrink-0">
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium" onClick={selectAll}>
              <CheckSquare className="w-5 h-5" />
              Select All
            </Button>
            <Button variant="outline" className="gap-2 flex-1 h-10 text-sm font-medium" onClick={clearAll}>
              <Square className="w-5 h-5" />
              Clear All
            </Button>
          </div>
        </Card>

        {/* Right Panel */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Fee Summary Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Fee Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Exam Fee ({selectedSubjects.length} subjects)
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{examFeeTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedSubjects.length > 0 ? `₹${PROCESSING_FEE}` : "₹0"}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-brand-primary">₹{totalFee}</span>
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
                {registrationNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 space-y-4">
              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {agreedToTerms ? (
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
                disabled={!canSubmit}
                onClick={handleRegister}
              >
                <CreditCard className="w-5 h-5" />
                Pay & Register {totalFee > 0 && `₹${totalFee}`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// Exam Management View Component (shown after registration)
function ExamManagementView({
  onShowHallTicket,
  onShowInstructions,
}: {
  onShowHallTicket: () => void;
  onShowInstructions: () => void;
}) {
  const deadlineStatus = getDeadlineStatus();
  const totalCredits = examSchedule.length * 3 + 3;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 flex items-center justify-center">
            <Exam className="w-7 h-7 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">December 2025 Semester Examination</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" weight="fill" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Registered</span>
          </div>
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", deadlineStatus.bg)}>
            <Timer className={cn("w-4 h-4", deadlineStatus.color)} />
            <span className={cn("text-sm font-medium", deadlineStatus.color)}>{deadlineStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <StatCard
          icon={FileText}
          value={examSchedule.length}
          label="Total Exams"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={CalendarCheck}
          value={totalCredits}
          label="Total Credits"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Calendar}
          value="Dec 15"
          label="First Exam"
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={Timer}
          value="9 days"
          label="Until Exams"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Panel - Exam Schedule */}
        <Card className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Exam Schedule</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Dec 15 - Dec 23, 2025</span>
          </div>

          {/* Exam List */}
          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {examSchedule.map((exam, index) => (
              <ExamRow key={exam.id} exam={exam} isLast={index === examSchedule.length - 1} />
            ))}
          </div>

        </Card>

        {/* Right Panel */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Hall Ticket Card */}
          <Card
            className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:border-brand-primary transition-colors"
            onClick={onShowHallTicket}
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
                  <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">{hallTicketInfo.studentName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{hallTicketInfo.rollNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hallTicketInfo.ticketNumber}</p>
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
                    onShowHallTicket();
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
                    onShowHallTicket();
                  }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <Info className="w-4 h-4 text-brand-secondary" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Key Instructions</h3>
            </div>

            <div className="p-4">
              <ul className="space-y-2.5">
                {keyInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={onShowInstructions}
              >
                View All Instructions
                <CaretRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ============ MAIN COMPONENT ============
export default function ExamManagementPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3 overflow-hidden">
      {!isRegistered ? (
        <RegistrationView onRegister={() => setIsRegistered(true)} />
      ) : (
        <ExamManagementView
          onShowHallTicket={() => setShowHallTicket(true)}
          onShowInstructions={() => setShowInstructions(true)}
        />
      )}

      {/* Modals */}
      {showHallTicket && (
        <HallTicketModal
          ticket={hallTicketInfo}
          exams={examSchedule}
          onClose={() => setShowHallTicket(false)}
        />
      )}

      {showInstructions && (
        <InstructionsModal
          instructions={allInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}
