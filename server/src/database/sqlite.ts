import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/dev.db');

// Ensure the database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log(`📁 Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log(`📊 Opening database at: ${dbPath}`);

// Initialize database
export const db: Database.Database = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  const schema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      full_name TEXT,
      organization TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Form submissions table
    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      created_by_user_id TEXT NOT NULL,

      -- Header Information
      county TEXT,
      district TEXT,
      building_type TEXT CHECK(building_type IN ('leased', 'owned')),
      school_building TEXT,
      completed_by TEXT,
      completion_date DATE,

      -- Section A Data (JSON for flexibility)
      section_a_items TEXT,
      section_a_notes TEXT,

      -- Section B Data (JSON for flexibility)
      section_b_items TEXT,
      section_b_notes TEXT,

      -- Auto-calculated scores
      section_a_no_count INTEGER DEFAULT 0,
      section_a_compliant BOOLEAN DEFAULT 0,
      section_b_yes_count INTEGER DEFAULT 0,
      section_b_no_count INTEGER DEFAULT 0,
      section_b_na_count INTEGER DEFAULT 0,
      section_b_percentage REAL DEFAULT 0,
      section_b_compliant BOOLEAN DEFAULT 0,
      overall_compliant BOOLEAN DEFAULT 0,

      -- Signatures
      signature_1_name TEXT,
      signature_1_title TEXT,
      signature_1_date DATE,
      signature_2_name TEXT,
      signature_2_title TEXT,
      signature_2_date DATE,
      signature_3_name TEXT,
      signature_3_title TEXT,
      signature_3_date DATE,

      -- Metadata
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      submitted_at DATETIME,

      FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_submissions_user ON form_submissions(created_by_user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_status ON form_submissions(status);
    CREATE INDEX IF NOT EXISTS idx_submissions_school ON form_submissions(school_building);
    CREATE INDEX IF NOT EXISTS idx_submissions_created ON form_submissions(created_at);
  `;

  db.exec(schema);
  console.log('✅ Database schema initialized');

  // Run migrations
  runMigrations();
}

function runMigrations() {
  // Migration: Add organization column if it doesn't exist
  try {
    const columns = db.pragma('table_info(users)') as Array<{ name: string }>;
    const hasOrganization = columns.some((col) => col.name === 'organization');

    if (!hasOrganization) {
      console.log('🔄 Running migration: Adding organization column to users table');
      db.exec('ALTER TABLE users ADD COLUMN organization TEXT');
      console.log('✅ Migration completed: organization column added');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}

export default db;
