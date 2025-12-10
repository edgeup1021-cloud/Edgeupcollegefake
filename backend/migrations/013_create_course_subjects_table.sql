-- Migration: Create course_subjects table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the course_subjects table for managing subjects/courses

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `course_subjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `semester_id` BIGINT UNSIGNED NOT NULL,
  `type_id` BIGINT UNSIGNED NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `credits` INT NOT NULL DEFAULT 3,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_semester_id` (`semester_id`),
  INDEX `idx_type_id` (`type_id`),
  INDEX `idx_code` (`code`),
  INDEX `idx_is_active` (`is_active`),
  UNIQUE KEY `unique_semester_code` (`semester_id`, `code`),
  CONSTRAINT `fk_course_subjects_semester` FOREIGN KEY (`semester_id`) REFERENCES `program_semesters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_subjects_type` FOREIGN KEY (`type_id`) REFERENCES `course_types` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
