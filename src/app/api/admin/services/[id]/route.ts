import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import { localUpdateService, localDeleteService } from "@/lib/local-data";
import type { ServiceItem } from "@/lib/content-api";

const CONTENT_API_URL = process.env.CONTENT_API_URL;

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function revalidateServices(id?: string) {
  revalidatePath("/admin/services");
  revalidatePath("/it/servizi");
  if (id) revalidatePath(`/it/servizi/${id}`);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  if (CONTENT_API_URL) {
    const adminSecret = process.env.ADMIN_SECRET;
    try {
      const upstream = await fetch(
        `${CONTENT_API_URL}/api/v1/services/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminSecret}`,
          },
          body: JSON.stringify(body),
        }
      );
      const text = await upstream.text();
      const data = text ? safeJson(text) : null;
      if (upstream.ok) {
        revalidateServices(id);
        return NextResponse.json(data ?? { ok: true });
      }
      return NextResponse.json(
        data ?? { error: `Backend ha risposto ${upstream.status}` },
        { status: upstream.status }
      );
    } catch {
      // Backend non raggiungibile → fallback locale
    }
  }

  try {
    await localUpdateService(id, body as Partial<ServiceItem>);
    revalidateServices(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore durante l'aggiornamento" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  if (CONTENT_API_URL) {
    const adminSecret = process.env.ADMIN_SECRET;
    try {
      const upstream = await fetch(
        `${CONTENT_API_URL}/api/v1/services/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminSecret}` },
        }
      );
      const text = await upstream.text();
      const data = text ? safeJson(text) : null;
      if (upstream.ok) {
        revalidateServices(id);
        return NextResponse.json(data ?? { ok: true });
      }
      return NextResponse.json(
        data ?? { error: `Backend ha risposto ${upstream.status}` },
        { status: upstream.status }
      );
    } catch {
      // Backend non raggiungibile → fallback locale
    }
  }

  try {
    await localDeleteService(id);
    revalidateServices(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Servizio non trovato" },
      { status: 404 }
    );
  }
}
