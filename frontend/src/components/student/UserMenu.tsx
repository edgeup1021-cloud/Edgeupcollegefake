"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Settings, LogOut, GraduationCap, Briefcase, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudentDashboard } from "@/hooks/student/useStudents";
import { UserRole } from "@/types/auth.types";

// Role icons and labels
const roleConfig: Record<UserRole, { icon: typeof GraduationCap; label: string }> = {
  student: { icon: GraduationCap, label: "Student" },
  teacher: { icon: Briefcase, label: "Teacher" },
  admin: { icon: Shield, label: "Admin" },
  superadmin: { icon: Shield, label: "Super Admin" },
};

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  // Fetch student dashboard for additional profile info (only for students)
  const { dashboard } = useStudentDashboard(
    user?.role === "student" ? user.id : null
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/login");
  };

  // Get display values
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Loading...";
  const roleInfo = user && user.role in roleConfig
    ? roleConfig[user.role]
    : roleConfig.student;
  const RoleIcon = roleInfo.icon;

  // For students, show program and college from dashboard
  const program = dashboard?.profile.program || user?.email || "";
  const college = dashboard?.profile.college || "";
  const profileImage = user?.profileImage || dashboard?.profile.profileImage;

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt={fullName}
            width={32}
            height={32}
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
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={48}
                  height={48}
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
                {program && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {program}
                  </div>
                )}
                {college && (
                  <div className="text-xs text-brand-secondary dark:text-brand-secondary">
                    {college}
                  </div>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-light dark:bg-brand-secondary/20 rounded-full">
              <RoleIcon className="w-3.5 h-3.5 text-brand-secondary dark:text-brand-secondary" />
              <span className="text-xs font-medium text-brand-secondary dark:text-brand-secondary">
                {roleInfo.label}
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
              onClick={handleLogout}
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
