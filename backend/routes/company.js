'use strict';

const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/company
router.get('/', (req, res) => {
  const row = db.prepare('SELECT data FROM company_data WHERE id = 1').get();
  if (!row) return res.status(404).json({ error: 'Company data non disponibile' });
  try {
    res.json(JSON.parse(row.data));
  } catch (err) {
    res.status(500).json({ error: 'Dati company corrotti' });
  }
});

// PUT /api/v1/company
router.put('/', requireAdmin, (req, res) => {
  const body = req.body;
  if (body === undefined || body === null || typeof body !== 'object') {
    return res.status(400).json({ error: 'Body richiesto: oggetto JSON' });
  }
  const json = JSON.stringify(body);
  const stmt = db.prepare(
    `INSERT INTO company_data (id, data, updated_at)
     VALUES (1, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       data = excluded.data,
       updated_at = datetime('now')`
  );
  stmt.run(json);
  res.json(body);
});

module.exports = router;
