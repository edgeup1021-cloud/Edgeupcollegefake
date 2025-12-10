"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import {
  LayoutGrid,
  Brain,
  AlertTriangle,
  DollarSign,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Briefcase,
  Users,
  Award,
  UserCheck,
  Package,
  GraduationCap,
  AlertCircle,
  Shield,
} from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import UserMenu from "./UserMenu";

// Institutional Health Items
const institutionalHealthItems = [
  { label: "Academic Performance", href: "/management/institutional-health/academic-performance", icon: TrendingUp },
  { label: "Compliance Tracker", href: "/management/institutional-health/compliance-tracker", icon: CheckCircle },
  { label: "Campus Comparison", href: "/management/institutional-health/campus-comparison", icon: BarChart3 },
  { label: "Financial Health", href: "/management/institutional-health/financial-health", icon: DollarSign },
  { label: "Career Readiness", href: "/management/institutional-health/career-readiness", icon: Briefcase },
];

// Predictive Intelligence Items
const predictiveIntelligenceItems = [
  { label: "Enrollment Prediction", href: "/management/predictive-intelligence/enrollment-prediction", icon: Users },
  { label: "Result Prediction", href: "/management/predictive-intelligence/result-prediction", icon: Award },
  { label: "Student Retention", href: "/management/predictive-intelligence/student-retention", icon: UserCheck },
  { label: "Placement Prediction", href: "/management/predictive-intelligence/placement-prediction", icon: Briefcase },
  { label: "Resource Management", href: "/management/predictive-intelligence/resource-management", icon: Package },
  { label: "Academic Achievement", href: "/management/predictive-intelligence/academic-achievement", icon: GraduationCap },
];

// Risk Mitigation Items
const riskMitigationItems = [
  { label: "Incident Tracking", href: "/management/risk-mitigation/incident-tracking", icon: AlertCircle },
  { label: "Risk Dashboard", href: "/management/risk-mitigation/risk-dashboard", icon: Shield },
];

// Main navigation items
const navItems = [
  { id: "overview", label: "Overview", href: "/management/overview", icon: LayoutGrid },
  { id: "health", label: "Institutional Health", icon: LayoutGrid, items: institutionalHealthItems },
  { id: "intelligence", label: "Predictive Intelligence", icon: Brain, items: predictiveIntelligenceItems },
  { id: "risk", label: "Risk Mitigation", icon: AlertTriangle, items: riskMitigationItems },
  { id: "finance", label: "Financial Management", href: "/management/financial-management", icon: DollarSign },
];

export default function PillNavbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActiveNavId = () => {
    if (pathname === "/management/overview") return "overview";
    if (pathname.startsWith("/management/institutional-health")) return "health";
    if (pathname.startsWith("/management/predictive-intelligence")) return "intelligence";
    if (pathname.startsWith("/management/risk-mitigation")) return "risk";
    if (pathname.startsWith("/management/financial-management")) return "finance";
    return null;
  };

  const activeNavId = getActiveNavId();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/management/overview" className="flex items-center">
              <Image
                src={logo}
                alt="EdgeUp"
                height={36}
                className="w-auto"
                priority
              />
            </Link>

            {/* Center: Pill Navigation (Desktop) */}
            <div className="hidden lg:flex items-center" ref={navContainerRef}>
              <div className="relative flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavId === item.id;
                  const hasDropdown = item.items && item.items.length > 0;

                  return (
                    <div key={item.id} className="relative">
                      {hasDropdown ? (
                        <>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === item.id ? null : item.id
                              )
                            }
                            className={`
                              relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                              transition-colors duration-200 z-10
                              ${
                                isActive
                                  ? "text-brand-primary dark:text-brand-primary"
                                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="pill-background"
                                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                                initial={false}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                            )}
                            <Icon className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">{item.label}</span>
                            <ChevronDown
                              className={`w-3 h-3 relative z-10 transition-transform ${
                                activeDropdown === item.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {activeDropdown === item.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                              >
                                <div className="p-2">
                                  {item.items?.map((subItem) => {
                                    const SubIcon = subItem.icon;
                                    return (
                                      <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        onClick={() => setActiveDropdown(null)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        <SubIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-200">
                                          {subItem.label}
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`
                            relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                            transition-colors duration-200 z-10
                            ${
                              isActive
                                ? "text-brand-primary dark:text-brand-primary"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }
                          `}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="pill-background"
                              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                          <Icon className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                className="lg:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

        {/* Search Bar */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 px-4 py-3"
          >
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports, analytics, or data..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavId === item.id;

                  return (
                    <div key={item.id}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all
                            ${
                              isActive
                                ? "bg-brand-light dark:bg-brand-primary/20 text-brand-primary"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                            {item.label}
                          </div>
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 ml-4 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <SubIcon className="w-4 h-4" />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
