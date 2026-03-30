const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all organization
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, slug, category, description, created_at FROM organizations');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET single organization by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'SELECT id, name, slug, category, description, created_at FROM organizations WHERE slug = $1',
      [slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'organization not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new suggestion for an organization
router.post('/:slug', async (req, res) => {
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