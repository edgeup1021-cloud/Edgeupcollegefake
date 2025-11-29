import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Base registration schema (common fields)
const baseRegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["student", "teacher"], {
    required_error: "Please select a role",
  }),
});

// Student-specific fields
const studentFields = z.object({
  admissionNo: z
    .string()
    .min(1, "Admission number is required")
    .max(64, "Admission number must be less than 64 characters"),
  program: z.string().optional(),
  batch: z.string().optional(),
});

// Teacher-specific fields
const teacherFields = z.object({
  designation: z.string().optional(),
  departmentId: z.number().optional(),
});

// Student registration schema
export const studentRegisterSchema = baseRegisterSchema
  .merge(studentFields)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Teacher registration schema
export const teacherRegisterSchema = baseRegisterSchema
  .merge(teacherFields)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Combined register schema with discriminated union
export const registerSchema = z
  .discriminatedUnion("role", [
    baseRegisterSchema
      .extend({ role: z.literal("student") })
      .merge(studentFields),
    baseRegisterSchema
      .extend({ role: z.literal("teacher") })
      .merge(teacherFields),
  ])
  .and(
    z.object({
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterFormData = z.infer<typeof teacherRegisterSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Helper type for form without confirmPassword (for API submission)
export type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;
