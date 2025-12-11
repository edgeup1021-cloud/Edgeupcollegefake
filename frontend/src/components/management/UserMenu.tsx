"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagementDashboard } from "@/hooks/management";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { dashboard } = useManagementDashboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get display values with fallback
  const fullName = dashboard?.profile?.name || user?.fullName || user?.username || "Loading...";
  const designation = dashboard?.profile?.designation || "Administrator";
  const institutionName = dashboard?.institution?.name || "Loading...";
  const profileImage = dashboard?.profile?.profileImage;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {fullName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {designation}
                </div>
                <div className="text-xs text-brand-secondary dark:text-brand-secondary">
                  {institutionName}
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-light dark:bg-brand-secondary/20 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-brand-secondary dark:text-brand-secondary" />
              <span className="text-xs font-medium text-brand-secondary dark:text-brand-secondary">
                Management
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
