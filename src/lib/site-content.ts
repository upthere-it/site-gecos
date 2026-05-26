import content from "@/data/site-content.json";
import type { ServiceItem, SeoData } from "./content-api";
import { getServicesFromApi, getSeoFromApi } from "./content-api";
import { readSiteContent } from "./local-data";

export type { ServiceItem, SeoData };
export type SiteContent = typeof content;
export type PageKey = keyof SiteContent["pages"];

export function getSiteContent(): SiteContent {
  return content;
}

// Lettura dinamica da file — riflette le modifiche fatte dall'admin
// senza dover riavviare il server. Usa l'import statico come ulteriore fallback.
async function getServicesLocalDynamic(): Promise<ServiceItem[]> {
  try {
    const data = await readSiteContent();
    return [...data.services].sort((a, b) => a.order - b.order);
  } catch {
    return [...content.services].sort((a, b) => a.order - b.order);
  }
}

async function getServiceBySlugLocalDynamic(
  slug: string
): Promise<ServiceItem | undefined> {
  try {
    const data = await readSiteContent();
    return data.services.find((s) => s.slug === slug);
  } catch {
    return content.services.find((s) => s.slug === slug);
  }
}

async function getPageSeoLocalDynamic(pageKey: string): Promise<SeoData | null> {
  try {
    const data = await readSiteContent();
    const pages = data.pages as Record<string, { seo: SeoData }>;
    return pages[pageKey]?.seo ?? null;
  } catch {
    const pages = content.pages as Record<string, { seo: SeoData }>;
    return pages[pageKey]?.seo ?? null;
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  const api = await getServicesFromApi();
  if (api && Array.isArray(api) && api.length > 0) {
    return [...api].sort((a, b) => a.order - b.order);
  }
  return getServicesLocalDynamic();
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceItem | undefined> {
  const api = await getServicesFromApi();
  if (api && Array.isArray(api)) {
    const found = api.find((s) => s.slug === slug);
    if (found) return found;
  }
  return getServiceBySlugLocalDynamic(slug);
}

export async function getPageSeo(pageKey: string): Promise<SeoData | null> {
  const api = await getSeoFromApi();
  if (api && api[pageKey]) return api[pageKey];
  return getPageSeoLocalDynamic(pageKey);
}

export const PAGE_KEYS: PageKey[] = [
  "home",
  "chi-siamo",
  "servizi",
  "certificazioni",
  "faqs",
  "contatti",
  "whistleblowing",
  "privacy-policy",
  "cookie-policy",
  "conferma",
];
