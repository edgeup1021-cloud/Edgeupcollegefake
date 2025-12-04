"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeSlash, Lock, Warning } from "@phosphor-icons/react";
import PasswordStrength from "./PasswordStrength";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showIcon?: boolean;
  showStrength?: boolean;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, showIcon = true, showStrength = false, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const inputId = id || props.name;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      if (props.onBlur) props.onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValue(e.target.value);
      setHasValue(e.target.value.length > 0);
      if (props.onChange) props.onChange(e);
    };

    const isPasswordField = props.name === "password";

    return (
      <div className="space-y-1.5">
        <div className="relative group">
          {showIcon && (
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
              <Lock className="w-5 h-5" weight={isFocused ? "duotone" : "regular"} />
            </motion.div>
          )}

          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            className={`absolute left-3 pointer-events-none transition-all duration-200 ${
              showIcon ? "left-11" : "left-4"
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
              left: isFocused || hasValue ? "0.75rem" : showIcon ? "2.75rem" : "1rem",
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="bg-white dark:bg-gray-800 px-1">{label}</span>
          </motion.label>

          <motion.input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`
              w-full px-4 py-3.5 pr-12 rounded-xl border-2 bg-white dark:bg-gray-800
              text-gray-900 dark:text-white placeholder-transparent
              transition-all duration-200
              ${showIcon ? "pl-11" : ""}
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

          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors z-10"
            tabIndex={-1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <EyeSlash className="w-5 h-5" weight="duotone" />
            ) : (
              <Eye className="w-5 h-5" weight="duotone" />
            )}
          </motion.button>

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

        {/* Password Strength Meter */}
        {isPasswordField && showStrength && !error && (
          <PasswordStrength password={passwordValue} />
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
