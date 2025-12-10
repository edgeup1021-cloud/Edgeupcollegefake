-- Migration: Add institutional_head_id to universities table
-- Database: edgeup_super_admin
-- Description: Links universities to institutional heads during institution onboarding

USE edgeup_super_admin;

-- Add the foreign key column
ALTER TABLE `universities`
  ADD COLUMN `institutional_head_id` BIGINT UNSIGNED NULL COMMENT 'References institutional_heads.id'
  AFTER `is_active`;

-- Add index for better query performance
ALTER TABLE `universities`
  ADD INDEX `idx_institutional_head_id` (`institutional_head_id`);

-- Note: We're not adding a foreign key constraint because institutional heads
-- can exist without being assigned to a university yet
-- The assignment happens during institution onboarding

-- Note: Column is nullable because:
-- 1. Existing universities might not have heads assigned yet
-- 2. New universities might be created before assignment
