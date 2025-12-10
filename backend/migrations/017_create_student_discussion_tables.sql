-- Migration: Create student discussion forum tables
-- Description: Adds tables for student discussion posts, comments, and upvotes
-- Date: 2025-12-10

-- Student Discussion Posts Table
CREATE TABLE `student_discussion_posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('question', 'discussion') NOT NULL DEFAULT 'question',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM(
    'Mathematics',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'General Academic',
    'Study Tips',
    'Career Guidance'
  ) NOT NULL,
  `tags` JSON NULL,
  `status` ENUM('active', 'archived', 'flagged') NOT NULL DEFAULT 'active',
  `upvote_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `comment_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_solved` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_type` (`type`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_solved` (`is_solved`),
  CONSTRAINT `fk_discussion_post_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Student Discussion Comments Table
CREATE TABLE `student_discussion_comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `content` TEXT NOT NULL,
  `is_solution` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_discussion_comment_post` FOREIGN KEY (`post_id`)
    REFERENCES `student_discussion_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_discussion_comment_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Student Discussion Upvotes Table
CREATE TABLE `student_discussion_upvotes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_post_student_upvote` (`post_id`, `student_id`),
  CONSTRAINT `fk_discussion_upvote_post` FOREIGN KEY (`post_id`)
    REFERENCES `student_discussion_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_discussion_upvote_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
