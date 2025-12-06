-- Migration: Create student library activity tables
-- Description: Creates tables for tracking student bookmarks, downloads, and access logs
-- Date: 2025-12-03

-- Student bookmarks table
CREATE TABLE `student_library_bookmarks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `bookmarked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_resource_bookmark` (`student_id`, `resource_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_bookmarked_at` (`bookmarked_at`),
  CONSTRAINT `fk_bookmark_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmark_resource` FOREIGN KEY (`resource_id`)
    REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Student downloads table
CREATE TABLE `student_library_downloads` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `downloaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_downloaded_at` (`downloaded_at`),
  CONSTRAINT `fk_download_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_download_resource` FOREIGN KEY (`resource_id`)
    REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Student access logs table
CREATE TABLE `student_library_access_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `accessed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_accessed_at` (`accessed_at`),
  CONSTRAINT `fk_access_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_access_resource` FOREIGN KEY (`resource_id`)
    REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
