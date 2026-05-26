'use strict';

const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/seo
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT page, data FROM page_seo').all();
  const out = {};
  for (const row of rows) {
    try {
      out[row.page] = JSON.parse(row.data);
    } catch (_e) {
      out[row.page] = null;
    }
  }
  res.json(out);
});

// GET /api/v1/seo/:page
router.get('/:page', (req, res) => {
  const row = db.prepare('SELECT data FROM page_seo WHERE page = ?').get(req.params.page);
  if (!row) return res.status(404).json({ error: 'SEO non trovata' });
  try {
    res.json(JSON.parse(row.data));
  } catch (_e) {
    res.status(500).json({ error: 'Dati SEO corrotti' });
  }
});

// PUT /api/v1/seo/:page
router.put('/:page', requireAdmin, (req, res) => {
  const { page } = req.params;
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Body richiesto: oggetto JSON' });
  }
  const json = JSON.stringify(body);
  const stmt = db.prepare(
    `INSERT INTO page_seo (page, data, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(page) DO UPDATE SET
       data = excluded.data,
       updated_at = datetime('now')`
  );
  stmt.run(page, json);
  res.json(body);
});

module.exports = router;
