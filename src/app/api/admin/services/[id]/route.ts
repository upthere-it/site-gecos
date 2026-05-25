import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdminAuth } from "@/lib/admin-auth";

const CONTENT_PATH = path.join(process.cwd(), "src/data/site-content.json");

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
}

function writeContent(data: unknown) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
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

  const content = readContent();
  const index = content.services.findIndex((s: { id: string }) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: `Servizio "${id}" non trovato` }, { status: 404 });
  }

  content.services[index] = {
    ...content.services[index],
    ...body,
    id, // id non modificabile
  };

  content.services.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
  writeContent(content);

  return NextResponse.json(content.services.find((s: { id: string }) => s.id === id));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const content = readContent();
  const index = content.services.findIndex((s: { id: string }) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: `Servizio "${id}" non trovato` }, { status: 404 });
  }

  const [removed] = content.services.splice(index, 1);
  writeContent(content);

  return NextResponse.json({ deleted: removed });
}
