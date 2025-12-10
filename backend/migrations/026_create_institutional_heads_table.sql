-- Migration: Create institutional_heads table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the institutional heads reference table for managing institutional head profiles
-- These are created before institutions and assigned during institution onboarding

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `institutional_heads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Full name of the institutional head',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email address (used for authentication)',
  `phone` VARCHAR(20) NOT NULL COMMENT 'Contact phone number',
  `address` TEXT NULL COMMENT 'Physical address',
  `admin_user_id` INT NULL COMMENT 'References edgeup_college.admin_users.id (set when assigned)',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_admin_user_id` (`admin_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Reference table for institutional heads - actual auth records created in edgeup_college.admin_users';

-- Note: admin_user_id is populated when the institutional head is assigned to an institution
-- The assignment process creates the corresponding record in edgeup_college.admin_users
