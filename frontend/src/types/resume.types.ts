// Resume Builder Types

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
  github: string;
}

export interface ProfessionalSummary {
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
  relevantCoursework: string[];
  isCurrently: boolean;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrently: boolean;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface Extracurricular {
  id: string;
  activity: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: ProfessionalSummary;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  awards: Award[];
  extracurriculars: Extracurricular[];
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative' | 'ats-friendly';

export type ResumeSection =
  | 'personal'
  | 'summary'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'awards'
  | 'extracurriculars';

export interface ResumeAnalysisDetails {
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasGitHub: boolean;
    hasPortfolio: boolean;
    hasAddress: boolean;
  };
  sectionsFound: string[];
  sectionsMissing: string[];
  skillsFound: string[];
  technicalSkills: string[];
  softSkills: string[];
  experienceCount: number;
  hasQuantifiedAchievements: boolean;
  actionVerbsUsed: string[];
  educationCount: number;
  wordCount: number;
  bulletPointCount: number;
  averageBulletLength: number;
  atsIssues: string[];
  jobMatchPercentage?: number;
  matchedKeywords?: string[];
}

export interface ATSScore {
  overallScore: number;
  keywordMatch: number;
  formatScore: number;
  readabilityScore: number;
  suggestions: string[];
  missingKeywords: string[];
  strongPoints: string[];
  details?: ResumeAnalysisDetails;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    github: '',
  },
  summary: {
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  awards: [],
  extracurriculars: [],
};

export const sectionLabels: Record<ResumeSection, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  education: 'Education',
  experience: 'Work Experience',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  awards: 'Awards & Honors',
  extracurriculars: 'Extracurricular Activities',
};

export const templateLabels: Record<ResumeTemplate, string> = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
  'ats-friendly': 'ATS-Friendly',
};
