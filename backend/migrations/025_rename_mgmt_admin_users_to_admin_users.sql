-- Migration: Rename mgmt_admin_users to admin_users
-- Database: edgeup_college
-- Description: Simplifies table naming by removing mgmt_ prefix
-- This table is used for management portal authentication

USE edgeup_college;

-- Check if mgmt_admin_users exists and rename it
-- If it doesn't exist, create the admin_users table from scratch
SET @table_exists = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = 'edgeup_college'
    AND table_name = 'mgmt_admin_users'
);

-- Rename if exists
SET @sql = IF(@table_exists > 0,
    'RENAME TABLE `mgmt_admin_users` TO `admin_users`',
    'SELECT "Table mgmt_admin_users does not exist, skipping rename" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create admin_users table if it doesn't exist (in case mgmt_admin_users didn't exist)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('Principal','Dean','HOD','Finance','Admin','Viewer') DEFAULT 'Admin',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Note: This table will be used for institutional heads authentication
-- when they are assigned to institutions
