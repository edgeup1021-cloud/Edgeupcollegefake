-- Migration: Create live classes tables
-- Description: Creates tables for live class scheduling, tracking, and attendance
-- Date: 2025-12-04

-- Live Classes Table
CREATE TABLE `live_classes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `subject` varchar(100) NOT NULL,
  `meet_link` varchar(1024) NOT NULL,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time NOT NULL,
  `duration` int UNSIGNED NOT NULL COMMENT 'Duration in minutes',
  `program` varchar(100) NOT NULL,
  `batch` varchar(100) NOT NULL,
  `section` varchar(50) NOT NULL,
  `status` enum('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_teacher_id` (`teacher_id`),
  KEY `idx_status` (`status`),
  KEY `idx_scheduled_date` (`scheduled_date`),
  KEY `idx_program_batch_section` (`program`, `batch`, `section`),
  CONSTRAINT `fk_live_class_teacher` FOREIGN KEY (`teacher_id`)
    REFERENCES `teacher_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Live Class Attendance Table
CREATE TABLE `live_class_attendance` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `live_class_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `joined_at` timestamp NULL DEFAULT NULL,
  `left_at` timestamp NULL DEFAULT NULL,
  `duration` int UNSIGNED DEFAULT 0 COMMENT 'Duration in minutes',
  `status` enum('PRESENT', 'ABSENT', 'LATE') NOT NULL DEFAULT 'ABSENT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_live_class_student` (`live_class_id`, `student_id`),
  KEY `idx_live_class_id` (`live_class_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_live_attendance_class` FOREIGN KEY (`live_class_id`)
    REFERENCES `live_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_live_attendance_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
