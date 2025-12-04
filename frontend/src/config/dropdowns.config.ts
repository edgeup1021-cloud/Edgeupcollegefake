/**
 * dropdowns.config.ts - Centralized Dropdown Configuration
 *
 * This file contains all dropdown options used across the application.
 * Update values here to reflect changes across all forms and pages.
 */

// Academic Programs
export const PROGRAMS = [
  "CSE - Computer Science and Engineering",
  "ECE - Electronics and Communication Engineering",
  "EEE - Electrical and Electronics Engineering",
  "MECH - Mechanical Engineering",
  "CIVIL - Civil Engineering",
  "IT - Information Technology",
  "AI&DS - Artificial Intelligence and Data Science",
  "CYBER - Cyber Security",
  "AERO - Aeronautical Engineering",
  "AUTO - Automobile Engineering",
  "CHEM - Chemical Engineering",
  "BIOTECH - Biotechnology",
  "BME - Biomedical Engineering",
  "TEXTILE - Textile Engineering",
  "FOOD - Food Technology",
  "AGRI - Agricultural Engineering"
] as const;

// Academic Batches (Years)
export const BATCHES = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020"
] as const;

// Class Sections
export const SECTIONS = [
  "A",
  "B",
  "C",
  "D",
  "E"
] as const;

// Subjects
export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Web Development",
  "Machine Learning",
  "Artificial Intelligence"
] as const;

// Assignment/Task Types
export const TASK_TYPES = [
  "Assignment",
  "Project",
  "Homework",
  "Lab"
] as const;

// Priority Levels
export const PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH"
] as const;

// Helper function to extract program code from full program string
export function getProgramCode(fullProgram: string): string {
  return fullProgram.split(' - ')[0];
}

// Helper function to get full program name from code
export function getFullProgramName(code: string): string {
  const program = PROGRAMS.find(p => p.startsWith(code));
  return program || code;
}

// Type exports for TypeScript
export type Program = typeof PROGRAMS[number];
export type Batch = typeof BATCHES[number];
export type Section = typeof SECTIONS[number];
export type Subject = typeof SUBJECTS[number];
export type TaskType = typeof TASK_TYPES[number];
export type Priority = typeof PRIORITIES[number];
