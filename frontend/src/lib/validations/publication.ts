import { z } from "zod";

export const PUBLICATION_STATUSES = [
  'Published',
  'Under Review',
  'In Progress',
  'Rejected',
] as const;

export const createPublicationSchema = z.object({
  publicationTitle: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(500, "Title must not exceed 500 characters"),

  journalConferenceName: z
    .string()
    .min(3, "Journal/Conference name must be at least 3 characters")
    .max(300, "Journal/Conference name must not exceed 300 characters"),

  publicationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  status: z.enum([
    'Published',
    'Under Review',
    'In Progress',
    'Rejected',
  ]),

  coAuthors: z
    .string()
    .optional()
    .or(z.literal("")),

  publicationUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  citationsCount: z
    .union([
      z.number().int().min(0),
      z.string().transform(val => val ? parseInt(val, 10) : 0)
    ])
    .optional(),

  impactFactor: z
    .union([
      z.number().min(0).max(100),
      z.string().transform(val => val ? parseFloat(val) : undefined)
    ])
    .optional(),

  doi: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),

  isbnIssn: z
    .string()
    .max(50)
    .optional()
    .or(z.literal("")),

  volumeNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),

  issueNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),

  pageNumbers: z
    .string()
    .max(50)
    .optional()
    .or(z.literal("")),

  personalNotes: z
    .string()
    .max(500, "Personal notes must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CreatePublicationFormData = z.infer<typeof createPublicationSchema>;
