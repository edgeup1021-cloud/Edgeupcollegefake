USE edgeup_super_admin;

-- Step 1: Add course_id column as NULLABLE first
ALTER TABLE `subjects`
  ADD COLUMN `course_id` BIGINT UNSIGNED NULL AFTER `id`;

-- Step 2: Create a default course if there are existing subjects without a course
INSERT INTO `courses` (`name`, `description`, `created_at`, `updated_at`)
SELECT 'Default Course', 'Auto-created for existing subjects', NOW(), NOW()
FROM `subjects`
WHERE NOT EXISTS (SELECT 1 FROM `courses`)
LIMIT 1;

-- Step 3: Assign all existing subjects to the first available course
UPDATE `subjects`
SET `course_id` = (SELECT `id` FROM `courses` ORDER BY `id` ASC LIMIT 1)
WHERE `course_id` IS NULL;

-- Step 4: Now make the column NOT NULL
ALTER TABLE `subjects`
  MODIFY COLUMN `course_id` BIGINT UNSIGNED NOT NULL;

-- Step 5: Add the foreign key constraint
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subject_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses`(`id`)
    ON DELETE CASCADE;

-- Step 6: Create index for better performance
CREATE INDEX `idx_subject_course_id` ON `subjects`(`course_id`);

SELECT 'Added course_id column to subjects table with foreign key constraint' as message;
