-- Add subjects_taught column to teacher_users table for personalized course recommendations
ALTER TABLE teacher_users
ADD COLUMN subjects_taught VARCHAR(500) NULL
COMMENT 'Comma-separated list of subjects/courses the teacher teaches (e.g., Data Structures, Algorithms, Database Systems)';

-- Example: To update a teacher's subjects:
-- UPDATE teacher_users SET subjects_taught = 'Data Structures, Algorithms, Database Systems' WHERE id = 1;
