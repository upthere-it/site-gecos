'use strict';

const path = require('path');
const fs = require('fs');

// Load env from project root (../) and backend (./)
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: false });

const db = require('./index');

const MESSAGES_PATH = path.join(__dirname, '..', '..', 'messages', 'it.json');
const SITE_CONTENT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'site-content.json');

const COMPANY_DATA = {
  tagline: 'Gestione Costruzioni Servizi S.r.l.',
  sedeOperativa: { indirizzo: "Via Monte d'Oro n. 30", cap: '00071', citta: 'Pomezia (RM)' },
  sedeLegale: { indirizzo: 'Via Anchise n. 9', cap: '00071', citta: 'Pomezia (RM)' },
  telefoni: ['069107142', '0691603098'],
  emails: [
    'info@gecospomezia.it',
    'ufficiotecnico@gecospomezia.it',
    'amministrazione@gecospomezia.it',
    'sgi@gecospomezia.it',
    'gecos@pec.it',
  ],
  social: {
    instagram: 'https://www.instagram.com',
    facebook: 'https://www.facebook.com',
  },
  copyright:
    '© 2026 GE.CO.S. S.r.l. Tutti i diritti riservati - C.F., P.IVA, C.C.I.A.A.: 07554601000 - Iscrizione REA: RM-1040431',
};

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function resetTables() {
  db.exec(`
    DROP TABLE IF EXISTS page_content;
    DROP TABLE IF EXISTS company_data;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS page_seo;
  `);
  // re-run migrations
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
}

function seedMessages() {
  const messages = readJson(MESSAGES_PATH);
  const insert = db.prepare(
    `INSERT INTO page_content (locale, page, content, updated_at)
     VALUES (?, ?, ?, datetime('now'))`
  );
  const tx = db.transaction((entries) => {
    for (const [page, content] of entries) {
      insert.run('it', page, JSON.stringify(content));
    }
  });
  tx(Object.entries(messages));
  return Object.keys(messages).length;
}

function seedServices() {
  const siteContent = readJson(SITE_CONTENT_PATH);
  const services = Array.isArray(siteContent.services) ? siteContent.services : [];
  const insert = db.prepare(
    `INSERT INTO services (slug, sort_order, data, updated_at)
     VALUES (?, ?, ?, datetime('now'))`
  );
  const tx = db.transaction((items) => {
    for (const svc of items) {
      const { slug, order, ...rest } = svc;
      if (!slug) continue;
      insert.run(slug, typeof order === 'number' ? order : 0, JSON.stringify(rest));
    }
  });
  tx(services);
  return services.length;
}

function seedSeo() {
  const siteContent = readJson(SITE_CONTENT_PATH);
  const pages = siteContent.pages || {};
  const insert = db.prepare(
    `INSERT INTO page_seo (page, data, updated_at)
     VALUES (?, ?, datetime('now'))`
  );
  const tx = db.transaction((entries) => {
    for (const [page, value] of entries) {
      if (!value || !value.seo) continue;
      insert.run(page, JSON.stringify(value.seo));
    }
  });
  const entries = Object.entries(pages);
  tx(entries);
  return entries.length;
}

function seedCompany() {
  const insert = db.prepare(
    `INSERT INTO company_data (id, data, updated_at)
     VALUES (1, ?, datetime('now'))`
  );
  insert.run(JSON.stringify(COMPANY_DATA));
}

function main() {
  console.log('[seed] resetting tables…');
  resetTables();
  console.log('[seed] seeding messages…');
  const m = seedMessages();
  console.log(`[seed]   inserted ${m} page_content rows`);
  console.log('[seed] seeding services…');
  const s = seedServices();
  console.log(`[seed]   inserted ${s} services rows`);
  console.log('[seed] seeding SEO…');
  const seoCount = seedSeo();
  console.log(`[seed]   inserted ${seoCount} page_seo rows`);
  console.log('[seed] seeding company data…');
  seedCompany();
  console.log('[seed] done.');
}

try {
  main();
  process.exit(0);
} catch (err) {
  console.error('[seed] error:', err);
  process.exit(1);
}
