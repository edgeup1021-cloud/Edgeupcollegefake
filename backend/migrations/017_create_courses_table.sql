-- Migration: Create courses table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates a simplified courses table for curriculum management

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Course/Program name (e.g., Computer Science and Engineering)',
  `description` TEXT NULL COMMENT 'Brief description of the course',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Simplified courses/programs table for curriculum management';
