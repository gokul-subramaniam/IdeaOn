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

    //  GET suggestions for that org
    const result = await pool.query(
      `SELECT suggestions.id, users.username, suggestions.body, 
       suggestions.flag_count, suggestions.posted_at 
       FROM suggestions
       JOIN users ON suggestions.user_id = users.id
       JOIN organizations ON suggestions.org_id = organizations.id
       WHERE organizations.slug = $1
       AND suggestions.parent_id IS NULL
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

// POST create new suggestion for an organization
router.post('/:slug', authenticateToken, async (req, res) => {

  try {
    const { slug } = req.params;
    const { user_id, body } = req.body;

    // Step 1 — find the org_id from the slug
    const orgResult = await pool.query(
      'SELECT id FROM organizations WHERE slug = $1',
      [slug]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const org_id = orgResult.rows[0].id;

    // Step 2 — insert the suggestion
    const result = await pool.query(
      'INSERT INTO suggestions (user_id, org_id, body) VALUES ($1, $2, $3) RETURNING *',
      [user_id, org_id, body]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;