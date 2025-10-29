const express = require('express');
const router = express.Router();
const db = require('../db'); // now uses PostgreSQL pool

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;
    
    const insertQuery = `
      INSERT INTO attendance (employee_name, employee_id, date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const rows = await db.query(insertQuery, [employeeName, employeeID, date, status]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create attendance' });
  }
});

// Get attendance records (with optional search, date filter)
router.get('/', async (req, res) => {
  try {
    const { search, date } = req.query;
    let q = 'SELECT * FROM attendance';
    const clauses = [];
    const params = [];

    if (search) {
      clauses.push('(employee_name ILIKE $' + (params.length + 1) + ' OR CAST(employee_id AS TEXT) ILIKE $' + (params.length + 2) + ')');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (date) {
      clauses.push(`date = $${params.length + 1}`);
      params.push(date);
    }
    if (clauses.length) q += ' WHERE ' + clauses.join(' AND ');
    q += ' ORDER BY date DESC, employee_name ASC';

    const rows = await db.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
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
