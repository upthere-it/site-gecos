import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";

const CONTENT_API_URL = process.env.CONTENT_API_URL ?? "http://localhost:3001";

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET non configurato" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

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

    if (!upstream.ok) {
      return NextResponse.json(
        data ?? { error: `Backend ha risposto ${upstream.status}` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Errore di comunicazione con il backend dei contenuti",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
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

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET non configurato" },
      { status: 500 }
    );
  }

  const { id } = await params;

  try {
    const upstream = await fetch(
      `${CONTENT_API_URL}/api/v1/services/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminSecret}`,
        },
      }
    );

    const text = await upstream.text();
    const data = text ? safeJson(text) : null;

    if (!upstream.ok) {
      return NextResponse.json(
        data ?? { error: `Backend ha risposto ${upstream.status}` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Errore di comunicazione con il backend dei contenuti",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
