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

  const inputClass =
    "w-full border border-gray-200 bg-white px-4 py-[14px] text-[15px] text-primary placeholder:text-gray-400 outline-none focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t("nome")}
          required
          value={formData.nome}
          onChange={(e) => setFormData((p) => ({ ...p, nome: e.target.value }))}
          className={inputClass}
        />
        <input
          type="email"
          placeholder={t("email")}
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
          className={inputClass}
        />
        <input
          type="tel"
          placeholder={t("telefono")}
          required
          value={formData.telefono}
          onChange={(e) =>
            setFormData((p) => ({ ...p, telefono: e.target.value }))
          }
          className={inputClass}
        />
        <div className="relative">
          <select
            value={formData.bisogno}
            onChange={(e) =>
              setFormData((p) => ({ ...p, bisogno: e.target.value }))
            }
            className={`${inputClass} appearance-none pr-10 ${
              formData.bisogno === "" ? "text-gray-400" : "text-primary"
            }`}
          >
            <option value="" disabled>
              {t("bisogno")}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-primary">
                {opt}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-[22px] leading-none"
            aria-hidden="true"
          >
            expand_more
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
        className={`${inputClass} resize-none`}
      />
      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          required
          checked={formData.privacy}
          onChange={(e) =>
            setFormData((p) => ({ ...p, privacy: e.target.checked }))
          }
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary border border-gray-300"
        />
        <span className="text-[12px] md:text-[13px] text-primary/80 leading-relaxed">
          {t("privacy")}
        </span>
      </label>
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent px-10 py-4 text-[15px] disabled:opacity-60"
        >
          {loading ? "..." : t("invia")}
        </button>
      </div>
    </form>
  );
}
