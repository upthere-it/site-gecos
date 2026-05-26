"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export interface CompanyData {
  tagline: string;
  sedeOperativa: { indirizzo: string; cap: string; citta: string };
  sedeLegale: { indirizzo: string; cap: string; citta: string };
  telefoni: string[];
  emails: string[];
  social: { instagram: string; facebook: string };
  copyright: string;
}

interface Props {
  initialData: CompanyData;
}

export default function CompanyForm({ initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CompanyData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function resetFeedback() {
    setError("");
    setSuccess(false);
  }

  function updateSede(
    which: "sedeOperativa" | "sedeLegale",
    field: "indirizzo" | "cap" | "citta",
    value: string
  ) {
    setForm((p) => ({ ...p, [which]: { ...p[which], [field]: value } }));
    resetFeedback();
  }

  function updateSocial(field: "instagram" | "facebook", value: string) {
    setForm((p) => ({ ...p, social: { ...p.social, [field]: value } }));
    resetFeedback();
  }

  function updateArrayItem(
    which: "telefoni" | "emails",
    idx: number,
    value: string
  ) {
    setForm((p) => {
      const copy = [...p[which]];
      copy[idx] = value;
      return { ...p, [which]: copy };
    });
    resetFeedback();
  }

  function addArrayItem(which: "telefoni" | "emails") {
    setForm((p) => ({ ...p, [which]: [...p[which], ""] }));
    resetFeedback();
  }

  function removeArrayItem(which: "telefoni" | "emails", idx: number) {
    setForm((p) => {
      const copy = [...p[which]];
      copy.splice(idx, 1);
      return { ...p, [which]: copy };
    });
    resetFeedback();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // pulizia: rimuovi stringhe vuote da array
    const payload: CompanyData = {
      ...form,
      telefoni: form.telefoni.map((s) => s.trim()).filter(Boolean),
      emails: form.emails.map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Errore durante il salvataggio");
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tagline */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Tagline
        </legend>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => {
            setForm((p) => ({ ...p, tagline: e.target.value }));
            resetFeedback();
          }}
          placeholder="Es. Specialisti del verde urbano"
          className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
        />
      </fieldset>

      {/* Sede operativa */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Sede operativa
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Indirizzo
            </label>
            <input
              type="text"
              value={form.sedeOperativa.indirizzo}
              onChange={(e) => updateSede("sedeOperativa", "indirizzo", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              CAP
            </label>
            <input
              type="text"
              value={form.sedeOperativa.cap}
              onChange={(e) => updateSede("sedeOperativa", "cap", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Città
            </label>
            <input
              type="text"
              value={form.sedeOperativa.citta}
              onChange={(e) => updateSede("sedeOperativa", "citta", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </fieldset>

      {/* Sede legale */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Sede legale
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Indirizzo
            </label>
            <input
              type="text"
              value={form.sedeLegale.indirizzo}
              onChange={(e) => updateSede("sedeLegale", "indirizzo", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              CAP
            </label>
            <input
              type="text"
              value={form.sedeLegale.cap}
              onChange={(e) => updateSede("sedeLegale", "cap", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Città
            </label>
            <input
              type="text"
              value={form.sedeLegale.citta}
              onChange={(e) => updateSede("sedeLegale", "citta", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </fieldset>

      {/* Telefoni */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Telefoni
        </legend>
        <div className="space-y-2">
          {form.telefoni.map((tel, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono w-6">{i + 1}.</span>
              <input
                type="tel"
                value={tel}
                onChange={(e) => updateArrayItem("telefoni", i, e.target.value)}
                placeholder="+39 06 12345678"
                className="flex-1 border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("telefoni", i)}
                className="text-xs font-bold text-error border border-error px-2 py-1 hover:bg-error hover:text-white transition-colors"
              >
                −
              </button>
            </div>
          ))}
          {form.telefoni.length === 0 && (
            <p className="text-xs text-gray-400 italic">Nessun telefono.</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addArrayItem("telefoni")}
          className="mt-3 text-xs font-bold text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
        >
          + AGGIUNGI TELEFONO
        </button>
      </fieldset>

      {/* Email */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Email
        </legend>
        <div className="space-y-2">
          {form.emails.map((em, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono w-6">{i + 1}.</span>
              <input
                type="email"
                value={em}
                onChange={(e) => updateArrayItem("emails", i, e.target.value)}
                placeholder="info@gecos.it"
                className="flex-1 border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("emails", i)}
                className="text-xs font-bold text-error border border-error px-2 py-1 hover:bg-error hover:text-white transition-colors"
              >
                −
              </button>
            </div>
          ))}
          {form.emails.length === 0 && (
            <p className="text-xs text-gray-400 italic">Nessuna email.</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addArrayItem("emails")}
          className="mt-3 text-xs font-bold text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
        >
          + AGGIUNGI EMAIL
        </button>
      </fieldset>

      {/* Social */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Social
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={form.social.instagram}
              onChange={(e) => updateSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={form.social.facebook}
              onChange={(e) => updateSocial("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </fieldset>

      {/* Copyright */}
      <fieldset className="bg-white border border-gray-200 p-6">
        <legend className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1 mb-4">
          Copyright
        </legend>
        <textarea
          value={form.copyright}
          rows={2}
          onChange={(e) => {
            setForm((p) => ({ ...p, copyright: e.target.value }));
            resetFeedback();
          }}
          placeholder="© 2026 GE.CO.S. S.r.l. - P.IVA …"
          className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
        />
      </fieldset>

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

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent disabled:opacity-50"
        >
          {loading ? "SALVATAGGIO…" : "SALVA MODIFICHE"}
        </button>
      </div>
    </form>
  );
}
