import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import { writeLocalCompany } from "@/lib/local-data";
import type { CompanyData } from "@/lib/content-api";

const CONTENT_API_URL = process.env.CONTENT_API_URL;

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  if (CONTENT_API_URL) {
    const adminSecret = process.env.ADMIN_SECRET;
    try {
      const upstream = await fetch(`${CONTENT_API_URL}/api/v1/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(body),
      });
      const text = await upstream.text();
      const data = text ? safeJson(text) : null;
      if (upstream.ok) {
        revalidatePath("/admin/company");
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
    await writeLocalCompany(body as CompanyData);
    revalidatePath("/admin/company");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore durante il salvataggio" },
      { status: 500 }
    );
  }
}
