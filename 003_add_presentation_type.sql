-- Add PRESENTATION to resource_type enum
-- Run this SQL against your MySQL database

ALTER TABLE `curriculum_session_resources`
MODIFY COLUMN `resource_type` ENUM('YOUTUBE_VIDEO', 'ARTICLE', 'PDF', 'PRESENTATION', 'INTERACTIVE_TOOL', 'WEBSITE') NOT NULL;
