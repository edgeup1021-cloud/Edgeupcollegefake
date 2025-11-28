"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/src/components/providers/SidebarProvider";

export default function MobileHeader() {
  const { isMobile, toggleMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:hidden">
      <button
        onClick={toggleMobile}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      <span className="text-xl font-bold">
        <span className="text-teal-500">edge</span>
        <span className="text-blue-600">Up</span>
      </span>

      {/* Placeholder for right side actions */}
      <div className="w-10" />
    </header>
  );
}
