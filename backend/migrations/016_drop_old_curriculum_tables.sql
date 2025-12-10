-- Migration: Drop old complex curriculum tables from edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Removes the old complex curriculum structure to make way for simplified design

USE edgeup_super_admin;

-- Drop tables in reverse order of dependencies (children first, then parents)

-- Drop course_subtopics (child of course_topics)
DROP TABLE IF EXISTS `course_subtopics`;

-- Drop course_topics (child of course_subjects)
DROP TABLE IF EXISTS `course_topics`;

-- Drop course_subjects (child of program_semesters and course_types)
DROP TABLE IF EXISTS `course_subjects`;

-- Drop course_types (referenced by course_subjects)
DROP TABLE IF EXISTS `course_types`;

-- Drop program_semesters (child of programs)
DROP TABLE IF EXISTS `program_semesters`;

-- Drop program_departments (child of programs)
DROP TABLE IF EXISTS `program_departments`;

-- Drop programs (child of universities)
DROP TABLE IF EXISTS `programs`;

-- Note: We're keeping the universities table as it may be used for other purposes
