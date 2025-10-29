const mysql = require('mysql2/promise');

// create a MySQL pool
const pool = mysql.createPool({
  host: 'localhost',    // your MySQL host
  user: 'root',         // your MySQL user
  password: 'ntlaba2', // your MySQL password
  database: 'attendance_db', // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  query: async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },
  pool
};
