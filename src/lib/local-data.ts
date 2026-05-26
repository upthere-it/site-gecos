/**
 * Operazioni di lettura/scrittura sui file JSON locali.
 * Usato come fallback quando CONTENT_API_URL non è configurato
 * o il backend non è raggiungibile.
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { ServiceItem, SeoData, CompanyData } from "./content-api";

const SITE_CONTENT_PATH = path.join(process.cwd(), "src", "data", "site-content.json");
const MESSAGES_IT_PATH = path.join(process.cwd(), "messages", "it.json");
const COMPANY_PATH = path.join(process.cwd(), "src", "data", "company.json");

interface RawSiteContent {
  services: ServiceItem[];
  pages: Record<string, { seo: Record<string, string> }>;
}

// ── Site content ──────────────────────────────────────────

export async function readSiteContent(): Promise<RawSiteContent> {
  const raw = await readFile(SITE_CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as RawSiteContent;
}

async function writeSiteContent(data: RawSiteContent): Promise<void> {
  await writeFile(SITE_CONTENT_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// ── Services ──────────────────────────────────────────────

export async function localCreateService(service: ServiceItem): Promise<void> {
  const data = await readSiteContent();
  if (data.services.find((s) => s.id === service.id)) {
    throw new Error(`ID "${service.id}" già in uso`);
  }
  data.services.push(service);
  await writeSiteContent(data);
}

export async function localUpdateService(
  id: string,
  patch: Partial<ServiceItem>
): Promise<void> {
  const data = await readSiteContent();
  const idx = data.services.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error(`Servizio "${id}" non trovato`);
  data.services[idx] = { ...data.services[idx], ...patch, id };
  await writeSiteContent(data);
}

export async function localDeleteService(id: string): Promise<void> {
  const data = await readSiteContent();
  const before = data.services.length;
  data.services = data.services.filter((s) => s.id !== id);
  if (data.services.length === before) {
    throw new Error(`Servizio "${id}" non trovato`);
  }
  await writeSiteContent(data);
}

// ── SEO ───────────────────────────────────────────────────

export async function localUpdateSeo(pageKey: string, seo: SeoData): Promise<void> {
  const data = await readSiteContent();
  if (!data.pages[pageKey]) {
    data.pages[pageKey] = { seo: {} };
  }
  data.pages[pageKey].seo = seo as Record<string, string>;
  await writeSiteContent(data);
}

// ── Messages (i18n) ───────────────────────────────────────

export async function readLocalMessages(): Promise<Record<string, unknown>> {
  const raw = await readFile(MESSAGES_IT_PATH, "utf-8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export async function localUpdateMessages(
  pageKey: string,
  pageData: unknown
): Promise<void> {
  const messages = await readLocalMessages();
  messages[pageKey] = pageData;
  await writeFile(MESSAGES_IT_PATH, JSON.stringify(messages, null, 2) + "\n", "utf-8");
}

// ── Company ───────────────────────────────────────────────

export async function readLocalCompany(): Promise<Partial<CompanyData>> {
  try {
    const raw = await readFile(COMPANY_PATH, "utf-8");
    return JSON.parse(raw) as Partial<CompanyData>;
  } catch {
    return {};
  }
}

export async function writeLocalCompany(data: CompanyData): Promise<void> {
  await writeFile(COMPANY_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
