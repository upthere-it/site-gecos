"use client";

import { useState, FormEvent } from "react";

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  canonicalUrl?: string;
}

interface Props {
  pageKey: string;
  pageLabel: string;
  initialSeo: Record<string, string>;
}

function getAdminToken(): string {
  if (typeof document === "undefined") return "";
  return (document.cookie.match(/admin_token=([^;]+)/) ?? [])[1] ?? "";
}

const ROBOTS_OPTIONS = [
  "index,follow",
  "noindex,nofollow",
  "index,nofollow",
  "noindex,follow",
];

export default function SeoForm({ pageKey, pageLabel, initialSeo }: Props) {
  const [form, setForm] = useState<SeoData>({
    metaTitle: initialSeo.metaTitle ?? "",
    metaDescription: initialSeo.metaDescription ?? "",
    ogTitle: initialSeo.ogTitle ?? "",
    ogDescription: initialSeo.ogDescription ?? "",
    ogImage: initialSeo.ogImage ?? "",
    robots: initialSeo.robots ?? "index,follow",
    canonicalUrl: initialSeo.canonicalUrl ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof SeoData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/pages/${pageKey}/seo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": getAdminToken(),
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error ?? "Errore durante il salvataggio");
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="mb-4">
        <h2 className="text-base font-bold text-primary">
          SEO — {pageLabel}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">{pageKey}</p>
      </div>

      {/* Meta base */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Meta tag
        </legend>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              maxLength={70}
              placeholder="Titolo pagina | GE.CO.S. S.r.l."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              {(form.metaTitle ?? "").length}/70 caratteri
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Meta Description
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="Descrizione della pagina per i motori di ricerca…"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              {(form.metaDescription ?? "").length}/160 caratteri
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
                Robots
              </label>
              <select
                value={form.robots}
                onChange={(e) => handleChange("robots", e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary bg-white"
              >
                {ROBOTS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={form.canonicalUrl}
                onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                placeholder="https://gecossrl.it/it/pagina"
                className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Open Graph */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Open Graph
        </legend>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              OG Title
            </label>
            <input
              type="text"
              value={form.ogTitle}
              onChange={(e) => handleChange("ogTitle", e.target.value)}
              placeholder="Se vuoto, usa Meta Title"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              OG Description
            </label>
            <textarea
              value={form.ogDescription}
              onChange={(e) => handleChange("ogDescription", e.target.value)}
              rows={2}
              placeholder="Se vuoto, usa Meta Description"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              OG Image path
            </label>
            <input
              type="text"
              value={form.ogImage}
              onChange={(e) => handleChange("ogImage", e.target.value)}
              placeholder="/assets/photos/og-image.jpg"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>
      </fieldset>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-error font-medium border border-error/30 bg-error/5 px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-success font-medium border border-success/30 bg-success/5 px-4 py-3">
          SEO salvata con successo!
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-accent disabled:opacity-50">
          {loading ? "SALVATAGGIO…" : "SALVA SEO"}
        </button>
      </div>
    </form>
  );
}
