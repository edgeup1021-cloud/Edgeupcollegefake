"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo.png";
import {
  LayoutGrid,
  Users,
  ClipboardCheck,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ClipboardList,
  Library,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import CompactDropdown from "@/components/ui/compact-dropdown";
import UserMenu from "./UserMenu";

const classroomItems = [
  {
    label: "Class Operations",
    href: "/teacher/class-operations",
    icon: Users,
    description: "Manage your classes and schedules",
  },
  {
    label: "Smart Assessment Suite",
    href: "/teacher/smart-assessment-suite",
    icon: ClipboardCheck,
    description: "Create and grade assessments with AI",
  },
  {
    label: "Tasks & Assignments",
    href: "/teacher/tasks-assignments",
    icon: ClipboardList,
    description: "Create and manage student assignments",
  },
];

const curriculumItems = [
  {
    label: "Content & Curriculum",
    href: "/teacher/content-curriculum",
    icon: BookOpen,
    description: "Manage course content and curriculum",
  },
  {
    label: "Digital Library",
    href: "/teacher/digital-library",
    icon: Library,
    description: "Add and manage educational resources",
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

  const isOverviewActive = pathname === "/teacher/overview";
  const isStudentsActive = pathname === "/teacher/student-development";
  const isGrowthActive = pathname === "/teacher/professional-learning";

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/teacher/overview" className="flex items-center">
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
                href="/teacher/overview"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isOverviewActive
                    ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Overview
              </Link>

              {/* Classroom Dropdown */}
              <CompactDropdown
                items={classroomItems}
                trigger="Classroom"
                themeColor="blue"
                columns={1}
                width="280px"
              />

              {/* Curriculum Dropdown */}
              <CompactDropdown
                items={curriculumItems}
                trigger="Curriculum"
                themeColor="green"
                columns={1}
                width="280px"
              />

              {/* Students Link */}
              <Link
                href="/teacher/student-development"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isStudentsActive
                    ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Students
              </Link>

              {/* Growth Link */}
              <Link
                href="/teacher/professional-learning"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isGrowthActive
                    ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Growth
              </Link>
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
                placeholder="Search classes, students, or resources..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/teacher/overview"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isOverviewActive
                    ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                Overview
              </Link>

              {/* Classroom Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Classroom
                </div>
                {classroomItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Curriculum Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Curriculum
                </div>
                {curriculumItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Other Links */}
              <div className="pt-2">

                <Link
                  href="/teacher/student-development"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isStudentsActive
                      ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  Student Development
                </Link>

                <Link
                  href="/teacher/professional-learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isGrowthActive
                      ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Professional Learning
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
