import Link from "next/link";
import { notFound } from "next/navigation";
import ContentEditor from "../_components/ContentEditor";

export const dynamic = "force-dynamic";

const CONTENT_API_URL = process.env.CONTENT_API_URL ?? "http://localhost:3001";

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  chiSiamo: "Chi siamo",
  servizi: "Servizi",
  certificazioni: "Certificazioni",
  faqs: "FAQ",
  contatti: "Contatti",
  conferma: "Conferma invio form",
  nav: "Menu navigazione",
  footer: "Footer",
};

async function getMessages(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${CONTENT_API_URL}/api/v1/messages/it`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const messages = await getMessages();

  if (!messages) {
    return (
      <div className="p-8">
        <p className="text-sm text-error border border-error/30 bg-error/5 px-4 py-3 max-w-3xl">
          Impossibile contattare il backend dei contenuti ({CONTENT_API_URL}).
        </p>
      </div>
    );
  }

  const data = messages[page];
  if (data === undefined) {
    notFound();
  }

  const label = PAGE_LABELS[page] ?? page;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/content"
          className="text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-wide"
        >
          ← Torna ai contenuti
        </Link>
      </div>
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-primary">{label}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pagina <span className="font-mono">{page}</span>. Modifica i testi e premi Salva.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <ContentEditor pageKey={page} initialData={data} />
      </div>
    </div>
  );
}
