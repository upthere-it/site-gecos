import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkAdminAuth } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "assets", "photos");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** Controlla i magic bytes del buffer per verificare che sia davvero un'immagine */
function hasValidImageSignature(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return true;
  return false;
}

function sanitizeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "upload";
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Form data non valida" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
  }

  // Dimensione
  if (file.size === 0) {
    return NextResponse.json({ error: "Il file è vuoto" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File troppo grande. Massimo 5 MB." }, { status: 400 });
  }

  // Estensione
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Estensione non consentita. Usa JPG, PNG, WebP o GIF." },
      { status: 400 }
    );
  }

  // MIME dichiarato dal browser
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo MIME non consentito." },
      { status: 400 }
    );
  }

  // Leggi i byte e verifica firma reale
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!hasValidImageSignature(buffer)) {
    return NextResponse.json(
      { error: "Il file non è un'immagine valida." },
      { status: 400 }
    );
  }

  const filename = sanitizeFilename(file.name);

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/assets/photos/${filename}` });
}
