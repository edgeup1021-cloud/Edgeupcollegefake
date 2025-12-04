"use client";

import { motion } from "framer-motion";
import { Check, X } from "@phosphor-icons/react";

interface PasswordStrengthProps {
  password: string;
}

const requirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Contains a number", test: (pw: string) => /\d/.test(pw) },
  { label: "Contains a letter", test: (pw: string) => /[a-zA-Z]/.test(pw) },
  {
    label: "Contains uppercase & lowercase",
    test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const metRequirements = requirements.filter((req) => req.test(password));
  const strength = metRequirements.length;
  const strengthPercentage = (strength / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-300";
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "Very Weak";
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  const getStrengthTextColor = () => {
    if (strength === 0) return "text-gray-500";
    if (strength <= 1) return "text-red-500";
    if (strength <= 2) return "text-orange-500";
    if (strength <= 3) return "text-yellow-600";
    return "text-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 mt-3"
    >
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
          <span className={`font-semibold ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getStrengthColor()} transition-colors duration-300`}
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              <motion.div
                animate={{
                  scale: isMet ? 1 : 0.8,
                  backgroundColor: isMet
                    ? "rgb(34, 197, 94)"
                    : "rgb(209, 213, 219)",
                }}
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isMet
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                }`}
              >
                {isMet ? (
                  <Check className="w-3 h-3" weight="bold" />
                ) : (
                  <X className="w-2.5 h-2.5" weight="bold" />
                )}
              </motion.div>
              <span
                className={`${
                  isMet
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {req.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
