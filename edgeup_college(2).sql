-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 02, 2025 at 12:24 PM
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
  `attendance_date` varchar(255) DEFAULT NULL,
  `status` enum('present','absent','late','excused') DEFAULT 'present',
  `marked_by` bigint UNSIGNED DEFAULT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_id`, `class_session_id`, `name`, `attendance_date`, `status`, `marked_by`, `remarks`, `created_at`) VALUES
(1, 1, NULL, 'Sameer', '12/05/2004', 'present', NULL, NULL, '2025-11-29 13:22:31');

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
(2, 4, 1, '2025-12-02 06:33:04', 'active');

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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(1, NULL, 'CS101', 'Introduction to Computer Science', NULL, 3, NULL, '2025-12-02 06:33:04', '2025-12-02 06:33:04');

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
(1, 1, 1, 'Fall', 2024, 'A', NULL, 30, '2025-12-02 06:33:04', '2025-12-02 06:33:04');

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
(3, 'Mohamed', 'Sameer', 'sameer@gmail.com', NULL, 'Professor', NULL, NULL, '$2b$12$B6h9wHj9s10NdJHNHmWflO/xhX/kAjqtnPkh/ODOEofk6cRNovobW', 1, '2025-12-02 11:58:28', '2025-12-02 11:58:28');

--
-- Indexes for dumped tables
--

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
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `idx_date` (`session_date`);

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_calendar_events`
--
ALTER TABLE `student_calendar_events`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_grades`
--
ALTER TABLE `student_grades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `teacher_assessments`
--
ALTER TABLE `teacher_assessments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teacher_class_sessions`
--
ALTER TABLE `teacher_class_sessions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacher_course_offerings`
--
ALTER TABLE `teacher_course_offerings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `student_calendar_events`
--
ALTER TABLE `student_calendar_events`
  ADD CONSTRAINT `fk_calendar_student` FOREIGN KEY (`student_id`) REFERENCES `student_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
