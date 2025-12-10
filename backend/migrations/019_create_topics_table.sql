-- Migration: Create topics table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates topics table for organizing subject content

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `topics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to subjects table',
  `name` VARCHAR(255) NOT NULL COMMENT 'Topic name (e.g., Arrays and Lists)',
  `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Display order within the subject',
  `description` TEXT NULL COMMENT 'Brief description of the topic',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subject_id` (`subject_id`),
  INDEX `idx_order_index` (`order_index`),
  INDEX `idx_subject_order` (`subject_id`, `order_index`),
  CONSTRAINT `fk_topics_subject` FOREIGN KEY (`subject_id`)
    REFERENCES `subjects` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Topics belonging to subjects for curriculum organization';
