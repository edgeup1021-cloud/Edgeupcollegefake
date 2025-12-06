"use client";

import { motion } from "framer-motion";
import { GraduationCap, Chalkboard, Sparkle } from "@phosphor-icons/react";

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
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "teacher" as Role,
    title: "Teacher",
    description: "Manage classes, create content, and track student progress",
    icon: Chalkboard,
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function RoleSelector({
  selectedRole,
  onSelect,
  error,
}: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        I am a...
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group
                ${
                  isSelected
                    ? "border-brand-primary bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/20 dark:to-brand-secondary/20 shadow-lg shadow-brand-primary/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 bg-white dark:bg-gray-800/50 hover:shadow-md"
                }
              `}
            >
              {/* Hover gradient background */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {/* Selection glow effect */}
              {isSelected && (
                <motion.div
                  layoutId="role-selector-glow"
                  className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 blur-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Selection indicator */}
              <motion.div
                className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary scale-100"
                    : "border-gray-300 dark:border-gray-600 scale-90"
                }
              `}
                animate={{ scale: isSelected ? [1, 1.2, 1] : 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-full h-full text-white p-1"
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
                  </motion.svg>
                )}
              </motion.div>

              {/* Sparkle effect on selection */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-4 right-4"
                >
                  <Sparkle className="w-5 h-5 text-brand-secondary" weight="fill" />
                </motion.div>
              )}

              {/* Icon */}
              <motion.div
                className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative
                ${
                  isSelected
                    ? `bg-gradient-to-br ${role.gradient}`
                    : "bg-gray-100 dark:bg-gray-800"
                }
              `}
                animate={{
                  rotate: isSelected ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon
                  className={`w-7 h-7 ${
                    isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                  weight={isSelected ? "duotone" : "regular"}
                />
              </motion.div>

              {/* Text */}
              <h3
                className={`font-bold text-lg mb-2 ${
                  isSelected
                    ? "text-brand-primary dark:text-brand-primary"
                    : "text-gray-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary"
                } transition-colors`}
              >
                {role.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {role.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5"
        >
          <span>⚠️</span>
          {error}
        </motion.p>
      )}
    </div>
  );
}
