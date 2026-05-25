import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "src/data/site-content.json");

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
}

function writeContent(data: unknown) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return !!secret && secret === process.env.ADMIN_SECRET;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { pageKey } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const content = readContent();
  const pages = content.pages as Record<string, { seo: unknown }>;

  if (!pages[pageKey]) {
    return NextResponse.json({ error: `Pagina "${pageKey}" non trovata` }, { status: 404 });
  }

  pages[pageKey].seo = {
    ...((pages[pageKey].seo as Record<string, unknown>) ?? {}),
    ...body,
  };

  writeContent(content);

  return NextResponse.json(pages[pageKey].seo);
}
