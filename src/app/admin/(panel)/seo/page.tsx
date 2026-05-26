import { getSiteContent, PAGE_KEYS } from "@/lib/site-content";
import SeoPageTabs from "./_components/SeoPageTabs";

export const dynamic = "force-dynamic";

const CONTENT_API_URL = process.env.CONTENT_API_URL ?? "http://localhost:9998";

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

async function getSeoFromBackend(): Promise<Record<string, Record<string, string>> | null> {
  try {
    const res = await fetch(`${CONTENT_API_URL}/api/v1/seo`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AdminSeoPage() {
  const backendSeo = await getSeoFromBackend();
  const localContent = getSiteContent();
  const localPages = localContent.pages as Record<string, { seo: Record<string, string> }>;

  const pagesData = PAGE_KEYS.map((key) => ({
    key,
    label: PAGE_LABELS[key] ?? key,
    seo: backendSeo?.[key] ?? localPages[key]?.seo ?? {},
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">SEO Pagine</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestisci i meta tag SEO per ciascuna pagina del sito.
        </p>
        {!backendSeo && (
          <p className="text-xs text-warning mt-2 border border-warning/30 bg-warning/5 px-3 py-2 inline-block">
            Backend non raggiungibile — dati da file locale (le modifiche non verranno salvate)
          </p>
        )}
      </div>

      <SeoPageTabs pages={pagesData} />
    </div>
  );
}
