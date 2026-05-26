import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { checkAdminAuth } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "assets", "photos");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const entries = await readdir(UPLOAD_DIR);
    const images = entries.filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));

    const files = await Promise.all(
      images.map(async (name) => {
        const info = await stat(path.join(UPLOAD_DIR, name));
        return {
          name,
          url: `/assets/photos/${name}`,
          size: info.size,
          lastModified: info.mtime.toISOString(),
        };
      })
    );

    files.sort((a, b) => b.lastModified.localeCompare(a.lastModified));

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
