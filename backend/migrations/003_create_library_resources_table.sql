-- Migration: Create teacher library resources table
-- Description: Creates the table for digital library where teachers upload educational resources
-- Date: 2025-12-03

CREATE TABLE `teacher_library_resources` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uploaded_by` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` enum(
    'Lecture Notes',
    'Textbooks',
    'Research Papers',
    'Lab Manuals',
    'Past Papers',
    'Reference Materials',
    'Study Guides',
    'Other'
  ) NOT NULL,
  `file_url` varchar(1024) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` bigint UNSIGNED DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_category` (`category`),
  KEY `idx_subject` (`subject`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `idx_fulltext_search` (`title`, `description`, `tags`),
  CONSTRAINT `fk_library_teacher` FOREIGN KEY (`uploaded_by`)
    REFERENCES `teacher_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
