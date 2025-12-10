-- Fix admin password for suhuail@gmail.com
-- This updates the password to 'admin123'
-- The hash below is generated using bcrypt.hash('admin123', 10)

USE edgeup_college;

-- First, let's see the current admin user
SELECT id, email, username, role, is_active, LEFT(password_hash, 30) as current_hash
FROM admin_users
WHERE email = 'suhuail@gmail.com';

-- Update with a new hash for 'admin123'
-- You need to run the test-password.js script first to get the hash
-- Then replace 'PASTE_HASH_HERE' with the actual hash from the script

-- Uncomment and update the line below after getting the hash:
-- UPDATE admin_users SET password_hash = 'PASTE_HASH_HERE' WHERE email = 'suhuail@gmail.com';

-- Instructions:
-- 1. Run: node test-password.js
-- 2. Copy the "Hash (10 rounds)" value
-- 3. Uncomment the UPDATE line above and replace PASTE_HASH_HERE with that hash
-- 4. Run this SQL file
