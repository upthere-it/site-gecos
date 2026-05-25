"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contatti.form");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
    bisogno: "",
    messaggio: "",
    privacy: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/it/conferma");
  };

  const options = (t.raw("bisognoOptions") as string[]) ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t("nome")}
          required
          value={formData.nome}
          onChange={(e) => setFormData((p) => ({ ...p, nome: e.target.value }))}
          className="border border-gray-300 px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary"
        />
        <input
          type="email"
          placeholder={t("email")}
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
          className="border border-gray-300 px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary"
        />
        <input
          type="tel"
          placeholder={t("telefono")}
          required
          value={formData.telefono}
          onChange={(e) =>
            setFormData((p) => ({ ...p, telefono: e.target.value }))
          }
          className="border border-gray-300 px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary"
        />
        <div className="relative">
          <select
            value={formData.bisogno}
            onChange={(e) =>
              setFormData((p) => ({ ...p, bisogno: e.target.value }))
            }
            className="w-full border border-gray-300 px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary appearance-none bg-white"
          >
            <option value="">{t("bisogno")}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            ∨
          </span>
        </div>
      </div>
      <textarea
        placeholder={t("messaggio")}
        rows={5}
        value={formData.messaggio}
        onChange={(e) =>
          setFormData((p) => ({ ...p, messaggio: e.target.value }))
        }
        className="w-full border border-gray-300 px-4 py-3 text-sm text-primary placeholder:text-gray-400 outline-none focus:border-primary resize-none"
      />
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={formData.privacy}
          onChange={(e) =>
            setFormData((p) => ({ ...p, privacy: e.target.checked }))
          }
          className="mt-0.5 flex-shrink-0"
        />
        <span className="text-xs text-primary/80">{t("privacy")}</span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="btn-accent px-8 py-4 disabled:opacity-60"
      >
        {loading ? "..." : t("invia")}
      </button>
    </form>
  );
}
