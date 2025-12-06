"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category?: string;
}

interface CompactDropdownProps {
  items: DropdownItem[];
  trigger: string;
  themeColor: "blue" | "purple" | "amber" | "green" | "rose" | "indigo";
  columns?: 1 | 2;
  width?: string;
  enableSearch?: boolean;
}

const themeColors = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconHoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60",
    iconText: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/50",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconHoverBg: "group-hover:bg-purple-200 dark:group-hover:bg-purple-800/60",
    iconText: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/50",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconHoverBg: "group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60",
    iconText: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/50",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconHoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-800/60",
    iconText: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/50",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconHoverBg: "group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
    iconText: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    hoverBg: "hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconHoverBg: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60",
    iconText: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
};

export default function CompactDropdown({
  items,
  trigger,
  themeColor,
  columns = 2,
  width = "320px",
  enableSearch = false,
}: CompactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  
  const theme = themeColors[themeColor];
  
  // Filter items based on search term
  const filteredItems = searchTerm
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm("");
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && filteredItems[focusedIndex]) {
            window.location.href = filteredItems[focusedIndex].href;
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, filteredItems]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const isActiveSection = items.some(item => pathname === item.href);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={`
          inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
          ${isActiveSection 
            ? "bg-brand-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
          ${isOpen ? "bg-gray-100 dark:bg-gray-800" : ""}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute top-full left-0 z-50 mt-2 bg-white dark:bg-gray-800 
            rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
            animate-in slide-in-from-top-2 duration-200
          `}
          style={{ width }}
        >
          {/* Search Input */}
          {enableSearch && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="p-2">
            <div 
              className={`grid gap-1 ${
                columns === 2 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isFocused = index === focusedIndex;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchTerm("");
                      setFocusedIndex(-1);
                    }}
                    className={`
                      group flex items-center gap-2 p-2 rounded-lg transition-all duration-150
                      ${theme.hoverBg} ${isFocused ? theme.bg : ""}
                      hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-brand-primary
                    `}
                  >
                    {/* Icon Container */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                      ${theme.iconBg} ${theme.iconHoverBg} transition-colors duration-150
                    `}>
                      <Icon className={`w-4 h-4 ${theme.iconText}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && searchTerm && (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}