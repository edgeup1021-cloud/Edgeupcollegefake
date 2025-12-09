"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import {
  LayoutGrid,
  BookOpen,
  Shield,
  Building2,
  ScrollText,
  Search,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import UserMenu from "./UserMenu";

// Main navigation items
const navItems = [
  { id: "overview", label: "Overview", href: "/superadmin/overview", icon: LayoutGrid },
  { id: "course", label: "Course", href: "/superadmin/course", icon: BookOpen },
  { id: "role", label: "Role", href: "/superadmin/role", icon: Shield },
  { id: "institute", label: "Institute", href: "/superadmin/institute", icon: Building2 },
  { id: "logs", label: "Admin Logs", href: "/superadmin/admin-logs", icon: ScrollText },
];

export default function PillNavbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const getActiveNavId = () => {
    if (pathname === "/superadmin/overview") return "overview";
    if (pathname.startsWith("/superadmin/course")) return "course";
    if (pathname.startsWith("/superadmin/role")) return "role";
    if (pathname.startsWith("/superadmin/institute")) return "institute";
    if (pathname.startsWith("/superadmin/admin-logs")) return "logs";
    return null;
  };

  const activeNavId = getActiveNavId();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/superadmin/overview" className="flex items-center">
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

                  return (
                    <div key={item.id} className="relative">
                      <Link
                        href={item.href}
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
                placeholder="Search system settings, users, or data..."
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
                    <Link
                      key={item.id}
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
