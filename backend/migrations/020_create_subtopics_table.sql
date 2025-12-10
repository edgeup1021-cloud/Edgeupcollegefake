-- Migration: Create subtopics table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates subtopics table for detailed topic breakdown

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `subtopics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_id` BIGINT UNSIGNED NOT NULL COMMENT 'Foreign key to topics table',
  `name` VARCHAR(255) NOT NULL COMMENT 'Subtopic name (e.g., Array Operations)',
  `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Display order within the topic',
  `content` TEXT NULL COMMENT 'Detailed content, learning objectives, or notes',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_topic_id` (`topic_id`),
  INDEX `idx_order_index` (`order_index`),
  INDEX `idx_topic_order` (`topic_id`, `order_index`),
  CONSTRAINT `fk_subtopics_topic` FOREIGN KEY (`topic_id`)
    REFERENCES `topics` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Subtopics providing detailed breakdown of topics';
