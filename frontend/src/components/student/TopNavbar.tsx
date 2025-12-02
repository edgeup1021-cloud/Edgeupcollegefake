"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo.png";
import {
  LayoutGrid,
  BookOpen,
  Bot,
  Briefcase,
  Target,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  FileText,
  BarChart3,
  Award,
  Brain,
  ClipboardCheck,
  Users,
} from "lucide-react";
 
import { useTheme } from "../providers/ThemeProvider";
import CompactDropdown from "@/components/ui/compact-dropdown";
import UserMenu from "./UserMenu";
// Study Center Items
const studyCenterItems = [
  {
    label: "Timetable",
    href: "/student/study-center/timetable",
    icon: Calendar,
    description: "Your class schedule",
  },
  {
    label: "Attendance",
    href: "/student/study-center/attendance",
    icon: ClipboardCheck,
    description: "Track your attendance",
  },
  {
    label: "Live Classes",
    href: "/student/study-center/liveclasses",
    icon: BookOpen,
    description: "Join live class sessions",
  },
  {
    label: "Task and Assignment",
    href: "/student/study-center/assignments",
    icon: FileText,
    description: "View and submit assignments",
  },
  {
    label: "Digital Library",
    href: "/student/study-center/digitallibrary",
    icon: BookOpen,
    description: "Access study materials",
  },
  {
    label: "Research and Assistant",
    href: "/student/study-center/research",
    icon: Brain,
    description: "Research tools and AI assistant",
  },
];

// Smart Assistant Items
const smartAssistantItems = [
  {
    label: "EUSTAD (Chatbot)",
    href: "/student/smart-assistant/eustad",
    icon: Bot,
    description: "AI-powered study chatbot",
  },
  {
    label: "Study Group",
    href: "/student/smart-assistant/study-group",
    icon: Users,
    description: "Collaborate with peers",
  },
  {
    label: "Deadline Tracker",
    href: "/student/smart-assistant/deadlines",
    icon: Calendar,
    description: "Never miss a deadline",
  },
  {
    label: "Performance Analytics",
    href: "/student/smart-assistant/analytics",
    icon: BarChart3,
    description: "Track your progress",
  },
];

// Career & Placement Items
const careerItems = [
  {
    label: "Resume Builder",
    href: "/student/career/resume-builder",
    icon: FileText,
    description: "Build your professional resume",
  },
  {
    label: "Interview Prep",
    href: "/student/career/interview-prep",
    icon: Briefcase,
    description: "Prepare for interviews",
  },
  {
    label: "Opportunities",
    href: "/student/career/opportunities",
    icon: Target,
    description: "Explore job opportunities",
  },
  {
    label: "My Applications",
    href: "/student/career/appss",
    icon: FileText,
    description: "Track your applications",
  },
  {
    label: "Skill Analysis",
    href: "/student/career/skills",
    icon: BarChart3,
    description: "Analyze your skills",
  },
  {
    label: "Mentors",
    href: "/student/career/mentors",
    icon: Award,
    description: "Connect with mentors",
  },
  {
    label: "Alumni Network",
    href: "/student/career/alumni",
    icon: Users,
    description: "Network with alumni",
  },
  {
    label: "PASCO Profile",
    href: "/student/career/pasco",
    icon: Award,
    description: "Your professional profile",
  },
];

// Job Matcher Items
const jobMatcherItems = [
  {
    label: "Career Assessments",
    href: "/student/job-matcher/assessments",
    icon: BarChart3,
    description: "Assess your career fit",
  },
  {
    label: "Job Analyser",
    href: "/student/job-matcher/analyzer",
    icon: Target,
    description: "Analyze job requirements",
  },
  {
    label: "Career Paths",
    href: "/student/job-matcher/paths",
    icon: Briefcase,
    description: "Explore career paths",
  },
];

// Wellness Items
const wellnessItems = [
  {
    label: "Wellness Dashboard",
    href: "/student/wellness/dashboard",
    icon: Heart,
    description: "Your wellness overview",
  },
  {
    label: "Self Assessment",
    href: "/student/wellness/self-assessment",
    icon: Brain,
    description: "Assess your wellbeing",
  },
  {
    label: "Mood Booster",
    href: "/student/wellness/mood-booster",
    icon: Heart,
    description: "Daily mood enhancement",
  },
  {
    label: "Report and Support",
    href: "/student/wellness/support",
    icon: FileText,
    description: "Get support resources",
  },
];

// Examinations Items
const examinationItems = [
  {
    label: "Exam Management",
    href: "/student/exams/management",
    icon: Calendar,
    description: "View exam schedule",
  },
  {
    label: "Results & Grades",
    href: "/student/exams/results",
    icon: BarChart3,
    description: "Check your results",
  },
  {
    label: "Supplementary Exams",
    href: "/student/exams/supplementary",
    icon: FileText,
    description: "Apply for supplementary exams",
  },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isOverviewActive = pathname === "/student/overview";

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/student/overview" className="flex items-center">
              <Image
                src={logo}
                alt="EdgeUp"
                height={36}
                className="w-auto"
                priority
              />
            </Link>

            {/* Center: Navigation (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Overview Link */}
              <Link
                href="/student/overview"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isOverviewActive
                    ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Overview
              </Link>

              {/* Compact Dropdowns */}
              <CompactDropdown
                items={studyCenterItems}
                trigger="Study"
                themeColor="blue"
                columns={2}
                width="300px"
                enableSearch={studyCenterItems.length > 6}
              />

              <CompactDropdown
                items={smartAssistantItems}
                trigger="Assistant"
                themeColor="purple"
                columns={2}
                width="280px"
              />

              <CompactDropdown
                items={careerItems}
                trigger="Career"
                themeColor="amber"
                columns={2}
                width="320px"
                enableSearch={true}
              />

              <CompactDropdown
                items={jobMatcherItems}
                trigger="Jobs"
                themeColor="green"
                columns={1}
                width="280px"
              />

              <CompactDropdown
                items={wellnessItems}
                trigger="Wellness"
                themeColor="rose"
                columns={2}
                width="280px"
              />

              <CompactDropdown
                items={examinationItems}
                trigger="Exams"
                themeColor="indigo"
                columns={1}
                width="280px"
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {searchOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, resources, or anything..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              <Link
                href="/student/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LayoutGrid className="w-5 h-5" />
                Overview
              </Link>

              {/* Study Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Study Center
                </div>
                {studyCenterItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Smart Assistant Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Smart Assistant
                </div>
                {smartAssistantItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Career Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Career
                </div>
                {careerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Job Matcher Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Job Matcher
                </div>
                {jobMatcherItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Wellness Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Wellness
                </div>
                {wellnessItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Examinations Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Examinations
                </div>
                {examinationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}