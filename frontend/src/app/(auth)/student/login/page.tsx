"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EnvelopeSimple, Student } from "@phosphor-icons/react";

import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import {
  InputField,
  PasswordField,
  AuthButton,
} from "@/components/ui/auth";

export default function StudentLoginPage() {
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
      await login({ ...data, portalType: 'student' });
      // Redirect is handled by AuthContext
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <Student className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Student Portal
          </h2>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sign in to access your student dashboard
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
          placeholder="student@example.com"
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
          Sign in as Student
        </AuthButton>
      </form>


    </div>
  );
}
