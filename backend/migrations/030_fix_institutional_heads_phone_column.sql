-- Migration: Fix institutional_heads phone column to be nullable
-- Database: edgeup_super_admin
-- Description: Changes phone column from NOT NULL to NULL to make it optional

USE edgeup_super_admin;

-- Modify the phone column to be nullable
ALTER TABLE `institutional_heads`
  MODIFY COLUMN `phone` VARCHAR(20) NULL COMMENT 'Contact phone number (optional)';

SELECT 'Phone column updated to be nullable' as message;
