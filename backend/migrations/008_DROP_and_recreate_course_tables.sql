-- ====================================================================
-- Migration: DROP and Recreate Course Management Tables
-- Database: edgeup_super_admin
-- WARNING: This will delete all data in these tables!
-- ====================================================================

USE edgeup_super_admin;

-- Drop tables in reverse order (child tables first due to foreign keys)
DROP TABLE IF EXISTS `course_subtopics`;
DROP TABLE IF EXISTS `course_topics`;
DROP TABLE IF EXISTS `course_subjects`;
DROP TABLE IF EXISTS `course_types`;
DROP TABLE IF EXISTS `program_semesters`;
DROP TABLE IF EXISTS `program_departments`;
DROP TABLE IF EXISTS `programs`;
DROP TABLE IF EXISTS `universities`;

-- ====================================================================
-- Now create tables with new structure
-- ====================================================================

-- ====================================================================
-- Table: universities
-- Description: Stores curriculum/syllabus authorities (Anna University, VTU, etc.)
--              These define the official curricula that colleges/campuses can adopt
-- ====================================================================

CREATE TABLE `universities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'e.g., Anna University, VTU, Mumbai University',
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g., AU, VTU, MU',
  `state_region` VARCHAR(100) NULL COMMENT 'e.g., Tamil Nadu, Karnataka, Maharashtra',
  `established_year` INT NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_universities_code` (`code`),
  INDEX `idx_universities_state_region` (`state_region`),
  INDEX `idx_universities_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: programs
-- Description: Stores degree programs (e.g., BSc CS, BBA, MBA)
-- ====================================================================

CREATE TABLE `programs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `university_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `duration_years` INT NOT NULL DEFAULT 4,
  `degree_type` VARCHAR(50) NULL COMMENT 'BSc, BA, BBA, BTech, MSc, MA, MBA, MTech, PhD, etc.',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_programs_university_id` (`university_id`),
  INDEX `idx_programs_code` (`code`),
  INDEX `idx_programs_is_active` (`is_active`),
  UNIQUE KEY `unique_university_program_code` (`university_id`, `code`),
  CONSTRAINT `fk_programs_university` FOREIGN KEY (`university_id`)
    REFERENCES `universities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: program_departments
-- Description: Stores departments within programs (e.g., Computer Science, Business Administration)
-- ====================================================================

CREATE TABLE `program_departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `program_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_departments_program_id` (`program_id`),
  INDEX `idx_departments_code` (`code`),
  INDEX `idx_departments_is_active` (`is_active`),
  UNIQUE KEY `unique_program_department_code` (`program_id`, `code`),
  CONSTRAINT `fk_program_departments_program` FOREIGN KEY (`program_id`)
    REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: program_semesters
-- Description: Stores semesters within programs (Semester 1-8)
-- ====================================================================

CREATE TABLE `program_semesters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `program_id` BIGINT UNSIGNED NOT NULL,
  `semester_number` INT NOT NULL COMMENT '1-8 or more',
  `academic_year` VARCHAR(20) NULL COMMENT 'e.g., 2024-2025',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_semesters_program_id` (`program_id`),
  INDEX `idx_semesters_semester_number` (`semester_number`),
  INDEX `idx_semesters_is_active` (`is_active`),
  UNIQUE KEY `unique_program_semester` (`program_id`, `semester_number`),
  CONSTRAINT `fk_program_semesters_program` FOREIGN KEY (`program_id`)
    REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: course_types
-- Description: Stores course type definitions (Core, Elective, Lab, etc.)
-- ====================================================================

CREATE TABLE `course_types` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'CORE, ELECT, LAB, etc.',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_type_name` (`name`),
  INDEX `idx_course_types_code` (`code`),
  INDEX `idx_course_types_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: course_subjects
-- Description: Stores subjects/courses (e.g., Data Structures, Marketing)
-- ====================================================================

CREATE TABLE `course_subjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `semester_id` BIGINT UNSIGNED NOT NULL,
  `type_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `credits` INT NOT NULL DEFAULT 3,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subjects_semester_id` (`semester_id`),
  INDEX `idx_subjects_type_id` (`type_id`),
  INDEX `idx_subjects_code` (`code`),
  INDEX `idx_subjects_is_active` (`is_active`),
  UNIQUE KEY `unique_semester_subject_code` (`semester_id`, `code`),
  CONSTRAINT `fk_course_subjects_semester` FOREIGN KEY (`semester_id`)
    REFERENCES `program_semesters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_subjects_type` FOREIGN KEY (`type_id`)
    REFERENCES `course_types` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: course_topics
-- Description: Stores topics within subjects (e.g., Arrays, Sorting Algorithms)
-- ====================================================================

CREATE TABLE `course_topics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_topics_subject_id` (`subject_id`),
  INDEX `idx_topics_order_index` (`order_index`),
  INDEX `idx_topics_is_active` (`is_active`),
  CONSTRAINT `fk_course_topics_subject` FOREIGN KEY (`subject_id`)
    REFERENCES `course_subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- Table: course_subtopics
-- Description: Stores sub-topics within topics (e.g., Dynamic Arrays, Bubble Sort)
-- ====================================================================

CREATE TABLE `course_subtopics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `content` LONGTEXT NULL COMMENT 'Rich text content/notes',
  `duration_minutes` INT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subtopics_topic_id` (`topic_id`),
  INDEX `idx_subtopics_order_index` (`order_index`),
  INDEX `idx_subtopics_is_active` (`is_active`),
  CONSTRAINT `fk_course_subtopics_topic` FOREIGN KEY (`topic_id`)
    REFERENCES `course_topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ====================================================================
-- End of migration
-- ====================================================================
