import { NextRequest } from "next/server";

/**
 * Verifica che la richiesta sia autenticata come admin.
 * Accetta sia il cookie `admin_token` (impostato al login dal panel)
 * che l'header `x-admin-secret` (per usi programmatici/API).
 */
export function checkAdminAuth(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;

  // Check cookie (panel UI)
  const cookieToken = req.cookies.get("admin_token")?.value;
  if (cookieToken === adminSecret) return true;

  // Check header (API esterna)
  const headerSecret = req.headers.get("x-admin-secret");
  if (headerSecret === adminSecret) return true;

  return false;
}
