const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbName = process.env.PGDATABASE || 'parkee_db';
const user = process.env.PGUSER || 'postgres';
const password = process.env.PGPASSWORD || 'postgres';
const host = process.env.PGHOST || 'localhost';
const port = process.env.PGPORT || 5432;

async function setupPostgres() {
  console.log(`[PostgreSQL Setup] Connecting to PostgreSQL at ${host}:${port} as user '${user}'...`);
  
  // 1. Connect to default 'postgres' db to check / create 'parkee_db'
  const rootClient = new Client({
    user,
    password,
    host,
    port,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    
    // Check if database exists
    const checkDb = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`[PostgreSQL Setup] Database '${dbName}' does not exist. Creating...`);
      await rootClient.query(`CREATE DATABASE "${dbName}";`);
      console.log(`✅ Database '${dbName}' created!`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL server:', err.message);
    console.error('👉 Please make sure PostgreSQL service is running and credentials in parkee-backend/.env are correct.');
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // 2. Connect to 'parkee_db' and create tables
  const dbClient = new Client({
    user,
    password,
    host,
    port,
    database: dbName
  });

  try {
    await dbClient.connect();
    const sqlPath = path.join(__dirname, 'init_db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log(`[PostgreSQL Setup] Running schema script from ${sqlPath}...`);
    await dbClient.query(sql);
    console.log('✅ PostgreSQL Tables (users table) initialized successfully!');

  } catch (err) {
    console.error('❌ Failed to run init_db.sql schema:', err.message);
  } finally {
    await dbClient.end();
  }
}

setupPostgres();
