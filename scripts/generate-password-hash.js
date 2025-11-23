/**
 * Generate bcrypt hash for password
 * Usage: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 10;
  
  console.log('🔐 Generating bcrypt hash...');
  console.log('Password:', password);
  console.log('Salt rounds:', saltRounds);
  console.log('');
  
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('✅ Hash generated:');
  console.log(hash);
  console.log('');
  console.log('📋 SQL to update mahasiswa:');
  console.log(`UPDATE mahasiswa SET password = '${hash}' WHERE nim = '2024001';`);
  console.log('');
  console.log('🧪 Test verification:');
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password matches:', isValid);
}

generateHash().catch(console.error);

