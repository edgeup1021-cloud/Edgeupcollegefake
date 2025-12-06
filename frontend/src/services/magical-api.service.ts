// MagicalAPI Service for ATS Scoring and Resume Analysis
// Routes through backend to keep API keys secure

import type { ResumeData, ATSScore } from '@/types/resume.types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface MagicalAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface KeywordExtractionResponse {
  keywords: string[];
  skills: string[];
  action_verbs: string[];
}

interface BulletPointSuggestion {
  original: string;
  improved: string;
  reason: string;
}

class MagicalAPIService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Convert resume data to plain text for analysis
  private resumeToText(resumeData: ResumeData): string {
    const sections: string[] = [];

    // Personal Info
    const { personalInfo } = resumeData;
    sections.push(`${personalInfo.fullName}`);
    sections.push(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`);

    // Summary
    if (resumeData.summary.summary) {
      sections.push(`\nPROFESSIONAL SUMMARY\n${resumeData.summary.summary}`);
    }

    // Education
    if (resumeData.education.length > 0) {
      sections.push('\nEDUCATION');
      resumeData.education.forEach((edu) => {
        sections.push(`${edu.degree} in ${edu.fieldOfStudy}`);
        sections.push(`${edu.institution} | ${edu.startDate} - ${edu.isCurrently ? 'Present' : edu.endDate}`);
        if (edu.gpa) sections.push(`GPA: ${edu.gpa}`);
      });
    }

    // Experience
    if (resumeData.experience.length > 0) {
      sections.push('\nWORK EXPERIENCE');
      resumeData.experience.forEach((exp) => {
        sections.push(`${exp.jobTitle} at ${exp.company}`);
        sections.push(`${exp.location} | ${exp.startDate} - ${exp.isCurrently ? 'Present' : exp.endDate}`);
        exp.description.forEach((desc) => sections.push(`• ${desc}`));
      });
    }

    // Projects
    if (resumeData.projects.length > 0) {
      sections.push('\nPROJECTS');
      resumeData.projects.forEach((proj) => {
        sections.push(`${proj.name}`);
        sections.push(proj.description);
        sections.push(`Technologies: ${proj.technologies.join(', ')}`);
      });
    }

    // Skills
    if (resumeData.skills.length > 0) {
      sections.push('\nSKILLS');
      const skillsByCategory: Record<string, string[]> = {};
      resumeData.skills.forEach((skill) => {
        if (!skillsByCategory[skill.category]) {
          skillsByCategory[skill.category] = [];
        }
        skillsByCategory[skill.category].push(skill.name);
      });
      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        sections.push(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${skills.join(', ')}`);
      });
    }

    // Certifications
    if (resumeData.certifications.length > 0) {
      sections.push('\nCERTIFICATIONS');
      resumeData.certifications.forEach((cert) => {
        sections.push(`${cert.name} - ${cert.issuingOrganization} (${cert.issueDate})`);
      });
    }

    // Awards
    if (resumeData.awards.length > 0) {
      sections.push('\nAWARDS & HONORS');
      resumeData.awards.forEach((award) => {
        sections.push(`${award.title} - ${award.organization} (${award.date})`);
      });
    }

    return sections.join('\n');
  }

  // Analyze resume for ATS compatibility using backend
  async analyzeATS(resumeData: ResumeData, jobDescription?: string): Promise<MagicalAPIResponse<ATSScore>> {
    try {
      const resumeText = this.resumeToText(resumeData);

      const response = await fetch(`${BACKEND_URL}/api/career/resume/score-by-text`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const result = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            overallScore: result.data.overallScore,
            keywordMatch: result.data.keywordMatch,
            formatScore: result.data.formatScore,
            readabilityScore: result.data.readabilityScore,
            suggestions: result.data.suggestions,
            missingKeywords: result.data.missingKeywords,
            strongPoints: result.data.strongPoints,
          },
        };
      }

      return { success: false, error: result.error || 'Failed to analyze resume' };
    } catch (error) {
      console.error('ATS Analysis Error:', error);
      // Fallback to local mock scoring
      return this.getMockATSScore(resumeData);
    }
  }

  // Analyze uploaded resume file
  async analyzeUploadedResume(file: File, jobDescription?: string): Promise<MagicalAPIResponse<ATSScore>> {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const response = await fetch(`${BACKEND_URL}/api/career/resume/score-by-file`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to analyze resume');
      }

      const result = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            overallScore: result.data.overallScore,
            keywordMatch: result.data.keywordMatch,
            formatScore: result.data.formatScore,
            readabilityScore: result.data.readabilityScore,
            suggestions: result.data.suggestions,
            missingKeywords: result.data.missingKeywords,
            strongPoints: result.data.strongPoints,
          },
        };
      }

      return { success: false, error: result.error || 'Failed to analyze resume' };
    } catch (error) {
      console.error('Uploaded Resume Analysis Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to analyze resume' };
    }
  }

  // Analyze resume by URL
  async analyzeResumeByUrl(resumeUrl: string, jobDescription?: string): Promise<MagicalAPIResponse<ATSScore>> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/career/resume/score-by-url`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          resumeUrl,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const result = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            overallScore: result.data.overallScore,
            keywordMatch: result.data.keywordMatch,
            formatScore: result.data.formatScore,
            readabilityScore: result.data.readabilityScore,
            suggestions: result.data.suggestions,
            missingKeywords: result.data.missingKeywords,
            strongPoints: result.data.strongPoints,
          },
        };
      }

      return { success: false, error: result.error || 'Failed to analyze resume' };
    } catch (error) {
      console.error('URL Resume Analysis Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to analyze resume' };
    }
  }

  // Get keyword suggestions for a job description (local processing)
  async extractKeywords(jobDescription: string): Promise<MagicalAPIResponse<KeywordExtractionResponse>> {
    // Local keyword extraction
    const words = jobDescription.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordFreq: Record<string, number> = {};

    words.forEach((word) => {
      if (!['with', 'that', 'this', 'from', 'have', 'will', 'your', 'they', 'been', 'more', 'when', 'very', 'some', 'what', 'about', 'which', 'would', 'there', 'their', 'could', 'other', 'into', 'than', 'only', 'come', 'made', 'find', 'them', 'these', 'after', 'first', 'also', 'back', 'through', 'just', 'where', 'most', 'know'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    // Common tech skills pattern matching
    const techSkills = ['javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'python', 'java', 'golang', 'rust', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile', 'scrum'];
    const foundSkills = techSkills.filter(skill => jobDescription.toLowerCase().includes(skill));

    // Action verbs
    const actionVerbs = ['develop', 'manage', 'lead', 'create', 'implement', 'design', 'build', 'improve', 'coordinate', 'analyze', 'collaborate', 'deliver', 'optimize', 'maintain', 'support'];
    const foundVerbs = actionVerbs.filter(verb => jobDescription.toLowerCase().includes(verb));

    return {
      success: true,
      data: {
        keywords: sortedWords.slice(0, 15),
        skills: foundSkills.length > 0 ? foundSkills : ['communication', 'teamwork', 'problem-solving'],
        action_verbs: foundVerbs.length > 0 ? foundVerbs : ['developed', 'implemented', 'designed', 'managed'],
      },
    };
  }

  // Get AI suggestions to improve bullet points (local processing)
  async improveBulletPoints(bulletPoints: string[]): Promise<MagicalAPIResponse<BulletPointSuggestion[]>> {
    const actionVerbs = ['Developed', 'Implemented', 'Designed', 'Led', 'Created', 'Managed', 'Built', 'Improved', 'Achieved', 'Delivered'];

    return {
      success: true,
      data: bulletPoints.map((bp) => {
        const startsWithAction = actionVerbs.some(verb => bp.startsWith(verb));
        if (startsWithAction) {
          return {
            original: bp,
            improved: bp,
            reason: 'Already starts with a strong action verb',
          };
        }

        const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        return {
          original: bp,
          improved: `${randomVerb} ${bp.charAt(0).toLowerCase()}${bp.slice(1)}`,
          reason: 'Added action verb for stronger impact',
        };
      }),
    };
  }

  // Mock ATS scoring when API is not available
  private getMockATSScore(resumeData: ResumeData): MagicalAPIResponse<ATSScore> {
    let score = 0;
    const suggestions: string[] = [];
    const missingKeywords: string[] = [];
    const strongPoints: string[] = [];

    // Check personal info completeness
    const { personalInfo } = resumeData;
    if (personalInfo.fullName) score += 10;
    else suggestions.push('Add your full name');

    if (personalInfo.email) score += 5;
    else suggestions.push('Add your email address');

    if (personalInfo.phone) score += 5;
    else suggestions.push('Add your phone number');

    if (personalInfo.linkedIn) {
      score += 5;
      strongPoints.push('LinkedIn profile included');
    } else {
      suggestions.push('Add your LinkedIn profile URL');
    }

    // Check summary
    if (resumeData.summary.summary) {
      score += 10;
      if (resumeData.summary.summary.length > 100) {
        strongPoints.push('Professional summary is well-detailed');
      }
    } else {
      suggestions.push('Add a professional summary to highlight your value');
    }

    // Check education
    if (resumeData.education.length > 0) {
      score += 15;
      strongPoints.push('Education section complete');
    } else {
      suggestions.push('Add your education history');
    }

    // Check experience
    if (resumeData.experience.length > 0) {
      score += 20;
      const hasDescriptions = resumeData.experience.every((exp) => exp.description.length > 0);
      if (hasDescriptions) {
        strongPoints.push('Work experience includes detailed descriptions');
      } else {
        suggestions.push('Add bullet points describing your achievements in each role');
      }
    } else {
      suggestions.push('Add work experience or internships');
      missingKeywords.push('work experience', 'achievements', 'responsibilities');
    }

    // Check skills
    if (resumeData.skills.length > 0) {
      score += 15;
      if (resumeData.skills.length >= 5) {
        strongPoints.push('Good variety of skills listed');
      }
    } else {
      suggestions.push('Add relevant skills to your resume');
      missingKeywords.push('technical skills', 'soft skills');
    }

    // Check projects
    if (resumeData.projects.length > 0) {
      score += 10;
      strongPoints.push('Projects section showcases practical experience');
    } else {
      suggestions.push('Add projects to demonstrate your hands-on experience');
    }

    // Check certifications
    if (resumeData.certifications.length > 0) {
      score += 5;
      strongPoints.push('Certifications add credibility');
    }

    // Calculate sub-scores
    const keywordMatch = Math.min(score + 10, 100);
    const formatScore = resumeData.experience.length > 0 && resumeData.education.length > 0 ? 85 : 60;
    const readabilityScore = resumeData.summary.summary && resumeData.summary.summary.length > 50 ? 80 : 65;

    return {
      success: true,
      data: {
        overallScore: Math.min(score, 100),
        keywordMatch,
        formatScore,
        readabilityScore,
        suggestions,
        missingKeywords,
        strongPoints,
      },
    };
  }
}

export const magicalAPIService = new MagicalAPIService();
export default magicalAPIService;
