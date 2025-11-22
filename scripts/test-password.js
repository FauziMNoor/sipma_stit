// Test password hashing
const bcrypt = require('bcryptjs');

const password = 'password123';
const hash = '$2b$10$Ar/9lnkk/hZAQB6S6LxdHOjr1C23WCJJ6ojn72gxYKEB91xH86Mxa';

console.log('Testing password verification...\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('');

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log('✅ Password match:', result);
  }
});

// Generate new hash
bcrypt.hash(password, 10, (err, newHash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
  } else {
    console.log('\n🔑 New hash generated:');
    console.log(newHash);
  }
});

