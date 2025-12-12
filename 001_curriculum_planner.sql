-- Curriculum Plan Generator Migration
-- Run this SQL against your MySQL database to create the required tables

-- ============================================
-- CURRICULUM COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `curriculum_courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` BIGINT UNSIGNED NOT NULL,
  `course_name` VARCHAR(255) NOT NULL,
  `course_code` VARCHAR(50) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) NULL,
  `total_weeks` INT NOT NULL,
  `hours_per_week` FLOAT NOT NULL,
  `session_duration` INT NOT NULL COMMENT 'Duration in minutes',
  `sessions_per_week` INT NOT NULL,
  `session_type` ENUM('LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR', 'HYBRID', 'WORKSHOP') NOT NULL DEFAULT 'LECTURE',
  `class_size` INT NOT NULL,
  `class_vibe` ENUM('HIGH_ENGAGEMENT', 'MIXED', 'LOW_ENGAGEMENT', 'ADVANCED', 'STRUGGLING') NOT NULL DEFAULT 'MIXED',
  `student_level` VARCHAR(50) NOT NULL DEFAULT 'Undergraduate',
  `outcomes` JSON NOT NULL COMMENT 'Array of learning outcomes',
  `primary_challenge` ENUM('STUDENTS_DISENGAGED', 'TOO_MUCH_CONTENT', 'WEAK_FUNDAMENTALS', 'MIXED_SKILL_LEVELS', 'TIME_MANAGEMENT', 'ASSESSMENT_ALIGNMENT', 'PRACTICAL_APPLICATION') NULL,
  `additional_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_curriculum_courses_teacher` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CURRICULUM PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `curriculum_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
  `macroplan` JSON NOT NULL COMMENT 'Full AI-generated macro plan',
  `teacher_overrides` JSON NULL COMMENT 'Teacher modifications to the plan',
  `generated_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_curriculum_plans_course` (`course_id`),
  UNIQUE KEY `uk_curriculum_plans_course_version` (`course_id`, `version`),
  CONSTRAINT `fk_curriculum_plans_course` FOREIGN KEY (`course_id`)
    REFERENCES `curriculum_courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CURRICULUM SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `curriculum_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curriculum_plan_id` BIGINT UNSIGNED NOT NULL,
  `week_number` INT NOT NULL,
  `session_number` INT NOT NULL,
  `blueprint` JSON NOT NULL COMMENT 'Full session blueprint with sections, scripts, etc.',
  `toolkit` JSON NULL COMMENT 'Engagement toolkit (generated on-demand)',
  `status` ENUM('GENERATED', 'REVIEWED', 'SCHEDULED', 'TAUGHT', 'NEEDS_REVISION') NOT NULL DEFAULT 'GENERATED',
  `teacher_overrides` JSON NULL,
  `generated_at` DATETIME NOT NULL,
  `taught_at` DATETIME NULL,
  `student_feedback` JSON NULL COMMENT 'Aggregated student feedback',
  `checkpoint_results` JSON NULL COMMENT 'Quiz/poll results',
  `teacher_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_curriculum_sessions_plan` (`curriculum_plan_id`),
  UNIQUE KEY `uk_curriculum_sessions_plan_week_session` (`curriculum_plan_id`, `week_number`, `session_number`),
  CONSTRAINT `fk_curriculum_sessions_plan` FOREIGN KEY (`curriculum_plan_id`)
    REFERENCES `curriculum_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CURRICULUM CALENDAR EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `curriculum_calendar_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curriculum_plan_id` BIGINT UNSIGNED NOT NULL,
  `session_id` BIGINT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `event_type` ENUM('SESSION', 'QUIZ', 'ASSIGNMENT_DUE', 'MIDTERM', 'FINAL_EXAM', 'PROJECT_DUE', 'BUFFER', 'REVIEW_SESSION') NOT NULL,
  `start_date_time` DATETIME NOT NULL,
  `end_date_time` DATETIME NOT NULL,
  `synced` TINYINT(1) NOT NULL DEFAULT 0,
  `external_event_id` VARCHAR(255) NULL COMMENT 'ID from external calendar if synced',
  `week_number` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_curriculum_calendar_plan` (`curriculum_plan_id`),
  INDEX `idx_curriculum_calendar_datetime` (`start_date_time`),
  UNIQUE KEY `uk_curriculum_calendar_session` (`session_id`),
  CONSTRAINT `fk_curriculum_calendar_plan` FOREIGN KEY (`curriculum_plan_id`)
    REFERENCES `curriculum_plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_curriculum_calendar_session` FOREIGN KEY (`session_id`)
    REFERENCES `curriculum_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CURRICULUM ADAPTATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `curriculum_adaptations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curriculum_plan_id` BIGINT UNSIGNED NOT NULL,
  `trigger_type` ENUM('LOW_QUIZ_SCORES', 'STUDENT_FEEDBACK', 'PACING_ISSUE', 'TEACHER_REQUEST', 'ATTENDANCE_DROP') NOT NULL,
  `trigger_data` JSON NOT NULL COMMENT 'Data that triggered the adaptation',
  `suggestion` JSON NOT NULL COMMENT 'AI-suggested changes',
  `reasoning` TEXT NOT NULL COMMENT 'AI explanation for suggestions',
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'PARTIALLY_ACCEPTED') NOT NULL DEFAULT 'PENDING',
  `responded_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_curriculum_adaptations_plan` (`curriculum_plan_id`),
  CONSTRAINT `fk_curriculum_adaptations_plan` FOREIGN KEY (`curriculum_plan_id`)
    REFERENCES `curriculum_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- You can uncomment and modify these to insert test data

-- INSERT INTO `curriculum_courses` (teacher_id, course_name, subject, total_weeks, hours_per_week, session_duration, sessions_per_week, class_size, outcomes)
-- VALUES (1, 'Introduction to Machine Learning', 'Computer Science', 16, 4.5, 90, 3, 45, '["Understand ML fundamentals", "Implement basic algorithms", "Apply ML to real problems"]');
