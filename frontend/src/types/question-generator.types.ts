export type QuestionType = 'mcq' | 'descriptive';
export type DescriptiveType = 'very_short' | 'short' | 'long_essay';
export type PaperType = 'Core' | 'Elective';

// Display labels for descriptive types with marks and word counts
export const DescriptiveTypeLabels: Record<DescriptiveType, string> = {
  very_short: 'Very Short Answer (2 marks / 50 words)',
  short: 'Short Answer (5 marks / 150 words)',
  long_essay: 'Long Essay (15 marks / 500 words)',
};

export interface QuestionGeneratorFormData {
  // College Information (Required)
  university: string;
  course: string;
  department: string;
  semester: number;
  paper_type: PaperType;

  // Question Parameters (Required)
  subject: string;
  topic: string;
  subtopic?: string;

  // Question Configuration
  question_type: QuestionType;
  descriptive_type?: DescriptiveType;
  num_questions: number;
  instructions?: string;
}

export interface MCQOption {
  [key: string]: string; // e.g., { "a": "Option A", "b": "Option B" }
}

export interface MCQQuestion {
  id?: string;
  question: string;
  question_type: 'mcq';
  options: MCQOption;
  correct_answer: string; // e.g., "a", "b", "c", or "d"
  explanation?: string;
  difficulty?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
}

export interface DescriptiveQuestion {
  id?: string;
  question: string;
  question_type: 'descriptive';
  descriptive_type?: DescriptiveType;
  expected_answer?: string;
  marking_rubric?: string;
  difficulty?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
}

export type GeneratedQuestion = MCQQuestion | DescriptiveQuestion;

export interface ValidationData {
  reflection?: {
    is_valid: boolean;
    mismatched_questions: string[];
    suggestions: string[];
  };
  selector?: {
    is_valid: boolean;
    actual_count: number;
    expected_count: number;
  };
}

export interface GenerateQuestionsResponse {
  success: boolean;
  questions: GeneratedQuestion[];
  validation?: ValidationData;
  metadata: {
    total_generated: number;
    generation_time_ms?: number;
    subject?: string;
    topic?: string;
    [key: string]: any;
  };
}
