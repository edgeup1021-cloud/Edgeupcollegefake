"use client";

import { type ButtonHTMLAttributes, useState } from "react";
import { motion } from "framer-motion";
import { CircleNotch, Check } from "@phosphor-icons/react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export default function AuthButton({
  children,
  isLoading = false,
  isSuccess = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples([...ripples, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const baseStyles =
    "relative overflow-hidden w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-gradient-to-r from-brand-secondary to-brand-accent hover:from-brand-accent hover:to-brand-secondary text-white shadow-lg shadow-brand-secondary/30 hover:shadow-xl hover:shadow-brand-secondary/40 hover:scale-[1.02] active:scale-[0.98]",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-brand-primary/20",
  };

  const { onClick, ...restProps } = props;

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading || isSuccess}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      {...(restProps as any)}
    >
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, x: "-50%", y: "-50%" }}
          animate={{
            width: 400,
            height: 400,
            opacity: [0.5, 0],
          }}
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Shine effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CircleNotch className="w-5 h-5" weight="bold" />
            </motion.div>
            <span>Please wait...</span>
          </>
        ) : isSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" weight="bold" />
            <span>Success!</span>
          </motion.div>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
