const { Pool } = require('pg');
require('dotenv').config();

const user = process.env.PGUSER || 'postgres';
const password = process.env.PGPASSWORD || 'postgres';
const host = process.env.PGHOST || 'localhost';
const port = process.env.PGPORT || 5432;
const database = process.env.PGDATABASE || 'parkee_db';

// Create PostgreSQL connection pool using individual parameters
const pool = new Pool({
  user,
  password,
  host,
  port: parseInt(port, 10),
  database,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log(`[PostgreSQL] Database '${database}' connected successfully.`);
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Error] Unexpected pool error:', err.message);
});

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[PostgreSQL Query Error]', err.message);
    throw err;
  }
};

module.exports = {
  query,
  pool
};
