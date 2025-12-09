-- Migration: Create program_semesters table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the program_semesters table for managing semesters within programs

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `program_semesters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `program_id` BIGINT UNSIGNED NOT NULL,
  `semester_number` INT NOT NULL COMMENT '1-8',
  `academic_year` VARCHAR(20) NULL COMMENT 'e.g., 2024-2025',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_program_id` (`program_id`),
  INDEX `idx_semester_number` (`semester_number`),
  INDEX `idx_is_active` (`is_active`),
  UNIQUE KEY `unique_program_semester` (`program_id`, `semester_number`),
  CONSTRAINT `fk_program_semesters_program` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
