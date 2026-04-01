const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// POST flag a suggestion
router.post('/:suggestion_id', authenticateToken, async (req, res) => {
  try {
    const { suggestion_id } = req.params;
    const user_id = req.user.userId;

    // Step 1 — check if suggestion exists
    const suggestionResult = await pool.query(
      'SELECT id, user_id FROM suggestions WHERE id = $1',
      [suggestion_id]
    );

    if (suggestionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    // Step 2 — prevent flagging own suggestion
    if (suggestionResult.rows[0].user_id === user_id) {
      return res.status(400).json({ error: 'You cannot flag your own suggestion' });
    }

    // Step 3 — insert flag
    await pool.query(
      'INSERT INTO flags (user_id, suggestion_id) VALUES ($1, $2)',
      [user_id, suggestion_id]
    );

    // Step 4 — increment flag_count on suggestion
    await pool.query(
      'UPDATE suggestions SET flag_count = flag_count + 1 WHERE id = $1',
      [suggestion_id]
    );

    res.status(201).json({ message: 'Suggestion flagged successfully' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'You have already flagged this suggestion' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;