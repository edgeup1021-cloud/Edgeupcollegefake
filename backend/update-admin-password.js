// Update admin user password to admin123
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function updatePassword() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'edgeup_college'
  });

  try {
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Generated hash for password "admin123":', hashedPassword);

    const [result] = await connection.query(
      'UPDATE admin_users SET password_hash = ? WHERE email = ?',
      [hashedPassword, 'suhuail@gmail.com']
    );

    console.log('\n✅ Password updated successfully!');
    console.log('Affected rows:', result.affectedRows);

    // Verify the update
    const [rows] = await connection.query(
      'SELECT email, LEFT(password_hash, 30) as hash_preview FROM admin_users WHERE email = ?',
      ['suhuail@gmail.com']
    );

    console.log('\nVerification:');
    console.log(rows[0]);

    // Test the password
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('\nPassword verification test:', isValid ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

updatePassword();
