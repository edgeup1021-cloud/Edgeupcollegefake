-- Migration: Add institution_type and college_type to universities table
-- Database: edgeup_super_admin
-- Description: Adds fields to distinguish between colleges and universities, and college specialization types
-- Based on Tamil Nadu education system

USE edgeup_super_admin;

-- Add institution_type column (College or University)
ALTER TABLE `universities`
  ADD COLUMN `institution_type` ENUM('College', 'University') NOT NULL DEFAULT 'College'
  AFTER `name`;

-- Add college_type column (Engineering, Medical, Law, Arts & Science, etc.)
-- This is only applicable when institution_type = 'College'
ALTER TABLE `universities`
  ADD COLUMN `college_type` ENUM(
    'Engineering',
    'Medical',
    'Law',
    'Arts and Science',
    'Polytechnic',
    'Management',
    'Education',
    'Agriculture',
    'Pharmacy',
    'Nursing',
    'Architecture',
    'Fine Arts',
    'Physical Education',
    'Other'
  ) NULL
  AFTER `institution_type`;

-- Add index for better query performance
ALTER TABLE `universities`
  ADD INDEX `idx_institution_type` (`institution_type`),
  ADD INDEX `idx_college_type` (`college_type`);

-- Note: college_type is NULL for Universities
-- For Colleges, college_type must be specified
