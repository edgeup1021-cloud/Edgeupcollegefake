"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { type Icon as PhosphorIcon } from "@phosphor-icons/react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  icon?: PhosphorIcon;
  options: readonly string[];
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, icon: Icon, options, placeholder = "Select an option", className = "", id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon className="w-5 h-5" weight="regular" />
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              transition-all duration-200
              ${Icon ? "pl-11" : ""}
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
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
