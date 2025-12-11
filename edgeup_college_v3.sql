-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 11, 2025 at 09:37 AM
-- Server version: 8.0.44-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edgeup_college`
--

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` bigint UNSIGNED NOT NULL,
  `exam_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique exam identifier',
  `exam_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Exam name (e.g., Mid Term Examination)',
  `exam_type` enum('sessional','mid_term','end_term','supplementary','revaluation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` int NOT NULL COMMENT 'Semester number (1-8)',
  `program` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Program (e.g., BCA, MCA)',
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Academic year (e.g., 2024-2025)',
  `session` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Session (odd/even)',
  `start_date` date NOT NULL COMMENT 'Exam period start date',
  `end_date` date NOT NULL COMMENT 'Exam period end date',
  `status` enum('scheduled','ongoing','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Exam schedule and period definitions';

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `exam_code`, `exam_name`, `exam_type`, `semester`, `program`, `academic_year`, `session`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'MID_2025_BCA_3', 'Mid Term Examination - Semester 3', 'mid_term', 3, 'BCA', '2024-2025', 'odd', '2025-03-15', '2025-03-25', 'scheduled', '2025-12-11 08:52:59', '2025-12-11 08:52:59'),
(2, 'END_2025_BCA_3', 'End Term Examination - Semester 3', 'end_term', 3, 'BCA', '2024-2025', 'odd', '2025-05-10', '2025-05-20', 'scheduled', '2025-12-11 08:52:59', '2025-12-11 08:52:59'),
(3, 'MID_2025_BCA_2', 'Mid Term Examination - Semester 2', 'mid_term', 2, 'BCA', '2024-2025', 'even', '2025-03-15', '2025-03-25', 'scheduled', '2025-12-11 08:53:00', '2025-12-11 08:53:00'),
(4, 'END_2025_BCA_2', 'End Term Examination - Semester 2', 'end_term', 2, 'BCA', '2024-2025', 'even', '2025-05-10', '2025-05-20', 'scheduled', '2025-12-11 08:53:00', '2025-12-11 08:53:00'),
(5, 'MID_2025_BCA_4', 'Mid Term Examination - Semester 4', 'mid_term', 4, 'BCA', '2024-2025', 'even', '2025-03-15', '2025-03-25', 'scheduled', '2025-12-11 08:53:00', '2025-12-11 08:53:00'),
(6, 'END_2025_BCA_4', 'End Term Examination - Semester 4', 'end_term', 4, 'BCA', '2024-2025', 'even', '2025-05-10', '2025-05-20', 'scheduled', '2025-12-11 08:53:00', '2025-12-11 08:53:00');

-- --------------------------------------------------------

--
-- Table structure for table `exam_subjects`
--

CREATE TABLE `exam_subjects` (
  `id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED NOT NULL,
  `exam_date` date NOT NULL COMMENT 'Specific date of this subject exam',
  `exam_time` time NOT NULL COMMENT 'Start time of the exam',
  `duration_minutes` int NOT NULL DEFAULT '180' COMMENT 'Exam duration in minutes',
  `max_marks` int NOT NULL COMMENT 'Maximum marks for this exam',
  `min_passing_marks` int NOT NULL COMMENT 'Minimum marks to pass',
  `room_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Exam room/hall number',
  `instructions` text COLLATE utf8mb4_unicode_ci COMMENT 'Specific instructions for this exam',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Exam-subject mapping with schedule and marks details';

--
-- Dumping data for table `exam_subjects`
--

INSERT INTO `exam_subjects` (`id`, `exam_id`, `subject_id`, `exam_date`, `exam_time`, `duration_minutes`, `max_marks`, `min_passing_marks`, `room_number`, `instructions`, `created_at`, `updated_at`) VALUES
(1, 1, 13, '2025-03-15', '10:00:00', 120, 100, 40, 'Hall A', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(2, 1, 14, '2025-03-17', '10:00:00', 120, 100, 40, 'Hall A', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(3, 1, 16, '2025-03-19', '10:00:00', 120, 100, 40, 'Hall A', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(4, 1, 17, '2025-03-21', '10:00:00', 120, 100, 40, 'Hall A', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(5, 1, 18, '2025-03-23', '10:00:00', 120, 100, 40, 'Hall A', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(8, 2, 13, '2025-05-10', '10:00:00', 180, 100, 40, 'Hall B', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(9, 2, 14, '2025-05-12', '10:00:00', 180, 100, 40, 'Hall B', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(10, 2, 16, '2025-05-14', '10:00:00', 180, 100, 40, 'Hall B', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(11, 2, 17, '2025-05-16', '10:00:00', 180, 100, 40, 'Hall B', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(12, 2, 18, '2025-05-18', '10:00:00', 180, 100, 40, 'Hall B', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(15, 3, 7, '2025-03-15', '14:00:00', 120, 100, 40, 'Hall C', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(16, 3, 8, '2025-03-17', '14:00:00', 120, 100, 40, 'Hall C', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(17, 3, 10, '2025-03-19', '14:00:00', 120, 100, 40, 'Hall C', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(18, 3, 11, '2025-03-21', '14:00:00', 120, 100, 40, 'Hall C', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(19, 3, 12, '2025-03-23', '14:00:00', 120, 100, 40, 'Hall C', NULL, '2025-12-11 08:53:06', '2025-12-11 08:53:06'),
(22, 5, 19, '2025-03-16', '10:00:00', 120, 100, 40, 'Hall D', NULL, '2025-12-11 08:53:07', '2025-12-11 08:53:07'),
(23, 5, 20, '2025-03-18', '10:00:00', 120, 100, 40, 'Hall D', NULL, '2025-12-11 08:53:07', '2025-12-11 08:53:07'),
(24, 5, 22, '2025-03-20', '10:00:00', 120, 100, 40, 'Hall D', NULL, '2025-12-11 08:53:07', '2025-12-11 08:53:07'),
(25, 5, 23, '2025-03-22', '10:00:00', 120, 100, 40, 'Hall D', NULL, '2025-12-11 08:53:07', '2025-12-11 08:53:07'),
(26, 5, 24, '2025-03-24', '10:00:00', 120, 100, 40, 'Hall D', NULL, '2025-12-11 08:53:07', '2025-12-11 08:53:07');

-- --------------------------------------------------------

--
-- Table structure for table `grade_scales`
--

CREATE TABLE `grade_scales` (
  `id` bigint UNSIGNED NOT NULL,
  `scale_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of grading scale (e.g., 10-point CGPA)',
  `min_percentage` decimal(5,2) NOT NULL COMMENT 'Minimum percentage for this grade',
  `max_percentage` decimal(5,2) NOT NULL COMMENT 'Maximum percentage for this grade',
  `grade_letter` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Grade letter (A+, A, B+, etc.)',
  `grade_points` decimal(4,2) NOT NULL COMMENT 'Grade points (10.0, 9.0, 8.0, etc.)',
  `description` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Description (Outstanding, Excellent, etc.)',
  `is_passing` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Whether this grade is passing',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Whether this scale is active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `grade_scales`
--

INSERT INTO `grade_scales` (`id`, `scale_name`, `min_percentage`, `max_percentage`, `grade_letter`, `grade_points`, `description`, `is_passing`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '10-point CGPA', 90.00, 100.00, 'A+', 10.00, 'Outstanding', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(2, '10-point CGPA', 80.00, 89.99, 'A', 9.00, 'Excellent', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(3, '10-point CGPA', 70.00, 79.99, 'B+', 8.00, 'Very Good', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(4, '10-point CGPA', 60.00, 69.99, 'B', 7.00, 'Good', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(5, '10-point CGPA', 55.00, 59.99, 'C+', 6.00, 'Above Average', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(6, '10-point CGPA', 50.00, 54.99, 'C', 5.00, 'Average', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(7, '10-point CGPA', 40.00, 49.99, 'D', 4.00, 'Pass', 1, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05'),
(8, '10-point CGPA', 0.00, 39.99, 'F', 0.00, 'Fail', 0, 1, '2025-12-11 08:35:05', '2025-12-11 08:35:05');

-- --------------------------------------------------------

--
-- Table structure for table `live_classes`
--

CREATE TABLE `live_classes` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `subject` varchar(100) NOT NULL,
  `meet_link` varchar(1024) NOT NULL,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time NOT NULL,
  `duration` int UNSIGNED NOT NULL COMMENT 'Duration in minutes',
  `program` varchar(100) NOT NULL,
  `batch` varchar(100) NOT NULL,
  `section` varchar(50) NOT NULL,
  `status` enum('SCHEDULED','LIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `live_classes`
--

INSERT INTO `live_classes` (`id`, `teacher_id`, `title`, `description`, `subject`, `meet_link`, `scheduled_date`, `scheduled_time`, `duration`, `program`, `batch`, `section`, `status`, `started_at`, `ended_at`, `created_at`, `updated_at`) VALUES
(1, 3, 'DSA', 'asdad', 'Artificial Intelligence', 'https://meet.google.com/yzr-qpgi-ren', '2025-12-08', '15:56:00', 60, 'CSE - Computer Science and Engineering', '2024', 'A', 'SCHEDULED', NULL, NULL, '2025-12-08 10:26:03', '2025-12-08 10:26:03');

-- --------------------------------------------------------

--
-- Table structure for table `live_class_attendance`
--

CREATE TABLE `live_class_attendance` (
  `id` bigint UNSIGNED NOT NULL,
  `live_class_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `joined_at` timestamp NULL DEFAULT NULL,
  `left_at` timestamp NULL DEFAULT NULL,
  `duration` int UNSIGNED DEFAULT '0' COMMENT 'Duration in minutes',
  `status` enum('PRESENT','ABSENT','LATE') NOT NULL DEFAULT 'ABSENT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_admin_users`
--

CREATE TABLE `mgmt_admin_users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('Principal','Dean','HOD','Finance','Admin','Viewer') DEFAULT 'Admin',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_campuses`
--

CREATE TABLE `mgmt_campuses` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `address` text,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_departments`
--

CREATE TABLE `mgmt_departments` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `campus_id` bigint UNSIGNED DEFAULT NULL,
  `head_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_financials`
--

CREATE TABLE `mgmt_financials` (
  `id` bigint UNSIGNED NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `tuition_income` decimal(15,2) DEFAULT '0.00',
  `grants` decimal(15,2) DEFAULT '0.00',
  `operational_expenses` decimal(15,2) DEFAULT '0.00',
  `salaries_expenses` decimal(15,2) DEFAULT '0.00',
  `surplus_deficit` decimal(15,2) GENERATED ALWAYS AS ((((`tuition_income` + `grants`) - `operational_expenses`) - `salaries_expenses`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_programs`
--

CREATE TABLE `mgmt_programs` (
  `id` bigint UNSIGNED NOT NULL,
  `program_name` varchar(255) NOT NULL,
  `program_code` varchar(50) NOT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `duration_years` int DEFAULT '4',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `semester_courses`
--

CREATE TABLE `semester_courses` (
  `id` bigint UNSIGNED NOT NULL,
  `program` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Program name (e.g., BCA, MCA, B.Tech CS)',
  `semester` int NOT NULL COMMENT 'Semester number (1-8)',
  `subject_id` bigint UNSIGNED NOT NULL,
  `is_mandatory` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Whether subject is mandatory or optional',
  `is_elective` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Whether subject is an elective',
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Academic year (e.g., 2024-2025)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Program-semester-subject mapping';

--
-- Dumping data for table `semester_courses`
--

INSERT INTO `semester_courses` (`id`, `program`, `semester`, `subject_id`, `is_mandatory`, `is_elective`, `academic_year`, `created_at`, `updated_at`) VALUES
(1, 'BCA', 1, 1, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(2, 'BCA', 1, 2, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(3, 'BCA', 1, 3, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(4, 'BCA', 1, 4, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(5, 'BCA', 1, 5, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(6, 'BCA', 1, 6, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(8, 'BCA', 2, 7, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(9, 'BCA', 2, 8, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(10, 'BCA', 2, 9, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(11, 'BCA', 2, 10, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(12, 'BCA', 2, 11, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(13, 'BCA', 2, 12, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(15, 'BCA', 3, 13, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(16, 'BCA', 3, 14, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(17, 'BCA', 3, 15, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(18, 'BCA', 3, 16, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(19, 'BCA', 3, 17, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(20, 'BCA', 3, 18, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(22, 'BCA', 4, 19, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(23, 'BCA', 4, 20, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(24, 'BCA', 4, 21, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(25, 'BCA', 4, 22, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(26, 'BCA', 4, 23, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(27, 'BCA', 4, 24, 1, 0, '2024-2025', '2025-12-11 08:52:52', '2025-12-11 08:52:52'),
(29, 'BCA', 5, 25, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(30, 'BCA', 5, 26, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(31, 'BCA', 5, 27, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(32, 'BCA', 5, 28, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(36, 'BCA', 5, 29, 0, 1, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(37, 'BCA', 5, 30, 0, 1, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(39, 'BCA', 6, 31, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(40, 'BCA', 6, 32, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(41, 'BCA', 6, 33, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(42, 'BCA', 6, 34, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(43, 'BCA', 6, 36, 1, 0, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53'),
(46, 'BCA', 6, 35, 0, 1, '2024-2025', '2025-12-11 08:52:53', '2025-12-11 08:52:53');

-- --------------------------------------------------------

--
-- Table structure for table `student_activity_logs`
--

CREATE TABLE `student_activity_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `activity_date` date NOT NULL,
  `activity_type` enum('login','study','submission','attendance') DEFAULT 'login',
  `metadata` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_assessments`
--

CREATE TABLE `student_assessments` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('Quiz','Test','Midterm','Final','Viva') DEFAULT 'Quiz',
  `scheduled_date` date NOT NULL,
  `scheduled_time` time DEFAULT NULL,
  `status` enum('upcoming','completed','missed') DEFAULT 'upcoming',
  `max_marks` int DEFAULT '100',
  `duration` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_assignment_submissions`
--

CREATE TABLE `student_assignment_submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `assignment_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `status` enum('pending','submitted','graded') DEFAULT 'pending',
  `submitted_at` datetime DEFAULT NULL,
  `file_url` varchar(1024) DEFAULT NULL,
  `notes` text,
  `grade` decimal(6,2) DEFAULT NULL,
  `feedback` text,
  `graded_by_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_assignment_submissions`
--

INSERT INTO `student_assignment_submissions` (`id`, `assignment_id`, `student_id`, `status`, `submitted_at`, `file_url`, `notes`, `grade`, `feedback`, `graded_by_teacher_id`, `created_at`, `updated_at`) VALUES
(1, 4, 3, 'graded', '2025-12-02 12:12:41', 'https://s3.example.com/submissions/student3-calculus-chapter5.pdf', 'I have completed all 20 exercises. Please review my work.', 48.00, 'Updated grade after review. Excellent problem-solving approach!', 1, '2025-12-02 06:37:58', '2025-12-02 06:53:39'),
(2, 4, 4, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 06:37:58', '2025-12-02 06:37:58'),
(3, 5, 6, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 11:14:36', '2025-12-02 11:14:36'),
(4, 6, 6, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 11:35:11', '2025-12-02 11:35:11'),
(5, 5, 1, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 11:43:06', '2025-12-02 11:43:06'),
(6, 6, 1, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 11:43:06', '2025-12-02 11:43:06'),
(8, 8, 8, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 11:59:05', '2025-12-02 11:59:05'),
(9, 9, 8, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 12:03:41', '2025-12-02 12:03:41'),
(10, 10, 8, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 12:09:34', '2025-12-02 12:09:34');

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED DEFAULT NULL,
  `class_session_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `attendance_date` date DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `status` enum('present','absent','late','excused') DEFAULT 'present',
  `marked_by` bigint UNSIGNED DEFAULT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_id`, `class_session_id`, `name`, `attendance_date`, `check_in_time`, `status`, `marked_by`, `remarks`, `created_at`) VALUES
(2, 8, 64, NULL, '2025-01-06', NULL, 'present', 1, 'On time', '2025-12-03 14:14:35'),
(3, 8, 443, NULL, '2025-12-03', NULL, 'present', 3, NULL, '2025-12-03 15:40:36'),
(4, 8, 359, NULL, '2025-12-04', NULL, 'present', 3, 'Test attendance', '2025-12-04 12:38:45'),
(5, 8, 468, NULL, '2025-12-04', NULL, 'absent', 3, NULL, '2025-12-04 14:38:45'),
(6, 2, NULL, 'Ananya Reddy', '2025-11-01', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:55'),
(7, 2, NULL, 'Ananya Reddy', '2025-11-02', '09:05:00', 'late', NULL, NULL, '2025-12-11 14:48:55'),
(8, 2, NULL, 'Ananya Reddy', '2025-11-03', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:55'),
(9, 2, NULL, 'Ananya Reddy', '2025-11-04', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:56'),
(10, 2, NULL, 'Ananya Reddy', '2025-11-05', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:56'),
(11, 2, NULL, 'Ananya Reddy', '2025-11-06', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:56'),
(12, 2, NULL, 'Ananya Reddy', '2025-11-07', NULL, 'absent', NULL, NULL, '2025-12-11 14:48:56'),
(13, 2, NULL, 'Ananya Reddy', '2025-11-08', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:56'),
(14, 2, NULL, 'Ananya Reddy', '2025-11-09', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:56'),
(15, 2, NULL, 'Ananya Reddy', '2025-11-10', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(16, 2, NULL, 'Ananya Reddy', '2025-11-11', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(17, 2, NULL, 'Ananya Reddy', '2025-11-12', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(18, 2, NULL, 'Ananya Reddy', '2025-11-13', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(19, 2, NULL, 'Ananya Reddy', '2025-11-14', '09:10:00', 'late', NULL, NULL, '2025-12-11 14:48:57'),
(20, 2, NULL, 'Ananya Reddy', '2025-11-15', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(21, 2, NULL, 'Ananya Reddy', '2025-11-16', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:57'),
(22, 2, NULL, 'Ananya Reddy', '2025-11-17', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(23, 2, NULL, 'Ananya Reddy', '2025-11-18', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(24, 2, NULL, 'Ananya Reddy', '2025-11-19', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(25, 2, NULL, 'Ananya Reddy', '2025-11-20', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(26, 2, NULL, 'Ananya Reddy', '2025-11-21', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(27, 2, NULL, 'Ananya Reddy', '2025-11-22', NULL, 'absent', NULL, NULL, '2025-12-11 14:48:58'),
(28, 2, NULL, 'Ananya Reddy', '2025-11-23', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(29, 2, NULL, 'Ananya Reddy', '2025-11-24', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:58'),
(30, 2, NULL, 'Ananya Reddy', '2025-11-25', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(31, 2, NULL, 'Ananya Reddy', '2025-11-26', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(32, 2, NULL, 'Ananya Reddy', '2025-11-27', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(33, 2, NULL, 'Ananya Reddy', '2025-11-28', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(34, 2, NULL, 'Ananya Reddy', '2025-11-29', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(35, 2, NULL, 'Ananya Reddy', '2025-11-30', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(36, 8, NULL, 'Muhammed Aakif', '2025-11-01', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:48:59'),
(37, 8, NULL, 'Muhammed Aakif', '2025-11-02', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:00'),
(38, 8, NULL, 'Muhammed Aakif', '2025-11-03', '09:15:00', 'late', NULL, NULL, '2025-12-11 14:49:00'),
(39, 8, NULL, 'Muhammed Aakif', '2025-11-04', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:00'),
(40, 8, NULL, 'Muhammed Aakif', '2025-11-05', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:00'),
(41, 8, NULL, 'Muhammed Aakif', '2025-11-06', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:00'),
(42, 8, NULL, 'Muhammed Aakif', '2025-11-07', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:00'),
(43, 8, NULL, 'Muhammed Aakif', '2025-11-08', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:00'),
(44, 8, NULL, 'Muhammed Aakif', '2025-11-09', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:00'),
(45, 8, NULL, 'Muhammed Aakif', '2025-11-10', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:01'),
(46, 8, NULL, 'Muhammed Aakif', '2025-11-11', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:01'),
(47, 8, NULL, 'Muhammed Aakif', '2025-11-12', '09:20:00', 'late', NULL, NULL, '2025-12-11 14:49:01'),
(48, 8, NULL, 'Muhammed Aakif', '2025-11-13', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:01'),
(49, 8, NULL, 'Muhammed Aakif', '2025-11-14', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:01'),
(50, 8, NULL, 'Muhammed Aakif', '2025-11-15', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:01'),
(51, 8, NULL, 'Muhammed Aakif', '2025-11-16', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:02'),
(52, 8, NULL, 'Muhammed Aakif', '2025-11-17', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:02'),
(53, 8, NULL, 'Muhammed Aakif', '2025-11-18', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:02'),
(54, 8, NULL, 'Muhammed Aakif', '2025-11-19', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:02'),
(55, 8, NULL, 'Muhammed Aakif', '2025-11-20', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:02'),
(56, 8, NULL, 'Muhammed Aakif', '2025-11-21', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:02'),
(57, 8, NULL, 'Muhammed Aakif', '2025-11-22', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:02'),
(58, 8, NULL, 'Muhammed Aakif', '2025-11-23', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:03'),
(59, 8, NULL, 'Muhammed Aakif', '2025-11-24', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:03'),
(60, 8, NULL, 'Muhammed Aakif', '2025-11-25', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:03'),
(61, 8, NULL, 'Muhammed Aakif', '2025-11-26', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:03'),
(62, 8, NULL, 'Muhammed Aakif', '2025-11-27', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:03'),
(63, 8, NULL, 'Muhammed Aakif', '2025-11-28', NULL, 'absent', NULL, NULL, '2025-12-11 14:49:03'),
(64, 8, NULL, 'Muhammed Aakif', '2025-11-29', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:03'),
(65, 8, NULL, 'Muhammed Aakif', '2025-11-30', '09:00:00', 'present', NULL, NULL, '2025-12-11 14:49:04');

-- --------------------------------------------------------

--
-- Table structure for table `student_calendar_events`
--

CREATE TABLE `student_calendar_events` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_type` enum('class','test','assignment','holiday','meeting','fair') NOT NULL,
  `event_date` date NOT NULL,
  `event_time` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `description` text,
  `color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_calendar_events`
--

INSERT INTO `student_calendar_events` (`id`, `student_id`, `title`, `event_type`, `event_date`, `event_time`, `subject`, `description`, `color`, `created_at`, `updated_at`) VALUES
(5, 8, 'Test', 'assignment', '2025-05-12', NULL, 'Mathematics', 'test', '#FF6B6B', '2025-12-02 11:59:05', '2025-12-02 11:59:05'),
(6, 8, 'gsdgb', 'assignment', '2025-01-01', NULL, 'Mathematics', 'dasg', '#FF6B6B', '2025-12-02 12:03:41', '2025-12-02 12:03:41'),
(7, 8, 'aaaa', 'assignment', '2026-02-05', NULL, 'Mathematics', 'aaa', '#FF6B6B', '2025-12-02 12:09:34', '2025-12-02 12:09:34');

-- --------------------------------------------------------

--
-- Table structure for table `student_discussion_comments`
--

CREATE TABLE `student_discussion_comments` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `is_solution` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_discussion_posts`
--

CREATE TABLE `student_discussion_posts` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `type` enum('question','discussion') NOT NULL DEFAULT 'question',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('Mathematics','Computer Science','Physics','Chemistry','Biology','Engineering','Business','General Academic','Study Tips','Career Guidance') NOT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('active','archived','flagged') NOT NULL DEFAULT 'active',
  `upvote_count` int UNSIGNED NOT NULL DEFAULT '0',
  `comment_count` int UNSIGNED NOT NULL DEFAULT '0',
  `is_solved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_discussion_upvotes`
--

CREATE TABLE `student_discussion_upvotes` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_enrollments`
--

CREATE TABLE `student_enrollments` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','dropped','completed') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_enrollments`
--

INSERT INTO `student_enrollments` (`id`, `student_id`, `course_offering_id`, `enrolled_at`, `status`) VALUES
(3, 8, 3, '2025-12-03 08:42:40', 'active'),
(4, 8, 4, '2025-12-03 09:39:21', 'active'),
(5, 8, 5, '2025-12-03 09:41:22', 'active'),
(6, 8, 6, '2025-12-04 06:36:37', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `student_grades`
--

CREATE TABLE `student_grades` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL COMMENT 'Reference to subject master',
  `assignment_id` bigint UNSIGNED DEFAULT NULL,
  `assessment_id` bigint UNSIGNED DEFAULT NULL,
  `exam_subject_id` bigint UNSIGNED DEFAULT NULL COMMENT 'Reference to specific exam subject',
  `marks_obtained` decimal(6,2) DEFAULT NULL,
  `max_marks` decimal(6,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `grade_type` enum('Assignment','Assessment','Final') DEFAULT 'Assignment',
  `internal_marks` decimal(6,2) DEFAULT NULL COMMENT 'Internal assessment marks (out of 30)',
  `external_marks` decimal(6,2) DEFAULT NULL COMMENT 'External exam marks (out of 70)',
  `grade_letter` varchar(3) DEFAULT NULL COMMENT 'Grade letter: A+, A, B+, B, C+, C, D, F',
  `grade_points` decimal(3,1) DEFAULT NULL COMMENT '10-point scale: 10, 9, 8, 7, 6, 5, 4, 0',
  `semester_result_id` bigint UNSIGNED DEFAULT NULL COMMENT 'Links to semester_results table',
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_grades`
--

INSERT INTO `student_grades` (`id`, `student_id`, `course_offering_id`, `subject_id`, `assignment_id`, `assessment_id`, `exam_subject_id`, `marks_obtained`, `max_marks`, `weight`, `grade_type`, `internal_marks`, `external_marks`, `grade_letter`, `grade_points`, `semester_result_id`, `calculated_at`) VALUES
(1, 2, 1, 13, NULL, NULL, NULL, 85.00, 100.00, NULL, 'Final', 35.00, 50.00, 'A', 9.0, NULL, '2025-11-15 04:30:00'),
(2, 2, 1, 14, NULL, NULL, NULL, 92.00, 100.00, NULL, 'Final', 40.00, 52.00, 'A+', 10.0, NULL, '2025-11-16 04:30:00'),
(3, 2, 1, 16, NULL, NULL, NULL, 78.00, 100.00, NULL, 'Final', 32.00, 46.00, 'B+', 8.0, NULL, '2025-11-17 04:30:00'),
(4, 2, 1, 17, NULL, NULL, NULL, 88.00, 100.00, NULL, 'Final', 38.00, 50.00, 'A', 9.0, NULL, '2025-11-18 04:30:00'),
(5, 2, 1, 18, NULL, NULL, NULL, 95.00, 100.00, NULL, 'Final', 42.00, 53.00, 'A+', 10.0, NULL, '2025-11-19 04:30:00'),
(6, 2, 1, 13, NULL, NULL, NULL, 45.00, 50.00, NULL, 'Assignment', NULL, NULL, 'A', 9.0, NULL, '2025-10-10 04:30:00'),
(7, 2, 1, 14, NULL, NULL, NULL, 48.00, 50.00, NULL, 'Assignment', NULL, NULL, 'A+', 10.0, NULL, '2025-10-12 04:30:00'),
(8, 2, 1, 16, NULL, NULL, NULL, 40.00, 50.00, NULL, 'Assignment', NULL, NULL, 'B+', 8.0, NULL, '2025-10-14 04:30:00'),
(9, 8, 1, 13, NULL, NULL, NULL, 72.00, 100.00, NULL, 'Final', 30.00, 42.00, 'B+', 8.0, NULL, '2025-11-15 04:30:00'),
(10, 8, 1, 14, NULL, NULL, NULL, 68.00, 100.00, NULL, 'Final', 28.00, 40.00, 'B', 7.0, NULL, '2025-11-16 04:30:00'),
(11, 8, 1, 16, NULL, NULL, NULL, 81.00, 100.00, NULL, 'Final', 33.00, 48.00, 'A', 9.0, NULL, '2025-11-17 04:30:00'),
(12, 8, 1, 17, NULL, NULL, NULL, 75.00, 100.00, NULL, 'Final', 31.00, 44.00, 'B+', 8.0, NULL, '2025-11-18 04:30:00'),
(13, 8, 1, 18, NULL, NULL, NULL, 79.00, 100.00, NULL, 'Final', 32.00, 47.00, 'B+', 8.0, NULL, '2025-11-19 04:30:00'),
(14, 8, 1, 13, NULL, NULL, NULL, 38.00, 50.00, NULL, 'Assignment', NULL, NULL, 'B+', 8.0, NULL, '2025-10-10 04:30:00'),
(15, 8, 1, 14, NULL, NULL, NULL, 35.00, 50.00, NULL, 'Assignment', NULL, NULL, 'B', 7.0, NULL, '2025-10-12 04:30:00'),
(16, 8, 1, 16, NULL, NULL, NULL, 42.00, 50.00, NULL, 'Assignment', NULL, NULL, 'A', 9.0, NULL, '2025-10-14 04:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `student_job_applications`
--

CREATE TABLE `student_job_applications` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_logo` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_date` date NOT NULL,
  `status` enum('applied','in-progress','offer-received','interview-scheduled','rejected','not-applied') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'applied',
  `job_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `job_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `interview_date` datetime DEFAULT NULL,
  `offer_deadline` date DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_leave_requests`
--

CREATE TABLE `student_leave_requests` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED DEFAULT NULL,
  `class_session_id` bigint UNSIGNED DEFAULT NULL,
  `leave_type` enum('Sick Leave','Personal Leave','Family Emergency','Medical Leave','Other') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `supporting_document` varchar(1024) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_library_access_logs`
--

CREATE TABLE `student_library_access_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `accessed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_library_bookmarks`
--

CREATE TABLE `student_library_bookmarks` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `bookmarked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_library_downloads`
--

CREATE TABLE `student_library_downloads` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `downloaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_notifications`
--

CREATE TABLE `student_notifications` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `type` enum('Deadline','Exam','Fee','General') DEFAULT 'General',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_notifications`
--

INSERT INTO `student_notifications` (`id`, `student_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 8, 'New Join Request', 'Rahul Sharma has requested to join \"test2\"', 'General', 0, '2025-12-08 09:20:20'),
(2, 1, 'Join Request Approved', 'Your request to join \"test2\" has been approved!', 'General', 0, '2025-12-08 09:20:39'),
(3, 8, 'New Join Request', 'Rahul Sharma has requested to join \"DSA Grind Group\"', 'General', 0, '2025-12-08 09:36:46'),
(4, 1, 'Join Request Approved', 'Your request to join \"DSA Grind Group\" has been approved!', 'General', 0, '2025-12-08 09:37:07'),
(5, 8, 'New Join Request', 'Rahul Sharma has requested to join \"Algoprep\"', 'General', 0, '2025-12-08 10:07:13'),
(6, 1, 'Join Request Approved', 'Your request to join \"Algoprep\" has been approved!', 'General', 0, '2025-12-08 10:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `student_profiles`
--

CREATE TABLE `student_profiles` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `address` text,
  `guardian_name` varchar(255) DEFAULT NULL,
  `guardian_phone` varchar(32) DEFAULT NULL,
  `emergency_contact` varchar(32) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_resumes`
--

CREATE TABLE `student_resumes` (
  `id` int UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `resumeData` json NOT NULL,
  `templateUsed` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'modern',
  `isSubmitted` tinyint(1) DEFAULT '0',
  `submittedAt` timestamp NULL DEFAULT NULL,
  `version` int DEFAULT '1',
  `atsScore` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_resumes`
--

INSERT INTO `student_resumes` (`id`, `student_id`, `resumeData`, `templateUsed`, `isSubmitted`, `submittedAt`, `version`, `atsScore`, `created_at`, `updated_at`) VALUES
(1, 8, '{\"awards\": [{\"id\": \"hsgqq6mko\", \"date\": \"\", \"title\": \"AWS\", \"description\": \"\", \"organization\": \"\"}], \"skills\": [{\"id\": \"xnpr62cdo\", \"name\": \"AWS\", \"category\": \"technical\", \"proficiency\": \"intermediate\"}, {\"id\": \"zqrpawlo1\", \"name\": \"REACT\", \"category\": \"technical\", \"proficiency\": \"intermediate\"}], \"summary\": {\"summary\": \"i am a good boy\"}, \"projects\": [{\"id\": \"x3mmjdahx\", \"name\": \"My good project\", \"endDate\": \"\", \"liveUrl\": \"\", \"githubUrl\": \"\", \"startDate\": \"\", \"description\": \"My good project desc\", \"technologies\": []}], \"education\": [{\"id\": \"psvlxvbfs\", \"gpa\": \"\", \"degree\": \"BSC\", \"endDate\": \"\", \"startDate\": \"\", \"institution\": \"anna\", \"isCurrently\": false, \"fieldOfStudy\": \"CS\", \"relevantCoursework\": []}], \"experience\": [{\"id\": \"v36puv11e\", \"company\": \"MNC\", \"endDate\": \"\", \"jobTitle\": \"Software Engineer\", \"location\": \"\", \"startDate\": \"\", \"description\": [\"\"], \"isCurrently\": false}], \"personalInfo\": {\"email\": \"aakif@gmail.com\", \"phone\": \"+919585499783\", \"github\": \"\", \"fullName\": \"Aakif\", \"linkedIn\": \"\", \"location\": \"\", \"portfolio\": \"\"}, \"certifications\": [{\"id\": \"kq0o48a1f\", \"name\": \"AWS\", \"issueDate\": \"\", \"credentialId\": \"\", \"credentialUrl\": \"\", \"expirationDate\": \"\", \"issuingOrganization\": \"AWS\"}], \"extracurriculars\": [{\"id\": \"ppva8nfr2\", \"role\": \"\", \"endDate\": \"\", \"activity\": \"MAX CLUB\", \"startDate\": \"\", \"description\": \"\", \"organization\": \"\"}]}', 'modern', 1, '2025-12-08 09:31:57', 37, 32, '2025-12-08 09:30:04', '2025-12-09 05:03:01');

-- --------------------------------------------------------

--
-- Table structure for table `student_revaluation_requests`
--

CREATE TABLE `student_revaluation_requests` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `grade_id` bigint UNSIGNED NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `fee` decimal(10,2) NOT NULL DEFAULT '500.00' COMMENT 'Revaluation fee',
  `status` enum('pending','approved','rejected','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  `old_marks` decimal(6,2) DEFAULT NULL COMMENT 'Original marks before revaluation',
  `new_marks` decimal(6,2) DEFAULT NULL COMMENT 'Updated marks after revaluation',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student revaluation requests for exams';

-- --------------------------------------------------------

--
-- Table structure for table `student_schedule`
--

CREATE TABLE `student_schedule` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `class_session_id` bigint UNSIGNED NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `room` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_schedule`
--

INSERT INTO `student_schedule` (`id`, `student_id`, `class_session_id`, `session_date`, `start_time`, `room`) VALUES
(1, 8, 64, '2025-01-06', '11:00:00', 'Room 401'),
(2, 8, 65, '2025-01-08', '11:00:00', 'Room 401'),
(3, 8, 66, '2025-01-13', '11:00:00', 'Room 401'),
(4, 8, 67, '2025-01-15', '11:00:00', 'Room 401'),
(5, 8, 68, '2025-01-20', '11:00:00', 'Room 401'),
(6, 8, 69, '2025-01-22', '11:00:00', 'Room 401'),
(7, 8, 70, '2025-01-27', '11:00:00', 'Room 401'),
(8, 8, 71, '2025-01-29', '11:00:00', 'Room 401'),
(9, 8, 72, '2025-02-03', '11:00:00', 'Room 401'),
(10, 8, 73, '2025-02-05', '11:00:00', 'Room 401'),
(11, 8, 74, '2025-02-10', '11:00:00', 'Room 401'),
(12, 8, 75, '2025-02-12', '11:00:00', 'Room 401'),
(13, 8, 76, '2025-02-17', '11:00:00', 'Room 401'),
(14, 8, 77, '2025-02-19', '11:00:00', 'Room 401'),
(15, 8, 78, '2025-02-24', '11:00:00', 'Room 401'),
(16, 8, 79, '2025-02-26', '11:00:00', 'Room 401'),
(17, 8, 80, '2025-01-13', '09:00:00', '201'),
(18, 8, 81, '2025-01-14', '09:00:00', '201'),
(19, 8, 82, '2025-01-15', '09:00:00', '201'),
(20, 8, 83, '2025-01-16', '09:00:00', '201'),
(21, 8, 84, '2025-01-17', '09:00:00', '201'),
(22, 8, 85, '2025-01-18', '09:00:00', '201'),
(23, 8, 86, '2025-01-20', '09:00:00', '201'),
(24, 8, 87, '2025-01-21', '09:00:00', '201'),
(25, 8, 88, '2025-01-22', '09:00:00', '201'),
(26, 8, 89, '2025-01-23', '09:00:00', '201'),
(27, 8, 90, '2025-01-24', '09:00:00', '201'),
(28, 8, 91, '2025-01-25', '09:00:00', '201'),
(29, 8, 92, '2025-01-27', '09:00:00', '201'),
(30, 8, 93, '2025-01-28', '09:00:00', '201'),
(31, 8, 94, '2025-01-29', '09:00:00', '201'),
(32, 8, 95, '2025-01-30', '09:00:00', '201'),
(33, 8, 96, '2025-01-31', '09:00:00', '201'),
(34, 8, 97, '2025-02-01', '09:00:00', '201'),
(35, 8, 98, '2025-02-03', '09:00:00', '201'),
(36, 8, 99, '2025-02-04', '09:00:00', '201'),
(37, 8, 100, '2025-02-05', '09:00:00', '201'),
(38, 8, 101, '2025-02-06', '09:00:00', '201'),
(39, 8, 102, '2025-02-07', '09:00:00', '201'),
(40, 8, 103, '2025-02-08', '09:00:00', '201'),
(41, 8, 104, '2025-02-10', '09:00:00', '201'),
(42, 8, 105, '2025-02-11', '09:00:00', '201'),
(43, 8, 106, '2025-02-12', '09:00:00', '201'),
(44, 8, 107, '2025-02-13', '09:00:00', '201'),
(45, 8, 108, '2025-02-14', '09:00:00', '201'),
(46, 8, 109, '2025-02-15', '09:00:00', '201'),
(47, 8, 110, '2025-02-17', '09:00:00', '201'),
(48, 8, 111, '2025-02-18', '09:00:00', '201'),
(49, 8, 112, '2025-02-19', '09:00:00', '201'),
(50, 8, 113, '2025-02-20', '09:00:00', '201'),
(51, 8, 114, '2025-02-21', '09:00:00', '201'),
(52, 8, 115, '2025-02-22', '09:00:00', '201'),
(53, 8, 116, '2025-02-24', '09:00:00', '201'),
(54, 8, 117, '2025-02-25', '09:00:00', '201'),
(55, 8, 118, '2025-02-26', '09:00:00', '201'),
(56, 8, 119, '2025-02-27', '09:00:00', '201'),
(57, 8, 120, '2025-02-28', '09:00:00', '201'),
(58, 8, 121, '2025-03-01', '09:00:00', '201'),
(59, 8, 122, '2025-03-03', '09:00:00', '201'),
(60, 8, 123, '2025-03-04', '09:00:00', '201'),
(61, 8, 124, '2025-03-05', '09:00:00', '201'),
(62, 8, 125, '2025-03-06', '09:00:00', '201'),
(63, 8, 126, '2025-03-07', '09:00:00', '201'),
(64, 8, 127, '2025-03-08', '09:00:00', '201'),
(65, 8, 128, '2025-03-10', '09:00:00', '201'),
(66, 8, 129, '2025-03-11', '09:00:00', '201'),
(67, 8, 130, '2025-03-12', '09:00:00', '201'),
(68, 8, 131, '2025-03-13', '09:00:00', '201'),
(69, 8, 132, '2025-03-14', '09:00:00', '201'),
(70, 8, 133, '2025-03-15', '09:00:00', '201'),
(71, 8, 134, '2025-03-17', '09:00:00', '201'),
(72, 8, 135, '2025-03-18', '09:00:00', '201'),
(73, 8, 136, '2025-03-19', '09:00:00', '201'),
(74, 8, 137, '2025-03-20', '09:00:00', '201'),
(75, 8, 138, '2025-03-21', '09:00:00', '201'),
(76, 8, 139, '2025-03-22', '09:00:00', '201'),
(77, 8, 140, '2025-03-24', '09:00:00', '201'),
(78, 8, 141, '2025-03-25', '09:00:00', '201'),
(79, 8, 142, '2025-03-26', '09:00:00', '201'),
(80, 8, 143, '2025-03-27', '09:00:00', '201'),
(81, 8, 144, '2025-03-28', '09:00:00', '201'),
(82, 8, 145, '2025-03-29', '09:00:00', '201'),
(83, 8, 146, '2025-03-31', '09:00:00', '201'),
(84, 8, 147, '2025-04-01', '09:00:00', '201'),
(85, 8, 148, '2025-04-02', '09:00:00', '201'),
(86, 8, 149, '2025-04-03', '09:00:00', '201'),
(87, 8, 150, '2025-04-04', '09:00:00', '201'),
(88, 8, 151, '2025-04-05', '09:00:00', '201'),
(89, 8, 152, '2025-04-07', '09:00:00', '201'),
(90, 8, 153, '2025-04-08', '09:00:00', '201'),
(91, 8, 154, '2025-04-09', '09:00:00', '201'),
(92, 8, 155, '2025-04-10', '09:00:00', '201'),
(93, 8, 156, '2025-04-11', '09:00:00', '201'),
(94, 8, 157, '2025-04-12', '09:00:00', '201'),
(95, 8, 158, '2025-04-14', '09:00:00', '201'),
(96, 8, 159, '2025-04-15', '09:00:00', '201'),
(97, 8, 160, '2025-04-16', '09:00:00', '201'),
(98, 8, 161, '2025-04-17', '09:00:00', '201'),
(99, 8, 162, '2025-04-18', '09:00:00', '201'),
(100, 8, 163, '2025-04-19', '09:00:00', '201'),
(101, 8, 164, '2025-04-21', '09:00:00', '201'),
(102, 8, 165, '2025-04-22', '09:00:00', '201'),
(103, 8, 166, '2025-04-23', '09:00:00', '201'),
(104, 8, 167, '2025-04-24', '09:00:00', '201'),
(105, 8, 168, '2025-04-25', '09:00:00', '201'),
(106, 8, 169, '2025-04-26', '09:00:00', '201'),
(107, 8, 170, '2025-04-28', '09:00:00', '201'),
(108, 8, 171, '2025-04-29', '09:00:00', '201'),
(109, 8, 172, '2025-04-30', '09:00:00', '201'),
(110, 8, 173, '2025-05-01', '09:00:00', '201'),
(111, 8, 174, '2025-05-02', '09:00:00', '201'),
(112, 8, 175, '2025-05-03', '09:00:00', '201'),
(113, 8, 176, '2025-05-05', '09:00:00', '201'),
(114, 8, 177, '2025-05-06', '09:00:00', '201'),
(115, 8, 178, '2025-05-07', '09:00:00', '201'),
(116, 8, 179, '2025-05-08', '09:00:00', '201'),
(117, 8, 180, '2025-05-09', '09:00:00', '201'),
(118, 8, 181, '2025-05-10', '09:00:00', '201'),
(119, 8, 182, '2025-05-12', '09:00:00', '201'),
(120, 8, 183, '2025-05-13', '09:00:00', '201'),
(121, 8, 184, '2025-05-14', '09:00:00', '201'),
(122, 8, 185, '2025-05-15', '09:00:00', '201'),
(123, 8, 186, '2025-05-16', '09:00:00', '201'),
(124, 8, 187, '2025-05-17', '09:00:00', '201'),
(125, 8, 188, '2025-05-19', '09:00:00', '201'),
(126, 8, 189, '2025-05-20', '09:00:00', '201'),
(127, 8, 190, '2025-05-21', '09:00:00', '201'),
(128, 8, 191, '2025-05-22', '09:00:00', '201'),
(129, 8, 192, '2025-05-23', '09:00:00', '201'),
(130, 8, 193, '2025-05-24', '09:00:00', '201'),
(131, 8, 194, '2025-05-26', '09:00:00', '201'),
(132, 8, 195, '2025-05-27', '09:00:00', '201'),
(133, 8, 196, '2025-05-28', '09:00:00', '201'),
(134, 8, 197, '2025-05-29', '09:00:00', '201'),
(135, 8, 198, '2025-05-30', '09:00:00', '201'),
(136, 8, 199, '2025-05-31', '09:00:00', '201'),
(137, 8, 200, '2025-06-02', '09:00:00', '201'),
(138, 8, 201, '2025-06-03', '09:00:00', '201'),
(139, 8, 202, '2025-06-04', '09:00:00', '201'),
(140, 8, 203, '2025-06-05', '09:00:00', '201'),
(141, 8, 204, '2025-06-06', '09:00:00', '201'),
(142, 8, 205, '2025-06-07', '09:00:00', '201'),
(143, 8, 206, '2025-06-09', '09:00:00', '201'),
(144, 8, 207, '2025-06-10', '09:00:00', '201'),
(145, 8, 208, '2025-06-11', '09:00:00', '201'),
(146, 8, 209, '2025-06-12', '09:00:00', '201'),
(147, 8, 210, '2025-06-13', '09:00:00', '201'),
(148, 8, 211, '2025-06-14', '09:00:00', '201'),
(149, 8, 212, '2025-06-16', '09:00:00', '201'),
(150, 8, 213, '2025-06-17', '09:00:00', '201'),
(151, 8, 214, '2025-06-18', '09:00:00', '201'),
(152, 8, 215, '2025-06-19', '09:00:00', '201'),
(153, 8, 216, '2025-06-20', '09:00:00', '201'),
(154, 8, 217, '2025-06-21', '09:00:00', '201'),
(155, 8, 218, '2025-06-23', '09:00:00', '201'),
(156, 8, 219, '2025-06-24', '09:00:00', '201'),
(157, 8, 220, '2025-06-25', '09:00:00', '201'),
(158, 8, 221, '2025-06-26', '09:00:00', '201'),
(159, 8, 222, '2025-06-27', '09:00:00', '201'),
(160, 8, 223, '2025-06-28', '09:00:00', '201'),
(161, 8, 224, '2025-06-30', '09:00:00', '201'),
(162, 8, 225, '2025-07-01', '09:00:00', '201'),
(163, 8, 226, '2025-07-02', '09:00:00', '201'),
(164, 8, 227, '2025-07-03', '09:00:00', '201'),
(165, 8, 228, '2025-07-04', '09:00:00', '201'),
(166, 8, 229, '2025-07-05', '09:00:00', '201'),
(167, 8, 230, '2025-07-07', '09:00:00', '201'),
(168, 8, 231, '2025-07-08', '09:00:00', '201'),
(169, 8, 232, '2025-07-09', '09:00:00', '201'),
(170, 8, 233, '2025-07-10', '09:00:00', '201'),
(171, 8, 234, '2025-07-11', '09:00:00', '201'),
(172, 8, 235, '2025-07-12', '09:00:00', '201'),
(173, 8, 236, '2025-07-14', '09:00:00', '201'),
(174, 8, 237, '2025-07-15', '09:00:00', '201'),
(175, 8, 238, '2025-07-16', '09:00:00', '201'),
(176, 8, 239, '2025-07-17', '09:00:00', '201'),
(177, 8, 240, '2025-07-18', '09:00:00', '201'),
(178, 8, 241, '2025-07-19', '09:00:00', '201'),
(179, 8, 242, '2025-07-21', '09:00:00', '201'),
(180, 8, 243, '2025-07-22', '09:00:00', '201'),
(181, 8, 244, '2025-07-23', '09:00:00', '201'),
(182, 8, 245, '2025-07-24', '09:00:00', '201'),
(183, 8, 246, '2025-07-25', '09:00:00', '201'),
(184, 8, 247, '2025-07-26', '09:00:00', '201'),
(185, 8, 248, '2025-07-28', '09:00:00', '201'),
(186, 8, 249, '2025-07-29', '09:00:00', '201'),
(187, 8, 250, '2025-07-30', '09:00:00', '201'),
(188, 8, 251, '2025-07-31', '09:00:00', '201'),
(189, 8, 252, '2025-08-01', '09:00:00', '201'),
(190, 8, 253, '2025-08-02', '09:00:00', '201'),
(191, 8, 254, '2025-08-04', '09:00:00', '201'),
(192, 8, 255, '2025-08-05', '09:00:00', '201'),
(193, 8, 256, '2025-08-06', '09:00:00', '201'),
(194, 8, 257, '2025-08-07', '09:00:00', '201'),
(195, 8, 258, '2025-08-08', '09:00:00', '201'),
(196, 8, 259, '2025-08-09', '09:00:00', '201'),
(197, 8, 260, '2025-08-11', '09:00:00', '201'),
(198, 8, 261, '2025-08-12', '09:00:00', '201'),
(199, 8, 262, '2025-08-13', '09:00:00', '201'),
(200, 8, 263, '2025-08-14', '09:00:00', '201'),
(201, 8, 264, '2025-08-15', '09:00:00', '201'),
(202, 8, 265, '2025-08-16', '09:00:00', '201'),
(203, 8, 266, '2025-08-18', '09:00:00', '201'),
(204, 8, 267, '2025-08-19', '09:00:00', '201'),
(205, 8, 268, '2025-08-20', '09:00:00', '201'),
(206, 8, 269, '2025-08-21', '09:00:00', '201'),
(207, 8, 270, '2025-08-22', '09:00:00', '201'),
(208, 8, 271, '2025-08-23', '09:00:00', '201'),
(209, 8, 272, '2025-08-25', '09:00:00', '201'),
(210, 8, 273, '2025-08-26', '09:00:00', '201'),
(211, 8, 274, '2025-08-27', '09:00:00', '201'),
(212, 8, 275, '2025-08-28', '09:00:00', '201'),
(213, 8, 276, '2025-08-29', '09:00:00', '201'),
(214, 8, 277, '2025-08-30', '09:00:00', '201'),
(215, 8, 278, '2025-09-01', '09:00:00', '201'),
(216, 8, 279, '2025-09-02', '09:00:00', '201'),
(217, 8, 280, '2025-09-03', '09:00:00', '201'),
(218, 8, 281, '2025-09-04', '09:00:00', '201'),
(219, 8, 282, '2025-09-05', '09:00:00', '201'),
(220, 8, 283, '2025-09-06', '09:00:00', '201'),
(221, 8, 284, '2025-09-08', '09:00:00', '201'),
(222, 8, 285, '2025-09-09', '09:00:00', '201'),
(223, 8, 286, '2025-09-10', '09:00:00', '201'),
(224, 8, 287, '2025-09-11', '09:00:00', '201'),
(225, 8, 288, '2025-09-12', '09:00:00', '201'),
(226, 8, 289, '2025-09-13', '09:00:00', '201'),
(227, 8, 290, '2025-09-15', '09:00:00', '201'),
(228, 8, 291, '2025-09-16', '09:00:00', '201'),
(229, 8, 292, '2025-09-17', '09:00:00', '201'),
(230, 8, 293, '2025-09-18', '09:00:00', '201'),
(231, 8, 294, '2025-09-19', '09:00:00', '201'),
(232, 8, 295, '2025-09-20', '09:00:00', '201'),
(233, 8, 296, '2025-09-22', '09:00:00', '201'),
(234, 8, 297, '2025-09-23', '09:00:00', '201'),
(235, 8, 298, '2025-09-24', '09:00:00', '201'),
(236, 8, 299, '2025-09-25', '09:00:00', '201'),
(237, 8, 300, '2025-09-26', '09:00:00', '201'),
(238, 8, 301, '2025-09-27', '09:00:00', '201'),
(239, 8, 302, '2025-09-29', '09:00:00', '201'),
(240, 8, 303, '2025-09-30', '09:00:00', '201'),
(241, 8, 304, '2025-10-01', '09:00:00', '201'),
(242, 8, 305, '2025-10-02', '09:00:00', '201'),
(243, 8, 306, '2025-10-03', '09:00:00', '201'),
(244, 8, 307, '2025-10-04', '09:00:00', '201'),
(245, 8, 308, '2025-10-06', '09:00:00', '201'),
(246, 8, 309, '2025-10-07', '09:00:00', '201'),
(247, 8, 310, '2025-10-08', '09:00:00', '201'),
(248, 8, 311, '2025-10-09', '09:00:00', '201'),
(249, 8, 312, '2025-10-10', '09:00:00', '201'),
(250, 8, 313, '2025-10-11', '09:00:00', '201'),
(251, 8, 314, '2025-10-13', '09:00:00', '201'),
(252, 8, 315, '2025-10-14', '09:00:00', '201'),
(253, 8, 316, '2025-10-15', '09:00:00', '201'),
(254, 8, 317, '2025-10-16', '09:00:00', '201'),
(255, 8, 318, '2025-10-17', '09:00:00', '201'),
(256, 8, 319, '2025-10-18', '09:00:00', '201'),
(257, 8, 320, '2025-10-20', '09:00:00', '201'),
(258, 8, 321, '2025-10-21', '09:00:00', '201'),
(259, 8, 322, '2025-10-22', '09:00:00', '201'),
(260, 8, 323, '2025-10-23', '09:00:00', '201'),
(261, 8, 324, '2025-10-24', '09:00:00', '201'),
(262, 8, 325, '2025-10-25', '09:00:00', '201'),
(263, 8, 326, '2025-10-27', '09:00:00', '201'),
(264, 8, 327, '2025-10-28', '09:00:00', '201'),
(265, 8, 328, '2025-10-29', '09:00:00', '201'),
(266, 8, 329, '2025-10-30', '09:00:00', '201'),
(267, 8, 330, '2025-10-31', '09:00:00', '201'),
(268, 8, 331, '2025-11-01', '09:00:00', '201'),
(269, 8, 332, '2025-11-03', '09:00:00', '201'),
(270, 8, 333, '2025-11-04', '09:00:00', '201'),
(271, 8, 334, '2025-11-05', '09:00:00', '201'),
(272, 8, 335, '2025-11-06', '09:00:00', '201'),
(273, 8, 336, '2025-11-07', '09:00:00', '201'),
(274, 8, 337, '2025-11-08', '09:00:00', '201'),
(275, 8, 338, '2025-11-10', '09:00:00', '201'),
(276, 8, 339, '2025-11-11', '09:00:00', '201'),
(277, 8, 340, '2025-11-12', '09:00:00', '201'),
(278, 8, 341, '2025-11-13', '09:00:00', '201'),
(279, 8, 342, '2025-11-14', '09:00:00', '201'),
(280, 8, 343, '2025-11-15', '09:00:00', '201'),
(281, 8, 344, '2025-11-17', '09:00:00', '201'),
(282, 8, 345, '2025-11-18', '09:00:00', '201'),
(283, 8, 346, '2025-11-19', '09:00:00', '201'),
(284, 8, 347, '2025-11-20', '09:00:00', '201'),
(285, 8, 348, '2025-11-21', '09:00:00', '201'),
(286, 8, 349, '2025-11-22', '09:00:00', '201'),
(287, 8, 350, '2025-11-24', '09:00:00', '201'),
(288, 8, 351, '2025-11-25', '09:00:00', '201'),
(289, 8, 352, '2025-11-26', '09:00:00', '201'),
(290, 8, 353, '2025-11-27', '09:00:00', '201'),
(291, 8, 354, '2025-11-28', '09:00:00', '201'),
(292, 8, 355, '2025-11-29', '09:00:00', '201'),
(293, 8, 356, '2025-12-01', '09:00:00', '201'),
(294, 8, 357, '2025-12-02', '09:00:00', '201'),
(295, 8, 358, '2025-12-03', '09:00:00', '201'),
(296, 8, 359, '2025-12-04', '09:00:00', '201'),
(297, 8, 360, '2025-12-05', '09:00:00', '201'),
(298, 8, 361, '2025-12-06', '09:00:00', '201'),
(299, 8, 362, '2025-12-08', '09:00:00', '201'),
(300, 8, 363, '2025-12-09', '09:00:00', '201'),
(301, 8, 364, '2025-12-10', '09:00:00', '201'),
(302, 8, 365, '2025-12-11', '09:00:00', '201'),
(303, 8, 366, '2025-12-12', '09:00:00', '201'),
(304, 8, 367, '2025-12-13', '09:00:00', '201'),
(305, 8, 368, '2025-12-15', '09:00:00', '201'),
(306, 8, 369, '2025-12-16', '09:00:00', '201'),
(307, 8, 370, '2025-12-17', '09:00:00', '201'),
(308, 8, 371, '2025-12-18', '09:00:00', '201'),
(309, 8, 372, '2025-12-19', '09:00:00', '201'),
(310, 8, 373, '2025-12-20', '09:00:00', '201'),
(311, 8, 374, '2025-12-22', '09:00:00', '201'),
(312, 8, 375, '2025-12-23', '09:00:00', '201'),
(313, 8, 376, '2025-12-24', '09:00:00', '201'),
(314, 8, 377, '2025-12-25', '09:00:00', '201'),
(315, 8, 378, '2025-12-26', '09:00:00', '201'),
(316, 8, 379, '2025-12-27', '09:00:00', '201'),
(317, 8, 380, '2025-12-29', '09:00:00', '201'),
(318, 8, 381, '2025-12-30', '09:00:00', '201'),
(319, 8, 382, '2025-12-31', '09:00:00', '201'),
(320, 8, 383, '2026-01-01', '09:00:00', '201'),
(321, 8, 384, '2026-01-02', '09:00:00', '201'),
(322, 8, 385, '2026-01-03', '09:00:00', '201'),
(323, 8, 386, '2026-01-05', '09:00:00', '201'),
(324, 8, 387, '2026-01-06', '09:00:00', '201'),
(325, 8, 388, '2026-01-07', '09:00:00', '201'),
(326, 8, 389, '2026-01-08', '09:00:00', '201'),
(327, 8, 390, '2026-01-09', '09:00:00', '201'),
(328, 8, 391, '2026-01-10', '09:00:00', '201'),
(329, 8, 392, '2026-01-12', '09:00:00', '201'),
(330, 8, 393, '2026-01-13', '09:00:00', '201'),
(331, 8, 394, '2026-01-14', '09:00:00', '201'),
(332, 8, 395, '2026-01-15', '09:00:00', '201'),
(333, 8, 396, '2026-01-16', '09:00:00', '201'),
(334, 8, 397, '2026-01-17', '09:00:00', '201'),
(335, 8, 398, '2026-01-19', '09:00:00', '201'),
(336, 8, 399, '2026-01-20', '09:00:00', '201'),
(337, 8, 400, '2026-01-21', '09:00:00', '201'),
(338, 8, 401, '2026-01-22', '09:00:00', '201'),
(339, 8, 402, '2026-01-23', '09:00:00', '201'),
(340, 8, 403, '2026-01-24', '09:00:00', '201'),
(341, 8, 404, '2026-01-26', '09:00:00', '201'),
(342, 8, 405, '2026-01-27', '09:00:00', '201'),
(343, 8, 406, '2026-01-28', '09:00:00', '201'),
(344, 8, 407, '2026-01-29', '09:00:00', '201'),
(345, 8, 408, '2026-01-30', '09:00:00', '201'),
(346, 8, 409, '2026-01-31', '09:00:00', '201'),
(347, 8, 410, '2026-02-02', '09:00:00', '201'),
(348, 8, 411, '2026-02-03', '09:00:00', '201'),
(349, 8, 412, '2026-02-04', '09:00:00', '201'),
(350, 8, 413, '2026-02-05', '09:00:00', '201'),
(351, 8, 414, '2026-02-06', '09:00:00', '201'),
(352, 8, 415, '2026-02-07', '09:00:00', '201'),
(353, 8, 416, '2026-02-09', '09:00:00', '201'),
(354, 8, 417, '2026-02-10', '09:00:00', '201'),
(355, 8, 418, '2026-02-11', '09:00:00', '201'),
(356, 8, 419, '2026-02-12', '09:00:00', '201'),
(357, 8, 420, '2026-02-13', '09:00:00', '201'),
(358, 8, 421, '2026-02-14', '09:00:00', '201'),
(359, 8, 422, '2026-02-16', '09:00:00', '201'),
(360, 8, 423, '2026-02-17', '09:00:00', '201'),
(361, 8, 424, '2026-02-18', '09:00:00', '201'),
(362, 8, 425, '2026-02-19', '09:00:00', '201'),
(363, 8, 426, '2026-02-20', '09:00:00', '201'),
(364, 8, 427, '2026-02-21', '09:00:00', '201'),
(365, 8, 428, '2026-02-23', '09:00:00', '201'),
(366, 8, 429, '2026-02-24', '09:00:00', '201'),
(367, 8, 430, '2026-02-25', '09:00:00', '201'),
(368, 8, 431, '2026-02-26', '09:00:00', '201'),
(369, 8, 432, '2026-02-27', '09:00:00', '201'),
(370, 8, 433, '2026-02-28', '09:00:00', '201'),
(371, 8, 434, '2026-03-02', '09:00:00', '201'),
(372, 8, 435, '2026-03-03', '09:00:00', '201'),
(373, 8, 436, '2026-03-04', '09:00:00', '201'),
(374, 8, 437, '2026-03-05', '09:00:00', '201'),
(375, 8, 438, '2026-03-06', '09:00:00', '201'),
(376, 8, 439, '2026-03-07', '09:00:00', '201'),
(377, 8, 440, '2026-03-09', '09:00:00', '201'),
(378, 8, 441, '2026-03-10', '09:00:00', '201'),
(379, 8, 442, '2026-03-11', '09:00:00', '201'),
(380, 8, 443, '2025-12-03', '09:00:00', '23'),
(381, 8, 444, '2025-12-04', '09:00:00', '23'),
(382, 8, 445, '2025-12-05', '09:00:00', '23'),
(383, 8, 446, '2025-12-06', '09:00:00', '23'),
(384, 8, 447, '2025-12-08', '09:00:00', '23'),
(385, 8, 448, '2025-12-09', '09:00:00', '23'),
(386, 8, 449, '2025-12-10', '09:00:00', '23'),
(387, 8, 450, '2025-12-11', '09:00:00', '23'),
(388, 8, 451, '2025-12-12', '09:00:00', '23'),
(389, 8, 452, '2025-12-13', '09:00:00', '23'),
(390, 8, 453, '2025-12-15', '09:00:00', '23'),
(391, 8, 454, '2025-12-16', '09:00:00', '23'),
(392, 8, 455, '2025-12-17', '09:00:00', '23'),
(393, 8, 456, '2025-12-18', '09:00:00', '23'),
(394, 8, 457, '2025-12-19', '09:00:00', '23'),
(395, 8, 458, '2025-12-20', '09:00:00', '23'),
(396, 8, 459, '2025-12-22', '09:00:00', '23'),
(397, 8, 460, '2025-12-23', '09:00:00', '23'),
(398, 8, 461, '2025-12-24', '09:00:00', '23'),
(399, 8, 462, '2025-12-25', '09:00:00', '23'),
(400, 8, 463, '2025-12-26', '09:00:00', '23'),
(401, 8, 464, '2025-12-27', '09:00:00', '23'),
(402, 8, 465, '2025-12-29', '09:00:00', '23'),
(403, 8, 466, '2025-12-30', '09:00:00', '23'),
(404, 8, 467, '2025-12-31', '09:00:00', '23'),
(405, 8, 468, '2025-12-04', '09:00:00', '212'),
(406, 8, 469, '2025-12-05', '09:00:00', '212'),
(407, 8, 470, '2025-12-06', '09:00:00', '212'),
(408, 8, 471, '2025-12-08', '09:00:00', '212'),
(409, 8, 472, '2025-12-09', '09:00:00', '212'),
(410, 8, 473, '2025-12-10', '09:00:00', '212'),
(411, 8, 474, '2025-12-11', '09:00:00', '212'),
(412, 8, 475, '2025-12-12', '09:00:00', '212'),
(413, 8, 476, '2025-12-13', '09:00:00', '212'),
(414, 8, 477, '2025-12-15', '09:00:00', '212'),
(415, 8, 478, '2025-12-16', '09:00:00', '212'),
(416, 8, 479, '2025-12-17', '09:00:00', '212'),
(417, 8, 480, '2025-12-18', '09:00:00', '212'),
(418, 8, 481, '2025-12-19', '09:00:00', '212'),
(419, 8, 482, '2025-12-20', '09:00:00', '212'),
(420, 8, 483, '2025-12-22', '09:00:00', '212'),
(421, 8, 484, '2025-12-23', '09:00:00', '212'),
(422, 8, 485, '2025-12-24', '09:00:00', '212'),
(423, 8, 486, '2025-12-25', '09:00:00', '212'),
(424, 8, 487, '2025-12-26', '09:00:00', '212'),
(425, 8, 488, '2025-12-27', '09:00:00', '212'),
(426, 8, 489, '2025-12-29', '09:00:00', '212'),
(427, 8, 490, '2025-12-30', '09:00:00', '212'),
(428, 8, 491, '2025-12-31', '09:00:00', '212');

-- --------------------------------------------------------

--
-- Table structure for table `student_semester_results`
--

CREATE TABLE `student_semester_results` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `semester` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Semester 1, Semester 2',
  `academic_year` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., 2024-2025',
  `session` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Dec 2024, May 2025',
  `total_credits` int UNSIGNED NOT NULL DEFAULT '0',
  `earned_credits` int UNSIGNED NOT NULL DEFAULT '0',
  `sgpa` decimal(4,2) DEFAULT NULL COMMENT 'Semester GPA on 10-point scale',
  `cgpa` decimal(4,2) DEFAULT NULL COMMENT 'Cumulative GPA on 10-point scale',
  `result_date` date DEFAULT NULL,
  `status` enum('published','draft','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Semester-wise academic results for students';

-- --------------------------------------------------------

--
-- Table structure for table `student_study_sessions`
--

CREATE TABLE `student_study_sessions` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `session_date` date NOT NULL,
  `hours_logged` decimal(4,2) DEFAULT '0.00',
  `target_hours` decimal(4,2) DEFAULT '4.00',
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_users`
--

CREATE TABLE `student_users` (
  `id` bigint UNSIGNED NOT NULL,
  `admission_no` varchar(64) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `program` varchar(128) DEFAULT NULL,
  `batch` varchar(32) DEFAULT NULL,
  `campus_id` bigint UNSIGNED DEFAULT NULL,
  `status` enum('active','suspended','graduated','withdrawn') DEFAULT 'active',
  `profile_image` varchar(1024) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `section` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_users`
--

INSERT INTO `student_users` (`id`, `admission_no`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `program`, `batch`, `campus_id`, `status`, `profile_image`, `created_at`, `updated_at`, `section`) VALUES
(1, 'ADM2024001', 'Rahul', 'Sharma', 'rahul@gmail.com', '+911234567890', '$2b$12$fr968kdoQR1EfAhjCIHRG.n6mBSAuiP9xxX15sosm6dXtZqHee7JO', 'CSE - Computer Science and Engineering', '2024', NULL, 'active', NULL, '2025-12-06 08:52:18', '2025-12-06 09:19:49', 'A'),
(2, 'ADM2024002', 'Ananya', 'Reddy', 'ananya@gmail.com', '+919876543210', '$2b$12$fr968kdoQR1EfAhjCIHRG.n6mBSAuiP9xxX15sosm6dXtZqHee7JO', 'CSE - Computer Science and Engineering', '2024', NULL, 'active', NULL, '2025-12-06 08:52:18', '2025-12-06 09:19:47', 'A'),
(8, 'ADM-2-24-001', 'Muhammed', 'Aakif', 'aakif@gmail.com', NULL, '$2b$12$fr968kdoQR1EfAhjCIHRG.n6mBSAuiP9xxX15sosm6dXtZqHee7JO', 'CSE - Computer Science and Engineering', '2024', NULL, 'active', NULL, '2025-12-02 11:57:49', '2025-12-02 11:57:49', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `study_groups`
--

CREATE TABLE `study_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `subject` varchar(255) DEFAULT NULL,
  `course_offering_id` bigint UNSIGNED DEFAULT NULL,
  `program` varchar(100) DEFAULT NULL,
  `batch` varchar(100) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `join_type` enum('open','code','approval') NOT NULL DEFAULT 'open',
  `invite_code` varchar(64) DEFAULT NULL,
  `max_members` int UNSIGNED NOT NULL DEFAULT '50',
  `current_members` int UNSIGNED NOT NULL DEFAULT '0',
  `created_by_student_id` bigint UNSIGNED NOT NULL,
  `status` enum('active','archived') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `study_groups`
--

INSERT INTO `study_groups` (`id`, `name`, `description`, `subject`, `course_offering_id`, `program`, `batch`, `section`, `join_type`, `invite_code`, `max_members`, `current_members`, `created_by_student_id`, `status`, `created_at`, `updated_at`) VALUES
(10, 'TEST', 'TEST', 'TEST', NULL, 'CSE - Computer Science and Engineering', '2024', 'A', 'open', NULL, 25, 1, 8, 'active', '2025-12-08 09:12:02', '2025-12-08 09:12:02'),
(11, 'test2', 'test', 'test', NULL, 'CSE - Computer Science and Engineering', '2024', 'A', 'approval', NULL, 25, 2, 8, 'active', '2025-12-08 09:19:51', '2025-12-08 09:20:39'),
(12, 'test3', 'test', 'test', NULL, 'ECE - Electronics and Communication Engineering', '2024', 'A', 'open', NULL, 25, 1, 8, 'active', '2025-12-08 09:21:13', '2025-12-08 09:21:13'),
(13, 'rest', 'test', 'test', NULL, 'CSE - Computer Science and Engineering', '2024', 'A', 'open', NULL, 25, 2, 8, 'active', '2025-12-08 09:32:08', '2025-12-08 09:32:19'),
(14, 'DSA Grind Group', 'DESC', 'CS', NULL, 'CSE - Computer Science and Engineering', '2024', 'A', 'approval', NULL, 25, 2, 8, 'active', '2025-12-08 09:36:34', '2025-12-08 09:37:07'),
(15, 'Algoprep', 'AlgoDEsc', 'CS', NULL, 'CSE - Computer Science and Engineering', '2024', 'A', 'approval', NULL, 25, 2, 8, 'active', '2025-12-08 10:06:49', '2025-12-08 10:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `study_group_members`
--

CREATE TABLE `study_group_members` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `role` enum('owner','moderator','member') NOT NULL DEFAULT 'member',
  `status` enum('joined','pending','rejected') NOT NULL DEFAULT 'joined',
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `study_group_members`
--

INSERT INTO `study_group_members` (`id`, `group_id`, `student_id`, `role`, `status`, `joined_at`, `created_at`, `updated_at`) VALUES
(12, 10, 8, 'owner', 'joined', '2025-12-08 09:12:02', '2025-12-08 09:12:02', '2025-12-08 09:12:02'),
(13, 11, 8, 'owner', 'joined', '2025-12-08 09:19:52', '2025-12-08 09:19:51', '2025-12-08 09:19:51'),
(14, 11, 1, 'member', 'joined', '2025-12-08 09:20:39', '2025-12-08 09:20:20', '2025-12-08 09:20:39'),
(15, 12, 8, 'owner', 'joined', '2025-12-08 09:21:13', '2025-12-08 09:21:13', '2025-12-08 09:21:13'),
(16, 13, 8, 'owner', 'joined', '2025-12-08 09:32:08', '2025-12-08 09:32:08', '2025-12-08 09:32:08'),
(17, 13, 1, 'member', 'joined', '2025-12-08 09:32:20', '2025-12-08 09:32:19', '2025-12-08 09:32:19'),
(18, 14, 8, 'owner', 'joined', '2025-12-08 09:36:35', '2025-12-08 09:36:34', '2025-12-08 09:36:34'),
(19, 14, 1, 'member', 'joined', '2025-12-08 09:37:07', '2025-12-08 09:36:46', '2025-12-08 09:37:07'),
(20, 15, 8, 'owner', 'joined', '2025-12-08 10:06:50', '2025-12-08 10:06:49', '2025-12-08 10:06:49'),
(21, 15, 1, 'member', 'joined', '2025-12-08 10:07:50', '2025-12-08 10:07:13', '2025-12-08 10:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `study_group_messages`
--

CREATE TABLE `study_group_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `sender_student_id` bigint UNSIGNED DEFAULT NULL,
  `sender_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `message_type` enum('text','system') NOT NULL DEFAULT 'text',
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `study_group_messages`
--

INSERT INTO `study_group_messages` (`id`, `group_id`, `sender_student_id`, `sender_teacher_id`, `message_type`, `content`, `created_at`) VALUES
(52, 11, 1, NULL, 'text', 'yo', '2025-12-08 09:20:52'),
(53, 13, 1, NULL, 'text', 'test', '2025-12-08 09:32:22'),
(54, 14, 1, NULL, 'text', 'Hello', '2025-12-08 09:37:15'),
(55, 14, 8, NULL, 'text', 'Hi', '2025-12-08 09:37:19'),
(56, 15, 8, NULL, 'text', 'whats up', '2025-12-08 10:07:54'),
(57, 15, 1, NULL, 'text', 'hello', '2025-12-08 10:08:09'),
(58, 15, 8, NULL, 'text', 'yo', '2025-12-08 10:31:48'),
(59, 15, 8, NULL, 'text', 'whatsup', '2025-12-08 10:32:17'),
(60, 15, 8, NULL, 'text', 'hi', '2025-12-08 10:32:45');

-- --------------------------------------------------------

--
-- Table structure for table `study_group_teacher_moderators`
--

CREATE TABLE `study_group_teacher_moderators` (
  `id` bigint UNSIGNED NOT NULL,
  `group_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `role` enum('moderator','owner') NOT NULL DEFAULT 'moderator',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint UNSIGNED NOT NULL,
  `subject_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique subject code (e.g., CS101, MATH201)',
  `subject_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Full subject name',
  `department_id` bigint UNSIGNED DEFAULT NULL COMMENT 'Department offering this subject (nullable, no FK)',
  `credits` int NOT NULL DEFAULT '3' COMMENT 'Credit hours for this subject',
  `subject_type` enum('theory','practical','lab','project') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'theory',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Detailed description of the subject',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Whether subject is currently active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master subject/course definitions';

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `subject_code`, `subject_name`, `department_id`, `credits`, `subject_type`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'BCA101', 'Fundamentals of Information Technology', NULL, 4, 'theory', 'Introduction to IT concepts, hardware, software, and networks', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(2, 'BCA102', 'Programming in C', NULL, 4, 'theory', 'Introduction to C programming language and problem solving', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(3, 'BCA103', 'C Programming Lab', NULL, 2, 'practical', 'Hands-on practice with C programming', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(4, 'BCA104', 'Mathematics I (Algebra)', NULL, 4, 'theory', 'Algebra, matrices, and basic mathematical concepts', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(5, 'BCA105', 'English Communication', NULL, 3, 'theory', 'Business communication and technical writing', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(6, 'BCA106', 'Digital Electronics', NULL, 3, 'theory', 'Digital logic, gates, and circuit fundamentals', 1, '2025-12-11 08:52:38', '2025-12-11 08:52:38'),
(7, 'BCA201', 'Data Structures', NULL, 4, 'theory', 'Arrays, linked lists, stacks, queues, trees, and graphs', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(8, 'BCA202', 'Object Oriented Programming with C++', NULL, 4, 'theory', 'OOP concepts using C++ language', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(9, 'BCA203', 'C++ Programming Lab', NULL, 2, 'practical', 'Practical implementation of OOP concepts', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(10, 'BCA204', 'Mathematics II (Calculus)', NULL, 4, 'theory', 'Differential and integral calculus', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(11, 'BCA205', 'Database Management Systems', NULL, 4, 'theory', 'Database concepts, SQL, normalization, and transactions', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(12, 'BCA206', 'Computer Organization', NULL, 3, 'theory', 'Computer architecture and organization', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(13, 'BCA301', 'Operating Systems', NULL, 4, 'theory', 'OS concepts, processes, memory management, and file systems', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(14, 'BCA302', 'Java Programming', NULL, 4, 'theory', 'Java language fundamentals and OOP', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(15, 'BCA303', 'Java Programming Lab', NULL, 2, 'practical', 'Hands-on Java programming practice', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(16, 'BCA304', 'Discrete Mathematics', NULL, 4, 'theory', 'Sets, relations, functions, graph theory, and combinatorics', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(17, 'BCA305', 'Software Engineering', NULL, 4, 'theory', 'SDLC, requirements, design, testing, and project management', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(18, 'BCA306', 'Web Technologies', NULL, 3, 'theory', 'HTML, CSS, JavaScript, and web development', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(19, 'BCA401', 'Computer Networks', NULL, 4, 'theory', 'Network protocols, TCP/IP, and network security', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(20, 'BCA402', 'Python Programming', NULL, 4, 'theory', 'Python language and scripting', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(21, 'BCA403', 'Python Programming Lab', NULL, 2, 'practical', 'Python programming exercises and projects', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(22, 'BCA404', 'Statistics and Probability', NULL, 4, 'theory', 'Statistical methods and probability theory', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(23, 'BCA405', 'Design and Analysis of Algorithms', NULL, 4, 'theory', 'Algorithm design techniques and complexity analysis', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(24, 'BCA406', 'Computer Graphics', NULL, 3, 'theory', 'Graphics primitives, transformations, and rendering', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(25, 'BCA501', 'Artificial Intelligence', NULL, 4, 'theory', 'AI concepts, search algorithms, and machine learning basics', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(26, 'BCA502', 'Mobile Application Development', NULL, 4, 'theory', 'Android/iOS app development', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(27, 'BCA503', 'Mobile App Development Lab', NULL, 2, 'practical', 'Hands-on mobile app development', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(28, 'BCA504', 'Cloud Computing', NULL, 4, 'theory', 'Cloud platforms, services, and deployment models', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(29, 'BCA505', 'Information Security', NULL, 4, 'theory', 'Cryptography, network security, and secure coding', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(30, 'BCA506', 'Elective I', NULL, 3, 'theory', 'Student choice: Big Data/IoT/Blockchain', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(31, 'BCA601', 'Machine Learning', NULL, 4, 'theory', 'ML algorithms, neural networks, and deep learning', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(32, 'BCA602', 'Full Stack Web Development', NULL, 4, 'theory', 'MERN/MEAN stack development', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(33, 'BCA603', 'Full Stack Development Lab', NULL, 2, 'practical', 'Full stack project development', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(34, 'BCA604', 'Software Testing', NULL, 3, 'theory', 'Testing methodologies, automation, and quality assurance', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(35, 'BCA605', 'Elective II', NULL, 3, 'theory', 'Student choice: DevOps/Cyber Security/Data Science', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39'),
(36, 'BCA606', 'Major Project', NULL, 6, 'project', 'Final year capstone project', 1, '2025-12-11 08:52:39', '2025-12-11 08:52:39');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_assignments`
--

CREATE TABLE `teacher_assignments` (
  `id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime NOT NULL,
  `type` enum('Assignment','Project','Homework','Lab') DEFAULT 'Assignment',
  `subject` varchar(100) DEFAULT NULL,
  `program` varchar(128) DEFAULT NULL,
  `batch` varchar(32) DEFAULT NULL,
  `section` varchar(32) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT '0.00',
  `max_marks` int DEFAULT '100',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` varchar(20) DEFAULT NULL,
  `file_url` varchar(1024) DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_assignments`
--

INSERT INTO `teacher_assignments` (`id`, `course_offering_id`, `title`, `description`, `due_date`, `type`, `subject`, `program`, `batch`, `section`, `weight`, `max_marks`, `created_at`, `updated_at`, `priority`, `file_url`, `created_by`, `status`) VALUES
(1, 1, 'Calculus Problem Set - Chapter 5', 'Complete exercises 1-20 from chapter 5. Show all work and explanations.', '2024-12-25 23:59:59', 'Assignment', NULL, NULL, NULL, NULL, 15.00, 50, '2025-12-02 06:34:00', '2025-12-02 11:34:37', 'HIGH', NULL, 1, 'ARCHIVED'),
(2, 1, 'Calculus Problem Set - Chapter 5', 'Complete exercises 1-20 from chapter 5. Show all work and explanations.', '2024-12-25 23:59:59', 'Assignment', NULL, NULL, NULL, NULL, 15.00, 50, '2025-12-02 06:36:17', '2025-12-02 06:36:17', 'HIGH', NULL, 1, 'ACTIVE'),
(3, 1, 'Calculus Problem Set - Chapter 5', 'Complete exercises 1-20 from chapter 5. Show all work and explanations.', '2024-12-25 23:59:59', 'Assignment', NULL, NULL, NULL, NULL, 15.00, 50, '2025-12-02 06:37:19', '2025-12-02 06:37:19', 'HIGH', NULL, 1, 'ACTIVE'),
(4, 1, 'Calculus Problem Set - Chapter 5', 'Complete exercises 1-20 from chapter 5. Show all work and explanations.', '2024-12-25 23:59:59', 'Assignment', NULL, NULL, NULL, NULL, 15.00, 50, '2025-12-02 06:37:58', '2025-12-02 06:37:58', 'HIGH', NULL, 1, 'ACTIVE'),
(5, 1, 'Test', 'test', '2025-05-12 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 11:14:36', '2025-12-02 11:14:36', 'MEDIUM', NULL, 1, 'ACTIVE'),
(6, 1, 'test', 'test', '2025-05-12 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 11:35:11', '2025-12-02 11:35:11', 'MEDIUM', NULL, 1, 'ACTIVE'),
(7, 1, 'SDAD', 'SDA', '2025-05-12 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2023', 'A', 0.00, 100, '2025-12-02 11:38:45', '2025-12-02 11:38:45', 'MEDIUM', NULL, 1, 'ACTIVE'),
(8, 1, 'Test', 'test', '2025-05-12 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 11:59:05', '2025-12-02 11:59:05', 'MEDIUM', NULL, 1, 'ACTIVE'),
(9, 1, 'gsdgb', 'dasg', '2025-01-01 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 12:03:41', '2025-12-02 12:03:41', 'MEDIUM', NULL, 1, 'ACTIVE'),
(10, 1, 'aaaa', 'aaa', '2026-02-05 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 12:09:34', '2025-12-02 12:09:34', 'MEDIUM', NULL, 3, 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_class_sessions`
--

CREATE TABLE `teacher_class_sessions` (
  `id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `duration_minutes` int DEFAULT '60',
  `room` varchar(100) DEFAULT NULL,
  `session_type` enum('Lecture','Lab','Tutorial') DEFAULT 'Lecture',
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `batch` varchar(32) DEFAULT NULL,
  `section` varchar(32) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_class_sessions`
--

INSERT INTO `teacher_class_sessions` (`id`, `course_offering_id`, `session_date`, `start_time`, `duration_minutes`, `room`, `session_type`, `department_id`, `batch`, `section`, `created_at`) VALUES
(1, 2, '2025-01-06', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(2, 2, '2025-01-08', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(3, 2, '2025-01-10', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(4, 2, '2025-01-13', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(5, 2, '2025-01-15', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(6, 2, '2025-01-17', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(7, 2, '2025-01-20', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(8, 2, '2025-01-22', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(9, 2, '2025-01-24', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(10, 2, '2025-01-27', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(11, 2, '2025-01-29', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(12, 2, '2025-01-31', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(13, 2, '2025-02-03', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(14, 2, '2025-02-05', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(15, 2, '2025-02-07', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(16, 2, '2025-02-10', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(17, 2, '2025-02-12', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(18, 2, '2025-02-14', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(19, 2, '2025-02-17', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(20, 2, '2025-02-19', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(21, 2, '2025-02-21', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(22, 2, '2025-02-24', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(23, 2, '2025-02-26', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(24, 2, '2025-02-28', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(25, 2, '2025-03-03', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(26, 2, '2025-03-05', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(27, 2, '2025-03-07', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(28, 2, '2025-03-10', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(29, 2, '2025-03-12', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(30, 2, '2025-03-14', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(31, 2, '2025-03-17', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(32, 2, '2025-03-19', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(33, 2, '2025-03-21', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(34, 2, '2025-03-24', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(35, 2, '2025-03-26', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(36, 2, '2025-03-28', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(37, 2, '2025-03-31', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(38, 2, '2025-04-02', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(39, 2, '2025-04-04', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(40, 2, '2025-04-07', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(41, 2, '2025-04-09', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(42, 2, '2025-04-11', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(43, 2, '2025-04-14', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(44, 2, '2025-04-16', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(45, 2, '2025-04-18', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(46, 2, '2025-04-21', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(47, 2, '2025-04-23', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(48, 2, '2025-04-25', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(49, 2, '2025-04-28', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(50, 2, '2025-04-30', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(51, 2, '2025-05-02', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(52, 2, '2025-05-05', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(53, 2, '2025-05-07', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(54, 2, '2025-05-09', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(55, 2, '2025-05-12', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(56, 2, '2025-05-14', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(57, 2, '2025-05-16', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(58, 2, '2025-05-19', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(59, 2, '2025-05-21', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(60, 2, '2025-05-23', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(61, 2, '2025-05-26', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(62, 2, '2025-05-28', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(63, 2, '2025-05-30', '09:00:00', 90, 'Room 301', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:41:08'),
(64, 3, '2025-01-06', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(65, 3, '2025-01-08', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(66, 3, '2025-01-13', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(67, 3, '2025-01-15', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(68, 3, '2025-01-20', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(69, 3, '2025-01-22', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(70, 3, '2025-01-27', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(71, 3, '2025-01-29', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(72, 3, '2025-02-03', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(73, 3, '2025-02-05', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(74, 3, '2025-02-10', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(75, 3, '2025-02-12', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(76, 3, '2025-02-17', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(77, 3, '2025-02-19', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(78, 3, '2025-02-24', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(79, 3, '2025-02-26', '11:00:00', 90, 'Room 401', 'Lecture', NULL, '2024', 'A', '2025-12-03 08:42:40'),
(80, 4, '2025-01-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(81, 4, '2025-01-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(82, 4, '2025-01-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(83, 4, '2025-01-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(84, 4, '2025-01-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(85, 4, '2025-01-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(86, 4, '2025-01-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(87, 4, '2025-01-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(88, 4, '2025-01-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(89, 4, '2025-01-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(90, 4, '2025-01-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(91, 4, '2025-01-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(92, 4, '2025-01-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(93, 4, '2025-01-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(94, 4, '2025-01-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(95, 4, '2025-01-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(96, 4, '2025-01-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(97, 4, '2025-02-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(98, 4, '2025-02-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(99, 4, '2025-02-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(100, 4, '2025-02-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(101, 4, '2025-02-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(102, 4, '2025-02-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(103, 4, '2025-02-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(104, 4, '2025-02-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(105, 4, '2025-02-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(106, 4, '2025-02-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(107, 4, '2025-02-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(108, 4, '2025-02-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(109, 4, '2025-02-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(110, 4, '2025-02-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(111, 4, '2025-02-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(112, 4, '2025-02-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(113, 4, '2025-02-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(114, 4, '2025-02-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(115, 4, '2025-02-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(116, 4, '2025-02-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(117, 4, '2025-02-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(118, 4, '2025-02-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(119, 4, '2025-02-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(120, 4, '2025-02-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(121, 4, '2025-03-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(122, 4, '2025-03-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(123, 4, '2025-03-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(124, 4, '2025-03-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(125, 4, '2025-03-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(126, 4, '2025-03-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(127, 4, '2025-03-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(128, 4, '2025-03-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(129, 4, '2025-03-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(130, 4, '2025-03-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(131, 4, '2025-03-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(132, 4, '2025-03-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(133, 4, '2025-03-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(134, 4, '2025-03-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(135, 4, '2025-03-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(136, 4, '2025-03-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(137, 4, '2025-03-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(138, 4, '2025-03-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(139, 4, '2025-03-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(140, 4, '2025-03-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(141, 4, '2025-03-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(142, 4, '2025-03-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(143, 4, '2025-03-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(144, 4, '2025-03-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(145, 4, '2025-03-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(146, 4, '2025-03-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(147, 4, '2025-04-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(148, 4, '2025-04-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(149, 4, '2025-04-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(150, 4, '2025-04-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(151, 4, '2025-04-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(152, 4, '2025-04-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(153, 4, '2025-04-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(154, 4, '2025-04-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(155, 4, '2025-04-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(156, 4, '2025-04-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(157, 4, '2025-04-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(158, 4, '2025-04-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(159, 4, '2025-04-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(160, 4, '2025-04-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(161, 4, '2025-04-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(162, 4, '2025-04-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(163, 4, '2025-04-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(164, 4, '2025-04-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(165, 4, '2025-04-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(166, 4, '2025-04-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(167, 4, '2025-04-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(168, 4, '2025-04-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(169, 4, '2025-04-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(170, 4, '2025-04-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(171, 4, '2025-04-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(172, 4, '2025-04-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(173, 4, '2025-05-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(174, 4, '2025-05-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(175, 4, '2025-05-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(176, 4, '2025-05-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(177, 4, '2025-05-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(178, 4, '2025-05-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(179, 4, '2025-05-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(180, 4, '2025-05-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(181, 4, '2025-05-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(182, 4, '2025-05-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(183, 4, '2025-05-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(184, 4, '2025-05-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(185, 4, '2025-05-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(186, 4, '2025-05-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(187, 4, '2025-05-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(188, 4, '2025-05-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(189, 4, '2025-05-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(190, 4, '2025-05-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(191, 4, '2025-05-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(192, 4, '2025-05-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(193, 4, '2025-05-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(194, 4, '2025-05-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(195, 4, '2025-05-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(196, 4, '2025-05-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(197, 4, '2025-05-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(198, 4, '2025-05-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(199, 4, '2025-05-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(200, 4, '2025-06-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(201, 4, '2025-06-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(202, 4, '2025-06-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(203, 4, '2025-06-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(204, 4, '2025-06-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(205, 4, '2025-06-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(206, 4, '2025-06-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(207, 4, '2025-06-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(208, 4, '2025-06-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(209, 4, '2025-06-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(210, 4, '2025-06-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(211, 4, '2025-06-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(212, 4, '2025-06-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(213, 4, '2025-06-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(214, 4, '2025-06-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:20'),
(215, 4, '2025-06-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(216, 4, '2025-06-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(217, 4, '2025-06-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(218, 4, '2025-06-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(219, 4, '2025-06-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(220, 4, '2025-06-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(221, 4, '2025-06-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(222, 4, '2025-06-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(223, 4, '2025-06-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(224, 4, '2025-06-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(225, 4, '2025-07-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(226, 4, '2025-07-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(227, 4, '2025-07-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(228, 4, '2025-07-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(229, 4, '2025-07-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(230, 4, '2025-07-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(231, 4, '2025-07-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(232, 4, '2025-07-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(233, 4, '2025-07-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(234, 4, '2025-07-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(235, 4, '2025-07-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(236, 4, '2025-07-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(237, 4, '2025-07-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(238, 4, '2025-07-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(239, 4, '2025-07-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(240, 4, '2025-07-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(241, 4, '2025-07-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(242, 4, '2025-07-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(243, 4, '2025-07-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(244, 4, '2025-07-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(245, 4, '2025-07-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(246, 4, '2025-07-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(247, 4, '2025-07-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(248, 4, '2025-07-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(249, 4, '2025-07-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(250, 4, '2025-07-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(251, 4, '2025-07-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(252, 4, '2025-08-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(253, 4, '2025-08-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(254, 4, '2025-08-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(255, 4, '2025-08-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(256, 4, '2025-08-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(257, 4, '2025-08-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(258, 4, '2025-08-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(259, 4, '2025-08-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(260, 4, '2025-08-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(261, 4, '2025-08-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(262, 4, '2025-08-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(263, 4, '2025-08-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(264, 4, '2025-08-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(265, 4, '2025-08-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(266, 4, '2025-08-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(267, 4, '2025-08-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(268, 4, '2025-08-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(269, 4, '2025-08-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(270, 4, '2025-08-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(271, 4, '2025-08-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(272, 4, '2025-08-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(273, 4, '2025-08-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(274, 4, '2025-08-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(275, 4, '2025-08-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(276, 4, '2025-08-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(277, 4, '2025-08-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(278, 4, '2025-09-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(279, 4, '2025-09-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(280, 4, '2025-09-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(281, 4, '2025-09-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(282, 4, '2025-09-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(283, 4, '2025-09-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(284, 4, '2025-09-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(285, 4, '2025-09-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(286, 4, '2025-09-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(287, 4, '2025-09-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(288, 4, '2025-09-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(289, 4, '2025-09-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(290, 4, '2025-09-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(291, 4, '2025-09-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(292, 4, '2025-09-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(293, 4, '2025-09-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(294, 4, '2025-09-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(295, 4, '2025-09-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(296, 4, '2025-09-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(297, 4, '2025-09-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(298, 4, '2025-09-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(299, 4, '2025-09-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(300, 4, '2025-09-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(301, 4, '2025-09-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(302, 4, '2025-09-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(303, 4, '2025-09-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(304, 4, '2025-10-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(305, 4, '2025-10-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(306, 4, '2025-10-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(307, 4, '2025-10-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(308, 4, '2025-10-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(309, 4, '2025-10-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(310, 4, '2025-10-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(311, 4, '2025-10-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(312, 4, '2025-10-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(313, 4, '2025-10-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(314, 4, '2025-10-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(315, 4, '2025-10-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(316, 4, '2025-10-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(317, 4, '2025-10-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(318, 4, '2025-10-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(319, 4, '2025-10-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(320, 4, '2025-10-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(321, 4, '2025-10-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(322, 4, '2025-10-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(323, 4, '2025-10-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(324, 4, '2025-10-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(325, 4, '2025-10-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(326, 4, '2025-10-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(327, 4, '2025-10-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(328, 4, '2025-10-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(329, 4, '2025-10-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(330, 4, '2025-10-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(331, 4, '2025-11-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(332, 4, '2025-11-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(333, 4, '2025-11-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(334, 4, '2025-11-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(335, 4, '2025-11-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(336, 4, '2025-11-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(337, 4, '2025-11-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(338, 4, '2025-11-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(339, 4, '2025-11-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(340, 4, '2025-11-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(341, 4, '2025-11-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(342, 4, '2025-11-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(343, 4, '2025-11-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(344, 4, '2025-11-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(345, 4, '2025-11-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(346, 4, '2025-11-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(347, 4, '2025-11-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(348, 4, '2025-11-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(349, 4, '2025-11-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(350, 4, '2025-11-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(351, 4, '2025-11-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(352, 4, '2025-11-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(353, 4, '2025-11-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(354, 4, '2025-11-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(355, 4, '2025-11-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(356, 4, '2025-12-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(357, 4, '2025-12-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(358, 4, '2025-12-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(359, 4, '2025-12-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(360, 4, '2025-12-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(361, 4, '2025-12-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(362, 4, '2025-12-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(363, 4, '2025-12-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(364, 4, '2025-12-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(365, 4, '2025-12-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(366, 4, '2025-12-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(367, 4, '2025-12-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(368, 4, '2025-12-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(369, 4, '2025-12-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(370, 4, '2025-12-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(371, 4, '2025-12-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(372, 4, '2025-12-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(373, 4, '2025-12-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(374, 4, '2025-12-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(375, 4, '2025-12-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(376, 4, '2025-12-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(377, 4, '2025-12-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(378, 4, '2025-12-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(379, 4, '2025-12-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(380, 4, '2025-12-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(381, 4, '2025-12-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(382, 4, '2025-12-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(383, 4, '2026-01-01', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(384, 4, '2026-01-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(385, 4, '2026-01-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(386, 4, '2026-01-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(387, 4, '2026-01-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(388, 4, '2026-01-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(389, 4, '2026-01-08', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(390, 4, '2026-01-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(391, 4, '2026-01-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(392, 4, '2026-01-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(393, 4, '2026-01-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(394, 4, '2026-01-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(395, 4, '2026-01-15', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(396, 4, '2026-01-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(397, 4, '2026-01-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(398, 4, '2026-01-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(399, 4, '2026-01-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(400, 4, '2026-01-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(401, 4, '2026-01-22', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(402, 4, '2026-01-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(403, 4, '2026-01-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(404, 4, '2026-01-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(405, 4, '2026-01-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(406, 4, '2026-01-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(407, 4, '2026-01-29', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(408, 4, '2026-01-30', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(409, 4, '2026-01-31', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(410, 4, '2026-02-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(411, 4, '2026-02-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(412, 4, '2026-02-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(413, 4, '2026-02-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(414, 4, '2026-02-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(415, 4, '2026-02-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(416, 4, '2026-02-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(417, 4, '2026-02-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(418, 4, '2026-02-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(419, 4, '2026-02-12', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(420, 4, '2026-02-13', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(421, 4, '2026-02-14', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(422, 4, '2026-02-16', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(423, 4, '2026-02-17', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(424, 4, '2026-02-18', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(425, 4, '2026-02-19', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(426, 4, '2026-02-20', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(427, 4, '2026-02-21', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(428, 4, '2026-02-23', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(429, 4, '2026-02-24', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(430, 4, '2026-02-25', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(431, 4, '2026-02-26', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(432, 4, '2026-02-27', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(433, 4, '2026-02-28', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(434, 4, '2026-03-02', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(435, 4, '2026-03-03', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(436, 4, '2026-03-04', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(437, 4, '2026-03-05', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(438, 4, '2026-03-06', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(439, 4, '2026-03-07', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(440, 4, '2026-03-09', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(441, 4, '2026-03-10', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(442, 4, '2026-03-11', '09:00:00', 60, '201', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:39:21'),
(443, 5, '2025-12-03', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(444, 5, '2025-12-04', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(445, 5, '2025-12-05', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(446, 5, '2025-12-06', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(447, 5, '2025-12-08', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(448, 5, '2025-12-09', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(449, 5, '2025-12-10', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(450, 5, '2025-12-11', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(451, 5, '2025-12-12', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(452, 5, '2025-12-13', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(453, 5, '2025-12-15', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(454, 5, '2025-12-16', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(455, 5, '2025-12-17', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(456, 5, '2025-12-18', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(457, 5, '2025-12-19', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(458, 5, '2025-12-20', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(459, 5, '2025-12-22', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(460, 5, '2025-12-23', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(461, 5, '2025-12-24', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(462, 5, '2025-12-25', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(463, 5, '2025-12-26', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(464, 5, '2025-12-27', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(465, 5, '2025-12-29', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(466, 5, '2025-12-30', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(467, 5, '2025-12-31', '09:00:00', 60, '23', 'Lecture', NULL, '2024', 'A', '2025-12-03 09:41:22'),
(468, 6, '2025-12-04', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(469, 6, '2025-12-05', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(470, 6, '2025-12-06', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(471, 6, '2025-12-08', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(472, 6, '2025-12-09', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(473, 6, '2025-12-10', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(474, 6, '2025-12-11', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(475, 6, '2025-12-12', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(476, 6, '2025-12-13', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(477, 6, '2025-12-15', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(478, 6, '2025-12-16', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(479, 6, '2025-12-17', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(480, 6, '2025-12-18', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(481, 6, '2025-12-19', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(482, 6, '2025-12-20', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(483, 6, '2025-12-22', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(484, 6, '2025-12-23', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(485, 6, '2025-12-24', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(486, 6, '2025-12-25', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(487, 6, '2025-12-26', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(488, 6, '2025-12-27', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(489, 6, '2025-12-29', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(490, 6, '2025-12-30', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37'),
(491, 6, '2025-12-31', '09:00:00', 60, '212', 'Lecture', NULL, '2024', 'A', '2025-12-04 06:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_conversations`
--

CREATE TABLE `teacher_conversations` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `is_archived` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_conversations`
--

INSERT INTO `teacher_conversations` (`id`, `teacher_id`, `title`, `last_message_at`, `is_archived`, `created_at`, `updated_at`) VALUES
(1, 3, 'Conversation with Muhammed', '2025-12-10 10:44:38', 0, '2025-12-10 10:44:33', '2025-12-10 10:44:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_conversation_participants`
--

CREATE TABLE `teacher_conversation_participants` (
  `id` bigint UNSIGNED NOT NULL,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_conversation_participants`
--

INSERT INTO `teacher_conversation_participants` (`id`, `conversation_id`, `student_id`, `joined_at`, `created_at`) VALUES
(1, 1, 8, '2025-12-10 10:44:33', '2025-12-10 10:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_courses`
--

CREATE TABLE `teacher_courses` (
  `id` bigint UNSIGNED NOT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `syllabus_link` varchar(1024) DEFAULT NULL,
  `credits` int DEFAULT '3',
  `created_by_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_courses`
--

INSERT INTO `teacher_courses` (`id`, `department_id`, `code`, `title`, `syllabus_link`, `credits`, `created_by_teacher_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 'CS101', 'Introduction to Computer Science', NULL, 3, NULL, '2025-12-02 06:33:04', '2025-12-02 06:33:04'),
(2, NULL, 'CS301', 'Data Structures and Algorithms', NULL, 3, 1, '2025-12-03 08:41:08', '2025-12-03 08:41:08'),
(3, NULL, 'CS401', 'Advanced Algorithms', NULL, 3, 1, '2025-12-03 08:42:40', '2025-12-03 08:42:40'),
(4, NULL, 'cd123', 'Python', NULL, 3, 3, '2025-12-03 09:41:22', '2025-12-03 09:41:22'),
(5, NULL, 'cs123', 'test', NULL, 3, 3, '2025-12-04 06:36:37', '2025-12-04 06:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_course_offerings`
--

CREATE TABLE `teacher_course_offerings` (
  `id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `semester` enum('Spring','Summer','Fall','Winter') NOT NULL,
  `year` smallint NOT NULL,
  `section` varchar(10) DEFAULT NULL,
  `campus_id` bigint UNSIGNED DEFAULT NULL,
  `max_students` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_course_offerings`
--

INSERT INTO `teacher_course_offerings` (`id`, `course_id`, `teacher_id`, `semester`, `year`, `section`, `campus_id`, `max_students`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Fall', 2024, 'A', NULL, 30, '2025-12-02 06:33:04', '2025-12-02 06:33:04'),
(2, 2, 1, 'Spring', 2025, 'A', NULL, 0, '2025-12-03 08:41:08', '2025-12-03 08:41:08'),
(3, 3, 1, 'Spring', 2025, 'A', NULL, 0, '2025-12-03 08:42:40', '2025-12-03 08:42:40'),
(4, 1, 3, 'Winter', 2024, 'A', NULL, 0, '2025-12-03 09:39:20', '2025-12-03 09:39:20'),
(5, 4, 3, 'Summer', 2025, 'A', NULL, 0, '2025-12-03 09:41:22', '2025-12-03 09:41:22'),
(6, 5, 3, 'Spring', 2025, 'A', NULL, 0, '2025-12-04 06:36:37', '2025-12-04 06:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_idea_sandbox_comments`
--

CREATE TABLE `teacher_idea_sandbox_comments` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_idea_sandbox_posts`
--

CREATE TABLE `teacher_idea_sandbox_posts` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `type` enum('idea','question') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'idea',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Pedagogical Strategies','Assessment Methods','Technology Integration','Classroom Management') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('active','archived','flagged') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `upvote_count` int UNSIGNED DEFAULT '0',
  `comment_count` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_idea_sandbox_upvotes`
--

CREATE TABLE `teacher_idea_sandbox_upvotes` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_library_resources`
--

CREATE TABLE `teacher_library_resources` (
  `id` bigint UNSIGNED NOT NULL,
  `uploaded_by` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `author` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `category` enum('Lecture Notes','Textbooks','Research Papers','Lab Manuals','Past Papers','Reference Materials','Study Guides','Other') NOT NULL,
  `file_url` varchar(1024) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` varchar(50) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `thumbnail_url` varchar(1024) DEFAULT NULL,
  `pages` int UNSIGNED DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `views` int UNSIGNED DEFAULT '0',
  `downloads` int UNSIGNED DEFAULT '0',
  `subject` varchar(100) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_library_resources`
--

INSERT INTO `teacher_library_resources` (`id`, `uploaded_by`, `title`, `description`, `author`, `type`, `category`, `file_url`, `file_name`, `file_size`, `file_type`, `thumbnail_url`, `pages`, `duration`, `published_date`, `views`, `downloads`, `subject`, `tags`, `status`, `created_at`, `updated_at`) VALUES
(2, 3, 'Data Structures Complete Guide', 'UPDATED: Comprehensive guide with examples and exercises', NULL, NULL, 'Textbooks', 'https://s3.amazonaws.com/example-bucket/textbooks/data-structures-guide.pdf', 'data-structures-guide.pdf', '2500000', 'application/pdf', NULL, NULL, NULL, NULL, 0, 0, 'Computer Science', 'data structures, algorithms, computer science, programming', 'ACTIVE', '2025-12-03 07:23:03', '2025-12-03 07:24:27'),
(3, 3, 'Operating Systems Lab Manual', 'Lab manual for OS course', NULL, NULL, 'Lab Manuals', 'https://s3.example.com/os-lab-manual.pdf', 'os-lab-manual.pdf', '1500000', 'application/pdf', NULL, NULL, NULL, NULL, 0, 0, 'Computer Science', 'operating systems, linux, labs', 'ARCHIVED', '2025-12-03 07:23:16', '2025-12-03 07:26:13'),
(4, 3, 'Operating Systems Lab Manual', 'Lab manual for OS course', NULL, NULL, 'Lab Manuals', 'https://s3.example.com/os-lab-manual.pdf', 'os-lab-manual.pdf', '1500000', 'application/pdf', NULL, NULL, NULL, NULL, 0, 0, 'Computer Science', 'operating systems, linux, labs', 'ACTIVE', '2025-12-03 07:23:29', '2025-12-03 07:23:29'),
(5, 3, 'test', 'testtesttest', 'test', 'book', 'Lecture Notes', 'https://example.com/thumbnail.jpg', 'thumbnail.jpg', 'test', NULL, NULL, 12, NULL, NULL, 0, 0, NULL, NULL, 'ACTIVE', '2025-12-03 10:41:14', '2025-12-03 10:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_mentorships`
--

CREATE TABLE `teacher_mentorships` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `status` enum('active','inactive','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `assigned_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `assigned_by` bigint UNSIGNED DEFAULT NULL COMMENT 'Admin/Management user who assigned',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Teacher-student mentorship assignments';

--
-- Dumping data for table `teacher_mentorships`
--

INSERT INTO `teacher_mentorships` (`id`, `teacher_id`, `student_id`, `status`, `assigned_date`, `end_date`, `assigned_by`, `notes`, `created_at`, `updated_at`) VALUES
(2, 3, 2, 'active', '2025-12-11', NULL, NULL, NULL, '2025-12-11 06:39:37', '2025-12-11 06:39:37'),
(3, 3, 8, 'active', '2025-12-11', NULL, NULL, NULL, '2025-12-11 06:39:37', '2025-12-11 06:39:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_messages`
--

CREATE TABLE `teacher_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `sender_type` enum('teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `sender_student_id` bigint UNSIGNED DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_messages`
--

INSERT INTO `teacher_messages` (`id`, `conversation_id`, `sender_type`, `sender_teacher_id`, `sender_student_id`, `content`, `is_read`, `created_at`) VALUES
(1, 1, 'teacher', 3, NULL, 'yo', 1, '2025-12-10 10:44:37');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_users`
--

CREATE TABLE `teacher_users` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `profile_image` varchar(1024) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subjects_taught` varchar(500) DEFAULT NULL COMMENT 'Comma-separated list of subjects/courses the teacher teaches (e.g., Data Structures, Algorithms, Database Systems)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_users`
--

INSERT INTO `teacher_users` (`id`, `first_name`, `last_name`, `email`, `phone`, `designation`, `department_id`, `profile_image`, `password_hash`, `is_active`, `created_at`, `updated_at`, `subjects_taught`) VALUES
(3, 'Mohamed', 'Sameer', 'sameer@gmail.com', NULL, 'Professor', NULL, NULL, '$2b$12$B6h9wHj9s10NdJHNHmWflO/xhX/kAjqtnPkh/ODOEofk6cRNovobW', 1, '2025-12-02 11:58:28', '2025-12-10 10:08:08', 'Data Structures, Algorithms, Database Systems');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exam_code` (`exam_code`),
  ADD UNIQUE KEY `unique_exam_code` (`exam_code`),
  ADD KEY `idx_program_semester` (`program`,`semester`),
  ADD KEY `idx_academic_year` (`academic_year`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_exam_type` (`exam_type`),
  ADD KEY `idx_start_date` (`start_date`);

--
-- Indexes for table `exam_subjects`
--
ALTER TABLE `exam_subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_exam_subject` (`exam_id`,`subject_id`),
  ADD KEY `idx_exam` (`exam_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_exam_date` (`exam_date`);

--
-- Indexes for table `grade_scales`
--
ALTER TABLE `grade_scales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_scale_range` (`scale_name`,`min_percentage`,`max_percentage`),
  ADD KEY `idx_scale_name` (`scale_name`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `live_classes`
--
ALTER TABLE `live_classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher_id` (`teacher_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_scheduled_date` (`scheduled_date`),
  ADD KEY `idx_program_batch_section` (`program`,`batch`,`section`);

--
-- Indexes for table `live_class_attendance`
--
ALTER TABLE `live_class_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_live_class_student` (`live_class_id`,`student_id`),
  ADD KEY `idx_live_class_id` (`live_class_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `mgmt_admin_users`
--
ALTER TABLE `mgmt_admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `mgmt_campuses`
--
ALTER TABLE `mgmt_campuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `mgmt_departments`
--
ALTER TABLE `mgmt_departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_campus` (`campus_id`);

--
-- Indexes for table `mgmt_financials`
--
ALTER TABLE `mgmt_financials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_period` (`period_start`,`period_end`);

--
-- Indexes for table `mgmt_programs`
--
ALTER TABLE `mgmt_programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `program_code` (`program_code`),
  ADD KEY `idx_department` (`department_id`);

--
-- Indexes for table `semester_courses`
--
ALTER TABLE `semester_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_program_semester_subject_year` (`program`,`semester`,`subject_id`,`academic_year`),
  ADD KEY `idx_program_semester` (`program`,`semester`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_academic_year` (`academic_year`);

--
-- Indexes for table `student_activity_logs`
--
ALTER TABLE `student_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_date` (`student_id`,`activity_date`);

--
-- Indexes for table `student_assessments`
--
ALTER TABLE `student_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_date` (`student_id`,`scheduled_date`);

--
-- Indexes for table `student_assignment_submissions`
--
ALTER TABLE `student_assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assignment` (`assignment_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_date` (`student_id`,`attendance_date`),
  ADD KEY `idx_session_status` (`class_session_id`,`status`);

--
-- Indexes for table `student_calendar_events`
--
ALTER TABLE `student_calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_date` (`event_date`),
  ADD KEY `idx_student_date` (`student_id`,`event_date`),
  ADD KEY `idx_type` (`event_type`);

--
-- Indexes for table `student_discussion_comments`
--
ALTER TABLE `student_discussion_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_post_id` (`post_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `student_discussion_posts`
--
ALTER TABLE `student_discussion_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_solved` (`is_solved`);

--
-- Indexes for table `student_discussion_upvotes`
--
ALTER TABLE `student_discussion_upvotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_student_upvote` (`post_id`,`student_id`),
  ADD KEY `fk_discussion_upvote_student` (`student_id`);

--
-- Indexes for table `student_enrollments`
--
ALTER TABLE `student_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_enrollment` (`student_id`,`course_offering_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_course` (`course_offering_id`);

--
-- Indexes for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_course` (`course_offering_id`),
  ADD KEY `idx_assignment` (`assignment_id`),
  ADD KEY `idx_assessment` (`assessment_id`),
  ADD KEY `idx_grade_points` (`grade_points`),
  ADD KEY `idx_semester_result_id` (`semester_result_id`),
  ADD KEY `idx_subject_id` (`subject_id`),
  ADD KEY `idx_exam_subject_id` (`exam_subject_id`);

--
-- Indexes for table `student_job_applications`
--
ALTER TABLE `student_job_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_application_date` (`application_date`);

--
-- Indexes for table `student_leave_requests`
--
ALTER TABLE `student_leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_course_offering` (`course_offering_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dates` (`start_date`,`end_date`),
  ADD KEY `fk_leave_reviewer` (`reviewed_by`);

--
-- Indexes for table `student_library_access_logs`
--
ALTER TABLE `student_library_access_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_resource_id` (`resource_id`),
  ADD KEY `idx_accessed_at` (`accessed_at`);

--
-- Indexes for table `student_library_bookmarks`
--
ALTER TABLE `student_library_bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_resource_bookmark` (`student_id`,`resource_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_resource_id` (`resource_id`),
  ADD KEY `idx_bookmarked_at` (`bookmarked_at`);

--
-- Indexes for table `student_library_downloads`
--
ALTER TABLE `student_library_downloads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_resource_id` (`resource_id`),
  ADD KEY `idx_downloaded_at` (`downloaded_at`);

--
-- Indexes for table `student_notifications`
--
ALTER TABLE `student_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_read` (`is_read`);

--
-- Indexes for table `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_profile` (`student_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `student_resumes`
--
ALTER TABLE `student_resumes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_student_id` (`student_id`);

--
-- Indexes for table `student_revaluation_requests`
--
ALTER TABLE `student_revaluation_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_grade_id` (`grade_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `student_schedule`
--
ALTER TABLE `student_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_session` (`class_session_id`),
  ADD KEY `idx_date` (`session_date`),
  ADD KEY `idx_student_date` (`student_id`,`session_date`);

--
-- Indexes for table `student_semester_results`
--
ALTER TABLE `student_semester_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_semester` (`student_id`,`semester`,`academic_year`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_semester` (`semester`);

--
-- Indexes for table `student_study_sessions`
--
ALTER TABLE `student_study_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_date` (`student_id`,`session_date`);

--
-- Indexes for table `student_users`
--
ALTER TABLE `student_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_no` (`admission_no`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_student_lookup` (`program`,`batch`,`section`,`status`);

--
-- Indexes for table `study_groups`
--
ALTER TABLE `study_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_offering` (`course_offering_id`),
  ADD KEY `idx_program_batch_section` (`program`,`batch`,`section`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_join_type` (`join_type`),
  ADD KEY `fk_study_group_creator` (`created_by_student_id`);

--
-- Indexes for table `study_group_members`
--
ALTER TABLE `study_group_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_group_member` (`group_id`,`student_id`),
  ADD KEY `idx_group_status` (`group_id`,`status`),
  ADD KEY `fk_study_member_student` (`student_id`);

--
-- Indexes for table `study_group_messages`
--
ALTER TABLE `study_group_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_group_created_at` (`group_id`,`created_at`),
  ADD KEY `fk_study_message_student` (`sender_student_id`),
  ADD KEY `fk_study_message_teacher` (`sender_teacher_id`);

--
-- Indexes for table `study_group_teacher_moderators`
--
ALTER TABLE `study_group_teacher_moderators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_group_teacher` (`group_id`,`teacher_id`),
  ADD KEY `fk_study_teacher_teacher` (`teacher_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_code` (`subject_code`),
  ADD UNIQUE KEY `unique_subject_code` (`subject_code`),
  ADD KEY `idx_department` (`department_id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_subject_type` (`subject_type`);

--
-- Indexes for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_offering` (`course_offering_id`),
  ADD KEY `idx_due` (`due_date`),
  ADD KEY `idx_assignment_filters` (`program`,`batch`,`section`,`status`),
  ADD KEY `idx_assignment_subject` (`subject`);

--
-- Indexes for table `teacher_class_sessions`
--
ALTER TABLE `teacher_class_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_offering` (`course_offering_id`),
  ADD KEY `idx_date` (`session_date`);

--
-- Indexes for table `teacher_conversations`
--
ALTER TABLE `teacher_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher_conversations_teacher_id` (`teacher_id`),
  ADD KEY `idx_teacher_conversations_last_message_at` (`last_message_at`);

--
-- Indexes for table `teacher_conversation_participants`
--
ALTER TABLE `teacher_conversation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_conversation_participant` (`conversation_id`,`student_id`),
  ADD KEY `idx_conversation_participants_conversation_id` (`conversation_id`),
  ADD KEY `idx_conversation_participants_student_id` (`student_id`);

--
-- Indexes for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_department` (`department_id`),
  ADD KEY `idx_teacher` (`created_by_teacher_id`);

--
-- Indexes for table `teacher_course_offerings`
--
ALTER TABLE `teacher_course_offerings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`course_id`),
  ADD KEY `idx_teacher` (`teacher_id`),
  ADD KEY `idx_semester` (`semester`,`year`);

--
-- Indexes for table `teacher_idea_sandbox_comments`
--
ALTER TABLE `teacher_idea_sandbox_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_post_id` (`post_id`),
  ADD KEY `idx_teacher_id` (`teacher_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `teacher_idea_sandbox_posts`
--
ALTER TABLE `teacher_idea_sandbox_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_teacher_id` (`teacher_id`);

--
-- Indexes for table `teacher_idea_sandbox_upvotes`
--
ALTER TABLE `teacher_idea_sandbox_upvotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_teacher_upvote` (`post_id`,`teacher_id`),
  ADD KEY `idx_post_id` (`post_id`),
  ADD KEY `idx_teacher_id` (`teacher_id`);

--
-- Indexes for table `teacher_library_resources`
--
ALTER TABLE `teacher_library_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uploaded_by` (`uploaded_by`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_subject` (`subject`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_author` (`author`);
ALTER TABLE `teacher_library_resources` ADD FULLTEXT KEY `idx_fulltext_search` (`title`,`description`,`tags`);

--
-- Indexes for table `teacher_mentorships`
--
ALTER TABLE `teacher_mentorships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_active_mentorship` (`teacher_id`,`student_id`,`status`),
  ADD KEY `idx_teacher_id` (`teacher_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `teacher_messages`
--
ALTER TABLE `teacher_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher_messages_conversation_id` (`conversation_id`),
  ADD KEY `idx_teacher_messages_created_at` (`created_at`),
  ADD KEY `idx_teacher_messages_sender_teacher` (`sender_teacher_id`),
  ADD KEY `idx_teacher_messages_sender_student` (`sender_student_id`);

--
-- Indexes for table `teacher_users`
--
ALTER TABLE `teacher_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `exam_subjects`
--
ALTER TABLE `exam_subjects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `grade_scales`
--
ALTER TABLE `grade_scales`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `live_classes`
--
ALTER TABLE `live_classes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `semester_courses`
--
ALTER TABLE `semester_courses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `student_discussion_comments`
--
ALTER TABLE `student_discussion_comments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `student_discussion_posts`
--
ALTER TABLE `student_discussion_posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `student_discussion_upvotes`
--
ALTER TABLE `student_discussion_upvotes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student_job_applications`
--
ALTER TABLE `student_job_applications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_revaluation_requests`
--
ALTER TABLE `student_revaluation_requests`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_semester_results`
--
ALTER TABLE `student_semester_results`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `teacher_conversations`
--
ALTER TABLE `teacher_conversations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacher_conversation_participants`
--
ALTER TABLE `teacher_conversation_participants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacher_mentorships`
--
ALTER TABLE `teacher_mentorships`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teacher_messages`
--
ALTER TABLE `teacher_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exam_subjects`
--
ALTER TABLE `exam_subjects`
  ADD CONSTRAINT `fk_exam_subject_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exam_subject_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `semester_courses`
--
ALTER TABLE `semester_courses`
  ADD CONSTRAINT `fk_semester_course_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_discussion_comments`
--
ALTER TABLE `student_discussion_comments`
  ADD CONSTRAINT `fk_discussion_comment_post` FOREIGN KEY (`post_id`) REFERENCES `student_discussion_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_discussion_comment_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_discussion_posts`
--
ALTER TABLE `student_discussion_posts`
  ADD CONSTRAINT `fk_discussion_post_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_discussion_upvotes`
--
ALTER TABLE `student_discussion_upvotes`
  ADD CONSTRAINT `fk_discussion_upvote_post` FOREIGN KEY (`post_id`) REFERENCES `student_discussion_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_discussion_upvote_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD CONSTRAINT `fk_grade_exam_subject` FOREIGN KEY (`exam_subject_id`) REFERENCES `exam_subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_grade_semester_result` FOREIGN KEY (`semester_result_id`) REFERENCES `student_semester_results` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_grade_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_job_applications`
--
ALTER TABLE `student_job_applications`
  ADD CONSTRAINT `fk_student_job_application_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_revaluation_requests`
--
ALTER TABLE `student_revaluation_requests`
  ADD CONSTRAINT `fk_revaluation_grade` FOREIGN KEY (`grade_id`) REFERENCES `student_grades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_revaluation_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_semester_results`
--
ALTER TABLE `student_semester_results`
  ADD CONSTRAINT `fk_semester_result_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subject_department` FOREIGN KEY (`department_id`) REFERENCES `mgmt_departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `teacher_conversations`
--
ALTER TABLE `teacher_conversations`
  ADD CONSTRAINT `fk_teacher_conversations_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teacher_conversation_participants`
--
ALTER TABLE `teacher_conversation_participants`
  ADD CONSTRAINT `fk_conversation_participants_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `teacher_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_conversation_participants_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teacher_mentorships`
--
ALTER TABLE `teacher_mentorships`
  ADD CONSTRAINT `fk_mentorship_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mentorship_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_messages`
--
ALTER TABLE `teacher_messages`
  ADD CONSTRAINT `fk_teacher_messages_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `teacher_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacher_messages_student` FOREIGN KEY (`sender_student_id`) REFERENCES `student_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacher_messages_teacher` FOREIGN KEY (`sender_teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
