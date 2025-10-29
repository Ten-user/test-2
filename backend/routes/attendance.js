const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // ✅ destructure pool correctly

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO Attendance (employeeName, employeeID, date, status)
       VALUES (?, ?, ?, ?)`,
      [employeeName, employeeID, date, status]
    );

    // Get the inserted record
    const [rows] = await pool.execute('SELECT * FROM Attendance WHERE id = ?', [result.insertId]);
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
    let q = 'SELECT * FROM Attendance';
    const clauses = [];
    const params = [];

    if (search) {
      clauses.push('(employeeName LIKE ? OR employeeID LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (date) {
      clauses.push('date = ?');
      params.push(date);
    }
    if (clauses.length) q += ' WHERE ' + clauses.join(' AND ');
    q += ' ORDER BY date DESC, employeeName ASC';

    const [rows] = await pool.execute(q, params);
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
    const [result] = await pool.execute('DELETE FROM Attendance WHERE id = ?', [id]);

    if (result.affectedRows === 0) 
      return res.status(404).json({ error: 'Not found' });

    res.json({ deletedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
