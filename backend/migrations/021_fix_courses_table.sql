-- Migration: Fix courses table structure
-- Database: edgeup_super_admin
-- Description: Drop and recreate courses table with correct simplified structure

USE edgeup_super_admin;

-- Drop the old courses table if it exists
DROP TABLE IF EXISTS `courses`;

-- Create the new simplified courses table
CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Course/Program name (e.g., Computer Science and Engineering)',
  `description` TEXT NULL COMMENT 'Brief description of the course',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Simplified courses/programs table for curriculum management';
