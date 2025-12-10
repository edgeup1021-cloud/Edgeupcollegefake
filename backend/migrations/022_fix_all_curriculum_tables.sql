-- Migration: Fix all curriculum tables with proper order
-- Database: edgeup_super_admin
-- Description: Drop all tables in correct order and recreate with simplified structure

USE edgeup_super_admin;

-- Drop tables in reverse order of dependencies (children first, then parents)

-- Drop subtopics (child of topics)
DROP TABLE IF EXISTS `subtopics`;

-- Drop topics (child of subjects)
DROP TABLE IF EXISTS `topics`;

-- Drop subjects (child of courses, if it has FK)
DROP TABLE IF EXISTS `subjects`;

-- Drop courses (parent table)
DROP TABLE IF EXISTS `courses`;

-- Now recreate all tables with simplified structure

-- Create courses table
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

-- Create subjects table (standalone, no foreign key to courses)
CREATE TABLE `subjects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Subject name',
  `code` VARCHAR(50) NOT NULL COMMENT 'Unique subject code (e.g., CS101)',
  `credits` INT NOT NULL DEFAULT 3 COMMENT 'Credit hours for this subject',
  `description` TEXT NULL COMMENT 'Brief description of the subject',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Whether subject is currently active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_code` (`code`),
  INDEX `idx_name` (`name`(50)),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Subjects/courses that can be taught';

-- Create topics table
CREATE TABLE `topics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id` BIGINT UNSIGNED NOT NULL COMMENT 'Reference to parent subject',
  `name` VARCHAR(255) NOT NULL COMMENT 'Topic name',
  `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Display order within the subject',
  `description` TEXT NULL COMMENT 'Brief description of the topic',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subject_id` (`subject_id`),
  INDEX `idx_order` (`order_index`),
  CONSTRAINT `fk_topics_subject` FOREIGN KEY (`subject_id`)
    REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Topics within a subject';

-- Create subtopics table
CREATE TABLE `subtopics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_id` BIGINT UNSIGNED NOT NULL COMMENT 'Reference to parent topic',
  `name` VARCHAR(255) NOT NULL COMMENT 'Subtopic name',
  `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Display order within the topic',
  `content` TEXT NULL COMMENT 'Detailed content or notes for this subtopic',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_topic_id` (`topic_id`),
  INDEX `idx_order` (`order_index`),
  CONSTRAINT `fk_subtopics_topic` FOREIGN KEY (`topic_id`)
    REFERENCES `topics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Subtopics within a topic for detailed curriculum breakdown';
