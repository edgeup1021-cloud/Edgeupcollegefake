-- Session Resources Migration
-- Run this SQL against your MySQL database to create the resources table

CREATE TABLE IF NOT EXISTS `curriculum_session_resources` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` BIGINT UNSIGNED NOT NULL,
  `resource_type` ENUM('YOUTUBE_VIDEO', 'ARTICLE', 'PDF', 'INTERACTIVE_TOOL', 'WEBSITE') NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NULL,
  `url` VARCHAR(2048) NOT NULL,
  `thumbnail_url` VARCHAR(2048) NULL,
  `source_name` VARCHAR(255) NULL COMMENT 'e.g., Khan Academy, MIT OCW, YouTube Channel Name',
  `duration` VARCHAR(50) NULL COMMENT 'For videos: e.g., "12:34"',
  `relevance_score` FLOAT NULL COMMENT 'AI-calculated relevance 0-1',
  `ai_reasoning` TEXT NULL COMMENT 'Why AI suggested this resource',
  `section_type` ENUM('hook', 'core', 'activity', 'application', 'checkpoint', 'close') NULL COMMENT 'Which section this resource is best for',
  `is_free` TINYINT(1) NOT NULL DEFAULT 1,
  `teacher_rating` TINYINT NULL COMMENT '1-5 rating by teacher',
  `teacher_notes` TEXT NULL,
  `is_hidden` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Teacher can hide irrelevant resources',
  `search_query_used` VARCHAR(500) NULL COMMENT 'Original search query',
  `fetched_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_session_resources_session` (`session_id`),
  INDEX `idx_session_resources_type` (`resource_type`),
  INDEX `idx_session_resources_relevance` (`relevance_score` DESC),
  CONSTRAINT `fk_session_resources_session` FOREIGN KEY (`session_id`)
    REFERENCES `curriculum_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
