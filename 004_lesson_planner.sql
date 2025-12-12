-- Lesson Planner Migration
-- Run this SQL against your MySQL database to create the lesson planner tables

-- ============================================
-- STANDALONE LESSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `standalone_lessons` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` BIGINT UNSIGNED NOT NULL,

  -- Optional link to curriculum session (for "import from curriculum" flow)
  `curriculum_session_id` BIGINT UNSIGNED NULL,

  -- Basic Info
  `title` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `grade_level` VARCHAR(50) NOT NULL COMMENT 'e.g., Grade 9, Undergraduate, etc.',
  `duration` INT NOT NULL COMMENT 'Duration in minutes',

  -- Class Context
  `class_size` INT NULL,
  `class_vibe` ENUM('HIGH_ENGAGEMENT', 'MIXED', 'LOW_ENGAGEMENT', 'ADVANCED', 'STRUGGLING') NULL DEFAULT 'MIXED',

  -- Learning Details
  `learning_objectives` JSON NOT NULL COMMENT 'Array of objectives',
  `prerequisites` JSON NULL COMMENT 'Array of prerequisite knowledge',
  `additional_notes` TEXT NULL,

  -- Generated Content (reuses same structure as curriculum sessions)
  `blueprint` JSON NULL COMMENT 'SessionBlueprint - same structure as curriculum',
  `toolkit` JSON NULL COMMENT 'EngagementToolkit - same structure as curriculum',

  -- Status
  `status` ENUM('DRAFT', 'GENERATED', 'REVIEWED', 'TAUGHT') NOT NULL DEFAULT 'DRAFT',
  `is_substitute_lesson` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Created by substitute teacher',

  -- Scheduling (optional)
  `scheduled_date` DATE NULL,
  `scheduled_time` TIME NULL,

  -- Timestamps
  `generated_at` DATETIME NULL,
  `taught_at` DATETIME NULL,
  `teacher_notes` TEXT NULL,

  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_standalone_lessons_teacher` (`teacher_id`),
  INDEX `idx_standalone_lessons_curriculum_session` (`curriculum_session_id`),
  INDEX `idx_standalone_lessons_status` (`status`),
  INDEX `idx_standalone_lessons_date` (`scheduled_date`),
  INDEX `idx_standalone_lessons_subject` (`subject`),
  CONSTRAINT `fk_standalone_lessons_curriculum_session` FOREIGN KEY (`curriculum_session_id`)
    REFERENCES `curriculum_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- LESSON RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `lesson_resources` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT UNSIGNED NOT NULL,
  `resource_type` ENUM('YOUTUBE_VIDEO', 'ARTICLE', 'PDF', 'PRESENTATION', 'INTERACTIVE_TOOL', 'WEBSITE') NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NULL,
  `url` VARCHAR(2048) NOT NULL,
  `thumbnail_url` VARCHAR(2048) NULL,
  `source_name` VARCHAR(255) NULL COMMENT 'e.g., Khan Academy, YouTube Channel Name',
  `duration` VARCHAR(50) NULL COMMENT 'For videos: e.g., "12:34"',
  `relevance_score` FLOAT NULL COMMENT 'AI-calculated relevance 0-1',
  `ai_reasoning` TEXT NULL COMMENT 'Why AI suggested this resource',
  `section_type` ENUM('hook', 'core', 'activity', 'application', 'checkpoint', 'close') NULL COMMENT 'Which section this resource is best for',
  `is_free` TINYINT(1) NOT NULL DEFAULT 1,
  `teacher_rating` TINYINT NULL COMMENT '1-5 rating by teacher',
  `teacher_notes` TEXT NULL,
  `is_hidden` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Teacher can hide irrelevant resources',
  `fetched_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_lesson_resources_lesson` (`lesson_id`),
  INDEX `idx_lesson_resources_type` (`resource_type`),
  INDEX `idx_lesson_resources_relevance` (`relevance_score` DESC),
  CONSTRAINT `fk_lesson_resources_lesson` FOREIGN KEY (`lesson_id`)
    REFERENCES `standalone_lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
