-- Migration: Remove credits column from subjects table
-- Database: edgeup_super_admin
-- Description: Drop the credits column as it's no longer needed

USE edgeup_super_admin;

-- Drop the credits column from subjects table
ALTER TABLE `subjects` DROP COLUMN `credits`;
