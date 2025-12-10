-- Migration: Create subjects table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates a standalone subjects table (not tied to semesters or programs)

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Subject name (e.g., Data Structures and Algorithms)',
  `code` VARCHAR(50) NOT NULL COMMENT 'Subject code (e.g., CS201)',
  `credits` INT NOT NULL DEFAULT 3 COMMENT 'Credit hours for the subject',
  `description` TEXT NULL COMMENT 'Detailed description of the subject',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Whether subject is active/available',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_code` (`code`),
  INDEX `idx_name` (`name`(50)),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Standalone subjects table for curriculum content';
