"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeSlash, Lock } from "@phosphor-icons/react";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showIcon?: boolean;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, showIcon = true, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          {showIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" weight="regular" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={`
              w-full px-4 py-3 pr-12 rounded-lg border bg-white dark:bg-gray-800
              text-gray-900 dark:text-white placeholder-gray-400
              transition-all duration-200
              ${showIcon ? "pl-11" : ""}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-brand-primary focus:ring-brand-primary/20"
              }
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlash className="w-5 h-5" weight="regular" />
            ) : (
              <Eye className="w-5 h-5" weight="regular" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
        {props.name === "password" && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use 8 or more characters with a mix of letters and numbers
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
