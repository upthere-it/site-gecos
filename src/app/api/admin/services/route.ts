import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import { localCreateService } from "@/lib/local-data";
import type { ServiceItem } from "@/lib/content-api";

const CONTENT_API_URL = process.env.CONTENT_API_URL;

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function revalidateServices() {
  revalidatePath("/admin/services");
  revalidatePath("/it/servizi");
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.id || !body.slug || !body.title) {
    return NextResponse.json(
      { error: "Campi obbligatori mancanti: id, slug, title" },
      { status: 400 }
    );
  }

  // Prova backend se configurato
  if (CONTENT_API_URL) {
    const adminSecret = process.env.ADMIN_SECRET;
    try {
      const upstream = await fetch(`${CONTENT_API_URL}/api/v1/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(body),
      });
      const text = await upstream.text();
      const data = text ? safeJson(text) : null;
      if (upstream.ok) {
        revalidateServices();
        return NextResponse.json(data ?? { ok: true }, { status: 201 });
      }
      // Backend ha risposto con errore (es. ID duplicato) — non fare fallback locale
      return NextResponse.json(
        data ?? { error: `Backend ha risposto ${upstream.status}` },
        { status: upstream.status }
      );
    } catch {
      // Backend non raggiungibile → fallback locale
    }
  }

  // Fallback locale
  try {
    await localCreateService(body as ServiceItem);
    revalidateServices();
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore durante la creazione" },
      { status: 400 }
    );
  }
}
