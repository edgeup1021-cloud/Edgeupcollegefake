"use client";

import { GraduationCap, Chalkboard } from "@phosphor-icons/react";

type Role = "student" | "teacher";

interface RoleSelectorProps {
  selectedRole: Role | null;
  onSelect: (role: Role) => void;
  error?: string;
}

const roles = [
  {
    id: "student" as Role,
    title: "Student",
    description: "Access courses, assignments, and track your progress",
    icon: GraduationCap,
  },
  {
    id: "teacher" as Role,
    title: "Teacher",
    description: "Manage classes, create content, and track student progress",
    icon: Chalkboard,
  },
];

export default function RoleSelector({
  selectedRole,
  onSelect,
  error,
}: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        I am a...
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-light/50 dark:bg-brand-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {/* Selection indicator */}
              <div
                className={`
                absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              >
                {isSelected && (
                  <svg
                    className="w-full h-full text-white p-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Icon */}
              <div
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3
                ${
                  isSelected
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }
              `}
              >
                <Icon className="w-6 h-6" weight="duotone" />
              </div>

              {/* Text */}
              <h3
                className={`font-semibold mb-1 ${isSelected ? "text-brand-primary" : "text-gray-900 dark:text-white"}`}
              >
                {role.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
