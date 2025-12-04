-- Migration: Enhance attendance and class sessions tables
-- Description: Adds check-in time to attendance, adds filters to sessions, and creates performance indexes

-- Add check-in time to student attendance
ALTER TABLE `student_attendance`
ADD COLUMN `check_in_time` time DEFAULT NULL AFTER `attendance_date`;

-- Add department/batch/section filters to teacher class sessions for auto-enrollment
ALTER TABLE `teacher_class_sessions`
ADD COLUMN `department_id` bigint UNSIGNED DEFAULT NULL AFTER `session_type`,
ADD COLUMN `batch` varchar(32) DEFAULT NULL AFTER `department_id`,
ADD COLUMN `section` varchar(32) DEFAULT NULL AFTER `batch`;

-- Add performance indexes for attendance queries
ALTER TABLE `student_attendance`
ADD KEY `idx_student_date` (`student_id`, `attendance_date`),
ADD KEY `idx_session_status` (`class_session_id`, `status`);

-- Add performance index for student schedule queries
ALTER TABLE `student_schedule`
ADD KEY `idx_student_date` (`student_id`, `session_date`);
