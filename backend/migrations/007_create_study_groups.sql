-- Migration: Create study groups tables
-- Description: Adds tables for study groups, memberships, messages, and teacher moderators
-- Date: 2025-12-04

-- Study Groups Table
CREATE TABLE `study_groups` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `course_offering_id` bigint UNSIGNED DEFAULT NULL,
  `program` varchar(100) DEFAULT NULL,
  `batch` varchar(100) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `join_type` enum('open', 'code', 'approval') NOT NULL DEFAULT 'open',
  `invite_code` varchar(64) DEFAULT NULL,
  `max_members` int UNSIGNED NOT NULL DEFAULT 50,
  `current_members` int UNSIGNED NOT NULL DEFAULT 0,
  `created_by_student_id` bigint UNSIGNED NOT NULL,
  `status` enum('active', 'archived') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_offering` (`course_offering_id`),
  KEY `idx_program_batch_section` (`program`, `batch`, `section`),
  KEY `idx_status` (`status`),
  KEY `idx_join_type` (`join_type`),
  CONSTRAINT `fk_study_group_course_offering` FOREIGN KEY (`course_offering_id`)
    REFERENCES `teacher_course_offerings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_study_group_creator` FOREIGN KEY (`created_by_student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Study Group Members Table
CREATE TABLE `study_group_members` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `role` enum('owner', 'moderator', 'member') NOT NULL DEFAULT 'member',
  `status` enum('joined', 'pending', 'rejected') NOT NULL DEFAULT 'joined',
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_group_member` (`group_id`, `student_id`),
  KEY `idx_group_status` (`group_id`, `status`),
  CONSTRAINT `fk_study_member_group` FOREIGN KEY (`group_id`)
    REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_study_member_student` FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Study Group Messages Table
CREATE TABLE `study_group_messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_id` bigint UNSIGNED NOT NULL,
  `sender_student_id` bigint UNSIGNED DEFAULT NULL,
  `sender_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `message_type` enum('text', 'system') NOT NULL DEFAULT 'text',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_group_created_at` (`group_id`, `created_at`),
  CONSTRAINT `fk_study_message_group` FOREIGN KEY (`group_id`)
    REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_study_message_student` FOREIGN KEY (`sender_student_id`)
    REFERENCES `student_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_study_message_teacher` FOREIGN KEY (`sender_teacher_id`)
    REFERENCES `teacher_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Study Group Teacher Moderators Table
CREATE TABLE `study_group_teacher_moderators` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `group_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `role` enum('moderator', 'owner') NOT NULL DEFAULT 'moderator',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_group_teacher` (`group_id`, `teacher_id`),
  CONSTRAINT `fk_study_teacher_group` FOREIGN KEY (`group_id`)
    REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_study_teacher_teacher` FOREIGN KEY (`teacher_id`)
    REFERENCES `teacher_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
