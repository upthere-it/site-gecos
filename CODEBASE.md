# CODEBASE.md — Guida tecnica riproducibile

> Documento operativo per replicare questa architettura su nuovi siti web con Claude Code.
> Le sezioni marcate **FISSO** sono invarianti. Quelle marcate **VARIA** vanno adattate progetto per progetto.

---

## 1. Stack tecnologico (FISSO)

| Layer | Tecnologia | Note |
|-------|-----------|------|
| Framework | Next.js 16+ — App Router, `src/` dir, TypeScript strict | Breaking changes rispetto a versioni precedenti — leggere `node_modules/next/dist/docs/` |
| Stile | Tailwind CSS v4 — `@import "tailwindcss"` + `@theme` in `globals.css` | Niente `tailwind.config.ts` |
| i18n | next-intl — `messages/{locale}.json` | Server: `getTranslations()`, Client: `useTranslations()` |
| Animazioni | Framer Motion | `motion.div` con `variants` + `whileInView` |
| Icone | **Material Symbols** (font icon via CDN) | `<span className="material-symbols-outlined">nome</span>` — **mai SVG inline, mai altre lib** |
| Immagini | `next/image` — sempre locali in `public/assets/` | URL Figma MCP scadono dopo 7 giorni |
| Backend CMS | Express + better-sqlite3 (SQLite) | Processo PM2 separato dalla Next.js app |
| Process Manager | **PM2** | Cloudflare Workers (`wrangler.jsonc`) = solo sandbox/test locale, **mai produzione** |

---

## 2. Struttura directory

### Parte FISSA (presente in ogni progetto)

```
src/
├── app/
│   ├── [locale]/               # pagine pubbliche — VARIA per progetto
│   ├── admin/
│   │   ├── layout.tsx          # root admin layout (controlla cookie)
│   │   ├── login/page.tsx      # SEMPRE: pagina login pubblica
│   │   └── (panel)/            # route group con sidebar
│   │       ├── layout.tsx      # sidebar + main area
│   │       ├── content/        # SEMPRE: editor testi pagine
│   │       │   ├── page.tsx    # lista pagine editabili
│   │       │   └── [page]/     # editor JSON per singola pagina
│   │       ├── company/        # SEMPRE: dati aziendali
│   │       ├── seo/            # SEMPRE: SEO per pagina (tabs)
│   │       └── _components/
│   │           ├── ContentEditor.tsx
│   │           ├── CompanyForm.tsx
│   │           ├── SeoForm.tsx
│   │           ├── SeoPageTabs.tsx
│   │           ├── ImageUploadField.tsx
│   │           └── ImageGalleryModal.tsx
│   └── api/
│       └── admin/
│           ├── auth/route.ts   # POST login → imposta cookie
│           ├── content/[page]/ # PUT testi pagina
│           ├── company/        # PUT dati aziendali
│           ├── pages/[key]/seo/# PUT SEO
│           ├── upload/         # POST upload media
│           └── uploads/        # GET lista media
├── components/                 # VARIA: costruiti da Figma
├── lib/
│   ├── site-content.ts         # FISSO: getServices(), getPageSeo(), hybrid fetch
│   ├── content-api.ts          # FISSO: interfaces TypeScript + fetchOrNull<T>
│   ├── local-data.ts           # FISSO: R/W fallback su file JSON
│   └── admin-auth.ts           # FISSO: checkAdminAuth(req)
├── i18n/
│   ├── routing.ts              # defineRouting({ locales, defaultLocale })
│   └── request.ts              # getRequestConfig() → fetch messages con fallback
├── data/
│   ├── site-content.json       # fallback offline: entità gestibili + pages SEO
│   └── company.json            # fallback offline: dati aziendali
└── proxy.ts                    # FISSO: middleware Edge (admin guard + intl)

backend/
├── server.js                   # entry point Express
├── package.json                # Express, better-sqlite3, cors, dotenv
├── middleware/auth.js          # requireAdmin: verifica Bearer token
├── db/
│   ├── index.js                # init DB + run schema.sql
│   ├── schema.sql              # tabelle base + tabelle progetto
│   └── seed.js                 # popola DB da messages/*.json + site-content.json
└── routes/                     # VARIA: messages, company, seo + route progetto

messages/
└── it.json                     # FISSO: tutti i testi UI (nav, pagine, footer, ecc.)

public/assets/                  # FISSO: foto, loghi, icone — tutti da Figma
ecosystem.config.cjs            # FISSO: PM2 config (backend + frontend)
.env.local                      # FISSO: secrets (mai committare)
```

### Parte VARIABILE (dipende dal progetto)

- **Pagine in `[locale]/`** — quante e quali pagine ha il sito
- **Componenti in `src/components/`** — costruiti a partire dai mockup Figma
- **Tabelle extra in `schema.sql`** — solo se ci sono entità gestibili (es. `services`, `team`, `portfolio`)
- **Routes extra in `backend/routes/`** — corrispondono alle tabelle extra
- **CRUD admin extra** — es. `/admin/services` — solo se il progetto lo richiede

---

## 3. Admin panel — moduli sempre presenti

| Modulo | Route | Descrizione |
|--------|-------|-------------|
| Login | `/admin/login` | Auth con password + cookie `admin_token` (httpOnly, 8h) |
| Testi pagine | `/admin/content/[page]` | Editor JSON generico — pagine = key di `messages/it.json` |
| Dati aziendali | `/admin/company` | Form strutturato (indirizzo, email, telefoni, social) |
| SEO | `/admin/seo` | Tabs per pagina: metaTitle, description, OG, robots, canonical |
| Upload media | API `/api/admin/upload` | Salva in `public/uploads/`, ritorna URL |

**Moduli extra** (aggiungere solo se il progetto li richiede):
- `/admin/services` — se il sito ha servizi gestibili
- `/admin/team`, `/admin/portfolio`, ecc.

---

## 4. Backend Express + SQLite

### Tabelle base (FISSO — sempre presenti)

```sql
CREATE TABLE page_content (
  locale TEXT NOT NULL,
  page   TEXT NOT NULL,
  content TEXT NOT NULL,               -- JSON con i testi della pagina
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (locale, page)
);

CREATE TABLE company_data (
  id   INTEGER PRIMARY KEY CHECK (id = 1),  -- singleton
  data TEXT NOT NULL,                        -- JSON dati aziendali
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE page_seo (
  page TEXT PRIMARY KEY,
  data TEXT NOT NULL,                        -- JSON SEO
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Tabelle extra (VARIA — solo se il progetto le richiede)

Esempio per sito con servizi:
```sql
CREATE TABLE services (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  data       TEXT NOT NULL,            -- JSON blob con tutti i campi
  updated_at TEXT DEFAULT (datetime('now'))
);
```

Pattern per `rowToService()` — evitare che lo spread del JSON blob sovrascriva l'id numerico:
```js
function rowToService(row) {
  const { id: _ignored, ...rest } = JSON.parse(row.data);
  return { dbId: row.id, id: row.slug, slug: row.slug, order: row.sort_order, ...rest };
}
```

### Porta backend — DINAMICA

**Mai hardcoded**. Sul server convivono più siti con questa architettura, le porte basse sono occupate.

```env
BACKEND_PORT=9998   # scegliere porta libera per ogni progetto
CONTENT_API_URL=http://localhost:${BACKEND_PORT}
```

### Seed (`backend/db/seed.js`)

Itera automaticamente su **tutti** i key di `messages/it.json` → `page_content`.
Aggiungere un nuovo key in `messages/it.json` = il seed lo include senza modifiche al seed stesso.

---

## 5. Sistema contenuti — Hybrid Fetch Pattern (FISSO)

Ogni dato recuperabile dal CMS usa questo pattern:

```
Componente → lib/site-content.ts
  → tenta fetchOrNull(CONTENT_API_URL + path)   ← backend Express/SQLite
    → OK → usa risposta
    → FAIL → fallback lib/local-data.ts          ← file JSON in src/data/
```

Il sito funziona anche senza il backend attivo (utile in sviluppo e durante deploy).

`fetchOrNull<T>` in `lib/content-api.ts`:
```ts
async function fetchOrNull<T>(path: string): Promise<T | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}
```

---

## 6. Middleware proxy.ts (FISSO)

Due responsabilità in sequenza:
1. **Admin guard**: richiesta a `/admin/*` senza cookie `admin_token` valido → redirect `/admin/login`
2. **i18n**: tutto il resto → `intlMiddleware` di next-intl

```ts
// src/proxy.ts  (export default + export { proxy as middleware })
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // controlla cookie → redirect se assente
  }
  return intlMiddleware(req);
}
export { proxy as middleware }
export const config = { matcher: [...] }
```

> **Breaking change Next.js 16**: il middleware si chiama `proxy.ts` con `export { proxy as middleware }`, non `middleware.ts` con `export default`.

---

## 7. i18n — next-intl (FISSO)

```ts
// src/i18n/routing.ts
export const routing = defineRouting({ locales: ['it'], defaultLocale: 'it' });

// src/i18n/request.ts
export default getRequestConfig(async () => {
  const messages = await getMessages('it');  // fetch API → fallback file
  return { locale: 'it', messages };
});
```

Struttura `messages/it.json`:
```json
{
  "nav": { ... },
  "home": { "hero": { ... }, "chiSiamo": { ... }, ... },
  "chiSiamo": { ... },
  "servizi": { ... },
  "footer": { ... }
  // aggiungere una chiave per ogni nuova pagina
}
```

Server Component: `const t = await getTranslations("home")`
Client Component: `const t = useTranslations("home")`

---

## 8. Design System (VARIA — sempre estratto da Figma)

### Regola fondamentale

**Colori, font, spacing, border-radius: sempre da Figma.** Non usare valori di altri progetti come default. Ogni progetto ha la sua palette.

### Procedura (eseguire prima di scrivere qualsiasi CSS)

1. Chiamare `get_design_context` sul frame **UI Kit / Palette** del file Figma
2. Estrarre: colori hex, font-family, font-weight, font-size, line-height, spacing, border-radius
3. Scrivere tutto nel blocco `@theme` di `src/app/globals.css`

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Colori — sempre da Figma */
  --color-primary:      /* hex da Figma */;
  --color-primary-950:  /* hex da Figma */;
  --color-accent:       /* hex da Figma — CTA principale */;
  --color-accent-dark:  /* hex da Figma — hover CTA */;

  /* Tipografia — sempre da Figma */
  --font-sans:    "NomeFontDaFigma", sans-serif;
  --font-heading: "NomeFontDaFigma", sans-serif;
}
```

### Classi utility da creare in globals.css

```css
.container-boxed {
  /* larghezza massima dal mockup Figma — solitamente 1140px ma verificare sempre */
  max-width: 1140px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

.btn-accent { /* CTA principale — colori da Figma */ }
.btn-outline { /* bottone secondario — colori da Figma */ }
```

> La larghezza `.container-boxed` segue il mockup. Non assumere 1140px — verificare sempre in Figma.

### Icone

- **Solo Material Symbols** → `<span className="material-symbols-outlined">icon_name</span>`
- Se l'icona non esiste in Material Symbols → scarica PNG da Figma in `public/assets/icons/`
- **Mai** SVG inline, mai FontAwesome, mai Heroicons, mai Lucide

---

## 9. Figma Workflow — istruzioni operative

### Prima di iniziare (obbligatorio)

**Step 1 — Raccogliere i dati Figma** (farlo PRIMA di avviare Claude Code):

```
FIGMA_FILE_URL:    https://www.figma.com/design/{FILE_KEY}/{NOME-FILE}
FIGMA_FILE_KEY:    {estratto dall'URL — segmento dopo /design/}
MOCKUP_PAGE_NAME:  {nome esatto della pagina Figma con i mockup delle pagine}
UIKIT_PAGE_NAME:   {nome esatto della pagina UI Kit / Design System / Styleguide}
```

**Step 2 — Raccogliere i node-id** di ogni frame (aprire in Figma → copiare URL → `node-id=XXX-YYY` → convertire in `XXX:YYY`):

| Elemento | node-id | Note |
|---------|---------|------|
| **UI Kit (frame root)** | `TODO` | Obbligatorio — estrarre prima di tutto |
| Palette colori | `TODO` | Nodo palette dentro l'UI Kit |
| Tipografia / Font scale | `TODO` | Nodo typography dentro l'UI Kit |
| Componenti base (bottoni, card, ecc.) | `TODO` | Nodo components |
| Homepage | `TODO` | Frame homepage nel mockup |
| Chi siamo | `TODO` | |
| Servizi (listing) | `TODO` | |
| Servizio [singolo] | `TODO` | |
| Certificazioni | `TODO` | |
| FAQ | `TODO` | |
| Contatti | `TODO` | |
| Whistleblowing | `TODO` | Se prevista |
| Privacy Policy | `TODO` | |
| Cookie Policy | `TODO` | |
| [altre pagine] | `TODO` | |

> **Regola**: non iniziare senza almeno UI Kit + palette + homepage. Le pagine restanti si aggiungono man mano.

### Step 3 — Scan Figma (Claude esegue all'avvio)

1. `get_metadata(fileKey)` — lista tutte le pagine del file
2. `get_design_context(fileKey, UIKIT_NODE_ID)` — estrae token → scrive `globals.css @theme`
3. `get_design_context(fileKey, HOMEPAGE_NODE_ID)` — implementa homepage
4. Per le altre pagine: chiamate parallele quando possibile
5. Download PNG di **tutti** gli asset → `public/assets/` — **mai usare URL Figma come `src` in produzione**

### Regole asset

- Tutti gli asset visivi provengono da Figma (niente placeholder, stock, immagini inventate)
- Download locale obbligatorio: URL Figma MCP scadono dopo 7 giorni
- Usare sempre `<Image>` di `next/image` con `width`, `height`, `alt`
- Niente SVG inline per illustrazioni — salvare come PNG

---

## 10. Variabili d'Ambiente

```env
# .env.local — mai committare

# Admin Panel
ADMIN_SECRET=scegliere-valore-sicuro-per-ogni-progetto

# Backend SQLite — porta libera sul server (non usare porte già occupate da altri siti)
BACKEND_PORT=XXXX
CONTENT_API_URL=http://localhost:XXXX

# Integrazioni esterne (se previste)
LOONAR_BE_URL=
LOONAR_BASE_URL=
APP_ENV=dev
```

---

## 11. Deploy — PM2 (produzione)

```js
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "{progetto}-backend",
      script: "backend/server.js",
      cwd: __dirname,
      env_prod: { NODE_ENV: "production", PORT: process.env.BACKEND_PORT }
    },
    {
      name: "{PORTA}.{progetto}",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 2,
      exec_mode: "cluster",
      env_prod: {
        NODE_ENV: "production",
        PORT: "{PORTA_FRONTEND}",
        CONTENT_API_URL: "http://localhost:{BACKEND_PORT}"
      }
    }
  ]
};
```

Workflow deploy:
```bash
npm run build          # zero errori TypeScript obbligatorio
pm2 startOrRestart ecosystem.config.cjs --env prod
```

> Cloudflare Workers (`wrangler.jsonc`) = solo test/sandbox locale. **Mai in produzione.**

---

## 12. Checklist per un nuovo progetto

Prima di avviare Claude Code:

- [ ] File Figma aperto — raccolto `FIGMA_FILE_KEY`
- [ ] Identificata pagina Mockup (nome esatto)
- [ ] Identificata pagina UI Kit / Design System (nome esatto)
- [ ] Compilato node-id per: UI Kit root, palette, tipografia
- [ ] Compilato node-id per: homepage + tutte le pagine principali
- [ ] Deciso quali entità gestibili ha il sito (servizi? team? portfolio? nessuna?)
- [ ] Scelto nome progetto e porta backend libera sul server
- [ ] Creato `.env.local` con `ADMIN_SECRET` e `BACKEND_PORT`
- [ ] Struttura base del repo pronta (copiare da questo template)

Durante l'implementazione:
- [ ] `globals.css @theme` scritto prima di qualsiasi componente
- [ ] Asset PNG scaricati localmente prima di usarli
- [ ] `npm run build` passa senza errori prima di ogni commit significativo
- [ ] `HANDOFF.md` aggiornato e committato a fine ogni sessione

---

## 13. Handoff tra sessioni (obbligatorio)

Prima di chiudere ogni sessione di lavoro, scrivere e committare `HANDOFF.md` nella root:

```markdown
# Handoff — {data e ora}

## Stato pagine
- Completate: [lista]
- In corso: [nome, % stimata]
- Rimanenti: [lista]

## Ultimo file modificato
- Path: [percorso]
- Stato: [cosa è fatto, cosa manca]

## Componenti creati
- `src/components/NomeComponente.tsx` — descrizione breve

## Asset scaricati in public/assets/
- [lista file]

## Problemi aperti
- [decisioni in sospeso, anomalie Figma, ecc.]

## Prompt per riprendere
---
Stai continuando l'implementazione di [{NOME PROGETTO}] da Figma.
Figma: {FIGMA_FILE_URL}
Branch: {branch corrente}
Leggi HANDOFF.md, poi riprendi da: {punto esatto}
---
```

---

## Riferimento progetto corrente (test-gecos / GE.CO.S.)

> Questa sezione documenta i valori specifici di questo progetto. Per un nuovo progetto, sostituire tutti i valori.

| Parametro | Valore |
|-----------|--------|
| Figma file key | `NWQUVNyJMB3ql4oWt0almu` |
| Figma URL | `https://www.figma.com/design/NWQUVNyJMB3ql4oWt0almu/GECOS` |
| Colore primary | `#00592E` (verde) |
| Colore accent CTA | `#DEF654` (lime giallo) |
| Font | Inter |
| Container boxed | 1152px (eccezione — di solito 1140px) |
| Porta backend | 9998 (backend) / 9999 (frontend) |

**Node-id Figma noti** (da sessioni di sviluppo precedenti):

| Pagina | node-id | URL |
|--------|---------|-----|
| Chi siamo / Servizi hero | `140:1242` | `?node-id=140-1242` |
| Servizio [slug] — card dettagli | `170:2807` | `?node-id=170-2807` |
| Whistleblowing | `300:3422` | `?node-id=300-3422` |
| UI Kit, palette, homepage, altre pagine | `TODO` | Da recuperare aprendo i frame in Figma |
