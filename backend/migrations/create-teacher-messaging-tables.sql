-- Migration: Create Teacher Messaging Tables
-- Description: Creates tables for teacher-student messaging feature
-- Date: 2025-12-10

-- Table: teacher_conversations
CREATE TABLE IF NOT EXISTS `teacher_conversations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NULL,
  `last_message_at` TIMESTAMP NULL,
  `is_archived` TINYINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_teacher_conversations_teacher_id` (`teacher_id`),
  INDEX `idx_teacher_conversations_last_message_at` (`last_message_at`),
  CONSTRAINT `fk_teacher_conversations_teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `teacher_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: teacher_conversation_participants
CREATE TABLE IF NOT EXISTS `teacher_conversation_participants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conversation_participants_conversation_id` (`conversation_id`),
  INDEX `idx_conversation_participants_student_id` (`student_id`),
  UNIQUE KEY `unique_conversation_participant` (`conversation_id`, `student_id`),
  CONSTRAINT `fk_conversation_participants_conversation`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `teacher_conversations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_conversation_participants_student`
    FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: teacher_messages
CREATE TABLE IF NOT EXISTS `teacher_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT UNSIGNED NOT NULL,
  `sender_type` ENUM('teacher', 'student') NOT NULL,
  `sender_teacher_id` BIGINT UNSIGNED NULL,
  `sender_student_id` BIGINT UNSIGNED NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_teacher_messages_conversation_id` (`conversation_id`),
  INDEX `idx_teacher_messages_created_at` (`created_at`),
  INDEX `idx_teacher_messages_sender_teacher` (`sender_teacher_id`),
  INDEX `idx_teacher_messages_sender_student` (`sender_student_id`),
  CONSTRAINT `fk_teacher_messages_conversation`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `teacher_conversations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_messages_teacher`
    FOREIGN KEY (`sender_teacher_id`)
    REFERENCES `teacher_users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_messages_student`
    FOREIGN KEY (`sender_student_id`)
    REFERENCES `student_users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
