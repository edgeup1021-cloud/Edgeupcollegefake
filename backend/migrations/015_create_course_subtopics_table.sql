-- Migration: Create course_subtopics table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the course_subtopics table for managing sub-topics within topics

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `course_subtopics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `content` LONGTEXT NULL COMMENT 'Rich text content',
  `duration_minutes` INT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_topic_id` (`topic_id`),
  INDEX `idx_order_index` (`order_index`),
  INDEX `idx_is_active` (`is_active`),
  CONSTRAINT `fk_course_subtopics_topic` FOREIGN KEY (`topic_id`) REFERENCES `course_topics` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
