-- Create teacher_publications table
CREATE TABLE IF NOT EXISTS `teacher_publications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` BIGINT UNSIGNED NOT NULL,
  `publication_title` VARCHAR(500) NOT NULL,
  `journal_conference_name` VARCHAR(300) NOT NULL,
  `publication_date` DATE NOT NULL,
  `status` ENUM('Published', 'Under Review', 'In Progress', 'Rejected') NOT NULL DEFAULT 'In Progress',
  `co_authors` TEXT NULL,
  `publication_url` VARCHAR(1024) NULL,
  `citations_count` INT NOT NULL DEFAULT 0,
  `impact_factor` DECIMAL(5,2) NULL,
  `doi` VARCHAR(100) NULL,
  `isbn_issn` VARCHAR(50) NULL,
  `volume_number` VARCHAR(20) NULL,
  `issue_number` VARCHAR(20) NULL,
  `page_numbers` VARCHAR(50) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_teacher_id` (`teacher_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_publication_date` (`publication_date`),
  INDEX `idx_teacher_status` (`teacher_id`, `status`),
  CONSTRAINT `fk_publications_teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `teacher_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores research publications and scholarly work for teachers';
