import { PAGE_KEYS } from "@/lib/site-content";
import { readSiteContent } from "@/lib/local-data";
import SeoPageTabs from "./_components/SeoPageTabs";

export const dynamic = "force-dynamic";

const CONTENT_API_URL = process.env.CONTENT_API_URL;

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  "chi-siamo": "Chi siamo",
  servizi: "Servizi",
  certificazioni: "Certificazioni",
  faqs: "FAQs",
  contatti: "Contatti",
  whistleblowing: "Whistleblowing",
  "privacy-policy": "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  conferma: "Conferma",
};

async function getSeoData(): Promise<{
  data: Record<string, Record<string, string>>;
  fromBackend: boolean;
}> {
  // Prova backend se configurato
  if (CONTENT_API_URL) {
    try {
      const res = await fetch(`${CONTENT_API_URL}/api/v1/seo`, { cache: "no-store" });
      if (res.ok) {
        return { data: await res.json(), fromBackend: true };
      }
    } catch {
      // Cade al fallback locale
    }
  }
  // Fallback locale (lettura dinamica, riflette le ultime modifiche)
  try {
    const content = await readSiteContent();
    const pages = content.pages as Record<string, { seo: Record<string, string> }>;
    const data: Record<string, Record<string, string>> = {};
    for (const key of PAGE_KEYS) {
      data[key] = pages[key]?.seo ?? {};
    }
    return { data, fromBackend: false };
  } catch {
    return { data: {}, fromBackend: false };
  }
}

export default async function AdminSeoPage() {
  const { data: seoData, fromBackend } = await getSeoData();

  const pagesData = PAGE_KEYS.map((key) => ({
    key,
    label: PAGE_LABELS[key] ?? key,
    seo: seoData[key] ?? {},
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">SEO Pagine</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestisci i meta tag SEO per ciascuna pagina del sito.
        </p>
        {!fromBackend && CONTENT_API_URL && (
          <p className="text-xs text-warning mt-2 border border-warning/30 bg-warning/5 px-3 py-2 inline-block">
            Backend non raggiungibile — dati da file locale
          </p>
        )}
      </div>

      <SeoPageTabs pages={pagesData} />
    </div>
  );
}
