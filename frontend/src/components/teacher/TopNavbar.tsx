"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/src/assets/logo.png";
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
} from "lucide-react";
import { useTheme } from "@/src/components/providers/ThemeProvider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/components/ui/navigation-menu";
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
  const isCurriculumActive = pathname === "/teacher/content-curriculum";
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
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {/* Overview Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/teacher/overview"
                      className={`inline-flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isOverviewActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Overview
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Classroom Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800">
                    Classroom
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-2">
                      {classroomItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="flex items-start gap-3 rounded-lg p-3 hover:bg-brand-light/50 dark:hover:bg-brand-primary/10 transition-colors"
                              >
                                <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Curriculum Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/teacher/content-curriculum"
                      className={`inline-flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isCurriculumActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Curriculum
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Students Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/teacher/student-development"
                      className={`inline-flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isStudentsActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      Students
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Growth Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/teacher/professional-learning"
                      className={`inline-flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isGrowthActive
                          ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Growth
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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

              {/* Other Links */}
              <div className="pt-2">
                <Link
                  href="/teacher/content-curriculum"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isCurriculumActive
                      ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Content & Curriculum
                </Link>

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
