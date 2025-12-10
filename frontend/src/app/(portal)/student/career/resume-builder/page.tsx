"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Certificate,
  Trophy,
  Users,
  FileText,
  Download,
  Eye,
  Sparkle,
  ChartBar,
  Plus,
  Trash,
  CaretRight,
  CaretDown,
  CheckCircle,
  Circle,
  LinkedinLogo,
  GithubLogo,
  Globe,
  EnvelopeSimple,
  Phone,
  MapPin,
  X,
  PencilSimple,
  MagicWand,
  Target,
  Lightning,
  type Icon,
} from "@phosphor-icons/react";
import type {
  ResumeData,
  ResumeSection,
  ResumeTemplate,
  Education,
  Experience,
  Project,
  Skill,
  Certification,
  Award,
  Extracurricular,
  ATSScore,
} from "@/types/resume.types";
import { defaultResumeData, sectionLabels, templateLabels } from "@/types/resume.types";
import { magicalAPIService } from "@/services/magical-api.service";
import resumeService from "@/services/resume.service";

const sectionIcons: Record<ResumeSection, Icon> = {
  personal: User,
  summary: FileText,
  education: GraduationCap,
  experience: Briefcase,
  projects: Code,
  skills: Lightning,
  certifications: Certificate,
  awards: Trophy,
  extracurriculars: Users,
};

const sections: ResumeSection[] = [
  "personal",
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "awards",
  "extracurriculars",
];

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<ResumeSection>("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("modern");
  const [showPreview, setShowPreview] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  // New state for navigation and database integration
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<number | null>(null);

  // Load resume from database on mount
  useEffect(() => {
    const loadResumeFromDB = async () => {
      try {
        const savedResume = await resumeService.getResume();
        if (savedResume) {
          setResumeData(savedResume.resumeData as ResumeData);
          setIsSubmitted(savedResume.isSubmitted);
          setSavedResumeId(savedResume.id);
          setSelectedTemplate(savedResume.templateUsed as ResumeTemplate);
        } else {
          // Fall back to localStorage if no DB resume exists
          const saved = localStorage.getItem("resumeData");
          if (saved) {
            try {
              setResumeData(JSON.parse(saved));
            } catch (e) {
              console.error("Failed to load saved resume from localStorage", e);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load resume from database:', error);
        // Fall back to localStorage on error
        const saved = localStorage.getItem("resumeData");
        if (saved) {
          try {
            setResumeData(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to load saved resume from localStorage", e);
          }
        }
      }
    };

    loadResumeFromDB();
  }, []);

  // Auto-save resume to localStorage and database
  useEffect(() => {
    // Save to localStorage (immediate)
    localStorage.setItem("resumeData", JSON.stringify(resumeData));

    // Debounced save to database
    const timer = setTimeout(async () => {
      try {
        if (savedResumeId) {
          // Update existing
          await resumeService.updateResume(resumeData, selectedTemplate);
        } else {
          // Create new
          const saved = await resumeService.saveResume(resumeData, selectedTemplate);
          setSavedResumeId(saved.id);
        }
      } catch (error) {
        console.error('Auto-save to database failed:', error);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [resumeData, selectedTemplate, savedResumeId]);

  // Calculate completion percentage
  const calculateCompletion = (): number => {
    let completed = 0;
    let total = 9;

    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary.summary) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.experience.length > 0) completed++;
    if (resumeData.projects.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.certifications.length > 0) completed++;
    if (resumeData.awards.length > 0) completed++;
    if (resumeData.extracurriculars.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  // Analyze ATS Score (used for manual re-analysis in modal)
  const analyzeResume = async () => {
    setIsAnalyzing(true);

    try {
      let result: any;

      if (isSubmitted && savedResumeId) {
        // Use database version if submitted
        result = await resumeService.analyzeStoredResume(jobDescription);
      } else {
        // Use in-memory version if not submitted yet
        result = await magicalAPIService.analyzeATS(resumeData, jobDescription);
      }

      setIsAnalyzing(false);

      if (result.success && result.data) {
        setAtsScore(result.data);
      } else {
        alert(result.error || 'Failed to analyze resume');
      }
    } catch (error: any) {
      setIsAnalyzing(false);
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume');
    }
  };

  // Handle analyzing stored resume from database
  const handleAnalyzeStoredResume = async () => {
    if (!isSubmitted) {
      alert('Please submit your resume first before analyzing it.');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Calling analyzeStoredResume with jobDescription:', jobDescription);
      const result = await resumeService.analyzeStoredResume(jobDescription);
      console.log('Analysis result:', result);
      console.log('result.success:', result.success);
      console.log('result.data:', result.data);

      if (result.success && result.data) {
        console.log('Setting ATS score to:', result.data);
        setAtsScore(result.data);
        console.log('ATS score set successfully');
      } else {
        console.error('Analysis failed - success or data missing:', result);
        alert(result.error || 'Failed to analyze resume');
      }
    } catch (error: any) {
      console.error('ATS analysis failed:', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || error.message || 'Failed to analyze resume from database');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Navigation functions
  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setActiveSection(sections[nextIndex] as ResumeSection);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      const prevIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(prevIndex);
      setActiveSection(sections[prevIndex] as ResumeSection);
    }
  };

  // Sync currentSectionIndex when activeSection changes via sidebar
  useEffect(() => {
    const index = sections.indexOf(activeSection);
    if (index !== -1) {
      setCurrentSectionIndex(index);
    }
  }, [activeSection]);

  // Submit handler (first time)
  const handleSubmit = async () => {
    // Validate required fields
    const { personalInfo } = resumeData;
    if (!personalInfo.fullName || !personalInfo.email || !personalInfo.phone) {
      alert('Please fill in all required fields: Name, Email, and Phone');
      return;
    }

    setIsSaving(true);
    try {
      // First save the latest data
      if (savedResumeId) {
        await resumeService.updateResume(resumeData, selectedTemplate);
      } else {
        const saved = await resumeService.saveResume(resumeData, selectedTemplate);
        setSavedResumeId(saved.id);
      }

      // Then submit
      await resumeService.submitResume();
      setIsSubmitted(true);

      alert('Resume submitted successfully! You can now analyze it with ATS scoring.');
    } catch (error: any) {
      console.error('Submit failed:', error);
      alert(error.response?.data?.message || 'Failed to submit resume');
    } finally {
      setIsSaving(false);
    }
  };

  // Save handler (after submission)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await resumeService.updateResume(resumeData, selectedTemplate);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  // NavigationButtons Component
  const NavigationButtons = () => {
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === sections.length - 1;

    return (
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
        {/* Previous Button */}
        <button
          onClick={goToPreviousSection}
          disabled={isFirstSection}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            isFirstSection
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Next or Submit/Save Button */}
        {!isLastSection ? (
          <button
            onClick={goToNextSection}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          // Show Submit or Save button on last section
          <button
            onClick={isSubmitted ? handleSave : handleSubmit}
            disabled={isSaving}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all ${
              isSaving
                ? 'bg-gray-600 cursor-wait'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                {isSubmitted ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Resume
                  </>
                )}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // Helper to format date for resume
  const formatDateForPDF = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  // Generate resume HTML from data (works in both edit and preview mode)
  const generateResumeHTML = () => {
    const { personalInfo, summary, education, experience, projects, skills, certifications, awards } = resumeData;

    let html = `
      <header>
        <h1>${personalInfo.fullName || 'Your Name'}</h1>
        <div class="contact-info">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>|</span><span>${personalInfo.phone}</span>` : ''}
          ${personalInfo.location ? `<span>|</span><span>${personalInfo.location}</span>` : ''}
        </div>
        <div class="links">
          ${personalInfo.linkedIn ? `<span>${personalInfo.linkedIn}</span>` : ''}
          ${personalInfo.github ? `<span>${personalInfo.github}</span>` : ''}
          ${personalInfo.portfolio ? `<span>${personalInfo.portfolio}</span>` : ''}
        </div>
      </header>
    `;

    if (summary.summary) {
      html += `
        <section>
          <h2>Professional Summary</h2>
          <p>${summary.summary}</p>
        </section>
      `;
    }

    if (education.length > 0) {
      html += `<section><h2>Education</h2>`;
      education.forEach(edu => {
        html += `
          <div class="entry">
            <div class="entry-header">
              <h3>${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
              <span class="date">${formatDateForPDF(edu.startDate)} - ${edu.isCurrently ? 'Present' : formatDateForPDF(edu.endDate)}</span>
            </div>
            <p class="institution">${edu.institution}</p>
            ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    if (experience.length > 0) {
      html += `<section><h2>Work Experience</h2>`;
      experience.forEach(exp => {
        html += `
          <div class="entry">
            <div class="entry-header">
              <h3>${exp.jobTitle}</h3>
              <span class="date">${formatDateForPDF(exp.startDate)} - ${exp.isCurrently ? 'Present' : formatDateForPDF(exp.endDate)}</span>
            </div>
            <p class="company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</p>
            ${exp.description.length > 0 ? `<ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    if (projects.length > 0) {
      html += `<section><h2>Projects</h2>`;
      projects.forEach(proj => {
        html += `
          <div class="entry">
            <h3>${proj.name}</h3>
            <p>${proj.description}</p>
            ${proj.technologies.length > 0 ? `<p class="tech">Technologies: ${proj.technologies.join(', ')}</p>` : ''}
          </div>
        `;
      });
      html += `</section>`;
    }

    if (skills.length > 0) {
      const skillsByCategory: Record<string, string[]> = {};
      skills.forEach(skill => {
        if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
        skillsByCategory[skill.category].push(skill.name);
      });
      html += `<section><h2>Skills</h2><div class="skills-grid">`;
      Object.entries(skillsByCategory).forEach(([category, skillList]) => {
        html += `<p><strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ${skillList.join(', ')}</p>`;
      });
      html += `</div></section>`;
    }

    if (certifications.length > 0) {
      html += `<section><h2>Certifications</h2>`;
      certifications.forEach(cert => {
        html += `<p>${cert.name} - ${cert.issuingOrganization} (${formatDateForPDF(cert.issueDate)})</p>`;
      });
      html += `</section>`;
    }

    if (awards.length > 0) {
      html += `<section><h2>Awards & Honors</h2>`;
      awards.forEach(award => {
        html += `<p><strong>${award.title}</strong> - ${award.organization} (${formatDateForPDF(award.date)})</p>`;
      });
      html += `</section>`;
    }

    return html;
  };

  // Export to PDF using iframe print (works in both edit and preview mode)
  const exportToPDF = () => {
    if (typeof window !== "undefined") {
      // Generate HTML directly from resume data
      const htmlContent = generateResumeHTML();

      // Create hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position: fixed; right: 0; bottom: 0; width: 0; height: 0; border: none;';
      iframe.id = 'resume-print-frame';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        alert('Failed to create print frame');
        document.body.removeChild(iframe);
        return;
      }

      // Write the print document with embedded styles - margins set to 0 to remove browser headers/footers
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            @page {
              size: letter;
              margin: 0;
            }
            @media print {
              html, body {
                width: 8.5in;
                height: 11in;
                margin: 0;
                padding: 0;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              color: #1f2937;
              background: white;
              line-height: 1.4;
              padding: 0.5in;
            }
            header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #374151;
            }
            header h1 {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
            }
            .contact-info, .links {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              gap: 8px;
              font-size: 12px;
              color: #4b5563;
            }
            .links {
              color: #2563eb;
              margin-top: 4px;
            }
            section {
              margin-bottom: 16px;
            }
            section h2 {
              font-size: 14px;
              font-weight: 700;
              color: #111827;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 4px;
              margin-bottom: 10px;
            }
            .entry {
              margin-bottom: 12px;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }
            .entry h3 {
              font-size: 13px;
              font-weight: 600;
              color: #1f2937;
            }
            .date {
              font-size: 11px;
              color: #6b7280;
            }
            .institution, .company {
              font-size: 12px;
              color: #4b5563;
              font-style: italic;
            }
            .tech {
              font-size: 11px;
              color: #6b7280;
              margin-top: 4px;
            }
            section p {
              font-size: 12px;
              color: #374151;
              margin-bottom: 4px;
            }
            ul {
              list-style-type: disc;
              padding-left: 20px;
              margin-top: 6px;
            }
            ul li {
              font-size: 11px;
              color: #374151;
              margin-bottom: 3px;
            }
            .skills-grid p {
              margin-bottom: 4px;
              font-size: 12px;
            }
            .skills-grid strong {
              color: #1f2937;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for content to load, then print
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Print error:', e);
        }
        // Remove iframe after a delay to allow print dialog to complete
        setTimeout(() => {
          const frameToRemove = document.getElementById('resume-print-frame');
          if (frameToRemove) {
            document.body.removeChild(frameToRemove);
          }
        }, 1000);
      }, 300);
    }
  };

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Update handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData((prev) => ({
      ...prev,
      summary: { summary: value },
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: "",
      relevantCoursework: [],
      isCurrently: false,
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrently: false,
      description: [""],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addExperienceBullet = (expId: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId ? { ...exp, description: [...exp.description, ""] } : exp
      ),
    }));
  };

  const updateExperienceBullet = (expId: string, index: number, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId
          ? {
            ...exp,
            description: exp.description.map((d, i) => (i === index ? value : d)),
          }
          : exp
      ),
    }));
  };

  const removeExperienceBullet = (expId: string, index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId
          ? { ...exp, description: exp.description.filter((_, i) => i !== index) }
          : exp
      ),
    }));
  };

  // Project handlers
  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Skill handlers
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: "",
      category: "technical",
      proficiency: "intermediate",
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  // Certification handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialId: "",
      credentialUrl: "",
    };
    setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  };

  const updateCertification = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  // Award handlers
  const addAward = () => {
    const newAward: Award = {
      id: generateId(),
      title: "",
      organization: "",
      date: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      awards: [...prev.awards, newAward],
    }));
  };

  const updateAward = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      awards: prev.awards.map((award) =>
        award.id === id ? { ...award, [field]: value } : award
      ),
    }));
  };

  const removeAward = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      awards: prev.awards.filter((award) => award.id !== id),
    }));
  };

  // Extracurricular handlers
  const addExtracurricular = () => {
    const newExtra: Extracurricular = {
      id: generateId(),
      activity: "",
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, newExtra],
    }));
  };

  const updateExtracurricular = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.map((extra) =>
        extra.id === id ? { ...extra, [field]: value } : extra
      ),
    }));
  };

  const removeExtracurricular = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((extra) => extra.id !== id),
    }));
  };

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <FileText className="w-6 h-6 text-white" weight="duotone" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Resume Builder
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create your professional resume
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Completion Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200 dark:text-gray-600"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={100}
                      strokeDashoffset={100 - completion}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                    {completion}%
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Complete
                </span>
              </div>

              {/* ATS Score Button */}
              <button
                onClick={() => setShowATSModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                <ChartBar className="w-5 h-5" weight="duotone" />
                ATS Score
              </button>

              {/* Preview Button */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                <Eye className="w-5 h-5" weight="duotone" />
                {showPreview ? "Edit" : "Preview"}
              </button>

              {/* Export Button */}
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-colors"
              >
                <Download className="w-5 h-5" weight="duotone" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = sectionIcons[section];
                  const isActive = activeSection === section;
                  const isComplete = (() => {
                    switch (section) {
                      case "personal":
                        return !!(resumeData.personalInfo.fullName && resumeData.personalInfo.email);
                      case "summary":
                        return !!resumeData.summary.summary;
                      case "education":
                        return resumeData.education.length > 0;
                      case "experience":
                        return resumeData.experience.length > 0;
                      case "projects":
                        return resumeData.projects.length > 0;
                      case "skills":
                        return resumeData.skills.length > 0;
                      case "certifications":
                        return resumeData.certifications.length > 0;
                      case "awards":
                        return resumeData.awards.length > 0;
                      case "extracurriculars":
                        return resumeData.extracurriculars.length > 0;
                      default:
                        return false;
                    }
                  })();

                  return (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <Icon className="w-5 h-5" weight={isActive ? "fill" : "duotone"} />
                      <span className="flex-1 text-left text-sm font-medium">
                        {sectionLabels[section]}
                      </span>
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Template Selector */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Template
                </h3>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as ResumeTemplate)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(templateLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showPreview ? (
              /* Preview Panel */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <ResumePreview
                  ref={previewRef}
                  data={resumeData}
                  template={selectedTemplate}
                />
              </div>
            ) : (
              /* Edit Forms */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {/* Personal Info Section */}
                {activeSection === "personal" && (
                  <>
                    <PersonalInfoForm
                      data={resumeData.personalInfo}
                      onChange={updatePersonalInfo}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Summary Section */}
                {activeSection === "summary" && (
                  <>
                    <SummaryForm
                      data={resumeData.summary}
                      onChange={updateSummary}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Education Section */}
                {activeSection === "education" && (
                  <>
                    <EducationForm
                      data={resumeData.education}
                      onAdd={addEducation}
                      onUpdate={updateEducation}
                      onRemove={removeEducation}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Experience Section */}
                {activeSection === "experience" && (
                  <>
                    <ExperienceForm
                      data={resumeData.experience}
                      onAdd={addExperience}
                      onUpdate={updateExperience}
                      onRemove={removeExperience}
                      onAddBullet={addExperienceBullet}
                      onUpdateBullet={updateExperienceBullet}
                      onRemoveBullet={removeExperienceBullet}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Projects Section */}
                {activeSection === "projects" && (
                  <>
                    <ProjectsForm
                      data={resumeData.projects}
                      onAdd={addProject}
                      onUpdate={updateProject}
                      onRemove={removeProject}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Skills Section */}
                {activeSection === "skills" && (
                  <>
                    <SkillsForm
                      data={resumeData.skills}
                      onAdd={addSkill}
                      onUpdate={updateSkill}
                      onRemove={removeSkill}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Certifications Section */}
                {activeSection === "certifications" && (
                  <>
                    <CertificationsForm
                      data={resumeData.certifications}
                      onAdd={addCertification}
                      onUpdate={updateCertification}
                      onRemove={removeCertification}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Awards Section */}
                {activeSection === "awards" && (
                  <>
                    <AwardsForm
                      data={resumeData.awards}
                      onAdd={addAward}
                      onUpdate={updateAward}
                      onRemove={removeAward}
                    />
                    <NavigationButtons />
                  </>
                )}

                {/* Extracurriculars Section */}
                {activeSection === "extracurriculars" && (
                  <>
                    <ExtracurricularsForm
                      data={resumeData.extracurriculars}
                      onAdd={addExtracurricular}
                      onUpdate={updateExtracurricular}
                      onRemove={removeExtracurricular}
                    />
                    <NavigationButtons />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATS Score Modal */}
      {showATSModal && (
        <ATSScoreModal
          score={atsScore}
          onClose={() => setShowATSModal(false)}
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          onAnalyze={analyzeResume}
          onAnalyzeStored={handleAnalyzeStoredResume}
          isAnalyzing={isAnalyzing}
          isSubmitted={isSubmitted}
        />
      )}
    </div>
  );
}

// Personal Info Form Component
function PersonalInfoForm({
  data,
  onChange,
}: {
  data: ResumeData["personalInfo"];
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" weight="duotone" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <div className="relative">
            <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="New York, NY"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn
          </label>
          <div className="relative">
            <LinkedinLogo className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={data.linkedIn}
              onChange={(e) => onChange("linkedIn", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub
          </label>
          <div className="relative">
            <GithubLogo className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={data.github}
              onChange={(e) => onChange("github", e.target.value)}
              placeholder="github.com/johndoe"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Portfolio Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={data.portfolio}
              onChange={(e) => onChange("portfolio", e.target.value)}
              placeholder="johndoe.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Form Component
function SummaryForm({
  data,
  onChange,
}: {
  data: ResumeData["summary"];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" weight="duotone" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Professional Summary
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Write a compelling summary about yourself (2-4 sentences)
        </label>
        <textarea
          value={data.summary}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Results-driven software engineer with 3+ years of experience in full-stack development. Passionate about building scalable web applications and improving user experiences. Skilled in React, Node.js, and cloud technologies."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {data.summary.length}/500 characters
        </p>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <MagicWand className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" weight="duotone" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Pro Tips:
            </p>
            <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
              <li>Start with your professional title or years of experience</li>
              <li>Highlight your key skills and achievements</li>
              <li>Keep it concise and impactful</li>
              <li>Tailor it to the job you&apos;re applying for</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Education Form Component
function EducationForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Education[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Education
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No education added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Education #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(edu.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => onUpdate(edu.id, "institution", e.target.value)}
                    placeholder="University of Example"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => onUpdate(edu.id, "fieldOfStudy", e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => onUpdate(edu.id, "startDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => onUpdate(edu.id, "endDate", e.target.value)}
                    disabled={edu.isCurrently}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.isCurrently}
                      onChange={(e) => onUpdate(edu.id, "isCurrently", e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Currently studying here
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => onUpdate(edu.id, "gpa", e.target.value)}
                    placeholder="3.8/4.0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Experience Form Component
function ExperienceForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet,
}: {
  data: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  onAddBullet: (expId: string) => void;
  onUpdateBullet: (expId: string, index: number, value: string) => void;
  onRemoveBullet: (expId: string, index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Work Experience
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No experience added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Experience #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(exp.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => onUpdate(exp.id, "jobTitle", e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                    placeholder="Tech Company Inc."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => onUpdate(exp.id, "location", e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => onUpdate(exp.id, "startDate", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
                      disabled={exp.isCurrently}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrently}
                      onChange={(e) => onUpdate(exp.id, "isCurrently", e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I currently work here
                    </span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Achievements & Responsibilities
                  </label>
                  <div className="space-y-2">
                    {exp.description.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-2">
                        <span className="mt-3 text-gray-400">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => onUpdateBullet(exp.id, bulletIndex, e.target.value)}
                          placeholder="Describe your achievement or responsibility..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {exp.description.length > 1 && (
                          <button
                            onClick={() => onRemoveBullet(exp.id, bulletIndex)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" weight="bold" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => onAddBullet(exp.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" weight="bold" />
                      Add bullet point
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Projects Form Component
function ProjectsForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Project[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const handleAddTech = (projectId: string) => {
    const tech = techInput[projectId]?.trim();
    if (tech) {
      const project = data.find((p) => p.id === projectId);
      if (project) {
        onUpdate(projectId, "technologies", [...project.technologies, tech]);
        setTechInput((prev) => ({ ...prev, [projectId]: "" }));
      }
    }
  };

  const handleRemoveTech = (projectId: string, techIndex: number) => {
    const project = data.find((p) => p.id === projectId);
    if (project) {
      onUpdate(
        projectId,
        "technologies",
        project.technologies.filter((_, i) => i !== techIndex)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Projects
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No projects added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Project #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(proj.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => onUpdate(proj.id, "name", e.target.value)}
                    placeholder="My Awesome Project"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => onUpdate(proj.id, "description", e.target.value)}
                    rows={3}
                    placeholder="Describe what the project does and your contributions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {proj.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => handleRemoveTech(proj.id, techIndex)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" weight="bold" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput[proj.id] || ""}
                      onChange={(e) =>
                        setTechInput((prev) => ({ ...prev, [proj.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech(proj.id);
                        }
                      }}
                      placeholder="Add technology (press Enter)"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => handleAddTech(proj.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 font-medium text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={proj.liveUrl}
                    onChange={(e) => onUpdate(proj.id, "liveUrl", e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={proj.githubUrl}
                    onChange={(e) => onUpdate(proj.id, "githubUrl", e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Skills Form Component
function SkillsForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Skill[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  const categories = [
    { value: "technical", label: "Technical" },
    { value: "soft", label: "Soft Skills" },
    { value: "language", label: "Languages" },
    { value: "tool", label: "Tools" },
  ];

  const proficiencies = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const groupedSkills = data.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <Lightning className="w-5 h-5 text-yellow-600 dark:text-yellow-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Skills
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Skill
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Lightning className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No skills added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <input
                type="text"
                value={skill.name}
                onChange={(e) => onUpdate(skill.id, "name", e.target.value)}
                placeholder="Skill name"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={skill.category}
                onChange={(e) => onUpdate(skill.id, "category", e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={skill.proficiency}
                onChange={(e) => onUpdate(skill.id, "proficiency", e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {proficiencies.map((prof) => (
                  <option key={prof.value} value={prof.value}>
                    {prof.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onRemove(skill.id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
              >
                <Trash className="w-4 h-4" weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Certifications Form Component
function CertificationsForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Certification[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
            <Certificate className="w-5 h-5 text-teal-600 dark:text-teal-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Certifications
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Certification
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Certificate className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No certifications added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((cert, index) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Certification #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(cert.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => onUpdate(cert.id, "name", e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={cert.issuingOrganization}
                    onChange={(e) => onUpdate(cert.id, "issuingOrganization", e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="month"
                    value={cert.issueDate}
                    onChange={(e) => onUpdate(cert.id, "issueDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={cert.credentialId}
                    onChange={(e) => onUpdate(cert.id, "credentialId", e.target.value)}
                    placeholder="ABC123XYZ"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    value={cert.credentialUrl}
                    onChange={(e) => onUpdate(cert.id, "credentialUrl", e.target.value)}
                    placeholder="https://credential.verify/abc123"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Awards Form Component
function AwardsForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Award[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Awards & Honors
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Award
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No awards added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first award
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((award, index) => (
            <div
              key={award.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Award #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(award.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Award Title *
                  </label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => onUpdate(award.id, "title", e.target.value)}
                    placeholder="Dean's List"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={award.organization}
                    onChange={(e) => onUpdate(award.id, "organization", e.target.value)}
                    placeholder="University of Example"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="month"
                    value={award.date}
                    onChange={(e) => onUpdate(award.id, "date", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={award.description}
                    onChange={(e) => onUpdate(award.id, "description", e.target.value)}
                    placeholder="Brief description..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Extracurriculars Form Component
function ExtracurricularsForm({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Extracurricular[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" weight="duotone" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Extracurricular Activities
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Activity
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" weight="duotone" />
          <p className="text-gray-500 dark:text-gray-400">No activities added yet</p>
          <button
            onClick={onAdd}
            className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Add your first activity
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((extra, index) => (
            <div
              key={extra.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Activity #{index + 1}
                </span>
                <button
                  onClick={() => onRemove(extra.id)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Activity/Club Name *
                  </label>
                  <input
                    type="text"
                    value={extra.activity}
                    onChange={(e) => onUpdate(extra.id, "activity", e.target.value)}
                    placeholder="Debate Club"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={extra.role}
                    onChange={(e) => onUpdate(extra.id, "role", e.target.value)}
                    placeholder="President"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={extra.organization}
                    onChange={(e) => onUpdate(extra.id, "organization", e.target.value)}
                    placeholder="University of Example"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={extra.startDate}
                      onChange={(e) => onUpdate(extra.id, "startDate", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={extra.endDate}
                      onChange={(e) => onUpdate(extra.id, "endDate", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={extra.description}
                    onChange={(e) => onUpdate(extra.id, "description", e.target.value)}
                    rows={2}
                    placeholder="Describe your contributions and achievements..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Resume Preview Component
import { forwardRef } from "react";

const ResumePreview = forwardRef<
  HTMLDivElement,
  { data: ResumeData; template: ResumeTemplate }
>(function ResumePreview({ data, template }, ref) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      ref={ref}
      data-resume-preview="true"
      className={`bg-white text-gray-900 p-8 min-h-[1100px] ${template === "modern"
        ? "font-sans"
        : template === "classic"
          ? "font-serif"
          : "font-sans"
        }`}
      style={{ width: "8.5in", margin: "0 auto" }}
    >
      {/* Header / Personal Info */}
      <header className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-600 mt-1">
          {data.personalInfo.linkedIn && (
            <span>{data.personalInfo.linkedIn}</span>
          )}
          {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
          {data.personalInfo.portfolio && (
            <span>{data.personalInfo.portfolio}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary.summary && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.summary.summary}
          </p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <p>
                    {formatDate(edu.startDate)} - {edu.isCurrently ? "Present" : formatDate(edu.endDate)}
                  </p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            WORK EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company}
                    {exp.location && ` | ${exp.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} - {exp.isCurrently ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              {exp.description.length > 0 && exp.description[0] && (
                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                  {exp.description.filter(Boolean).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            PROJECTS
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                <div className="text-sm text-blue-600 flex gap-2">
                  {proj.liveUrl && <span>Live</span>}
                  {proj.githubUrl && <span>GitHub</span>}
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Technologies:</span>{" "}
                  {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            SKILLS
          </h2>
          <div className="text-sm text-gray-700">
            {["technical", "soft", "tool", "language"].map((category) => {
              const categorySkills = data.skills.filter((s) => s.category === category);
              if (categorySkills.length === 0) return null;
              return (
                <p key={category} className="mb-1">
                  <span className="font-medium capitalize">{category}:</span>{" "}
                  {categorySkills.map((s) => s.name).join(", ")}
                </p>
              );
            })}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">{cert.name}</span>
                <span className="text-sm text-gray-600"> - {cert.issuingOrganization}</span>
              </div>
              <span className="text-sm text-gray-600">{formatDate(cert.issueDate)}</span>
            </div>
          ))}
        </section>
      )}

      {/* Awards */}
      {data.awards.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            AWARDS & HONORS
          </h2>
          {data.awards.map((award) => (
            <div key={award.id} className="mb-2 flex justify-between">
              <div>
                <span className="font-medium text-gray-900">{award.title}</span>
                {award.organization && (
                  <span className="text-sm text-gray-600"> - {award.organization}</span>
                )}
              </div>
              <span className="text-sm text-gray-600">{formatDate(award.date)}</span>
            </div>
          ))}
        </section>
      )}

      {/* Extracurriculars */}
      {data.extracurriculars.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            EXTRACURRICULAR ACTIVITIES
          </h2>
          {data.extracurriculars.map((extra) => (
            <div key={extra.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900">{extra.activity}</span>
                  {extra.role && (
                    <span className="text-sm text-gray-600"> - {extra.role}</span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(extra.startDate)} - {formatDate(extra.endDate) || "Present"}
                </span>
              </div>
              {extra.description && (
                <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
});

// ATS Score Modal Component
function ATSScoreModal({
  score,
  onClose,
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  onAnalyzeStored,
  isAnalyzing,
  isSubmitted,
}: {
  score: ATSScore | null;
  onClose: () => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onAnalyze: () => void;
  onAnalyzeStored: () => void;
  isAnalyzing: boolean;
  isSubmitted: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"built" | "upload">("built");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedScore, setUploadedScore] = useState<ATSScore | null>(null);
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600 dark:text-green-400";
    if (value >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(ext)) {
        setUploadError("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }
      setUploadedFile(file);
      setUploadError(null);
      setUploadedScore(null);
    }
  };

  const handleAnalyzeUpload = async () => {
    if (!uploadedFile) return;

    setIsAnalyzingUpload(true);
    setUploadError(null);

    try {
      const result = await magicalAPIService.analyzeUploadedResume(uploadedFile, jobDescription);
      if (result.success && result.data) {
        setUploadedScore(result.data);
      } else {
        setUploadError(result.error || "Failed to analyze resume");
      }
    } catch (error) {
      setUploadError("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzingUpload(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (!allowedTypes.includes(ext)) {
        setUploadError("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }
      setUploadedFile(file);
      setUploadError(null);
      setUploadedScore(null);
    }
  };

  const currentScore = activeTab === "built" ? score : uploadedScore;

  const [showDetails, setShowDetails] = useState(false);

  const ScoreDisplay = ({ scoreData }: { scoreData: ATSScore }) => (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 relative">
          <svg className="w-32 h-32 transform -rotate-90 absolute">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-600"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={352}
              strokeDashoffset={352 - (352 * scoreData.overallScore) / 100}
              className={getScoreBg(scoreData.overallScore)}
              strokeLinecap="round"
            />
          </svg>
          <span className={`text-4xl font-bold ${getScoreColor(scoreData.overallScore)}`}>
            {scoreData.overallScore}
          </span>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          {scoreData.overallScore >= 80
            ? "Great! Your resume is well-optimized"
            : scoreData.overallScore >= 60
              ? "Good, but there's room for improvement"
              : "Needs improvement for better ATS compatibility"}
        </p>
      </div>

      {/* Sub Scores */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Keywords</p>
          <p className={`text-2xl font-bold ${getScoreColor(scoreData.keywordMatch)}`}>
            {scoreData.keywordMatch}%
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Format</p>
          <p className={`text-2xl font-bold ${getScoreColor(scoreData.formatScore)}`}>
            {scoreData.formatScore}%
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Readability</p>
          <p className={`text-2xl font-bold ${getScoreColor(scoreData.readabilityScore)}`}>
            {scoreData.readabilityScore}%
          </p>
        </div>
      </div>

      {/* Detailed Analysis Toggle */}
      {scoreData.details && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 px-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          {showDetails ? "Hide" : "Show"} Detailed Analysis
          {showDetails ? <CaretDown className="w-4 h-4" /> : <CaretRight className="w-4 h-4" />}
        </button>
      )}

      {/* Detailed Analysis Section */}
      {showDetails && scoreData.details && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          {/* Resume Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Resume Metrics</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Words</p>
                <p className="font-semibold text-gray-900 dark:text-white">{scoreData.details.wordCount}</p>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Bullet Points</p>
                <p className="font-semibold text-gray-900 dark:text-white">{scoreData.details.bulletPointCount}</p>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Experiences</p>
                <p className="font-semibold text-gray-900 dark:text-white">{scoreData.details.experienceCount}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Contact Information</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(scoreData.details.contactInfo).map(([key, value]) => (
                <span
                  key={key}
                  className={`px-2 py-1 text-xs rounded-full ${value
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {value ? "✓" : "✗"} {key.replace(/^has/, "")}
                </span>
              ))}
            </div>
          </div>

          {/* Sections Found */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Sections Detected</h4>
            <div className="flex flex-wrap gap-2">
              {scoreData.details.sectionsFound.map((section, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  ✓ {section}
                </span>
              ))}
              {scoreData.details.sectionsMissing.map((section, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                  ✗ {section}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Skills Found */}
          {scoreData.details.technicalSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Technical Skills ({scoreData.details.technicalSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {scoreData.details.technicalSkills.slice(0, 15).map((skill, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {skill}
                  </span>
                ))}
                {scoreData.details.technicalSkills.length > 15 && (
                  <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full">
                    +{scoreData.details.technicalSkills.length - 15} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {scoreData.details.softSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Soft Skills ({scoreData.details.softSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {scoreData.details.softSkills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Verbs */}
          {scoreData.details.actionVerbsUsed.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Action Verbs Used ({scoreData.details.actionVerbsUsed.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {scoreData.details.actionVerbsUsed.map((verb, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Match */}
          {scoreData.details.jobMatchPercentage !== undefined && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Job Description Match: {scoreData.details.jobMatchPercentage}%
              </h4>
              {scoreData.details.matchedKeywords && scoreData.details.matchedKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {scoreData.details.matchedKeywords.slice(0, 10).map((kw, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ATS Issues */}
          {scoreData.details.atsIssues.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 text-sm">ATS Compatibility Issues</h4>
              <ul className="space-y-1">
                {scoreData.details.atsIssues.map((issue, i) => (
                  <li key={i} className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1">
                    <span>⚠</span> {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantified Achievements */}
          <div className="flex items-center gap-2 text-sm">
            <span className={scoreData.details.hasQuantifiedAchievements ? "text-green-500" : "text-red-500"}>
              {scoreData.details.hasQuantifiedAchievements ? "✓" : "✗"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {scoreData.details.hasQuantifiedAchievements
                ? "Resume includes quantified achievements"
                : "Add quantified achievements (numbers, percentages, metrics)"}
            </span>
          </div>
        </div>
      )}

      {/* Strong Points */}
      {scoreData.strongPoints.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
            Strong Points
          </h3>
          <ul className="space-y-1">
            {scoreData.strongPoints.map((point, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-green-500 mt-1">+</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {scoreData.suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-yellow-500" weight="fill" />
            Suggestions
          </h3>
          <ul className="space-y-1">
            {scoreData.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-yellow-500 mt-1">!</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Keywords */}
      {scoreData.missingKeywords.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" weight="fill" />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {scoreData.missingKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" weight="duotone" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ATS Compatibility Score
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-500" weight="bold" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mt-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("built")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "built"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                Built Resume
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "upload"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                Upload Resume
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === "built" && (
              <>
                {score ? (
                  <>
                    <ScoreDisplay scoreData={score} />

                    {/* Job Description Input */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Paste a job description to compare (Optional)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => onJobDescriptionChange(e.target.value)}
                        rows={4}
                        placeholder="Paste the job description here to get tailored suggestions..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                      />
                      <button
                        onClick={onAnalyze}
                        disabled={isAnalyzing}
                        className="mt-3 w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Re-analyze with Job Description"
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <ChartBar className="w-8 h-8 text-purple-600 dark:text-purple-400" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Ready to Analyze?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                      Get detailed feedback on your resume's ATS compatibility, keyword matching, and formatting.
                    </p>

                    <div className="max-w-md mx-auto">
                      <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Description (Optional)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => onJobDescriptionChange(e.target.value)}
                        rows={3}
                        placeholder="Paste a job description to check keyword matching..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm mb-4"
                      />
                      <button
                        onClick={isSubmitted ? onAnalyzeStored : onAnalyze}
                        disabled={isAnalyzing || (!isSubmitted && !score)}
                        className="w-full px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing Resume...
                          </>
                        ) : (
                          <>
                            <Sparkle className="w-5 h-5" weight="fill" />
                            {isSubmitted ? 'Analyze Stored Resume' : 'Analyze My Resume'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "upload" && (
              <>
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${uploadedFile
                    ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
                    }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-10 h-10 text-green-500" weight="duotone" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadedScore(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileText className="w-12 h-12 mx-auto text-gray-400" weight="duotone" />
                      <div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                        >
                          Click to upload
                        </button>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                    {uploadError}
                  </div>
                )}

                {/* Job Description for Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => onJobDescriptionChange(e.target.value)}
                    rows={4}
                    placeholder="Paste the job description to compare your resume against..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Analyze Button */}
                {uploadedFile && !uploadedScore && (
                  <button
                    onClick={handleAnalyzeUpload}
                    disabled={isAnalyzingUpload}
                    className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnalyzingUpload ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <ChartBar className="w-5 h-5" weight="bold" />
                        Analyze Uploaded Resume
                      </>
                    )}
                  </button>
                )}

                {/* Uploaded Resume Score */}
                {uploadedScore && <ScoreDisplay scoreData={uploadedScore} />}

                {uploadedScore && (
                  <button
                    onClick={() => {
                      setUploadedScore(null);
                      handleAnalyzeUpload();
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                  >
                    Re-analyze with Updated Job Description
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
