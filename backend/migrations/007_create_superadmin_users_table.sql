-- Migration: Create superadmin_users table in edgeup_super_admin database
-- Database: edgeup_super_admin
-- Description: Creates the superadmin users table with authentication and profile fields

USE edgeup_super_admin;

CREATE TABLE IF NOT EXISTS `superadmin_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'superadmin',
  `department` VARCHAR(100) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login` TIMESTAMP NULL,
  `profile_image` VARCHAR(500) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert a default superadmin user (password: admin123 - change this in production!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO `superadmin_users`
  (`email`, `password`, `first_name`, `last_name`, `role`, `department`)
VALUES
  ('superadmin@edgeup.com', '$2b$10$rRHZ8VZ8VZ8VZ8VZ8VZ8VecY3DqVqVqVqVqVqVqVqVqVqVqVqVqVq', 'Super', 'Admin', 'superadmin', 'System Administration')
ON DUPLICATE KEY UPDATE
  `email` = `email`;

-- Note: The above password hash is a placeholder.
-- You should generate a proper bcrypt hash for your actual password using:
-- bcrypt.hash('your_password', 10)
