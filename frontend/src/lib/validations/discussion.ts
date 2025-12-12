import { z } from "zod";

export const DISCUSSION_CATEGORIES = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business',
  'General Academic',
  'Study Tips',
  'Career Guidance',
] as const;

export const AVAILABLE_TAGS = [
  "Algorithms",
  "Data Structures",
  "Calculus",
  "Linear Algebra",
  "Physics",
  "Chemistry",
  "Programming",
  "Web Development",
  "Machine Learning",
  "Database",
  "Networking",
  "Operating Systems",
  "Statistics",
  "Discrete Math",
  "Software Engineering",
  "Electronics",
  "Thermodynamics",
  "Research",
  "Project Help",
  "Exam Prep",
];

export const createDiscussionSchema = z.object({
  type: z.enum(['question', 'discussion']),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters"),
  category: z.enum(DISCUSSION_CATEGORIES),
  tags: z
    .array(z.string())
    .max(5, "You can select up to 5 tags")
    .optional(),
});

export type CreateDiscussionFormData = z.infer<typeof createDiscussionSchema>;

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must not exceed 2000 characters"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
