-- Migration: Add subject, program, batch, section fields to teacher_assignments
-- Date: 2025-12-02
-- Description: Add new fields to support program/batch/section filtering for assignments

-- Add new columns (skip if they already exist)
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND COLUMN_NAME = 'subject') = 0,
  'ALTER TABLE teacher_assignments ADD COLUMN subject VARCHAR(100) NULL AFTER type;',
  'SELECT "subject column already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND COLUMN_NAME = 'program') = 0,
  'ALTER TABLE teacher_assignments ADD COLUMN program VARCHAR(128) NULL AFTER subject;',
  'SELECT "program column already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND COLUMN_NAME = 'batch') = 0,
  'ALTER TABLE teacher_assignments ADD COLUMN batch VARCHAR(32) NULL AFTER program;',
  'SELECT "batch column already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND COLUMN_NAME = 'section') = 0,
  'ALTER TABLE teacher_assignments ADD COLUMN section VARCHAR(32) NULL AFTER batch;',
  'SELECT "section column already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes for performance
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND INDEX_NAME = 'idx_assignment_filters') = 0,
  'CREATE INDEX idx_assignment_filters ON teacher_assignments(program, batch, section, status);',
  'SELECT "idx_assignment_filters already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_assignments' AND INDEX_NAME = 'idx_assignment_subject') = 0,
  'CREATE INDEX idx_assignment_subject ON teacher_assignments(subject);',
  'SELECT "idx_assignment_subject already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'student_users' AND INDEX_NAME = 'idx_student_lookup') = 0,
  'CREATE INDEX idx_student_lookup ON student_users(program, batch, section, status);',
  'SELECT "idx_student_lookup already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the changes
SELECT 'Migration completed successfully!' AS message;
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'teacher_assignments'
  AND COLUMN_NAME IN ('subject', 'program', 'batch', 'section');
