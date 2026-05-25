import type { MetadataRoute } from "next";

const BASE_URL = "https://gecospomezia.it";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/it`, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/it/chi-siamo`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/it/servizi`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/it/servizi/manutenzione-aree-verdi`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/it/servizi/gestione-aree-boschive`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/it/servizi/arredo-urbano`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/it/servizi/servizi-cimiteriali`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/it/certificazioni`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/it/faqs`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/it/contatti`, lastModified: new Date(), priority: 0.8 },
  ];
}
