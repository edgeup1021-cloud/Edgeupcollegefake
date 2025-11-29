"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import {
  EnvelopeSimple,
  User,
  IdentificationCard,
  GraduationCap,
  Briefcase,
  ArrowLeft,
} from "@phosphor-icons/react";

import { useAuth } from "@/src/contexts/AuthContext";
import {
  InputField,
  PasswordField,
  AuthButton,
  RoleSelector,
} from "@/src/components/ui/auth";

// Combined schema for both roles
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["student", "teacher"]),
    // Student fields
    admissionNo: z.string().optional(),
    program: z.string().optional(),
    batch: z.string().optional(),
    // Teacher fields
    designation: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        return data.admissionNo && data.admissionNo.length > 0;
      }
      return true;
    },
    {
      message: "Admission number is required for students",
      path: ["admissionNo"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      admissionNo: "",
      program: "",
      batch: "",
      designation: "",
    },
  });

  const role = watch("role");

  const handleRoleSelect = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      // Remove confirmPassword before sending
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...submitData } = data;

      // Build the registration payload
      const registerPayload = {
        email: submitData.email,
        password: submitData.password,
        firstName: submitData.firstName,
        lastName: submitData.lastName,
        role: submitData.role as "student" | "teacher",
        // Include role-specific fields if they have values
        ...(submitData.role === "student" && {
          admissionNo: submitData.admissionNo,
          ...(submitData.program && { program: submitData.program }),
          ...(submitData.batch && { batch: submitData.batch }),
        }),
        ...(submitData.role === "teacher" && {
          ...(submitData.designation && { designation: submitData.designation }),
        }),
      };

      await registerUser(registerPayload);
      // Redirect is handled by AuthContext
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {step === 2 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
          {step === 1 ? "Create an account" : "Complete your profile"}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {step === 1
            ? "Select your role to get started"
            : `Fill in your details as a ${selectedRole}`}
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <RoleSelector
            selectedRole={selectedRole}
            onSelect={handleRoleSelect}
          />

          <AuthButton
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            Continue
          </AuthButton>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First name"
              placeholder="John"
              icon={User}
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <InputField
              label="Last name"
              placeholder="Doe"
              icon={User}
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Email */}
          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            icon={EnvelopeSimple}
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Role-specific fields */}
          {role === "student" && (
            <>
              <InputField
                label="Admission Number"
                placeholder="ADM-2024-001"
                icon={IdentificationCard}
                error={errors.admissionNo?.message}
                {...register("admissionNo")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Program (Optional)"
                  placeholder="Computer Science"
                  icon={GraduationCap}
                  {...register("program")}
                />
                <InputField
                  label="Batch (Optional)"
                  placeholder="2024"
                  icon={GraduationCap}
                  {...register("batch")}
                />
              </div>
            </>
          )}

          {role === "teacher" && (
            <InputField
              label="Designation (Optional)"
              placeholder="Assistant Professor"
              icon={Briefcase}
              {...register("designation")}
            />
          )}

          {/* Password fields */}
          <PasswordField
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordField
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            showIcon={false}
            {...register("confirmPassword")}
          />

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              By creating an account, I agree to the{" "}
              <Link
                href="/terms"
                className="text-brand-primary hover:text-brand-secondary"
              >
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-brand-primary hover:text-brand-secondary"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit button */}
          <AuthButton type="submit" isLoading={isLoading}>
            Create account
          </AuthButton>

          {/* Login link */}
          <p className="text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
