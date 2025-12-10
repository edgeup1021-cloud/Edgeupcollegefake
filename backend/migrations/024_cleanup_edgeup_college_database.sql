-- Migration: Cleanup unused tables from edgeup_college database
-- Database: edgeup_college
-- Description: Removes unused management tables to simplify database structure
-- Note: Keeps essential tables for student, teacher, and admin functionality

USE edgeup_college;

-- Drop unused management tables
DROP TABLE IF EXISTS `mgmt_report_exports`;
DROP TABLE IF EXISTS `mgmt_research_publications`;
DROP TABLE IF EXISTS `mgmt_placement_stats`;
DROP TABLE IF EXISTS `mgmt_institutional_metrics`;
DROP TABLE IF EXISTS `mgmt_compliance_records`;
DROP TABLE IF EXISTS `mgmt_alerts`;
DROP TABLE IF EXISTS `mgmt_audit_logs`;
DROP TABLE IF EXISTS `mgmt_academic_terms`;

-- Drop duplicate tables (functionality moved to superadmin DB)
DROP TABLE IF EXISTS `mgmt_programs`;
DROP TABLE IF EXISTS `mgmt_departments`;
DROP TABLE IF EXISTS `mgmt_campuses`;

-- Note: Keeping the following essential tables:
-- - mgmt_admin_users (will be renamed in next migration)
-- - mgmt_financials (used by management portal)
-- - All student_* tables (student portal functionality)
-- - All teacher_* tables (teacher portal functionality)
-- - live_classes (actively being used)
