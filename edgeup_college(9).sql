-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 10, 2025 at 10:36 AM
-- Server version: 8.0.44-0ubuntu0.24.04.1
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
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint UNSIGNED NOT NULL,
  `type` enum('one_to_one','course_group','section_group') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_offering_id` bigint UNSIGNED DEFAULT NULL,
  `batch` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `section` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_id` bigint UNSIGNED NOT NULL,
  `created_by_type` enum('teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_archived` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_message_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `id` bigint UNSIGNED NOT NULL,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `user_type` enum('teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','member') COLLATE utf8mb4_unicode_ci DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_muted` tinyint DEFAULT '0',
  `is_archived` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(7, 3, 'DSA', 'DSA', 'Biology', 'https://meet.google.com/kub-scyk-uqy', '2025-12-04', '15:51:00', 60, 'CSE - Computer Science and Engineering', '2024', 'A', 'SCHEDULED', NULL, NULL, '2025-12-04 10:20:47', '2025-12-04 10:20:47'),
(8, 3, 'Formula 1', 'F1 DESC', 'Mathematics', 'https://meet.google.com/kub-scyk-uqy', '2025-12-04', '15:58:00', 60, 'CSE - Computer Science and Engineering', '2024', 'A', 'SCHEDULED', NULL, NULL, '2025-12-04 10:27:00', '2025-12-04 10:27:00'),
(10, 3, 'test', 'stes', 'Mathematics', 'https://meet.google.com/kub-scyk-uqy?pli=1', '2025-12-05', '12:45:00', 60, 'CSE - Computer Science and Engineering', '2024', 'A', 'SCHEDULED', NULL, NULL, '2025-12-05 07:11:46', '2025-12-05 07:11:46');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint UNSIGNED NOT NULL,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `sender_id` bigint UNSIGNED NOT NULL,
  `sender_type` enum('teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('text','file','image') COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `priority` enum('normal','important','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `parent_message_id` bigint UNSIGNED DEFAULT NULL,
  `is_edited` tinyint DEFAULT '0',
  `is_deleted` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_attachments`
--

CREATE TABLE `message_attachments` (
  `id` bigint UNSIGNED NOT NULL,
  `message_id` bigint UNSIGNED NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_read_receipts`
--

CREATE TABLE `message_read_receipts` (
  `id` bigint UNSIGNED NOT NULL,
  `message_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `user_type` enum('teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_tags`
--

CREATE TABLE `message_tags` (
  `id` bigint UNSIGNED NOT NULL,
  `message_id` bigint UNSIGNED NOT NULL,
  `tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_academic_terms`
--

CREATE TABLE `mgmt_academic_terms` (
  `id` bigint UNSIGNED NOT NULL,
  `term_name` varchar(100) NOT NULL,
  `term_code` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
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
-- Table structure for table `mgmt_alerts`
--

CREATE TABLE `mgmt_alerts` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text,
  `alert_type` enum('Maintenance','Policy','Security','General') DEFAULT 'General',
  `severity` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_audit_logs`
--

CREATE TABLE `mgmt_audit_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `actor_id` bigint UNSIGNED DEFAULT NULL,
  `actor_type` enum('Admin','Teacher','Student','System') DEFAULT 'Admin',
  `action` varchar(255) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `record_id` bigint UNSIGNED NOT NULL,
  `old_value` text,
  `new_value` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
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
-- Table structure for table `mgmt_compliance_records`
--

CREATE TABLE `mgmt_compliance_records` (
  `id` bigint UNSIGNED NOT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `compliance_type` varchar(255) DEFAULT NULL,
  `status` enum('Pending','InProgress','Compliant','NonCompliant') DEFAULT 'Pending',
  `last_audit_date` date DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `notes` text,
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
-- Table structure for table `mgmt_institutional_metrics`
--

CREATE TABLE `mgmt_institutional_metrics` (
  `id` bigint UNSIGNED NOT NULL,
  `metric_name` varchar(255) NOT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `value` decimal(12,4) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_placement_stats`
--

CREATE TABLE `mgmt_placement_stats` (
  `id` bigint UNSIGNED NOT NULL,
  `department_id` bigint UNSIGNED NOT NULL,
  `year` smallint NOT NULL,
  `placement_rate` decimal(5,2) DEFAULT NULL,
  `placements_count` int DEFAULT NULL,
  `avg_salary` decimal(12,2) DEFAULT NULL,
  `notes` text,
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
-- Table structure for table `mgmt_report_exports`
--

CREATE TABLE `mgmt_report_exports` (
  `id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED NOT NULL,
  `report_type` varchar(255) NOT NULL,
  `parameters` json DEFAULT NULL,
  `exported_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mgmt_research_publications`
--

CREATE TABLE `mgmt_research_publications` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(1024) NOT NULL,
  `authors` text,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `publication_year` smallint DEFAULT NULL,
  `venue` varchar(512) DEFAULT NULL,
  `citation_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Table structure for table `student_alerts`
--

CREATE TABLE `student_alerts` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `alert_type` enum('Deadline','LowAttendance','OverdueFee','Warning') NOT NULL,
  `message` text,
  `status` enum('Active','Resolved') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL
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
(8, 8, 8, 'submitted', '2025-12-04 10:14:25', NULL, 'dasdasdas', NULL, NULL, NULL, '2025-12-02 11:59:05', '2025-12-04 04:44:24'),
(9, 9, 8, 'submitted', '2025-12-04 10:14:19', NULL, 'dasdasd', NULL, NULL, NULL, '2025-12-02 12:03:41', '2025-12-04 04:44:19'),
(10, 10, 8, 'submitted', '2025-12-04 10:14:27', NULL, 'dasdasdasdasd', NULL, NULL, NULL, '2025-12-02 12:09:34', '2025-12-04 04:44:27'),
(11, 11, 8, 'submitted', '2025-12-04 10:15:46', NULL, 'rerewrwerwerewr', NULL, NULL, NULL, '2025-12-04 04:45:20', '2025-12-04 04:45:45'),
(12, 13, 8, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-04 10:42:33', '2025-12-04 10:42:33'),
(13, 14, 8, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-05 07:12:25', '2025-12-05 07:12:25');

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED DEFAULT NULL,
  `class_session_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `attendance_date` varchar(255) DEFAULT NULL,
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
(1, 1, NULL, 'Sameer', '12/05/2004', NULL, 'present', NULL, NULL, '2025-11-29 13:22:31'),
(2, 8, 64, NULL, '2025-01-06', NULL, 'present', 1, 'On time', '2025-12-03 14:14:35'),
(3, 8, 443, NULL, '2025-12-03', NULL, 'present', 3, NULL, '2025-12-03 15:40:36'),
(4, 8, 444, NULL, '2025-12-04', NULL, 'present', 3, NULL, '2025-12-04 16:13:18'),
(5, 8, 572, NULL, '2025-12-05', NULL, 'present', 3, NULL, '2025-12-05 12:40:52'),
(6, 8, 468, NULL, '2025-12-15', NULL, 'present', 3, NULL, '2025-12-05 16:43:26'),
(7, 8, 445, NULL, '2025-12-05', NULL, 'present', 3, NULL, '2025-12-05 18:44:25');

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
(7, 8, 'aaaa', 'assignment', '2026-02-05', NULL, 'Mathematics', 'aaa', '#FF6B6B', '2025-12-02 12:09:34', '2025-12-02 12:09:34'),
(8, 8, 'dfsdfafdasda', 'assignment', '2025-10-12', NULL, 'Physics', 'fdgfgfdggdfg', '#FF6B6B', '2025-12-04 04:45:20', '2025-12-04 04:45:20'),
(9, 8, 'SADAsda', 'assignment', '2026-01-01', NULL, 'Physics', 'sadasdasdasds', '#FF6B6B', '2025-12-04 10:42:33', '2025-12-04 10:42:33'),
(10, 8, 'test', 'assignment', '2025-12-05', NULL, 'Mathematics', 'test', '#FF6B6B', '2025-12-05 07:12:25', '2025-12-05 07:12:25'),
(11, 8, 'tsts', 'class', '2025-12-06', NULL, NULL, NULL, NULL, '2025-12-05 07:20:39', '2025-12-05 07:20:39');

-- --------------------------------------------------------

--
-- Table structure for table `student_career_applications`
--

CREATE TABLE `student_career_applications` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `applied_on` date DEFAULT NULL,
  `status` enum('Applied','Shortlisted','Interview','Offered','Rejected') DEFAULT 'Applied',
  `notes` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_documents`
--

CREATE TABLE `student_documents` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `category` enum('ID','Assignment','Certificate','Other') DEFAULT 'Other',
  `file_url` varchar(1024) DEFAULT NULL,
  `pinata_hash` varchar(255) DEFAULT NULL,
  `pinned` tinyint(1) DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
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
(1, 3, 1, '2025-12-02 06:33:04', 'active'),
(2, 4, 1, '2025-12-02 06:33:04', 'active'),
(3, 8, 3, '2025-12-03 08:42:40', 'active'),
(4, 8, 4, '2025-12-03 09:39:21', 'active'),
(5, 8, 5, '2025-12-03 09:41:22', 'active'),
(6, 8, 6, '2025-12-04 10:47:14', 'active'),
(7, 8, 7, '2025-12-05 07:10:04', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `student_grades`
--

CREATE TABLE `student_grades` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `assignment_id` bigint UNSIGNED DEFAULT NULL,
  `assessment_id` bigint UNSIGNED DEFAULT NULL,
  `marks_obtained` decimal(6,2) DEFAULT NULL,
  `max_marks` decimal(6,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `grade_type` enum('Assignment','Assessment','Final') DEFAULT 'Assignment',
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

--
-- Dumping data for table `student_job_applications`
--

INSERT INTO `student_job_applications` (`id`, `student_id`, `company_name`, `company_logo`, `position`, `application_date`, `status`, `job_type`, `location`, `salary`, `description`, `job_url`, `notes`, `interview_date`, `offer_deadline`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 8, 'Google', NULL, 'Software Engineer', '2025-12-09', 'applied', 'Job', 'Chennai , India', '8000', 'A very good description', 'https://google.com', 'Who are you and what are you?', NULL, NULL, NULL, '2025-12-09 10:21:20', '2025-12-09 11:35:21'),
(2, 8, 'Amazon', NULL, 'Devops', '2025-12-09', 'applied', 'Internship', 'Bangalore, India', '60,000', 'AWS Desc', 'https://amazon.in', 'AWS Notes', NULL, NULL, NULL, '2025-12-09 11:33:35', '2025-12-09 11:35:19');

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

--
-- Dumping data for table `student_library_access_logs`
--

INSERT INTO `student_library_access_logs` (`id`, `student_id`, `resource_id`, `accessed_at`) VALUES
(1, 8, 4, '2025-12-03 11:25:12'),
(2, 8, 4, '2025-12-03 11:33:47'),
(3, 8, 5, '2025-12-03 13:34:11'),
(4, 8, 5, '2025-12-04 04:38:25'),
(5, 8, 5, '2025-12-05 11:03:59');

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

--
-- Dumping data for table `student_library_bookmarks`
--

INSERT INTO `student_library_bookmarks` (`id`, `student_id`, `resource_id`, `bookmarked_at`) VALUES
(2, 8, 5, '2025-12-05 11:03:26');

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

--
-- Dumping data for table `student_library_downloads`
--

INSERT INTO `student_library_downloads` (`id`, `student_id`, `resource_id`, `downloaded_at`) VALUES
(1, 8, 4, '2025-12-03 11:25:12'),
(2, 8, 4, '2025-12-03 11:33:47'),
(3, 8, 5, '2025-12-03 13:34:11'),
(4, 8, 5, '2025-12-04 04:38:25'),
(5, 8, 5, '2025-12-05 11:03:59');

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
(1, 8, '{\"awards\": [{\"id\": \"hsgqq6mko\", \"date\": \"\", \"title\": \"AWS\", \"description\": \"\", \"organization\": \"\"}], \"skills\": [{\"id\": \"xnpr62cdo\", \"name\": \"AWS\", \"category\": \"technical\", \"proficiency\": \"intermediate\"}, {\"id\": \"zqrpawlo1\", \"name\": \"REACT\", \"category\": \"technical\", \"proficiency\": \"intermediate\"}], \"summary\": {\"summary\": \"i am a good boy\"}, \"projects\": [{\"id\": \"x3mmjdahx\", \"name\": \"My good project\", \"endDate\": \"\", \"liveUrl\": \"\", \"githubUrl\": \"\", \"startDate\": \"\", \"description\": \"My good project desc\", \"technologies\": []}], \"education\": [{\"id\": \"psvlxvbfs\", \"gpa\": \"\", \"degree\": \"BSC\", \"endDate\": \"\", \"startDate\": \"\", \"institution\": \"anna\", \"isCurrently\": false, \"fieldOfStudy\": \"CS\", \"relevantCoursework\": []}], \"experience\": [{\"id\": \"v36puv11e\", \"company\": \"MNC\", \"endDate\": \"\", \"jobTitle\": \"Software Engineer\", \"location\": \"\", \"startDate\": \"\", \"description\": [\"\"], \"isCurrently\": false}], \"personalInfo\": {\"email\": \"aakif@gmail.com\", \"phone\": \"+919585499783\", \"github\": \"\", \"fullName\": \"Aakif\", \"linkedIn\": \"\", \"location\": \"\", \"portfolio\": \"\"}, \"certifications\": [{\"id\": \"kq0o48a1f\", \"name\": \"AWS\", \"issueDate\": \"\", \"credentialId\": \"\", \"credentialUrl\": \"\", \"expirationDate\": \"\", \"issuingOrganization\": \"AWS\"}], \"extracurriculars\": [{\"id\": \"ppva8nfr2\", \"role\": \"\", \"endDate\": \"\", \"activity\": \"MAX CLUB\", \"startDate\": \"\", \"description\": \"\", \"organization\": \"\"}]}', 'modern', 1, '2025-12-08 09:31:57', 37, 32, '2025-12-08 09:30:04', '2025-12-09 05:00:30');

-- --------------------------------------------------------

--
-- Table structure for table `student_roles`
--

CREATE TABLE `student_roles` (
  `id` bigint UNSIGNED NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_role_map`
--

CREATE TABLE `student_role_map` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(405, 8, 468, '2025-12-15', '09:00:00', 'Room 204'),
(406, 8, 469, '2025-12-16', '09:00:00', 'Room 204'),
(407, 8, 470, '2025-12-22', '09:00:00', 'Room 204'),
(408, 8, 471, '2025-12-23', '09:00:00', 'Room 204'),
(409, 8, 472, '2025-12-29', '09:00:00', 'Room 204'),
(410, 8, 473, '2025-12-30', '09:00:00', 'Room 204'),
(411, 8, 474, '2026-01-05', '09:00:00', 'Room 204'),
(412, 8, 475, '2026-01-06', '09:00:00', 'Room 204'),
(413, 8, 476, '2026-01-12', '09:00:00', 'Room 204'),
(414, 8, 477, '2026-01-13', '09:00:00', 'Room 204'),
(415, 8, 478, '2026-01-19', '09:00:00', 'Room 204'),
(416, 8, 479, '2026-01-20', '09:00:00', 'Room 204'),
(417, 8, 480, '2026-01-26', '09:00:00', 'Room 204'),
(418, 8, 481, '2026-01-27', '09:00:00', 'Room 204'),
(419, 8, 482, '2026-02-02', '09:00:00', 'Room 204'),
(420, 8, 483, '2026-02-03', '09:00:00', 'Room 204'),
(421, 8, 484, '2026-02-09', '09:00:00', 'Room 204'),
(422, 8, 485, '2026-02-10', '09:00:00', 'Room 204'),
(423, 8, 486, '2026-02-16', '09:00:00', 'Room 204'),
(424, 8, 487, '2026-02-17', '09:00:00', 'Room 204'),
(425, 8, 488, '2026-02-23', '09:00:00', 'Room 204'),
(426, 8, 489, '2026-02-24', '09:00:00', 'Room 204'),
(427, 8, 490, '2026-03-02', '09:00:00', 'Room 204'),
(428, 8, 491, '2026-03-03', '09:00:00', 'Room 204'),
(429, 8, 492, '2026-03-09', '09:00:00', 'Room 204'),
(430, 8, 493, '2026-03-10', '09:00:00', 'Room 204'),
(431, 8, 494, '2026-03-16', '09:00:00', 'Room 204'),
(432, 8, 495, '2026-03-17', '09:00:00', 'Room 204'),
(433, 8, 496, '2026-03-23', '09:00:00', 'Room 204'),
(434, 8, 497, '2026-03-24', '09:00:00', 'Room 204'),
(435, 8, 498, '2026-03-30', '09:00:00', 'Room 204'),
(436, 8, 499, '2026-03-31', '09:00:00', 'Room 204'),
(437, 8, 500, '2026-04-06', '09:00:00', 'Room 204'),
(438, 8, 501, '2026-04-07', '09:00:00', 'Room 204'),
(439, 8, 502, '2026-04-13', '09:00:00', 'Room 204'),
(440, 8, 503, '2026-04-14', '09:00:00', 'Room 204'),
(441, 8, 504, '2026-04-20', '09:00:00', 'Room 204'),
(442, 8, 505, '2026-04-21', '09:00:00', 'Room 204'),
(443, 8, 506, '2026-04-27', '09:00:00', 'Room 204'),
(444, 8, 507, '2026-04-28', '09:00:00', 'Room 204'),
(445, 8, 508, '2026-05-04', '09:00:00', 'Room 204'),
(446, 8, 509, '2026-05-05', '09:00:00', 'Room 204'),
(447, 8, 510, '2026-05-11', '09:00:00', 'Room 204'),
(448, 8, 511, '2026-05-12', '09:00:00', 'Room 204'),
(449, 8, 512, '2026-05-18', '09:00:00', 'Room 204'),
(450, 8, 513, '2026-05-19', '09:00:00', 'Room 204'),
(451, 8, 514, '2026-05-25', '09:00:00', 'Room 204'),
(452, 8, 515, '2026-05-26', '09:00:00', 'Room 204'),
(453, 8, 516, '2026-06-01', '09:00:00', 'Room 204'),
(454, 8, 517, '2026-06-02', '09:00:00', 'Room 204'),
(455, 8, 518, '2026-06-08', '09:00:00', 'Room 204'),
(456, 8, 519, '2026-06-09', '09:00:00', 'Room 204'),
(457, 8, 520, '2026-06-15', '09:00:00', 'Room 204'),
(458, 8, 521, '2026-06-16', '09:00:00', 'Room 204'),
(459, 8, 522, '2026-06-22', '09:00:00', 'Room 204'),
(460, 8, 523, '2026-06-23', '09:00:00', 'Room 204'),
(461, 8, 524, '2026-06-29', '09:00:00', 'Room 204'),
(462, 8, 525, '2026-06-30', '09:00:00', 'Room 204'),
(463, 8, 526, '2026-07-06', '09:00:00', 'Room 204'),
(464, 8, 527, '2026-07-07', '09:00:00', 'Room 204'),
(465, 8, 528, '2026-07-13', '09:00:00', 'Room 204'),
(466, 8, 529, '2026-07-14', '09:00:00', 'Room 204'),
(467, 8, 530, '2026-07-20', '09:00:00', 'Room 204'),
(468, 8, 531, '2026-07-21', '09:00:00', 'Room 204'),
(469, 8, 532, '2026-07-27', '09:00:00', 'Room 204'),
(470, 8, 533, '2026-07-28', '09:00:00', 'Room 204'),
(471, 8, 534, '2026-08-03', '09:00:00', 'Room 204'),
(472, 8, 535, '2026-08-04', '09:00:00', 'Room 204'),
(473, 8, 536, '2026-08-10', '09:00:00', 'Room 204'),
(474, 8, 537, '2026-08-11', '09:00:00', 'Room 204'),
(475, 8, 538, '2026-08-17', '09:00:00', 'Room 204'),
(476, 8, 539, '2026-08-18', '09:00:00', 'Room 204'),
(477, 8, 540, '2026-08-24', '09:00:00', 'Room 204'),
(478, 8, 541, '2026-08-25', '09:00:00', 'Room 204'),
(479, 8, 542, '2026-08-31', '09:00:00', 'Room 204'),
(480, 8, 543, '2026-09-01', '09:00:00', 'Room 204'),
(481, 8, 544, '2026-09-07', '09:00:00', 'Room 204'),
(482, 8, 545, '2026-09-08', '09:00:00', 'Room 204'),
(483, 8, 546, '2026-09-14', '09:00:00', 'Room 204'),
(484, 8, 547, '2026-09-15', '09:00:00', 'Room 204'),
(485, 8, 548, '2026-09-21', '09:00:00', 'Room 204'),
(486, 8, 549, '2026-09-22', '09:00:00', 'Room 204'),
(487, 8, 550, '2026-09-28', '09:00:00', 'Room 204'),
(488, 8, 551, '2026-09-29', '09:00:00', 'Room 204'),
(489, 8, 552, '2026-10-05', '09:00:00', 'Room 204'),
(490, 8, 553, '2026-10-06', '09:00:00', 'Room 204'),
(491, 8, 554, '2026-10-12', '09:00:00', 'Room 204'),
(492, 8, 555, '2026-10-13', '09:00:00', 'Room 204'),
(493, 8, 556, '2026-10-19', '09:00:00', 'Room 204'),
(494, 8, 557, '2026-10-20', '09:00:00', 'Room 204'),
(495, 8, 558, '2026-10-26', '09:00:00', 'Room 204'),
(496, 8, 559, '2026-10-27', '09:00:00', 'Room 204'),
(497, 8, 560, '2026-11-02', '09:00:00', 'Room 204'),
(498, 8, 561, '2026-11-03', '09:00:00', 'Room 204'),
(499, 8, 562, '2026-11-09', '09:00:00', 'Room 204'),
(500, 8, 563, '2026-11-10', '09:00:00', 'Room 204'),
(501, 8, 564, '2026-11-16', '09:00:00', 'Room 204'),
(502, 8, 565, '2026-11-17', '09:00:00', 'Room 204'),
(503, 8, 566, '2026-11-23', '09:00:00', 'Room 204'),
(504, 8, 567, '2026-11-24', '09:00:00', 'Room 204'),
(505, 8, 568, '2026-11-30', '09:00:00', 'Room 204'),
(506, 8, 569, '2026-12-01', '09:00:00', 'Room 204'),
(507, 8, 570, '2026-12-07', '09:00:00', 'Room 204'),
(508, 8, 571, '2026-12-08', '09:00:00', 'Room 204'),
(509, 8, 572, '2025-12-05', '09:00:00', '211'),
(510, 8, 573, '2025-12-06', '09:00:00', '211'),
(511, 8, 574, '2025-12-07', '09:00:00', '211'),
(512, 8, 575, '2025-12-08', '09:00:00', '211'),
(513, 8, 576, '2025-12-09', '09:00:00', '211'),
(514, 8, 577, '2025-12-10', '09:00:00', '211'),
(515, 8, 578, '2025-12-11', '09:00:00', '211'),
(516, 8, 579, '2025-12-12', '09:00:00', '211'),
(517, 8, 580, '2025-12-13', '09:00:00', '211'),
(518, 8, 581, '2025-12-14', '09:00:00', '211'),
(519, 8, 582, '2025-12-15', '09:00:00', '211'),
(520, 8, 583, '2025-12-16', '09:00:00', '211'),
(521, 8, 584, '2025-12-17', '09:00:00', '211'),
(522, 8, 585, '2025-12-18', '09:00:00', '211'),
(523, 8, 586, '2025-12-19', '09:00:00', '211'),
(524, 8, 587, '2025-12-20', '09:00:00', '211'),
(525, 8, 588, '2025-12-21', '09:00:00', '211'),
(526, 8, 589, '2025-12-22', '09:00:00', '211'),
(527, 8, 590, '2025-12-23', '09:00:00', '211'),
(528, 8, 591, '2025-12-24', '09:00:00', '211'),
(529, 8, 592, '2025-12-25', '09:00:00', '211'),
(530, 8, 593, '2025-12-26', '09:00:00', '211'),
(531, 8, 594, '2025-12-27', '09:00:00', '211'),
(532, 8, 595, '2025-12-28', '09:00:00', '211'),
(533, 8, 596, '2025-12-29', '09:00:00', '211'),
(534, 8, 597, '2025-12-30', '09:00:00', '211'),
(535, 8, 598, '2025-12-31', '09:00:00', '211');

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
(8, 'ADM-2-24-001', 'Muhammed', 'Aakif', 'aakif@gmail.com', NULL, '$2b$12$fr968kdoQR1EfAhjCIHRG.n6mBSAuiP9xxX15sosm6dXtZqHee7JO', 'CSE - Computer Science and Engineering', '2024', NULL, 'active', NULL, '2025-12-02 11:57:49', '2025-12-02 11:57:49', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `student_wellness_logs`
--

CREATE TABLE `student_wellness_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `log_type` enum('Counseling','Health','Behavior','Other') DEFAULT 'Other',
  `notes` text,
  `counselor_name` varchar(255) DEFAULT NULL,
  `session_date` date DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `confidential` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(1, 'DSA Group', 'DSA DESC', 'CS', NULL, 'CSE', '2024', 'A', 'open', NULL, 25, 1, 8, 'active', '2025-12-06 10:51:07', '2025-12-06 10:51:07');

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
(1, 1, 8, 'owner', 'joined', '2025-12-06 10:51:08', '2025-12-06 10:51:07', '2025-12-06 10:51:07');

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
(1, 1, 8, NULL, 'text', 'hello', '2025-12-06 10:51:59');

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
-- Table structure for table `teacher_assessments`
--

CREATE TABLE `teacher_assessments` (
  `id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `assessment_date` datetime NOT NULL,
  `duration_minutes` int NOT NULL,
  `max_marks` int NOT NULL,
  `type` enum('Quiz','Midterm','Final','Viva','LabExam') DEFAULT 'Quiz',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(10, 1, 'aaaa', 'aaa', '2026-02-05 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-02 12:09:34', '2025-12-04 10:42:08', 'MEDIUM', NULL, 3, 'ARCHIVED'),
(11, 1, 'dfsdfafdasda', 'fdgfgfdggdfg', '2025-10-12 05:30:00', 'Assignment', 'Physics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-04 04:45:20', '2025-12-04 10:42:05', 'LOW', NULL, 3, 'ARCHIVED'),
(12, 1, 'qwertyui', 'kdsljkgfgnfds,fmsdf', '2026-10-12 05:30:00', 'Project', 'Mathematics', 'CHEM - Chemical Engineering', '2023', 'B', 0.00, 100, '2025-12-04 04:46:27', '2025-12-04 04:46:27', 'MEDIUM', NULL, 3, 'ACTIVE'),
(13, 1, 'SADAsda', 'sadasdasdasds', '2026-01-01 05:30:00', 'Project', 'Physics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-04 10:42:33', '2025-12-04 10:42:33', 'HIGH', NULL, 3, 'ACTIVE'),
(14, 1, 'test', 'test', '2025-12-05 05:30:00', 'Assignment', 'Mathematics', 'CSE - Computer Science and Engineering', '2024', 'A', 0.00, 100, '2025-12-05 07:12:25', '2025-12-05 07:12:25', 'MEDIUM', NULL, 3, 'ACTIVE');

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
(468, 6, '2025-12-15', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(469, 6, '2025-12-16', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(470, 6, '2025-12-22', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(471, 6, '2025-12-23', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(472, 6, '2025-12-29', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(473, 6, '2025-12-30', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(474, 6, '2026-01-05', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(475, 6, '2026-01-06', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(476, 6, '2026-01-12', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(477, 6, '2026-01-13', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(478, 6, '2026-01-19', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(479, 6, '2026-01-20', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(480, 6, '2026-01-26', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(481, 6, '2026-01-27', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(482, 6, '2026-02-02', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(483, 6, '2026-02-03', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(484, 6, '2026-02-09', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(485, 6, '2026-02-10', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(486, 6, '2026-02-16', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(487, 6, '2026-02-17', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(488, 6, '2026-02-23', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(489, 6, '2026-02-24', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(490, 6, '2026-03-02', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(491, 6, '2026-03-03', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(492, 6, '2026-03-09', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(493, 6, '2026-03-10', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(494, 6, '2026-03-16', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(495, 6, '2026-03-17', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(496, 6, '2026-03-23', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(497, 6, '2026-03-24', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(498, 6, '2026-03-30', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(499, 6, '2026-03-31', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(500, 6, '2026-04-06', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(501, 6, '2026-04-07', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(502, 6, '2026-04-13', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(503, 6, '2026-04-14', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14');
INSERT INTO `teacher_class_sessions` (`id`, `course_offering_id`, `session_date`, `start_time`, `duration_minutes`, `room`, `session_type`, `department_id`, `batch`, `section`, `created_at`) VALUES
(504, 6, '2026-04-20', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(505, 6, '2026-04-21', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(506, 6, '2026-04-27', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(507, 6, '2026-04-28', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(508, 6, '2026-05-04', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(509, 6, '2026-05-05', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(510, 6, '2026-05-11', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(511, 6, '2026-05-12', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(512, 6, '2026-05-18', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(513, 6, '2026-05-19', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(514, 6, '2026-05-25', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(515, 6, '2026-05-26', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(516, 6, '2026-06-01', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(517, 6, '2026-06-02', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(518, 6, '2026-06-08', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(519, 6, '2026-06-09', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(520, 6, '2026-06-15', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(521, 6, '2026-06-16', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(522, 6, '2026-06-22', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(523, 6, '2026-06-23', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(524, 6, '2026-06-29', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(525, 6, '2026-06-30', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(526, 6, '2026-07-06', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(527, 6, '2026-07-07', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(528, 6, '2026-07-13', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(529, 6, '2026-07-14', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(530, 6, '2026-07-20', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(531, 6, '2026-07-21', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(532, 6, '2026-07-27', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(533, 6, '2026-07-28', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(534, 6, '2026-08-03', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(535, 6, '2026-08-04', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(536, 6, '2026-08-10', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(537, 6, '2026-08-11', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(538, 6, '2026-08-17', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(539, 6, '2026-08-18', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(540, 6, '2026-08-24', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(541, 6, '2026-08-25', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(542, 6, '2026-08-31', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(543, 6, '2026-09-01', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(544, 6, '2026-09-07', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(545, 6, '2026-09-08', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(546, 6, '2026-09-14', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(547, 6, '2026-09-15', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(548, 6, '2026-09-21', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(549, 6, '2026-09-22', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(550, 6, '2026-09-28', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(551, 6, '2026-09-29', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(552, 6, '2026-10-05', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(553, 6, '2026-10-06', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(554, 6, '2026-10-12', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(555, 6, '2026-10-13', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(556, 6, '2026-10-19', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(557, 6, '2026-10-20', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(558, 6, '2026-10-26', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(559, 6, '2026-10-27', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(560, 6, '2026-11-02', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(561, 6, '2026-11-03', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(562, 6, '2026-11-09', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(563, 6, '2026-11-10', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(564, 6, '2026-11-16', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(565, 6, '2026-11-17', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(566, 6, '2026-11-23', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(567, 6, '2026-11-24', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(568, 6, '2026-11-30', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(569, 6, '2026-12-01', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(570, 6, '2026-12-07', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(571, 6, '2026-12-08', '09:00:00', 60, 'Room 204', 'Lecture', NULL, '2024', 'A', '2025-12-04 10:47:14'),
(572, 7, '2025-12-05', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(573, 7, '2025-12-06', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(574, 7, '2025-12-07', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(575, 7, '2025-12-08', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(576, 7, '2025-12-09', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(577, 7, '2025-12-10', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(578, 7, '2025-12-11', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(579, 7, '2025-12-12', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(580, 7, '2025-12-13', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(581, 7, '2025-12-14', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(582, 7, '2025-12-15', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(583, 7, '2025-12-16', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(584, 7, '2025-12-17', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(585, 7, '2025-12-18', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(586, 7, '2025-12-19', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(587, 7, '2025-12-20', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(588, 7, '2025-12-21', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(589, 7, '2025-12-22', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(590, 7, '2025-12-23', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(591, 7, '2025-12-24', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(592, 7, '2025-12-25', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(593, 7, '2025-12-26', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(594, 7, '2025-12-27', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(595, 7, '2025-12-28', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(596, 7, '2025-12-29', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(597, 7, '2025-12-30', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04'),
(598, 7, '2025-12-31', '09:00:00', 60, '211', 'Lecture', NULL, '2024', 'A', '2025-12-05 07:10:04');

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
(6, 3, 'Conversation with Mohamed Sameer', '2025-12-10 10:17:44', 0, '2025-12-10 09:59:59', '2025-12-10 10:17:43');

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
(6, 6, 8, '2025-12-10 09:59:59', '2025-12-10 09:59:59');

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
(5, NULL, 'CS102', 'Python', NULL, 3, 3, '2025-12-04 10:47:14', '2025-12-04 10:47:14'),
(6, NULL, 'test', 'test', NULL, 3, 3, '2025-12-05 07:10:04', '2025-12-05 07:10:04');

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
(6, 5, 3, 'Spring', 2025, 'A', NULL, 0, '2025-12-04 10:47:14', '2025-12-04 10:47:14'),
(7, 6, 3, 'Spring', 2025, 'A', NULL, 0, '2025-12-05 07:10:04', '2025-12-05 07:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_grades`
--

CREATE TABLE `teacher_grades` (
  `id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `final_grade` varchar(5) DEFAULT NULL,
  `cgpa` decimal(4,2) DEFAULT NULL,
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_grading_components`
--

CREATE TABLE `teacher_grading_components` (
  `id` bigint UNSIGNED NOT NULL,
  `course_offering_id` bigint UNSIGNED NOT NULL,
  `component_name` varchar(255) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `max_marks` int DEFAULT '100',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_idea_sandbox_comments`
--

CREATE TABLE `teacher_idea_sandbox_comments` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_idea_sandbox_comments`
--

INSERT INTO `teacher_idea_sandbox_comments` (`id`, `post_id`, `teacher_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Its good', '2025-12-09 04:52:10', '2025-12-09 04:52:10'),
(2, 1, 3, 'I think this idea is better\n', '2025-12-09 04:52:31', '2025-12-09 04:52:31'),
(3, 1, 4, 'Yeah its good man\n', '2025-12-09 05:13:03', '2025-12-09 05:13:03');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_idea_sandbox_posts`
--

CREATE TABLE `teacher_idea_sandbox_posts` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `type` enum('idea','question') COLLATE utf8mb4_unicode_ci DEFAULT 'idea',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Pedagogical Strategies','Assessment Methods','Technology Integration','Classroom Management') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('active','archived','flagged') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `upvote_count` int UNSIGNED DEFAULT '0',
  `comment_count` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_idea_sandbox_posts`
--

INSERT INTO `teacher_idea_sandbox_posts` (`id`, `teacher_id`, `type`, `title`, `description`, `category`, `tags`, `status`, `upvote_count`, `comment_count`, `created_at`, `updated_at`) VALUES
(1, 3, 'idea', 'testtesttest', 'testtesttesttetttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', 'Assessment Methods', '[\"Classroom Activities\", \"Student Engagement\"]', 'active', 2, 3, '2025-12-09 04:48:18', '2025-12-09 05:50:32');

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

--
-- Dumping data for table `teacher_idea_sandbox_upvotes`
--

INSERT INTO `teacher_idea_sandbox_upvotes` (`id`, `post_id`, `teacher_id`, `created_at`) VALUES
(18, 1, 4, '2025-12-09 05:43:40'),
(20, 1, 3, '2025-12-09 05:50:32');

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
(14, 6, 'student', NULL, 8, 'Hello sir , how are you?', 1, '2025-12-10 10:00:07'),
(15, 6, 'teacher', 3, NULL, 'i am fine man , how are you ?', 1, '2025-12-10 10:00:20'),
(16, 6, 'student', NULL, 8, 'i am good , how are you sir', 1, '2025-12-10 10:04:31'),
(17, 6, 'student', NULL, 8, 'hello?', 1, '2025-12-10 10:04:50'),
(18, 6, 'teacher', 3, NULL, 'yes', 1, '2025-12-10 10:04:56'),
(19, 6, 'teacher', 3, NULL, 'ok good ?', 1, '2025-12-10 10:05:10'),
(20, 6, 'student', NULL, 8, 'hmm', 1, '2025-12-10 10:05:19'),
(21, 6, 'teacher', 3, NULL, 'y', 1, '2025-12-10 10:06:31'),
(22, 6, 'student', NULL, 8, 'u', 1, '2025-12-10 10:06:34'),
(23, 6, 'student', NULL, 8, 'ok sir ', 1, '2025-12-10 10:06:51'),
(24, 6, 'teacher', 3, NULL, 'ok aakif', 1, '2025-12-10 10:06:56'),
(25, 6, 'student', NULL, 8, 'hmm', 1, '2025-12-10 10:07:56'),
(26, 6, 'student', NULL, 8, 'hello', 1, '2025-12-10 10:09:29'),
(27, 6, 'teacher', 3, NULL, 'ok', 1, '2025-12-10 10:09:37'),
(28, 6, 'student', NULL, 8, 'okokok', 1, '2025-12-10 10:11:19'),
(29, 6, 'student', NULL, 8, 'now ', 1, '2025-12-10 10:11:30'),
(30, 6, 'student', NULL, 8, 'hmmm', 1, '2025-12-10 10:13:11'),
(31, 6, 'teacher', 3, NULL, 'okok', 1, '2025-12-10 10:13:18'),
(32, 6, 'teacher', 3, NULL, 'okay', 1, '2025-12-10 10:14:39'),
(33, 6, 'student', NULL, 8, 'who are you??', 1, '2025-12-10 10:17:27'),
(34, 6, 'student', NULL, 8, '?', 1, '2025-12-10 10:17:35'),
(35, 6, 'teacher', 3, NULL, 'i am ghost', 1, '2025-12-10 10:17:43');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_notifications`
--

CREATE TABLE `teacher_notifications` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_office_hours`
--

CREATE TABLE `teacher_office_hours` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `weekday` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_permissions`
--

CREATE TABLE `teacher_permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_roles`
--

CREATE TABLE `teacher_roles` (
  `id` bigint UNSIGNED NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_role_map`
--

CREATE TABLE `teacher_role_map` (
  `id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_submissions`
--

CREATE TABLE `teacher_submissions` (
  `id` bigint UNSIGNED NOT NULL,
  `assignment_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `file_url` varchar(1024) DEFAULT NULL,
  `grade` decimal(6,2) DEFAULT NULL,
  `feedback` text,
  `graded_by_teacher_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teacher_users`
--

INSERT INTO `teacher_users` (`id`, `first_name`, `last_name`, `email`, `phone`, `designation`, `department_id`, `profile_image`, `password_hash`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'Mohamed', 'Sameer', 'sameer@gmail.com', NULL, 'Professor', NULL, NULL, '$2b$12$B6h9wHj9s10NdJHNHmWflO/xhX/kAjqtnPkh/ODOEofk6cRNovobW', 1, '2025-12-02 11:58:28', '2025-12-02 11:58:28'),
(4, 'Sameer', 'Khan', 'sameer2@gmail.com', NULL, 'Professor', NULL, NULL, '$2b$12$B6h9wHj9s10NdJHNHmWflO/xhX/kAjqtnPkh/ODOEofk6cRNovobW', 1, '2025-12-09 11:58:28', '2025-12-09 05:06:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_course_offering` (`course_offering_id`),
  ADD KEY `idx_batch_section` (`batch`,`section`),
  ADD KEY `idx_last_message` (`last_message_at`),
  ADD KEY `idx_creator` (`created_by_id`,`created_by_type`);

--
-- Indexes for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participant` (`conversation_id`,`user_id`,`user_type`),
  ADD KEY `idx_conversation` (`conversation_id`),
  ADD KEY `idx_user` (`user_id`,`user_type`),
  ADD KEY `idx_last_read` (`last_read_at`);

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
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation_created` (`conversation_id`,`created_at`),
  ADD KEY `idx_sender` (`sender_id`,`sender_type`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_parent` (`parent_message_id`);
ALTER TABLE `messages` ADD FULLTEXT KEY `idx_content` (`content`);

--
-- Indexes for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_message` (`message_id`);

--
-- Indexes for table `message_read_receipts`
--
ALTER TABLE `message_read_receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_read` (`message_id`,`user_id`,`user_type`),
  ADD KEY `idx_message` (`message_id`),
  ADD KEY `idx_user` (`user_id`,`user_type`),
  ADD KEY `idx_read_at` (`read_at`);

--
-- Indexes for table `message_tags`
--
ALTER TABLE `message_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_message` (`message_id`),
  ADD KEY `idx_tag` (`tag`);

--
-- Indexes for table `mgmt_academic_terms`
--
ALTER TABLE `mgmt_academic_terms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `term_code` (`term_code`);

--
-- Indexes for table `mgmt_admin_users`
--
ALTER TABLE `mgmt_admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `mgmt_alerts`
--
ALTER TABLE `mgmt_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`alert_type`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `mgmt_audit_logs`
--
ALTER TABLE `mgmt_audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_actor` (`actor_id`),
  ADD KEY `idx_table_record` (`table_name`,`record_id`);

--
-- Indexes for table `mgmt_campuses`
--
ALTER TABLE `mgmt_campuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `mgmt_compliance_records`
--
ALTER TABLE `mgmt_compliance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dept` (`department_id`),
  ADD KEY `idx_status` (`status`);

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
-- Indexes for table `mgmt_institutional_metrics`
--
ALTER TABLE `mgmt_institutional_metrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_metric` (`metric_name`),
  ADD KEY `idx_period` (`period_start`,`period_end`),
  ADD KEY `idx_department` (`department_id`);

--
-- Indexes for table `mgmt_placement_stats`
--
ALTER TABLE `mgmt_placement_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dept_year` (`department_id`,`year`);

--
-- Indexes for table `mgmt_programs`
--
ALTER TABLE `mgmt_programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `program_code` (`program_code`),
  ADD KEY `idx_department` (`department_id`);

--
-- Indexes for table `mgmt_report_exports`
--
ALTER TABLE `mgmt_report_exports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin` (`admin_id`),
  ADD KEY `idx_type` (`report_type`);

--
-- Indexes for table `mgmt_research_publications`
--
ALTER TABLE `mgmt_research_publications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dept` (`department_id`),
  ADD KEY `idx_year` (`publication_year`);

--
-- Indexes for table `student_activity_logs`
--
ALTER TABLE `student_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_date` (`student_id`,`activity_date`);

--
-- Indexes for table `student_alerts`
--
ALTER TABLE `student_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_status` (`status`);

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
-- Indexes for table `student_career_applications`
--
ALTER TABLE `student_career_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_company` (`company_name`);

--
-- Indexes for table `student_documents`
--
ALTER TABLE `student_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`);

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
  ADD KEY `idx_assessment` (`assessment_id`);

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
-- Indexes for table `student_roles`
--
ALTER TABLE `student_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `student_role_map`
--
ALTER TABLE `student_role_map`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_role_map` (`student_id`,`role_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_role` (`role_id`);

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
-- Indexes for table `student_wellness_logs`
--
ALTER TABLE `student_wellness_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_session_date` (`session_date`);

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
-- Indexes for table `teacher_assessments`
--
ALTER TABLE `teacher_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_offering` (`course_offering_id`),
  ADD KEY `idx_date` (`assessment_date`);

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
-- Indexes for table `teacher_grades`
--
ALTER TABLE `teacher_grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_grade` (`student_id`,`course_offering_id`),
  ADD KEY `idx_offering` (`course_offering_id`);

--
-- Indexes for table `teacher_grading_components`
--
ALTER TABLE `teacher_grading_components`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_offering` (`course_offering_id`);

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
-- Indexes for table `teacher_messages`
--
ALTER TABLE `teacher_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher_messages_conversation_id` (`conversation_id`),
  ADD KEY `idx_teacher_messages_created_at` (`created_at`),
  ADD KEY `idx_teacher_messages_sender_teacher` (`sender_teacher_id`),
  ADD KEY `idx_teacher_messages_sender_student` (`sender_student_id`);

--
-- Indexes for table `teacher_notifications`
--
ALTER TABLE `teacher_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher` (`teacher_id`),
  ADD KEY `idx_read` (`is_read`);

--
-- Indexes for table `teacher_office_hours`
--
ALTER TABLE `teacher_office_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_teacher_day` (`teacher_id`,`weekday`);

--
-- Indexes for table `teacher_permissions`
--
ALTER TABLE `teacher_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_role` (`role_id`);

--
-- Indexes for table `teacher_roles`
--
ALTER TABLE `teacher_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `teacher_role_map`
--
ALTER TABLE `teacher_role_map`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_map` (`teacher_id`,`role_id`);

--
-- Indexes for table `teacher_submissions`
--
ALTER TABLE `teacher_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assignment` (`assignment_id`),
  ADD KEY `idx_student` (`student_id`);

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
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `live_classes`
--
ALTER TABLE `live_classes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_attachments`
--
ALTER TABLE `message_attachments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_read_receipts`
--
ALTER TABLE `message_read_receipts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_tags`
--
ALTER TABLE `message_tags`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_academic_terms`
--
ALTER TABLE `mgmt_academic_terms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_admin_users`
--
ALTER TABLE `mgmt_admin_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_alerts`
--
ALTER TABLE `mgmt_alerts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_audit_logs`
--
ALTER TABLE `mgmt_audit_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_campuses`
--
ALTER TABLE `mgmt_campuses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_compliance_records`
--
ALTER TABLE `mgmt_compliance_records`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_departments`
--
ALTER TABLE `mgmt_departments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_financials`
--
ALTER TABLE `mgmt_financials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_institutional_metrics`
--
ALTER TABLE `mgmt_institutional_metrics`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_placement_stats`
--
ALTER TABLE `mgmt_placement_stats`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_programs`
--
ALTER TABLE `mgmt_programs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_report_exports`
--
ALTER TABLE `mgmt_report_exports`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mgmt_research_publications`
--
ALTER TABLE `mgmt_research_publications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_activity_logs`
--
ALTER TABLE `student_activity_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_alerts`
--
ALTER TABLE `student_alerts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_assessments`
--
ALTER TABLE `student_assessments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_assignment_submissions`
--
ALTER TABLE `student_assignment_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `student_calendar_events`
--
ALTER TABLE `student_calendar_events`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student_career_applications`
--
ALTER TABLE `student_career_applications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_documents`
--
ALTER TABLE `student_documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_enrollments`
--
ALTER TABLE `student_enrollments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `student_grades`
--
ALTER TABLE `student_grades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_job_applications`
--
ALTER TABLE `student_job_applications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_leave_requests`
--
ALTER TABLE `student_leave_requests`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_library_access_logs`
--
ALTER TABLE `student_library_access_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student_library_bookmarks`
--
ALTER TABLE `student_library_bookmarks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_library_downloads`
--
ALTER TABLE `student_library_downloads`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student_notifications`
--
ALTER TABLE `student_notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_profiles`
--
ALTER TABLE `student_profiles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_resumes`
--
ALTER TABLE `student_resumes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_roles`
--
ALTER TABLE `student_roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_role_map`
--
ALTER TABLE `student_role_map`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_schedule`
--
ALTER TABLE `student_schedule`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=536;

--
-- AUTO_INCREMENT for table `student_study_sessions`
--
ALTER TABLE `student_study_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_users`
--
ALTER TABLE `student_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `student_wellness_logs`
--
ALTER TABLE `student_wellness_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `study_groups`
--
ALTER TABLE `study_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_group_members`
--
ALTER TABLE `study_group_members`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_group_messages`
--
ALTER TABLE `study_group_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_group_teacher_moderators`
--
ALTER TABLE `study_group_teacher_moderators`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_assessments`
--
ALTER TABLE `teacher_assessments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `teacher_class_sessions`
--
ALTER TABLE `teacher_class_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=599;

--
-- AUTO_INCREMENT for table `teacher_conversations`
--
ALTER TABLE `teacher_conversations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_conversation_participants`
--
ALTER TABLE `teacher_conversation_participants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_course_offerings`
--
ALTER TABLE `teacher_course_offerings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `teacher_grades`
--
ALTER TABLE `teacher_grades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_grading_components`
--
ALTER TABLE `teacher_grading_components`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_idea_sandbox_comments`
--
ALTER TABLE `teacher_idea_sandbox_comments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teacher_idea_sandbox_posts`
--
ALTER TABLE `teacher_idea_sandbox_posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacher_idea_sandbox_upvotes`
--
ALTER TABLE `teacher_idea_sandbox_upvotes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `teacher_library_resources`
--
ALTER TABLE `teacher_library_resources`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teacher_messages`
--
ALTER TABLE `teacher_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `teacher_notifications`
--
ALTER TABLE `teacher_notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_office_hours`
--
ALTER TABLE `teacher_office_hours`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_permissions`
--
ALTER TABLE `teacher_permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_roles`
--
ALTER TABLE `teacher_roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_role_map`
--
ALTER TABLE `teacher_role_map`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_submissions`
--
ALTER TABLE `teacher_submissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_users`
--
ALTER TABLE `teacher_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `fk_conv_participant_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `live_classes`
--
ALTER TABLE `live_classes`
  ADD CONSTRAINT `fk_live_class_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_message_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_message_parent` FOREIGN KEY (`parent_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD CONSTRAINT `fk_attachment_message` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message_read_receipts`
--
ALTER TABLE `message_read_receipts`
  ADD CONSTRAINT `fk_read_receipt_message` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message_tags`
--
ALTER TABLE `message_tags`
  ADD CONSTRAINT `fk_tag_message` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_calendar_events`
--
ALTER TABLE `student_calendar_events`
  ADD CONSTRAINT `fk_calendar_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_job_applications`
--
ALTER TABLE `student_job_applications`
  ADD CONSTRAINT `fk_student_job_application_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_leave_requests`
--
ALTER TABLE `student_leave_requests`
  ADD CONSTRAINT `fk_leave_course_offering` FOREIGN KEY (`course_offering_id`) REFERENCES `teacher_course_offerings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_leave_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `teacher_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_leave_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_library_access_logs`
--
ALTER TABLE `student_library_access_logs`
  ADD CONSTRAINT `fk_access_resource` FOREIGN KEY (`resource_id`) REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_access_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_library_bookmarks`
--
ALTER TABLE `student_library_bookmarks`
  ADD CONSTRAINT `fk_bookmark_resource` FOREIGN KEY (`resource_id`) REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bookmark_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_library_downloads`
--
ALTER TABLE `student_library_downloads`
  ADD CONSTRAINT `fk_download_resource` FOREIGN KEY (`resource_id`) REFERENCES `teacher_library_resources` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_download_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_resumes`
--
ALTER TABLE `student_resumes`
  ADD CONSTRAINT `FK_student_resumes_student_id` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_groups`
--
ALTER TABLE `study_groups`
  ADD CONSTRAINT `fk_study_group_course_offering` FOREIGN KEY (`course_offering_id`) REFERENCES `teacher_course_offerings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_study_group_creator` FOREIGN KEY (`created_by_student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_group_members`
--
ALTER TABLE `study_group_members`
  ADD CONSTRAINT `fk_study_member_group` FOREIGN KEY (`group_id`) REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_study_member_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_group_messages`
--
ALTER TABLE `study_group_messages`
  ADD CONSTRAINT `fk_study_message_group` FOREIGN KEY (`group_id`) REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_study_message_student` FOREIGN KEY (`sender_student_id`) REFERENCES `student_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_study_message_teacher` FOREIGN KEY (`sender_teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `study_group_teacher_moderators`
--
ALTER TABLE `study_group_teacher_moderators`
  ADD CONSTRAINT `fk_study_teacher_group` FOREIGN KEY (`group_id`) REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_study_teacher_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `teacher_idea_sandbox_comments`
--
ALTER TABLE `teacher_idea_sandbox_comments`
  ADD CONSTRAINT `teacher_idea_sandbox_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `teacher_idea_sandbox_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_idea_sandbox_comments_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_idea_sandbox_posts`
--
ALTER TABLE `teacher_idea_sandbox_posts`
  ADD CONSTRAINT `teacher_idea_sandbox_posts_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_idea_sandbox_upvotes`
--
ALTER TABLE `teacher_idea_sandbox_upvotes`
  ADD CONSTRAINT `teacher_idea_sandbox_upvotes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `teacher_idea_sandbox_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_idea_sandbox_upvotes_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_library_resources`
--
ALTER TABLE `teacher_library_resources`
  ADD CONSTRAINT `fk_library_teacher` FOREIGN KEY (`uploaded_by`) REFERENCES `teacher_users` (`id`) ON DELETE CASCADE;

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
