# GE.CO.S. S.r.l. — Sito istituzionale

Sito web istituzionale di GE.CO.S. S.r.l., costruito con **Next.js 16** (App Router), **next-intl** per l'i18n e un **backend CMS leggero** basato su Express + SQLite.

Preview pubblica (Cloudflare Workers): **https://gecos-preview.sites-b06.workers.dev**

---

## Stack

| Layer | Tecnologia |
|---|---|
| Frontend | Next.js 16.2.6 (App Router, Turbopack), React 19, TypeScript |
| Stili | Tailwind CSS v4 |
| i18n | next-intl v4 (solo locale `it`) |
| Animazioni | Framer Motion |
| CMS backend | Express 4 + better-sqlite3 (SQLite) |
| Process manager | PM2 (`ecosystem.config.cjs`) |
| Preview cloud | Cloudflare Workers via `@opennextjs/cloudflare` |

---

## Struttura della repo

```
.
├── src/
│   ├── app/
│   │   ├── [locale]/              # Pagine pubbliche (route group i18n)
│   │   │   ├── page.tsx           # Home /it
│   │   │   ├── chi-siamo/
│   │   │   ├── servizi/
│   │   │   │   └── [slug]/        # Pagina singolo servizio
│   │   │   ├── certificazioni/
│   │   │   ├── faqs/
│   │   │   ├── contatti/
│   │   │   ├── whistleblowing/
│   │   │   ├── privacy-policy/
│   │   │   └── cookie-policy/
│   │   │
│   │   ├── admin/                 # Pannello CMS (protetto da cookie)
│   │   │   ├── login/             # Pagina di login
│   │   │   └── (panel)/           # Route group con sidebar
│   │   │       ├── layout.tsx     # Sidebar + contenuto principale
│   │   │       ├── services/      # Gestione servizi (CRUD)
│   │   │       ├── content/       # Testi delle pagine (editor JSON)
│   │   │       ├── company/       # Dati aziendali (form strutturato)
│   │   │       └── seo/           # Meta tag per pagina
│   │   │
│   │   └── api/
│   │       ├── admin/             # Proxy autenticati verso il backend
│   │       │   ├── auth/          # POST login → imposta cookie
│   │       │   ├── services/      # POST + PUT/DELETE /:id
│   │       │   ├── content/[page] # PUT testi pagina
│   │       │   ├── company/       # PUT dati aziendali
│   │       │   └── pages/[pageKey]/seo/  # PUT SEO pagina
│   │       └── loonar/            # Integrazioni esterne (Brevo, FAQ, ticket)
│   │
│   ├── components/                # Componenti riutilizzabili
│   │   ├── Header.tsx
│   │   ├── Footer.tsx             # Server Component async, dati dal CMS
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── content-api.ts         # Fetch dal backend con fallback JSON
│   │   ├── company.ts             # getCompanyData() con fallback
│   │   ├── site-content.ts        # getServices(), getPageSeo() async
│   │   ├── admin-auth.ts          # Verifica cookie admin lato Next.js
│   │   └── faq-datasource.ts      # Sorgente FAQ
│   │
│   ├── data/
│   │   ├── site-content.json      # Dati statici servizi + SEO (fallback)
│   │   └── company-fallback.json  # Dati aziendali (fallback)
│   │
│   ├── i18n/
│   │   ├── routing.ts             # Definizione locales (solo "it")
│   │   └── request.ts             # Carica messaggi dal backend o da file
│   │
│   └── middleware.ts              # Auth admin + routing i18n (Edge runtime)
│
├── messages/
│   └── it.json                    # Testi UI (nav, home, chiSiamo, footer…)
│
├── backend/                       # CMS backend — NON fa parte del bundle Next.js
│   ├── server.js                  # Entry point Express (porta 3001)
│   ├── package.json
│   ├── db/
│   │   ├── schema.sql             # Definizione tabelle SQLite
│   │   ├── index.js               # Connessione + migrazione automatica
│   │   └── seed.js                # Popolamento iniziale del DB dai JSON
│   ├── middleware/
│   │   └── auth.js                # Bearer token (ADMIN_SECRET)
│   ├── routes/
│   │   ├── messages.js            # GET/PUT testi per pagina
│   │   ├── company.js             # GET/PUT dati aziendali
│   │   ├── services.js            # CRUD servizi
│   │   └── seo.js                 # GET/PUT meta tag
│   └── data/
│       └── gecos.db               # File SQLite (gitignored)
│
├── ecosystem.config.cjs           # PM2: avvia backend (3001) + frontend (3000)
├── open-next.config.ts            # Config per Cloudflare Workers
├── wrangler.jsonc                 # Config Wrangler (deploy Cloudflare)
└── next.config.ts
```

---

## Variabili d'ambiente

Crea un file `.env.local` nella root del progetto (non committare mai questo file):

```env
# Obbligatoria — password del pannello /admin e secret del backend
ADMIN_SECRET=una-password-sicura

# Solo in produzione self-hosted — URL del backend Express
CONTENT_API_URL=http://localhost:3001

# Integrazioni esterne (opzionali)
BREVO_API_KEY=...
LOONAR_API_KEY=...
LOONAR_API_URL=...
```

Il backend legge `ADMIN_SECRET` dallo stesso `.env.local` nella root (il `server.js` fa `dotenv.config` dal path `../`).

---

## Avvio in sviluppo locale

### 1. Installa le dipendenze

```bash
npm install
cd backend && npm install && cd ..
```

### 2. Popola il database (prima volta)

```bash
cd backend
ADMIN_SECRET=dev node db/seed.js
cd ..
```

Il seed legge `messages/it.json` e `src/data/site-content.json` e popola il DB SQLite in `backend/data/gecos.db`. È idempotente: può essere rieseguito senza duplicare dati.

### 3. Avvia i due processi in parallelo

**Terminale 1 — backend:**
```bash
cd backend
ADMIN_SECRET=dev node server.js
```

**Terminale 2 — frontend:**
```bash
ADMIN_SECRET=dev CONTENT_API_URL=http://localhost:3001 npm run dev
```

Il sito è su **http://localhost:3000**, il pannello admin su **http://localhost:3000/admin**.

> Se il backend non è raggiungibile, il frontend fa fallback automatico sui file JSON locali: il sito pubblico funziona comunque, ma le modifiche dal pannello admin non vengono salvate.

---

## Avvio in produzione (self-hosting con PM2)

### 1. Prima installazione sul server

```bash
git clone <repo> /var/www/gecos
cd /var/www/gecos

# Dipendenze frontend
npm ci

# Dipendenze backend + seed iniziale
cd backend && npm ci && node db/seed.js && cd ..

# Build Next.js
npm run build
```

### 2. Configura le variabili d'ambiente

Crea `/var/www/gecos/.env.local`:
```env
ADMIN_SECRET=password-molto-sicura
CONTENT_API_URL=http://localhost:3001
```

### 3. Avvia con PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # configura riavvio automatico al boot del server
```

PM2 avvia due processi:
- `gecos-backend` — Express su porta 3001
- `gecos-frontend` — `next start` su porta 3000

### 4. Aggiornamenti successivi

```bash
git pull
npm ci
npm run build
pm2 restart all
```

---

## Deploy preview su Cloudflare Workers

In questa modalità il backend CMS **non è disponibile** — il sito usa i dati statici dai file JSON come fallback. Utile per preview e staging.

```bash
# Build con adapter OpenNext
npx @opennextjs/cloudflare build

# Deploy (richiede CLOUDFLARE_API_TOKEN come variabile d'ambiente)
CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
```

URL preview: **https://gecos-preview.sites-b06.workers.dev**

---

## Pannello admin

Accessibile su `/admin` (in locale e in produzione self-hosted). Non funziona su Cloudflare Workers.

| Sezione | Percorso | Funzione |
|---|---|---|
| Servizi | `/admin/services` | Crea, modifica, elimina i servizi |
| Contenuti pagine | `/admin/content` | Modifica i testi di ogni pagina |
| Dati aziendali | `/admin/company` | Indirizzi, telefoni, email, social, copyright |
| SEO | `/admin/seo` | Meta title e description per ogni pagina |

L'autenticazione usa un cookie `admin_token` impostato al login con la password definita in `ADMIN_SECRET`. Le modifiche passano attraverso le route `/api/admin/*` (Next.js), che a loro volta chiamano il backend Express con Bearer token.

---

## Come funziona il CMS

```
Browser admin                Next.js /api/admin/*        Backend Express :3001
     │                              │                            │
     │  PUT /api/admin/company      │                            │
     ├─────────────────────────────►│                            │
     │  (verifica cookie)           │  PUT /api/v1/company       │
     │                              ├───────────────────────────►│
     │                              │  (verifica Bearer token)   │
     │                              │                            │ scrive su SQLite
     │                              │◄───────────────────────────┤
     │◄─────────────────────────────┤                            │

Pagine pubbliche Next.js
     │
     │  getCompanyData() / getMessages() / getServices()
     ├──► fetch http://localhost:3001/api/v1/...  (cache revalidate: 60s)
     │         se il backend non risponde → fallback JSON locale
```

---

## API backend (porta 3001)

Tutte le route di scrittura richiedono `Authorization: Bearer <ADMIN_SECRET>`.

| Metodo | Percorso | Descrizione |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/messages/:locale` | Tutti i testi (es. `it`) |
| PUT | `/api/v1/messages/:locale/:page` | Aggiorna testi di una pagina |
| GET | `/api/v1/company` | Dati aziendali |
| PUT | `/api/v1/company` | Aggiorna dati aziendali |
| GET | `/api/v1/services` | Lista servizi |
| GET | `/api/v1/services/:slug` | Singolo servizio |
| POST | `/api/v1/services` | Crea servizio |
| PUT | `/api/v1/services/:id` | Aggiorna servizio |
| DELETE | `/api/v1/services/:id` | Elimina servizio |
| GET | `/api/v1/seo` | Tutti i meta tag |
| GET | `/api/v1/seo/:page` | Meta tag di una pagina |
| PUT | `/api/v1/seo/:page` | Aggiorna meta tag |
