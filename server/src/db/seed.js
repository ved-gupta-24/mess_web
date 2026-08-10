import bcrypt from 'bcryptjs';
import pool from './pool.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@mess.local';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admins (email, password_hash, name)
     VALUES ($1, $2, 'Mess Admin')
     ON CONFLICT (email) DO NOTHING`,
    [email, hash]
  );

  console.log(`Admin seeded: ${email}`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
