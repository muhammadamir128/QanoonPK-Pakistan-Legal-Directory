const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'custom.db');
const db = new DatabaseSync(dbPath);

async function run() {
  // 1. Check if password column exists in User table
  const cols = db.prepare('PRAGMA table_info(User)').all();
  const hasPassword = cols.some((c) => c.name === 'password');
  if (!hasPassword) {
    console.log('Adding password column to User table...');
    db.exec('ALTER TABLE "User" ADD COLUMN "password" TEXT;');
    console.log('password column added successfully.');
  } else {
    console.log('password column already exists.');
  }

  // 2. Hash password and insert or update admin
  const hash = await bcrypt.hash('Admin@123', 12);
  const existing = db.prepare('SELECT * FROM "User" WHERE email = ?').get('admin@qanoon.pk');
  const now = new Date().toISOString();

  if (existing) {
    db.prepare('UPDATE "User" SET password = ?, role = ?, updatedAt = ? WHERE email = ?').run(
      hash,
      'admin',
      now,
      'admin@qanoon.pk'
    );
    console.log('Existing admin user updated.');
  } else {
    const id = 'cm_' + Math.random().toString(36).substring(2, 12);
    db.prepare(
      'INSERT INTO "User" (id, name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, 'Administrator', 'admin@qanoon.pk', hash, 'admin', now, now);
    console.log('Admin user created successfully.');
  }

  const admin = db
    .prepare('SELECT id, name, email, role, createdAt FROM "User" WHERE email = ?')
    .get('admin@qanoon.pk');
  console.log('Admin User verification:', admin);
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
