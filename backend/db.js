const pkg = require('pg');
require('dotenv').config();

const { Pool } = pkg;

// create a PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Neon
});

module.exports = {
  query: async (sql, params) => {
    const result = await pool.query(sql, params);
    return result.rows; // always return rows
  },
  pool
};
