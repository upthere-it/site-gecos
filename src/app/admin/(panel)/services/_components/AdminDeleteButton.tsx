"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  serviceId: string;
  serviceName: string;
}

export default function AdminDeleteButton({ serviceId, serviceName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Eliminare il servizio "${serviceName}"? L'operazione non è reversibile.`)) {
      return;
    }

    setLoading(true);
    try {
      // Il cookie admin_token è httpOnly → non leggibile da JS.
      // Il browser lo invia automaticamente con credentials: "same-origin".
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Errore durante l'eliminazione");
      }
    } catch {
      alert("Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold text-error border border-error px-3 py-1.5 hover:bg-error hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "ELIMINA"}
    </button>
  );
}
