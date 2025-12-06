-- Migration: Create student leave requests table
-- Description: Creates the table for managing student leave requests with approval workflow

CREATE TABLE `student_leave_requests` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED DEFAULT NULL,
  `class_session_id` bigint UNSIGNED DEFAULT NULL,
  `leave_type` enum('Sick Leave','Personal Leave','Family Emergency','Medical Leave','Other') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `supporting_document` varchar(1024) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_course_offering` (`course_offering_id`),
  KEY `idx_status` (`status`),
  KEY `idx_dates` (`start_date`, `end_date`),
  CONSTRAINT `fk_leave_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_leave_course_offering` FOREIGN KEY (`course_offering_id`) REFERENCES `teacher_course_offerings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_leave_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `teacher_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
