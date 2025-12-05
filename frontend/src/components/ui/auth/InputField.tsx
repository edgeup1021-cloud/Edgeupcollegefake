"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Check, Warning } from "@phosphor-icons/react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: PhosphorIcon;
  showValidation?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon: Icon, showValidation = false, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      if (props.onBlur) props.onBlur(e);
    };

    const isValid = showValidation && hasValue && !error;

    return (
      <div className="space-y-1.5">
        <div className="relative group">
          {Icon && (
            <motion.div
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
                error
                  ? "text-red-500"
                  : isFocused
                  ? "text-brand-primary"
                  : "text-gray-400"
              }`}
              animate={{
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5" weight={isFocused ? "duotone" : "regular"} />
            </motion.div>
          )}

          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            className={`absolute left-3 pointer-events-none transition-all duration-200 ${
              Icon ? "left-11" : "left-4"
            } ${
              error
                ? "text-red-500"
                : isFocused
                ? "text-brand-primary font-medium"
                : "text-gray-500 dark:text-gray-400"
            }`}
            animate={{
              top: isFocused || hasValue ? "-0.5rem" : "50%",
              translateY: isFocused || hasValue ? "0%" : "-50%",
              fontSize: isFocused || hasValue ? "0.75rem" : "0.875rem",
              left: isFocused || hasValue ? "0.75rem" : Icon ? "2.75rem" : "1rem",
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="bg-white dark:bg-gray-800 px-1">{label}</span>
          </motion.label>

          <motion.input
            ref={ref}
            id={inputId}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full px-4 py-3.5 rounded-xl border-2 bg-white dark:bg-gray-800
              text-gray-900 dark:text-white placeholder-transparent
              transition-all duration-200
              ${Icon ? "pl-11" : ""}
              ${isValid ? "pr-11" : ""}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-300 dark:border-gray-600 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              }
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              group-hover:border-gray-400 dark:group-hover:border-gray-500
              ${className}
            `}
            animate={{
              boxShadow: isFocused
                ? error
                  ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                  : "0 0 0 3px rgba(16, 172, 139, 0.1)"
                : "none",
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Success Check Icon */}
          {isValid && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              <Check className="w-5 h-5" weight="bold" />
            </motion.div>
          )}

          {/* Animated Border Gradient */}
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-50 blur-sm -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>

        {/* Error Message with Animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400"
            >
              <Warning className="w-4 h-4" weight="fill" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
