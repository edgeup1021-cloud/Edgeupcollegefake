"use client";

import { type ButtonHTMLAttributes } from "react";
import { CircleNotch } from "@phosphor-icons/react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export default function AuthButton({
  children,
  isLoading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  const baseStyles =
    "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-brand-primary hover:bg-brand-dark text-white shadow-sm hover:shadow-md",
    secondary:
      "bg-brand-secondary hover:bg-brand-accent text-white shadow-sm hover:shadow-md",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
