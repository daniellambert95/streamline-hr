import { Pool } from 'pg';

// Use the DATABASE_URL from environment variables

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('❌ Error with PostgreSQL database connection', err);
  process.exit(-1);
});

export default pool;