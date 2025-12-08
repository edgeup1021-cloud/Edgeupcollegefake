-- ====================================================================
-- Migration: ALTER Existing Course Management Tables
-- Database: edgeup_super_admin
-- Description: Updates existing tables to new schema (preserves data)
-- Use this if tables already exist and you want to keep existing data
-- ====================================================================

USE edgeup_super_admin;

-- ====================================================================
-- Update universities table
-- Remove 'location' column, add 'state_region' column
-- ====================================================================

-- Check if state_region doesn't exist and location does exist, then migrate
ALTER TABLE `universities`
  ADD COLUMN `state_region` VARCHAR(100) NULL COMMENT 'e.g., Tamil Nadu, Karnataka, Maharashtra'
  AFTER `code`;

-- Copy data from location to state_region (if you want to preserve it)
UPDATE `universities` SET `state_region` = `location` WHERE `location` IS NOT NULL;

-- Drop the old location column
ALTER TABLE `universities` DROP COLUMN `location`;

-- Add index on new state_region column
ALTER TABLE `universities` ADD INDEX `idx_universities_state_region` (`state_region`);

-- ====================================================================
-- Update course_types table - Add 'code' column if missing
-- ====================================================================

ALTER TABLE `course_types`
  ADD COLUMN `code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'CORE, ELECT, LAB, etc.'
  AFTER `name`;

-- If you have existing data, you'll need to update the code column manually
-- Example:
-- UPDATE `course_types` SET `code` = 'CORE' WHERE `name` = 'Core';
-- UPDATE `course_types` SET `code` = 'ELECT' WHERE `name` = 'Elective';
-- UPDATE `course_types` SET `code` = 'LAB' WHERE `name` = 'Lab';

-- ====================================================================
-- Update course_subtopics table - Add 'duration_minutes' column if missing
-- ====================================================================

ALTER TABLE `course_subtopics`
  ADD COLUMN `duration_minutes` INT NULL
  AFTER `content`;

-- ====================================================================
-- End of migration
-- ====================================================================
