-- Migration: Fix universities table structure
-- Database: edgeup_super_admin
-- Description: Ensures all required columns exist in the universities table

USE edgeup_super_admin;

-- Add location column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'edgeup_super_admin'
    AND table_name = 'universities'
    AND column_name = 'location'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `universities` ADD COLUMN `location` VARCHAR(255) NULL AFTER `code`',
    'SELECT "Column location already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add established_year column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'edgeup_super_admin'
    AND table_name = 'universities'
    AND column_name = 'established_year'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `universities` ADD COLUMN `established_year` INT NULL AFTER `location`',
    'SELECT "Column established_year already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add description column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'edgeup_super_admin'
    AND table_name = 'universities'
    AND column_name = 'description'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `universities` ADD COLUMN `description` TEXT NULL AFTER `established_year`',
    'SELECT "Column description already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add is_active column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = 'edgeup_super_admin'
    AND table_name = 'universities'
    AND column_name = 'is_active'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `universities` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT TRUE AFTER `description`',
    'SELECT "Column is_active already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Display final structure
SELECT 'Universities table structure updated successfully' as message;
