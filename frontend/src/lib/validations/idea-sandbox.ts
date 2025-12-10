import { z } from "zod";

export const IDEA_CATEGORIES = [
  'Pedagogical Strategies',
  'Assessment Methods',
  'Technology Integration',
  'Classroom Management',
] as const;

export const createIdeaSchema = z.object({
  type: z.enum(['idea', 'question']),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters"),
  category: z.enum([
    'Pedagogical Strategies',
    'Assessment Methods',
    'Technology Integration',
    'Classroom Management',
  ]),
  tags: z
    .array(z.string())
    .max(5, "You can select up to 5 tags")
    .optional(),
});

export type CreateIdeaFormData = z.infer<typeof createIdeaSchema>;

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must not exceed 2000 characters"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
