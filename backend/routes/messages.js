'use strict';

const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/messages/:locale -> merge di tutte le page_content per locale
router.get('/:locale', (req, res) => {
  const { locale } = req.params;
  const rows = db
    .prepare('SELECT page, content FROM page_content WHERE locale = ?')
    .all(locale);

  if (!rows.length) {
    return res.status(404).json({ error: `Nessun contenuto per locale "${locale}"` });
  }

  const out = {};
  for (const row of rows) {
    try {
      out[row.page] = JSON.parse(row.content);
    } catch (err) {
      out[row.page] = null;
    }
  }
  res.json(out);
});

// PUT /api/v1/messages/:locale/:page -> sostituisce intero contenuto sezione
router.put('/:locale/:page', requireAdmin, (req, res) => {
  const { locale, page } = req.params;
  const body = req.body;
  if (body === undefined || body === null || typeof body !== 'object') {
    return res.status(400).json({ error: 'Body richiesto: oggetto JSON' });
  }
  const json = JSON.stringify(body);
  const stmt = db.prepare(
    `INSERT INTO page_content (locale, page, content, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(locale, page) DO UPDATE SET
       content = excluded.content,
       updated_at = datetime('now')`
  );
  stmt.run(locale, page, json);
  res.json({ locale, page, content: body });
});

module.exports = router;
