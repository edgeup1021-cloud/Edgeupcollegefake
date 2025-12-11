-- Add personal_notes column to teacher_publications table
ALTER TABLE `teacher_publications`
ADD COLUMN `personal_notes` VARCHAR(500) NULL COMMENT 'Personal notes or reflections about the publication (teacher-only)' AFTER `page_numbers`;
