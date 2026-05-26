'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');

// Carica .env da root progetto e da ./
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env'), override: false });

// Inizializza DB (esegue migrazioni)
require('./db');

const messagesRouter = require('./routes/messages');
const companyRouter = require('./routes/company');
const servicesRouter = require('./routes/services');
const seoRouter = require('./routes/seo');

const app = express();
const PORT = Number(process.env.BACKEND_PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '2mb' }));

// Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`[${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms]`);
  });
  next();
});

// Health
app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true });
});

// Routers
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/seo', seoRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler globale
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[gecos-backend] listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[gecos-backend] CORS origin: ${FRONTEND_URL}`);
});
