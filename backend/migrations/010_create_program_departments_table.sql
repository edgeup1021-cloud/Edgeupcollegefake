-- Migration: Create program_departments table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the program_departments table for managing departments within programs

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `program_departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `program_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_program_id` (`program_id`),
  INDEX `idx_code` (`code`),
  INDEX `idx_is_active` (`is_active`),
  UNIQUE KEY `unique_program_code` (`program_id`, `code`),
  CONSTRAINT `fk_program_departments_program` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
