-- Migration: Add subject, program, batch, section fields to teacher_assignments
-- Date: 2025-12-02
-- Description: Add new fields to support program/batch/section filtering for assignments

ALTER TABLE teacher_assignments
  ADD COLUMN IF NOT EXISTS subject VARCHAR(100) NULL AFTER type,
  ADD COLUMN IF NOT EXISTS program VARCHAR(128) NULL AFTER subject,
  ADD COLUMN IF NOT EXISTS batch VARCHAR(32) NULL AFTER program,
  ADD COLUMN IF NOT EXISTS section VARCHAR(32) NULL AFTER batch;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignment_filters ON teacher_assignments(program, batch, section, status);
CREATE INDEX IF NOT EXISTS idx_assignment_subject ON teacher_assignments(subject);
CREATE INDEX IF NOT EXISTS idx_student_lookup ON student_users(program, batch, section, status);

-- Verify the changes
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'teacher_assignments'
  AND COLUMN_NAME IN ('subject', 'program', 'batch', 'section');
