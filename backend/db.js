import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// create a PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Neon
});

export default {
  query: async (sql, params) => {
    const result = await pool.query(sql, params);
    return result.rows; // always return rows
  },
  pool
};
