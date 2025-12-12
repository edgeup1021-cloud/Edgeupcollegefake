import { z } from 'zod';

export const questionGeneratorSchema = z
  .object({
    // College Information (Required)
    university: z
      .string()
      .min(1, 'Please select a university')
      .max(255, 'University name must not exceed 255 characters'),

    course: z
      .string()
      .min(1, 'Please select a course')
      .max(100, 'Course must not exceed 100 characters'),

    department: z
      .string()
      .min(1, 'Please select a department')
      .max(255, 'Department must not exceed 255 characters'),

    semester: z
      .number()
      .int()
      .min(1, 'Semester must be at least 1')
      .max(6, 'Semester must not exceed 6'),

    paper_type: z.enum(['Core', 'Elective'], {
      required_error: 'Please select a paper type',
    }),

    // Question Parameters (Required)
    subject: z
      .string()
      .min(1, 'Please select a subject')
      .max(200, 'Subject must not exceed 200 characters'),

    topic: z
      .string()
      .min(1, 'Please select a topic')
      .max(200, 'Topic must not exceed 200 characters'),

    subtopic: z
      .string()
      .max(200, 'Subtopic must not exceed 200 characters')
      .optional()
      .or(z.literal('')),

    // Question Configuration
    question_type: z.enum(['mcq', 'descriptive'], {
      required_error: 'Please select a question type',
    }),

    descriptive_type: z
      .enum(['very_short', 'short', 'long_essay'])
      .optional()
      .nullable(),

    num_questions: z
      .number()
      .int()
      .min(1, 'Must generate at least 1 question')
      .max(20, 'Cannot generate more than 20 questions at once'),

    instructions: z
      .string()
      .max(500, 'Instructions must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // If question_type is descriptive, descriptive_type must be provided
      if (data.question_type === 'descriptive' && !data.descriptive_type) {
        return false;
      }
      return true;
    },
    {
      message: 'Please select a descriptive question type',
      path: ['descriptive_type'],
    },
  );

export type QuestionGeneratorFormData = z.infer<
  typeof questionGeneratorSchema
>;
