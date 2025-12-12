-- Create databases if they don't exist
CREATE DATABASE IF NOT EXISTS `edgeup_college`;
CREATE DATABASE IF NOT EXISTS `edgeup_super_admin`;

-- Grant privileges
GRANT ALL PRIVILEGES ON `edgeup_college`.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON `edgeup_super_admin`.* TO 'root'@'%';

FLUSH PRIVILEGES;
