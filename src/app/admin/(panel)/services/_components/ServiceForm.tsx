"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export interface ServiceFormData {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  label: string;
  detail1Title: string;
  detail1Text: string;
  detail2Title: string;
  detail2Text: string;
  image: string;
  imageAlt: string;
  heroImage: string;
  heroImageAlt: string;
}

interface Props {
  initialData?: Partial<ServiceFormData>;
  mode: "create" | "edit";
}

const EMPTY: ServiceFormData = {
  id: "",
  slug: "",
  order: 1,
  title: "",
  subtitle: "",
  label: "",
  detail1Title: "",
  detail1Text: "",
  detail2Title: "",
  detail2Text: "",
  image: "",
  imageAlt: "",
  heroImage: "",
  heroImageAlt: "",
};

// Non serve estrarre il token dal cookie: il browser lo invia automaticamente
// come cookie httpOnly con credentials: "same-origin".

export default function ServiceForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceFormData>({ ...EMPTY, ...initialData });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof ServiceFormData, value: string | number) {
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
      const url =
        mode === "create"
          ? "/api/admin/services"
          : `/api/admin/services/${form.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        if (mode === "create") {
          router.push("/admin/services");
        }
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
      {/* Identità */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Identità
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              ID <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => handleChange("id", e.target.value)}
              required
              disabled={mode === "edit"}
              placeholder="manutenzione-verde"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-400 font-mono"
            />
            {mode === "edit" && (
              <p className="text-xs text-gray-400 mt-0.5">L&apos;ID non è modificabile</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Slug <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              required
              placeholder="manutenzione-verde"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Ordine
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => handleChange("order", parseInt(e.target.value) || 1)}
              min={1}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Label (occhiello)
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="VERDE URBANO"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary uppercase"
            />
          </div>
        </div>
      </fieldset>

      {/* Testi principali */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Testi principali
        </legend>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Titolo <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              placeholder="Manutenzione Aree Verdi"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Sottotitolo
            </label>
            <textarea
              value={form.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              rows={2}
              placeholder="Cura e gestione di parchi, giardini…"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
            />
          </div>
        </div>
      </fieldset>

      {/* Dettagli */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Dettagli (scheda servizio)
        </legend>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Titolo dettaglio 1
            </label>
            <input
              type="text"
              value={form.detail1Title}
              onChange={(e) => handleChange("detail1Title", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Testo dettaglio 1
            </label>
            <textarea
              value={form.detail1Text}
              onChange={(e) => handleChange("detail1Text", e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Titolo dettaglio 2
            </label>
            <input
              type="text"
              value={form.detail2Title}
              onChange={(e) => handleChange("detail2Title", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Testo dettaglio 2
            </label>
            <textarea
              value={form.detail2Text}
              onChange={(e) => handleChange("detail2Text", e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
            />
          </div>
        </div>
      </fieldset>

      {/* Immagini */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Immagini
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Card image path
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="/assets/photos/servizio-1.jpg"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Card image alt
            </label>
            <input
              type="text"
              value={form.imageAlt}
              onChange={(e) => handleChange("imageAlt", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Hero image path
            </label>
            <input
              type="text"
              value={form.heroImage}
              onChange={(e) => handleChange("heroImage", e.target.value)}
              placeholder="/assets/photos/servizio-hero-1.jpg"
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Hero image alt
            </label>
            <input
              type="text"
              value={form.heroImageAlt}
              onChange={(e) => handleChange("heroImageAlt", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
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
          Salvato con successo!
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-accent disabled:opacity-50">
          {loading ? "SALVATAGGIO…" : "SALVA MODIFICHE"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="btn-outline"
        >
          ANNULLA
        </button>
      </div>
    </form>
  );
}
