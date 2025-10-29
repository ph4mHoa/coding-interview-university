import { pool } from './database';

const createIdeasTable = `
  CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    persona VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    rationale TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_ideas_persona ON ideas(persona);
  CREATE INDEX IF NOT EXISTS idx_ideas_industry ON ideas(industry);
  CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
`;

async function runMigration() {
  try {
    console.log('🚀 Running database migration...');

    const client = await pool.connect();
    await client.query(createIdeasTable);
    client.release();

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
