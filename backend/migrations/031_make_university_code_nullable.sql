-- Migration: Make university code column nullable
-- Database: edgeup_super_admin
-- Description: Makes the code column in universities table nullable since it's no longer required

USE edgeup_super_admin;

-- Make code column nullable
ALTER TABLE `universities`
  MODIFY COLUMN `code` VARCHAR(50) NULL COMMENT 'Institution code (optional)';

SELECT 'University code column is now nullable' as message;
