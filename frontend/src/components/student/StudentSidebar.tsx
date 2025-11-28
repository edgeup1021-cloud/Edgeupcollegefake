"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  Bot,
  Briefcase,
  Target,
  Heart,
  LogOut,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  User,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useSidebar } from "@/src/components/providers/SidebarProvider";
import { useTheme } from "@/src/components/providers/ThemeProvider";

const navItems = [
  { label: "Overview", href: "/student/overview", icon: LayoutGrid },
  { label: "Study Center", href: "/student/study-center", icon: BookOpen },
  { label: "Smart Assistant", href: "/student/smart-assistant", icon: Bot },
  { label: "Career & Placement Guide", href: "/student/career-placement-guide", icon: Briefcase },
  { label: "Job Matcher", href: "/student/job-matcher", icon: Target },
  { label: "Mental Health & Wellness", href: "/student/mental-health-wellness", icon: Heart },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Mobile backdrop
  if (isMobile && isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-50 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300">
          <SidebarContent
            pathname={pathname}
            isCollapsed={false}
            toggleCollapsed={toggleCollapsed}
            onNavClick={handleNavClick}
            resolvedTheme={resolvedTheme}
            toggleTheme={toggleTheme}
            isMobile={isMobile}
            onClose={() => setIsMobileOpen(false)}
          />
        </aside>
      </>
    );
  }

  // Mobile - hidden
  if (isMobile && !isMobileOpen) {
    return null;
  }

  // Desktop
  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarContent
        pathname={pathname}
        isCollapsed={isCollapsed}
        toggleCollapsed={toggleCollapsed}
        onNavClick={handleNavClick}
        resolvedTheme={resolvedTheme}
        toggleTheme={toggleTheme}
        isMobile={false}
        onClose={() => {}}
      />
    </aside>
  );
}

interface SidebarContentProps {
  pathname: string;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  onNavClick: () => void;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  isMobile: boolean;
  onClose: () => void;
}

function SidebarContent({
  pathname,
  isCollapsed,
  toggleCollapsed,
  onNavClick,
  resolvedTheme,
  toggleTheme,
  isMobile,
  onClose,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo & Close button */}
      <div className="px-4 py-4 flex items-center justify-between">
        {!isCollapsed ? (
          <span className="text-2xl font-bold">
            <span className="text-teal-500">edge</span>
            <span className="text-blue-600">Up</span>
          </span>
        ) : (
          <span className="text-xl font-bold text-teal-500 mx-auto">e</span>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Aravind Kumar</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">B.Tech Computer Science - Year 3</p>
            <p className="text-xs text-teal-600 dark:text-teal-400">MIT College of Engineering</p>
          </div>

          {/* Role Selector */}
          <button className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-gray-700 dark:text-gray-300">Student</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div className="px-2 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-center">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Collapsed Search Icon */}
      {isCollapsed && (
        <div className="px-2 py-3 flex justify-center">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Search">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                  {!isCollapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
          {!isCollapsed && (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode")}
        </button>

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleCollapsed}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
            {!isCollapsed && "Collapse"}
          </button>
        )}

        {/* Logout */}
        <button
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </>
  );
}
