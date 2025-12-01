-- Migration: Add calendar_events table
-- Date: 2025-12-01
-- Description: Adds the calendar_events table for student timetable/calendar functionality

-- Create calendar_events table
CREATE TABLE `student_calendar_events` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_type` enum('class','test','assignment','holiday','meeting','fair') NOT NULL,
  `event_date` date NOT NULL,
  `event_time` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_date` (`event_date`),
  KEY `idx_student_date` (`student_id`, `event_date`),
  KEY `idx_type` (`event_type`),
  CONSTRAINT `fk_calendar_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
