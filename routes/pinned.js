const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if org exists
    const orgResult = await pool.query(
      'SELECT id FROM organizations WHERE slug = $1',
      [slug]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    //  GET pinned suggestions for that org
    const result = await pool.query(
      `SELECT suggestions.body, users.username, organizations.name, 
    suggestions.flag_count, pinned_suggestions.pinned_at
    FROM pinned_suggestions
    JOIN suggestions ON pinned_suggestions.suggestion_id = suggestions.id
    JOIN users ON suggestions.user_id = users.id
    JOIN organizations ON suggestions.org_id = organizations.id
    WHERE organizations.slug = $1
    ORDER BY suggestions.flag_count DESC`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No suggestions yet for this organization' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST pin a suggestion (moderator only)
router.post('/:suggestion_id', authenticateToken, async (req, res) => {
  try {
    const { suggestion_id } = req.params;
    const user_id = req.user.userId;

    // Step 1 — get the org_id from the suggestion
    const suggestionResult = await pool.query(
      'SELECT org_id FROM suggestions WHERE id = $1',
      [suggestion_id]
    );

    if (suggestionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    const org_id = suggestionResult.rows[0].org_id;

    // Step 2 — check if user is a moderator for that org
    const modResult = await pool.query(
      'SELECT id FROM moderator_roles WHERE user_id = $1 AND org_id = $2',
      [user_id, org_id]
    );

    if (modResult.rows.length === 0) {
      return res.status(403).json({ error: 'You are not a moderator for this organization' });
    }

    // Step 3 — pin the suggestion
    const result = await pool.query(
      'INSERT INTO pinned_suggestions (suggestion_id, pinned_by) VALUES ($1, $2) RETURNING *',
      [suggestion_id, user_id]
    );

    res.status(201).json({ message: 'Suggestion pinned successfully', pinned: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Suggestion is already pinned' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;