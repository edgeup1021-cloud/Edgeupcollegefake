"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react";

import { useAuth } from "@/src/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/src/lib/validations/auth";
import {
  InputField,
  PasswordField,
  AuthButton,
} from "@/src/components/ui/auth";

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
      // Redirect is handled by AuthContext
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={EnvelopeSimple}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-brand-primary hover:text-brand-secondary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <AuthButton type="submit" isLoading={isLoading}>
          Sign in
        </AuthButton>
      </form>

      {/* Register link */}
      <p className="text-center text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
