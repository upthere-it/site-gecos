import { getSiteContent, PAGE_KEYS } from "@/lib/site-content";
import SeoPageTabs from "./_components/SeoPageTabs";

export const dynamic = "force-dynamic";

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

export default function AdminSeoPage() {
  const content = getSiteContent();
  const pages = content.pages as Record<string, { seo: Record<string, string> }>;

  const pagesData = PAGE_KEYS.map((key) => ({
    key,
    label: PAGE_LABELS[key] ?? key,
    seo: pages[key]?.seo ?? {},
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">SEO Pagine</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestisci i meta tag SEO per ciascuna pagina del sito.
        </p>
      </div>

      <SeoPageTabs pages={pagesData} />
    </div>
  );
}
