// Script untuk seed users ke database
// Run: node scripts/seed-users.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ijwfqsgednjfzugwnhtv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2Zxc2dlZG5qZnp1Z3duaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3ODcxOTksImV4cCI6MjA3OTM2MzE5OX0.SLSPzlWD77esynEO3msCTva7lHvyEUd7SRS4hkNUAig';

const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
  {
    email: 'admin@stit.ac.id',
    password: 'password123',
    nama: 'Admin SIPMA',
    role: 'admin',
  },
  {
    email: 'waket3@stit.ac.id',
    password: 'password123',
    nama: 'Wakil Ketua 3',
    role: 'waket3',
  },
  {
    email: 'dosen.pa@stit.ac.id',
    password: 'password123',
    nama: 'Dr. Ahmad Fauzi, M.Pd',
    role: 'dosen_pa',
  },
  {
    email: 'musyrif@stit.ac.id',
    password: 'password123',
    nama: 'Ustadz Muhammad Ali',
    role: 'musyrif',
  },
  {
    email: 'mahasiswa1@stit.ac.id',
    password: 'password123',
    nama: 'Ahmad Zaki',
    role: 'mahasiswa',
  },
  {
    email: 'mahasiswa2@stit.ac.id',
    password: 'password123',
    nama: 'Fatimah Azzahra',
    role: 'mahasiswa',
  },
];

async function seedUsers() {
  console.log('🌱 Starting to seed users...\n');

  for (const user of users) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          password: hashedPassword,
          nama: user.nama,
          role: user.role,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️  User ${user.email} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${user.email}:`, err.message);
    }
  }

  console.log('\n✨ Seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('   Email: admin@stit.ac.id');
  console.log('   Password: password123');
}

seedUsers();

