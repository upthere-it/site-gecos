import Link from "next/link";

export const dynamic = "force-dynamic";

const CONTENT_API_URL = process.env.CONTENT_API_URL ?? "http://localhost:3001";

const PAGE_LABELS: Array<{ key: string; label: string; description: string }> = [
  { key: "home", label: "Home", description: "Testi della homepage" },
  { key: "chiSiamo", label: "Chi siamo", description: "Pagina chi siamo" },
  { key: "servizi", label: "Servizi", description: "Testi della sezione servizi (non i singoli servizi)" },
  { key: "certificazioni", label: "Certificazioni", description: "Pagina certificazioni" },
  { key: "faqs", label: "FAQ", description: "Pagina FAQ e domande" },
  { key: "contatti", label: "Contatti", description: "Pagina contatti" },
  { key: "conferma", label: "Conferma invio form", description: "Pagina di ringraziamento dopo invio form" },
  { key: "nav", label: "Menu navigazione", description: "Voci della top-bar" },
  { key: "footer", label: "Footer", description: "Testi del footer" },
];

async function getMessages(): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(`${CONTENT_API_URL}/api/v1/messages/it`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export default async function AdminContentPage() {
  const messages = await getMessages();
  const available = new Set(Object.keys(messages));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Contenuti Pagine</h1>
        <p className="text-sm text-gray-500 mt-1">
          Modifica i testi delle pagine pubbliche del sito.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {PAGE_LABELS.map((p) => {
          const exists = available.has(p.key);
          return (
            <div
              key={p.key}
              className="bg-white border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <h2 className="text-base font-bold text-primary">{p.label}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                <p className="text-xs font-mono text-gray-400 mt-1">{p.key}</p>
              </div>
              {exists ? (
                <Link
                  href={`/admin/content/${p.key}`}
                  className="text-xs font-bold text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                >
                  MODIFICA →
                </Link>
              ) : (
                <span className="text-xs text-gray-400 italic">non disponibile</span>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(messages).length === 0 && (
        <p className="mt-8 text-sm text-error border border-error/30 bg-error/5 px-4 py-3 max-w-4xl">
          Impossibile contattare il backend dei contenuti ({CONTENT_API_URL}). Verifica che sia in esecuzione.
        </p>
      )}
    </div>
  );
}
