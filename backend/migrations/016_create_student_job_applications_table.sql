CREATE TABLE IF NOT EXISTS `student_job_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `company_logo` VARCHAR(1024) DEFAULT NULL,
  `position` VARCHAR(255) NOT NULL,
  `application_date` DATE NOT NULL,
  `status` ENUM('applied', 'in-progress', 'offer-received', 'interview-scheduled', 'rejected', 'not-applied') NOT NULL DEFAULT 'applied',
  `job_type` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `salary` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `job_url` VARCHAR(1024) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `interview_date` DATETIME DEFAULT NULL,
  `offer_deadline` DATE DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_application_date` (`application_date`),
  CONSTRAINT `fk_student_job_application_student`
    FOREIGN KEY (`student_id`)
    REFERENCES `student_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
