// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials for testing
const supabaseUrl = 'https://ijwfqsgednjfzugwnhtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2Zxc2dlZG5qZnp1Z3duaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3ODcxOTksImV4cCI6MjA3OTM2MzE5OX0.SLSPzlWD77esynEO3msCTva7lHvyEUd7SRS4hkNUAig';

console.log('🔍 Testing Supabase Connection...\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'NOT FOUND');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connection...');
    
    // Test 1: Check if we can query users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, nama, role')
      .limit(5);

    if (usersError) {
      console.error('❌ Error querying users table:', usersError.message);
      console.error('   Details:', usersError);
    } else {
      console.log('✅ Users table accessible!');
      console.log(`   Found ${users.length} users:`);
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });
    }
    console.log('');

    // Test 2: Check if we can query mahasiswa table
    console.log('2️⃣ Testing mahasiswa table...');
    const { data: mahasiswa, error: mahasiswaError } = await supabase
      .from('mahasiswa')
      .select('nim, nama, prodi')
      .limit(5);

    if (mahasiswaError) {
      console.error('❌ Error querying mahasiswa table:', mahasiswaError.message);
      console.error('   Details:', mahasiswaError);
    } else {
      console.log('✅ Mahasiswa table accessible!');
      console.log(`   Found ${mahasiswa.length} mahasiswa:`);
      mahasiswa.forEach(m => {
        console.log(`   - ${m.nim}: ${m.nama} (${m.prodi})`);
      });
    }
    console.log('');

    // Test 3: Check specific admin user
    console.log('3️⃣ Testing admin user...');
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@stit.ac.id')
      .single();

    if (adminError) {
      console.error('❌ Admin user not found!');
      console.error('   Error:', adminError.message);
      console.log('   ⚠️  You need to run insert-admin.sql in Supabase SQL Editor!');
    } else {
      console.log('✅ Admin user found!');
      console.log('   Email:', admin.email);
      console.log('   Nama:', admin.nama);
      console.log('   Role:', admin.role);
      console.log('   Active:', admin.is_active);
      console.log('   Password hash:', admin.password ? `${admin.password.substring(0, 30)}...` : 'NULL');
    }
    console.log('');

    // Test 4: Check mahasiswa with NIM 2024001
    console.log('4️⃣ Testing mahasiswa 2024001...');
    const { data: mhs, error: mhsError } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('nim', '2024001')
      .single();

    if (mhsError) {
      console.error('❌ Mahasiswa 2024001 not found!');
      console.error('   Error:', mhsError.message);
      console.log('   ⚠️  You need to run insert-admin.sql in Supabase SQL Editor!');
    } else {
      console.log('✅ Mahasiswa 2024001 found!');
      console.log('   NIM:', mhs.nim);
      console.log('   Nama:', mhs.nama);
      console.log('   Prodi:', mhs.prodi);
      console.log('   Angkatan:', mhs.angkatan);
      console.log('   Active:', mhs.is_active);
      console.log('   Password hash:', mhs.password ? `${mhs.password.substring(0, 30)}...` : 'NULL ⚠️');
    }
    console.log('');

    console.log('✅ Connection test completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();

