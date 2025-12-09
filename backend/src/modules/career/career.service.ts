import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentResume } from '../../database/entities/student/student-resume.entity';
import { SaveResumeDto } from './dto/save-resume.dto';

interface MagicalAPIResponse {
  data?: {
    score: number;
    reason: string;
  };
  usage?: {
    credits: number;
  };
  message?: string;
  request_id?: string;
}

interface ResumeAnalysisDetails {
  // Contact Information
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasGitHub: boolean;
    hasPortfolio: boolean;
    hasAddress: boolean;
  };
  // Sections Detected
  sectionsFound: string[];
  sectionsMissing: string[];
  // Skills Analysis
  skillsFound: string[];
  technicalSkills: string[];
  softSkills: string[];
  // Experience Analysis
  experienceCount: number;
  hasQuantifiedAchievements: boolean;
  actionVerbsUsed: string[];
  // Education
  educationCount: number;
  // Resume Metrics
  wordCount: number;
  bulletPointCount: number;
  averageBulletLength: number;
  // ATS Compatibility
  atsIssues: string[];
  // Job Match (if job description provided)
  jobMatchPercentage?: number;
  matchedKeywords?: string[];
}

export interface ResumeScoreResult {
  success: boolean;
  data?: {
    score: number;
    reason: string;
    overallScore: number;
    keywordMatch: number;
    formatScore: number;
    readabilityScore: number;
    suggestions: string[];
    missingKeywords: string[];
    strongPoints: string[];
    // New detailed analysis
    details?: ResumeAnalysisDetails;
  };
  error?: string;
}

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);
  private readonly magicalApiKey: string;
  private readonly magicalApiUrl: string;

  // Common technical skills to detect
  private readonly technicalSkillsList = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'git', 'github',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'jira',
    'figma', 'adobe', 'photoshop', 'illustrator', 'sketch',
    'excel', 'powerpoint', 'word', 'tableau', 'power bi', 'salesforce',
  ];

  // Soft skills to detect
  private readonly softSkillsList = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'critical thinking',
    'time management', 'adaptability', 'creativity', 'collaboration', 'negotiation',
    'presentation', 'mentoring', 'coaching', 'decision-making', 'conflict resolution',
    'project management', 'strategic planning', 'analytical', 'interpersonal', 'organization',
  ];

  // Action verbs for resume
  private readonly actionVerbs = [
    'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'completed', 'conducted',
    'coordinated', 'created', 'delivered', 'designed', 'developed', 'directed', 'drove',
    'enabled', 'engineered', 'established', 'executed', 'expanded', 'facilitated',
    'generated', 'grew', 'headed', 'implemented', 'improved', 'increased', 'initiated',
    'innovated', 'integrated', 'launched', 'led', 'managed', 'mentored', 'negotiated',
    'optimized', 'organized', 'oversaw', 'pioneered', 'planned', 'produced', 'reduced',
    'resolved', 'restructured', 'revamped', 'saved', 'scaled', 'spearheaded', 'streamlined',
    'strengthened', 'supervised', 'trained', 'transformed', 'upgraded',
  ];

  constructor(
    private configService: ConfigService,
    @InjectRepository(StudentResume)
    private readonly resumeRepo: Repository<StudentResume>,
  ) {
    this.magicalApiKey = this.configService.get<string>('MAGICAL_API_KEY') || '';
    this.magicalApiUrl = this.configService.get<string>('MAGICAL_API_URL') || 'https://gw.magicalapi.com';
  }

  async scoreResumeByUrl(resumeUrl: string, jobDescription?: string): Promise<ResumeScoreResult> {
    try {
      if (!this.magicalApiKey) {
        this.logger.warn('MagicalAPI key not configured, using mock scoring');
        return this.getMockScore(jobDescription);
      }

      const response = await fetch(`${this.magicalApiUrl}/resume-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.magicalApiKey,
        },
        body: JSON.stringify({
          url: resumeUrl,
          job_description: jobDescription || 'General job position requiring professional skills and experience',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`MagicalAPI error: ${response.status} - ${errorText}`);

        if (response.status === 401) {
          return { success: false, error: 'Invalid API key' };
        }
        if (response.status === 402) {
          return { success: false, error: 'Insufficient API credits' };
        }

        return this.getMockScore(jobDescription);
      }

      const data: MagicalAPIResponse = await response.json();

      if (data.request_id) {
        return await this.pollForResults(data.request_id);
      }

      if (data.data) {
        return this.formatResponse(data.data.score, data.data.reason);
      }

      return this.getMockScore(jobDescription);
    } catch (error) {
      this.logger.error('Failed to score resume:', error);
      return this.getMockScore(jobDescription);
    }
  }

  async scoreResumeByText(resumeText: string, jobDescription?: string): Promise<ResumeScoreResult> {
    return this.analyzeResumeText(resumeText, jobDescription);
  }

  private async pollForResults(requestId: string, maxAttempts = 10): Promise<ResumeScoreResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const response = await fetch(`${this.magicalApiUrl}/resume-score/${requestId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.magicalApiKey,
          },
        });

        if (response.ok) {
          const data: MagicalAPIResponse = await response.json();
          if (data.data) {
            return this.formatResponse(data.data.score, data.data.reason);
          }
        }
      } catch (error) {
        this.logger.warn(`Polling attempt ${i + 1} failed:`, error);
      }
    }

    return { success: false, error: 'Timeout waiting for results' };
  }

  private formatResponse(score: number, reason: string): ResumeScoreResult {
    const overallScore = score * 10;
    const suggestions: string[] = [];
    const strongPoints: string[] = [];
    const missingKeywords: string[] = [];

    if (reason) {
      if (overallScore >= 70) {
        strongPoints.push(reason);
      } else {
        suggestions.push(reason);
      }
    }

    if (overallScore < 50) {
      suggestions.push('Add a professional summary highlighting your key qualifications');
      suggestions.push('Include relevant keywords from the job description');
      missingKeywords.push('achievements', 'metrics', 'leadership');
    } else if (overallScore < 70) {
      suggestions.push('Consider adding more specific accomplishments');
      suggestions.push('Ensure your skills section aligns with job requirements');
    }

    return {
      success: true,
      data: {
        score,
        reason,
        overallScore,
        keywordMatch: Math.min(overallScore + 5, 100),
        formatScore: Math.min(overallScore + 10, 100),
        readabilityScore: Math.min(overallScore + 8, 100),
        suggestions,
        missingKeywords,
        strongPoints,
      },
    };
  }

  private analyzeResumeText(resumeText: string, jobDescription?: string): ResumeScoreResult {
    const textLower = resumeText.toLowerCase();
    const jobLower = (jobDescription || '').toLowerCase();
    const lines = resumeText.split('\n').filter(line => line.trim());

    // Initialize scores
    let contactScore = 0;
    let sectionScore = 0;
    let experienceScore = 0;
    let skillsScore = 0;
    let formatScore = 0;
    let keywordScore = 0;

    const suggestions: string[] = [];
    const missingKeywords: string[] = [];
    const strongPoints: string[] = [];
    const atsIssues: string[] = [];

    // ===== CONTACT INFORMATION ANALYSIS =====
    const contactInfo = {
      hasEmail: /[\w.-]+@[\w.-]+\.\w+/.test(resumeText),
      hasPhone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText),
      hasLinkedIn: textLower.includes('linkedin.com') || textLower.includes('linkedin:'),
      hasGitHub: textLower.includes('github.com') || textLower.includes('github:'),
      hasPortfolio: textLower.includes('portfolio') || /https?:\/\/(?!linkedin|github)[\w.-]+/.test(textLower),
      hasAddress: /\b\d{5}(-\d{4})?\b/.test(resumeText) || /[A-Z][a-z]+,\s*[A-Z]{2}/.test(resumeText),
    };

    if (contactInfo.hasEmail) { contactScore += 25; strongPoints.push('Email address included'); }
    else { suggestions.push('Add your email address for recruiters to contact you'); }

    if (contactInfo.hasPhone) { contactScore += 25; strongPoints.push('Phone number included'); }
    else { suggestions.push('Add your phone number'); }

    if (contactInfo.hasLinkedIn) { contactScore += 20; strongPoints.push('LinkedIn profile linked'); }
    else { suggestions.push('Add your LinkedIn profile URL to increase credibility'); }

    if (contactInfo.hasGitHub) { contactScore += 15; strongPoints.push('GitHub profile linked'); }
    if (contactInfo.hasPortfolio) { contactScore += 15; strongPoints.push('Portfolio/website included'); }

    // ===== SECTIONS ANALYSIS =====
    const sectionKeywords = {
      'Professional Summary': ['summary', 'objective', 'profile', 'about me'],
      'Work Experience': ['experience', 'employment', 'work history', 'professional experience'],
      'Education': ['education', 'academic', 'degree', 'university', 'college'],
      'Skills': ['skills', 'technical skills', 'competencies', 'proficiencies'],
      'Projects': ['projects', 'portfolio', 'personal projects'],
      'Certifications': ['certifications', 'certificates', 'licenses', 'credentials'],
      'Awards': ['awards', 'honors', 'achievements', 'recognition'],
    };

    const sectionsFound: string[] = [];
    const sectionsMissing: string[] = [];

    Object.entries(sectionKeywords).forEach(([section, keywords]) => {
      if (keywords.some(kw => textLower.includes(kw))) {
        sectionsFound.push(section);
        sectionScore += 12;
      } else {
        sectionsMissing.push(section);
      }
    });

    if (sectionsFound.length >= 5) {
      strongPoints.push(`Well-organized resume with ${sectionsFound.length} key sections`);
    }

    if (!sectionsFound.includes('Professional Summary')) {
      suggestions.push('Add a professional summary at the top to quickly capture recruiter attention');
    }
    if (!sectionsFound.includes('Work Experience')) {
      suggestions.push('Add a work experience section - this is critical for ATS');
      atsIssues.push('Missing work experience section');
    }
    if (!sectionsFound.includes('Skills')) {
      suggestions.push('Add a dedicated skills section with relevant keywords');
      atsIssues.push('Missing skills section may hurt ATS ranking');
    }

    // ===== SKILLS ANALYSIS =====
    const skillsFound: string[] = [];
    const technicalSkills: string[] = [];
    const softSkills: string[] = [];

    this.technicalSkillsList.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        skillsFound.push(skill);
        technicalSkills.push(skill);
      }
    });

    this.softSkillsList.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        skillsFound.push(skill);
        softSkills.push(skill);
      }
    });

    skillsScore = Math.min(skillsFound.length * 3, 100);

    if (technicalSkills.length >= 5) {
      strongPoints.push(`Strong technical skills: ${technicalSkills.slice(0, 5).join(', ')}`);
    } else if (technicalSkills.length > 0) {
      suggestions.push('Consider adding more technical skills relevant to your field');
    }

    if (softSkills.length >= 3) {
      strongPoints.push('Good mix of soft skills demonstrated');
    } else {
      suggestions.push('Include soft skills like leadership, communication, or teamwork');
    }

    // ===== EXPERIENCE ANALYSIS =====
    const actionVerbsUsed: string[] = [];
    this.actionVerbs.forEach(verb => {
      const regex = new RegExp(`\\b${verb}(ed|ing|s)?\\b`, 'gi');
      if (regex.test(textLower)) {
        actionVerbsUsed.push(verb);
      }
    });

    if (actionVerbsUsed.length >= 8) {
      strongPoints.push(`Excellent use of action verbs (${actionVerbsUsed.length} found)`);
      experienceScore += 30;
    } else if (actionVerbsUsed.length >= 4) {
      strongPoints.push('Good use of action verbs');
      experienceScore += 20;
    } else {
      suggestions.push('Use more action verbs like "developed", "led", "implemented", "achieved"');
      experienceScore += 10;
    }

    // Check for quantified achievements
    const quantifiedPatterns = [
      /\d+%/g,           // Percentages
      /\$[\d,]+/g,       // Dollar amounts
      /\d+\+?\s*(years?|months?)/gi,  // Time periods
      /\d+\s*(team members?|people|employees?|clients?|customers?|users?)/gi,  // People counts
      /\d+\s*(projects?|applications?|systems?|products?)/gi,  // Project counts
      /increased.*\d+/gi,
      /reduced.*\d+/gi,
      /saved.*\d+/gi,
      /grew.*\d+/gi,
    ];

    let quantifiedCount = 0;
    quantifiedPatterns.forEach(pattern => {
      const matches = resumeText.match(pattern);
      if (matches) quantifiedCount += matches.length;
    });

    const hasQuantifiedAchievements = quantifiedCount >= 3;
    if (hasQuantifiedAchievements) {
      strongPoints.push(`Achievements are quantified with ${quantifiedCount} metrics/numbers`);
      experienceScore += 25;
    } else if (quantifiedCount > 0) {
      suggestions.push('Add more quantified achievements (e.g., "increased sales by 25%", "managed team of 10")');
      experienceScore += 10;
    } else {
      suggestions.push('Quantify your achievements with numbers, percentages, and metrics');
      atsIssues.push('No quantified achievements found');
    }

    // Count experience entries (rough estimate)
    const datePatterns = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}/gi;
    const experienceCount = Math.floor((resumeText.match(datePatterns) || []).length / 2);

    if (experienceCount >= 3) {
      strongPoints.push(`${experienceCount} work experiences documented`);
    }

    // Count education entries
    const degreePatterns = /(bachelor|master|phd|doctorate|associate|diploma|b\.s\.|b\.a\.|m\.s\.|m\.a\.|mba)/gi;
    const educationCount = (resumeText.match(degreePatterns) || []).length;

    if (educationCount > 0) {
      strongPoints.push('Educational qualifications clearly stated');
    }

    // ===== FORMAT ANALYSIS =====
    const wordCount = resumeText.split(/\s+/).filter(word => word.length > 0).length;
    const bulletPoints = (resumeText.match(/^[\s]*[•\-\*►▪]/gm) || []).length;
    const bulletPointCount = bulletPoints;

    // Calculate average bullet point length
    const bulletLines = resumeText.split('\n').filter(line => /^[\s]*[•\-\*►▪]/.test(line));
    const averageBulletLength = bulletLines.length > 0
      ? Math.round(bulletLines.reduce((sum, line) => sum + line.split(/\s+/).length, 0) / bulletLines.length)
      : 0;

    if (wordCount >= 300 && wordCount <= 800) {
      formatScore += 25;
      strongPoints.push(`Good resume length (${wordCount} words)`);
    } else if (wordCount < 300) {
      suggestions.push('Resume may be too short. Consider adding more details about your experience');
      formatScore += 10;
    } else if (wordCount > 800) {
      suggestions.push('Resume may be too long. Consider condensing to 1-2 pages');
      formatScore += 15;
    }

    if (bulletPointCount >= 10) {
      formatScore += 25;
      strongPoints.push('Good use of bullet points for readability');
    } else if (bulletPointCount >= 5) {
      formatScore += 15;
    } else {
      suggestions.push('Use more bullet points to improve readability and ATS parsing');
      atsIssues.push('Limited use of bullet points');
    }

    // Check for ATS-unfriendly elements
    if (resumeText.includes('|') || resumeText.includes('│')) {
      atsIssues.push('Contains pipe characters which may confuse some ATS systems');
    }
    if (/[^\x00-\x7F]/.test(resumeText) && !/[•\-►▪]/.test(resumeText)) {
      atsIssues.push('Contains special characters that may not parse correctly');
    }

    // ===== JOB DESCRIPTION MATCHING =====
    let jobMatchPercentage: number | undefined;
    let matchedKeywords: string[] = [];

    if (jobDescription && jobDescription.length > 50) {
      const stopWords = new Set(['with', 'that', 'this', 'from', 'have', 'will', 'your', 'they', 'been', 'more', 'when', 'very', 'some', 'what', 'about', 'which', 'would', 'there', 'their', 'could', 'other', 'into', 'than', 'only', 'also', 'just', 'should', 'these', 'such', 'both', 'each', 'through']);

      const jobKeywords = jobLower.match(/\b[a-z]{4,}\b/g) || [];
      const uniqueJobKeywords = [...new Set(jobKeywords)].filter(kw => !stopWords.has(kw));

      matchedKeywords = uniqueJobKeywords.filter(keyword => textLower.includes(keyword));
      const unmatchedKeywords = uniqueJobKeywords.filter(keyword => !textLower.includes(keyword) && keyword.length > 5);

      jobMatchPercentage = uniqueJobKeywords.length > 0
        ? Math.round((matchedKeywords.length / uniqueJobKeywords.length) * 100)
        : 0;

      keywordScore = jobMatchPercentage;

      if (jobMatchPercentage >= 70) {
        strongPoints.push(`Excellent job description match (${jobMatchPercentage}%)`);
      } else if (jobMatchPercentage >= 50) {
        strongPoints.push(`Good job description match (${jobMatchPercentage}%)`);
        suggestions.push('Consider adding more keywords from the job description');
      } else {
        suggestions.push('Your resume has low keyword match with the job description');
        atsIssues.push('Low keyword match may result in ATS rejection');
      }

      // Add top missing keywords
      missingKeywords.push(...unmatchedKeywords.slice(0, 10));
    } else {
      keywordScore = 50; // Default if no job description
    }

    // ===== CALCULATE FINAL SCORES =====
    const overallScore = Math.min(Math.round(
      (contactScore * 0.15) +
      (sectionScore * 0.20) +
      (experienceScore * 0.25) +
      (skillsScore * 0.15) +
      (formatScore * 0.10) +
      (keywordScore * 0.15)
    ), 100);

    const finalKeywordMatch = jobMatchPercentage ?? Math.min(skillsScore + 10, 100);
    const finalFormatScore = Math.min(formatScore + (bulletPointCount >= 10 ? 20 : 0), 100);
    const readabilityScore = Math.min(
      (averageBulletLength >= 8 && averageBulletLength <= 20 ? 30 : 15) +
      (wordCount >= 300 && wordCount <= 800 ? 30 : 15) +
      (bulletPointCount >= 10 ? 30 : 15) +
      (sectionsFound.length >= 4 ? 10 : 5),
      100
    );

    // Determine overall reason
    let reason: string;
    if (overallScore >= 80) {
      reason = 'Excellent resume! Well-structured with strong content and good ATS compatibility';
    } else if (overallScore >= 65) {
      reason = 'Good resume with solid foundation. Minor improvements could boost your ATS score';
    } else if (overallScore >= 50) {
      reason = 'Decent resume but needs improvement in several areas for better ATS performance';
    } else {
      reason = 'Resume needs significant improvements for ATS compatibility and recruiter appeal';
    }

    // Build detailed analysis
    const details: ResumeAnalysisDetails = {
      contactInfo,
      sectionsFound,
      sectionsMissing,
      skillsFound,
      technicalSkills,
      softSkills,
      experienceCount,
      hasQuantifiedAchievements,
      actionVerbsUsed: actionVerbsUsed.slice(0, 10),
      educationCount,
      wordCount,
      bulletPointCount,
      averageBulletLength,
      atsIssues,
      jobMatchPercentage,
      matchedKeywords: matchedKeywords.slice(0, 15),
    };

    return {
      success: true,
      data: {
        score: Math.round(overallScore / 10),
        reason,
        overallScore,
        keywordMatch: finalKeywordMatch,
        formatScore: finalFormatScore,
        readabilityScore,
        suggestions: suggestions.slice(0, 8),
        missingKeywords: missingKeywords.slice(0, 10),
        strongPoints: strongPoints.slice(0, 8),
        details,
      },
    };
  }

  private getMockScore(jobDescription?: string): ResumeScoreResult {
    const baseScore = 65 + Math.floor(Math.random() * 20);

    return {
      success: true,
      data: {
        score: Math.round(baseScore / 10),
        reason: 'Resume demonstrates solid professional experience with relevant skills',
        overallScore: baseScore,
        keywordMatch: baseScore + 5,
        formatScore: baseScore + 10,
        readabilityScore: baseScore + 8,
        suggestions: [
          'Consider adding more specific achievements',
          'Include metrics to quantify your impact',
          'Add relevant certifications if available',
        ],
        missingKeywords: jobDescription
          ? ['leadership', 'team collaboration', 'project management']
          : [],
        strongPoints: [
          'Clear section organization',
          'Professional formatting',
          'Relevant experience highlighted',
        ],
      },
    };
  }

  // ===== RESUME STORAGE METHODS =====

  async saveResume(studentId: number, dto: SaveResumeDto): Promise<StudentResume> {
    // Check if resume exists
    let resume = await this.resumeRepo.findOne({ where: { studentId } });

    if (resume) {
      // Update existing
      resume.resumeData = dto.resumeData;
      resume.templateUsed = dto.templateUsed || resume.templateUsed;
      resume.version += 1;
    } else {
      // Create new
      resume = this.resumeRepo.create({
        studentId,
        resumeData: dto.resumeData,
        templateUsed: dto.templateUsed || 'modern',
        isSubmitted: false,
      });
    }

    return await this.resumeRepo.save(resume);
  }

  async submitResume(studentId: number): Promise<StudentResume> {
    const resume = await this.resumeRepo.findOne({ where: { studentId } });

    if (!resume) {
      throw new NotFoundException('Resume not found. Please save your resume first.');
    }

    resume.isSubmitted = true;
    resume.submittedAt = new Date();

    return await this.resumeRepo.save(resume);
  }

  async getResume(studentId: number): Promise<StudentResume | null> {
    return await this.resumeRepo.findOne({ where: { studentId } });
  }

  async analyzeStoredResume(studentId: number, jobDescription?: string): Promise<ResumeScoreResult> {
    const resume = await this.getResume(studentId);

    if (!resume) {
      throw new NotFoundException('No resume found in database. Please add resume data first.');
    }

    // Convert resumeData to text format
    const resumeText = this.convertResumeDataToText(resume.resumeData);

    // Use existing analysis method
    const analysis = await this.analyzeResumeText(resumeText, jobDescription);

    return analysis;
  }

  private convertResumeDataToText(resumeData: any): string {
    const sections: string[] = [];

    // Personal Info
    if (resumeData.personalInfo) {
      const pi = resumeData.personalInfo;
      sections.push(`${pi.fullName}`);
      sections.push(`${pi.email} | ${pi.phone} | ${pi.location}`);
      if (pi.linkedin) sections.push(`LinkedIn: ${pi.linkedin}`);
      if (pi.github) sections.push(`GitHub: ${pi.github}`);
      if (pi.portfolio) sections.push(`Portfolio: ${pi.portfolio}`);
    }

    // Summary
    if (resumeData.summary?.summary) {
      sections.push(`\nPROFESSIONAL SUMMARY\n${resumeData.summary.summary}`);
    }

    // Education
    if (resumeData.education?.length > 0) {
      sections.push('\nEDUCATION');
      resumeData.education.forEach((edu: any) => {
        sections.push(`${edu.degree} in ${edu.fieldOfStudy}`);
        sections.push(`${edu.institution} | ${edu.startDate} - ${edu.isCurrently ? 'Present' : edu.endDate}`);
        if (edu.gpa) sections.push(`GPA: ${edu.gpa}`);
      });
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      sections.push('\nWORK EXPERIENCE');
      resumeData.experience.forEach((exp: any) => {
        sections.push(`${exp.jobTitle} at ${exp.company}`);
        sections.push(`${exp.location} | ${exp.startDate} - ${exp.isCurrently ? 'Present' : exp.endDate}`);
        if (exp.description?.length > 0) {
          exp.description.forEach((desc: string) => sections.push(`• ${desc}`));
        }
      });
    }

    // Projects
    if (resumeData.projects?.length > 0) {
      sections.push('\nPROJECTS');
      resumeData.projects.forEach((proj: any) => {
        sections.push(`${proj.name}`);
        sections.push(proj.description);
        if (proj.technologies?.length > 0) {
          sections.push(`Technologies: ${proj.technologies.join(', ')}`);
        }
        if (proj.url) sections.push(`URL: ${proj.url}`);
      });
    }

    // Skills
    if (resumeData.skills?.length > 0) {
      sections.push('\nSKILLS');
      const skillsByCategory: Record<string, string[]> = {};
      resumeData.skills.forEach((skill: any) => {
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
    if (resumeData.certifications?.length > 0) {
      sections.push('\nCERTIFICATIONS');
      resumeData.certifications.forEach((cert: any) => {
        sections.push(`${cert.name} - ${cert.issuingOrganization} (${cert.issueDate})`);
        if (cert.credentialId) sections.push(`Credential ID: ${cert.credentialId}`);
      });
    }

    // Awards
    if (resumeData.awards?.length > 0) {
      sections.push('\nAWARDS & HONORS');
      resumeData.awards.forEach((award: any) => {
        sections.push(`${award.title} - ${award.organization} (${award.date})`);
        if (award.description) sections.push(award.description);
      });
    }

    // Extracurriculars
    if (resumeData.extracurriculars?.length > 0) {
      sections.push('\nEXTRACURRICULAR ACTIVITIES');
      resumeData.extracurriculars.forEach((activity: any) => {
        sections.push(`${activity.activityName} - ${activity.organization}`);
        sections.push(`${activity.role} | ${activity.startDate} - ${activity.isCurrently ? 'Present' : activity.endDate}`);
        if (activity.description) sections.push(activity.description);
      });
    }

    return sections.join('\n');
  }
}
