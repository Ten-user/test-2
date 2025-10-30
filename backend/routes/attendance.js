const express = require('express');
const db = require('../db'); // CommonJS import

const router = express.Router();

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;

    const insertQuery = `
      INSERT INTO attendance (employee_name, employee_id, date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const inserted = await db.query(insertQuery, [employeeName, employeeID, date, status]);
    res.status(201).json(inserted[0]); // return the first row
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create attendance' });
  }
});

// Get attendance records (with optional search, date filter)
router.get('/', async (req, res) => {
  try {
    const { search, date } = req.query;
    let query = 'SELECT * FROM attendance';
    const clauses = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      clauses.push(`(employee_name ILIKE $${params.length - 1} OR CAST(employee_id AS TEXT) ILIKE $${params.length})`);
    }
    if (date) {
      params.push(date);
      clauses.push(`date = $${params.length}`);
    }

    if (clauses.length) query += ' WHERE ' + clauses.join(' AND ');
    query += ' ORDER BY date DESC, employee_name ASC';

    const rows = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM attendance WHERE id = $1 RETURNING *';
    const rows = await db.query(deleteQuery, [id]);

    if (rows.length === 0) 
      return res.status(404).json({ error: 'Not found' });

    res.json({ deletedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
