-- Migration: Add missing fields to teacher_library_resources table
-- Description: Adds author, type, thumbnailUrl, pages, duration, publishedDate, views, downloads
-- Date: 2025-12-03

ALTER TABLE `teacher_library_resources`
  ADD COLUMN `author` varchar(100) DEFAULT NULL AFTER `description`,
  ADD COLUMN `type` varchar(50) DEFAULT NULL AFTER `author`,
  MODIFY COLUMN `file_size` varchar(50) DEFAULT NULL,
  ADD COLUMN `thumbnail_url` varchar(1024) DEFAULT NULL AFTER `file_type`,
  ADD COLUMN `pages` int UNSIGNED DEFAULT NULL AFTER `thumbnail_url`,
  ADD COLUMN `duration` varchar(50) DEFAULT NULL AFTER `pages`,
  ADD COLUMN `published_date` date DEFAULT NULL AFTER `duration`,
  ADD COLUMN `views` int UNSIGNED DEFAULT 0 AFTER `published_date`,
  ADD COLUMN `downloads` int UNSIGNED DEFAULT 0 AFTER `views`;

-- Add indexes for common query patterns
ALTER TABLE `teacher_library_resources`
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_author` (`author`);
