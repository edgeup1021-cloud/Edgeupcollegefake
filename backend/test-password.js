// Test password hashing
const bcrypt = require('bcrypt');

async function test() {
  const password = 'admin123';

  // Hash with 10 rounds (what we use in institutional heads service)
  const hash10 = await bcrypt.hash(password, 10);
  console.log('Hash (10 rounds):', hash10);

  // Hash with 12 rounds (what PasswordService uses)
  const hash12 = await bcrypt.hash(password, 12);
  console.log('Hash (12 rounds):', hash12);

  // Test comparison
  console.log('\nTesting password: admin123');
  console.log('Compare with 10-round hash:', await bcrypt.compare(password, hash10));
  console.log('Compare with 12-round hash:', await bcrypt.compare(password, hash12));

  // Test wrong password
  console.log('\nTesting wrong password: wrongpass');
  console.log('Compare with 10-round hash:', await bcrypt.compare('wrongpass', hash10));

  console.log('\n✅ Password hashing is working correctly!');
  console.log('\nTo use this hash in your database, copy one of the hashes above');
  console.log('and update the admin_users record:');
  console.log(`UPDATE admin_users SET password_hash = '${hash10}' WHERE email = 'your-email@example.com';`);
}

test().catch(console.error);
