-- Migration: Create course_topics table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the course_topics table for managing topics within subjects

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `course_topics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subject_id` (`subject_id`),
  INDEX `idx_order_index` (`order_index`),
  INDEX `idx_is_active` (`is_active`),
  CONSTRAINT `fk_course_topics_subject` FOREIGN KEY (`subject_id`) REFERENCES `course_subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
