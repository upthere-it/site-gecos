'use strict';

function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({
      error: 'ADMIN_SECRET non configurato sul server. Impostarlo nelle variabili ambiente.',
    });
  }
  const header = req.headers['authorization'] || '';
  const m = /^Bearer\s+(.+)$/i.exec(header);
  if (!m) {
    return res.status(401).json({ error: 'Token mancante' });
  }
  const token = m[1].trim();
  if (token !== secret) {
    return res.status(401).json({ error: 'Token non valido' });
  }
  return next();
}

module.exports = { requireAdmin };
