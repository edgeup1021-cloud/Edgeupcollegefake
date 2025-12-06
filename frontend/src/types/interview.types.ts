// Interview Prep Types

export type QuestionCategory =
  | 'behavioral'
  | 'technical'
  | 'situational'
  | 'case-study'
  | 'competency'
  | 'culture-fit';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type IndustryType =
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'consulting'
  | 'marketing'
  | 'sales'
  | 'engineering'
  | 'general';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  industry: IndustryType;
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
  commonMistakes?: string[];
}

export interface STARResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface PracticeSession {
  id: string;
  date: string;
  questionId: string;
  question: string;
  userAnswer: string;
  starResponse?: STARResponse;
  selfRating: number; // 1-5
  notes?: string;
  timeSpent: number; // in seconds
}

export interface MockInterviewSession {
  id: string;
  date: string;
  industry: IndustryType;
  role: string;
  questions: InterviewQuestion[];
  responses: {
    questionId: string;
    answer: string;
    timeSpent: number;
  }[];
  overallScore?: number;
  feedback?: string[];
  completed: boolean;
}

export interface InterviewTip {
  id: string;
  title: string;
  content: string;
  category: 'preparation' | 'during' | 'after' | 'virtual' | 'body-language';
}

export interface UserProgress {
  totalQuestionsAnswered: number;
  questionsByCategory: Record<QuestionCategory, number>;
  averageSelfRating: number;
  mockInterviewsCompleted: number;
  practiceStreak: number;
  lastPracticeDate: string | null;
}

// Category labels and descriptions
export const categoryInfo: Record<QuestionCategory, { label: string; description: string }> = {
  behavioral: {
    label: 'Behavioral',
    description: 'Questions about past experiences and how you handled situations',
  },
  technical: {
    label: 'Technical',
    description: 'Questions testing your technical knowledge and problem-solving',
  },
  situational: {
    label: 'Situational',
    description: 'Hypothetical scenarios to assess your decision-making',
  },
  'case-study': {
    label: 'Case Study',
    description: 'Business problems requiring analytical thinking',
  },
  competency: {
    label: 'Competency',
    description: 'Questions assessing specific skills and competencies',
  },
  'culture-fit': {
    label: 'Culture Fit',
    description: 'Questions about values, work style, and team dynamics',
  },
};

export const industryLabels: Record<IndustryType, string> = {
  technology: 'Technology',
  finance: 'Finance & Banking',
  healthcare: 'Healthcare',
  consulting: 'Consulting',
  marketing: 'Marketing',
  sales: 'Sales',
  engineering: 'Engineering',
  general: 'General',
};

export const difficultyLabels: Record<QuestionDifficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  hard: { label: 'Hard', color: 'red' },
};

// Sample interview questions database
export const sampleQuestions: InterviewQuestion[] = [
  // Behavioral Questions
  {
    id: 'beh-1',
    question: 'Tell me about a time when you had to deal with a difficult coworker or team member.',
    category: 'behavioral',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Focus on the resolution, not the conflict',
      'Show empathy and understanding',
      'Highlight your communication skills',
    ],
    sampleAnswer: 'In my previous role, I worked with a colleague who often missed deadlines affecting our team. Instead of complaining, I scheduled a one-on-one to understand their challenges. I discovered they were overwhelmed with tasks. Together, we created a priority system and I offered to help with urgent items. This improved our working relationship and team productivity by 20%.',
    followUpQuestions: ['What would you do differently?', 'How did this change your approach to teamwork?'],
    commonMistakes: ['Badmouthing the coworker', 'Not taking any responsibility', 'Focusing only on the problem'],
  },
  {
    id: 'beh-2',
    question: 'Describe a situation where you had to meet a tight deadline. How did you handle it?',
    category: 'behavioral',
    difficulty: 'easy',
    industry: 'general',
    tips: [
      'Demonstrate time management skills',
      'Show how you prioritize tasks',
      'Mention the successful outcome',
    ],
    sampleAnswer: 'During my internship, we had a client presentation moved up by a week. I immediately created a detailed task list, identified critical deliverables, and delegated where possible. I worked extra hours and maintained clear communication with my team. We delivered the presentation on time and received positive feedback from the client.',
    followUpQuestions: ['What did you learn from this experience?', 'How do you normally manage your time?'],
  },
  {
    id: 'beh-3',
    question: 'Tell me about a time you failed. How did you handle it?',
    category: 'behavioral',
    difficulty: 'hard',
    industry: 'general',
    tips: [
      'Be honest about the failure',
      'Focus on what you learned',
      'Show how you improved afterwards',
    ],
    sampleAnswer: 'In a group project, I took on too many responsibilities thinking I could handle everything. The result was mediocre work across all areas. I learned the importance of delegation and trusting team members. Since then, I focus on my strengths and actively involve others, which has led to much better outcomes.',
  },
  {
    id: 'beh-4',
    question: 'Give an example of when you showed leadership.',
    category: 'behavioral',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Leadership isn\'t just about titles',
      'Show initiative and influence',
      'Highlight the impact on others',
    ],
  },
  {
    id: 'beh-5',
    question: 'Describe a time when you had to adapt to a major change at work or school.',
    category: 'behavioral',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Show flexibility and resilience',
      'Demonstrate positive attitude',
      'Highlight the outcome',
    ],
  },
  // Technical Questions
  {
    id: 'tech-1',
    question: 'Explain a complex technical concept to someone without a technical background.',
    category: 'technical',
    difficulty: 'medium',
    industry: 'technology',
    tips: [
      'Use simple analogies',
      'Avoid jargon',
      'Check for understanding',
    ],
    sampleAnswer: 'I would explain cloud computing like renting an apartment instead of buying a house. Just like you don\'t need to worry about plumbing or electrical work in a rental, with cloud services you don\'t need to manage physical servers. You just use what you need and pay for that usage.',
  },
  {
    id: 'tech-2',
    question: 'How do you stay updated with the latest technology trends?',
    category: 'technical',
    difficulty: 'easy',
    industry: 'technology',
    tips: [
      'Mention specific resources',
      'Show continuous learning mindset',
      'Give concrete examples',
    ],
  },
  {
    id: 'tech-3',
    question: 'Describe your approach to debugging a complex problem.',
    category: 'technical',
    difficulty: 'hard',
    industry: 'technology',
    tips: [
      'Show systematic approach',
      'Mention tools you use',
      'Demonstrate patience and persistence',
    ],
  },
  // Situational Questions
  {
    id: 'sit-1',
    question: 'What would you do if you disagreed with your manager\'s decision?',
    category: 'situational',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Show respect for authority',
      'Demonstrate assertiveness appropriately',
      'Focus on constructive communication',
    ],
    sampleAnswer: 'I would first make sure I fully understand my manager\'s reasoning. Then, if I still disagreed, I would request a private meeting to share my perspective with supporting data. I would present my concerns professionally and be open to their feedback. Ultimately, I would support the final decision while documenting my input.',
  },
  {
    id: 'sit-2',
    question: 'How would you handle a situation where you had multiple urgent tasks with the same deadline?',
    category: 'situational',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Show prioritization skills',
      'Demonstrate communication',
      'Mention escalation if needed',
    ],
  },
  {
    id: 'sit-3',
    question: 'What would you do if you noticed a colleague taking credit for your work?',
    category: 'situational',
    difficulty: 'hard',
    industry: 'general',
    tips: [
      'Address it professionally',
      'Document your contributions',
      'Focus on resolution, not confrontation',
    ],
  },
  // Culture Fit Questions
  {
    id: 'cul-1',
    question: 'What type of work environment do you thrive in?',
    category: 'culture-fit',
    difficulty: 'easy',
    industry: 'general',
    tips: [
      'Research the company culture',
      'Be honest but adaptable',
      'Give specific examples',
    ],
  },
  {
    id: 'cul-2',
    question: 'How do you handle work-life balance?',
    category: 'culture-fit',
    difficulty: 'easy',
    industry: 'general',
    tips: [
      'Show you value both work and personal time',
      'Demonstrate flexibility when needed',
      'Mention specific strategies',
    ],
  },
  {
    id: 'cul-3',
    question: 'What motivates you in your work?',
    category: 'culture-fit',
    difficulty: 'easy',
    industry: 'general',
    tips: [
      'Be genuine',
      'Connect to company values if possible',
      'Give concrete examples',
    ],
  },
  // Competency Questions
  {
    id: 'comp-1',
    question: 'How do you approach learning a new skill or technology?',
    category: 'competency',
    difficulty: 'easy',
    industry: 'general',
    tips: [
      'Show proactive learning',
      'Mention specific methods',
      'Give examples of skills learned',
    ],
  },
  {
    id: 'comp-2',
    question: 'Describe your experience working in a team. What role do you usually take?',
    category: 'competency',
    difficulty: 'medium',
    industry: 'general',
    tips: [
      'Show flexibility',
      'Highlight collaboration skills',
      'Give specific examples',
    ],
  },
  // Case Study Questions
  {
    id: 'case-1',
    question: 'A company is experiencing declining sales. What steps would you take to analyze and address this problem?',
    category: 'case-study',
    difficulty: 'hard',
    industry: 'consulting',
    tips: [
      'Structure your approach',
      'Ask clarifying questions',
      'Consider multiple factors',
    ],
    sampleAnswer: 'First, I would gather data on sales trends, customer feedback, and market conditions. I would analyze internal factors like pricing, product quality, and sales team performance, as well as external factors like competition and economic conditions. Based on findings, I would develop targeted strategies for the root causes identified.',
  },
  {
    id: 'case-2',
    question: 'How would you launch a new product in a competitive market?',
    category: 'case-study',
    difficulty: 'hard',
    industry: 'marketing',
    tips: [
      'Show market analysis skills',
      'Demonstrate strategic thinking',
      'Consider budget and resources',
    ],
  },
];

// Interview tips database
export const interviewTips: InterviewTip[] = [
  {
    id: 'prep-1',
    title: 'Research the Company',
    content: 'Thoroughly research the company\'s mission, values, recent news, and products. Understanding the company shows genuine interest and helps you tailor your answers.',
    category: 'preparation',
  },
  {
    id: 'prep-2',
    title: 'Practice Common Questions',
    content: 'Prepare answers for common interview questions, but don\'t memorize scripts. Know your key points and practice delivering them naturally.',
    category: 'preparation',
  },
  {
    id: 'prep-3',
    title: 'Prepare Your Own Questions',
    content: 'Have thoughtful questions ready to ask the interviewer. This shows engagement and helps you evaluate if the role is right for you.',
    category: 'preparation',
  },
  {
    id: 'during-1',
    title: 'Use the STAR Method',
    content: 'Structure behavioral answers using Situation, Task, Action, Result. This keeps your responses organized and impactful.',
    category: 'during',
  },
  {
    id: 'during-2',
    title: 'Listen Carefully',
    content: 'Pay attention to the full question before answering. It\'s okay to take a moment to think or ask for clarification.',
    category: 'during',
  },
  {
    id: 'during-3',
    title: 'Be Specific',
    content: 'Use concrete examples and quantify achievements when possible. "Increased sales by 20%" is more impactful than "improved sales significantly."',
    category: 'during',
  },
  {
    id: 'body-1',
    title: 'Maintain Eye Contact',
    content: 'Good eye contact shows confidence and engagement. In virtual interviews, look at the camera, not the screen.',
    category: 'body-language',
  },
  {
    id: 'body-2',
    title: 'Mind Your Posture',
    content: 'Sit up straight and lean slightly forward to show interest. Avoid crossing arms or fidgeting excessively.',
    category: 'body-language',
  },
  {
    id: 'virtual-1',
    title: 'Test Your Technology',
    content: 'Check your internet connection, camera, and microphone before the interview. Have a backup plan ready.',
    category: 'virtual',
  },
  {
    id: 'virtual-2',
    title: 'Choose a Professional Background',
    content: 'Find a quiet, well-lit space with a neutral background. Remove distractions and inform others not to interrupt.',
    category: 'virtual',
  },
  {
    id: 'after-1',
    title: 'Send a Thank You Note',
    content: 'Send a personalized thank you email within 24 hours. Reference specific points from your conversation.',
    category: 'after',
  },
  {
    id: 'after-2',
    title: 'Reflect on Your Performance',
    content: 'Take notes on questions asked and how you answered. Identify areas for improvement for future interviews.',
    category: 'after',
  },
];
