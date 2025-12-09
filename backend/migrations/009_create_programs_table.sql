-- Migration: Create programs table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the programs table for managing university programs/courses

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `programs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `university_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `duration_years` INT NOT NULL DEFAULT 4,
  `degree_type` VARCHAR(50) NULL COMMENT 'BSc, BA, MSc, MA, MBA, PhD, etc.',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_university_id` (`university_id`),
  INDEX `idx_code` (`code`),
  INDEX `idx_is_active` (`is_active`),
  UNIQUE KEY `unique_university_code` (`university_id`, `code`),
  CONSTRAINT `fk_programs_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
