import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const NAV_ITEMS = [
  { href: "/admin/services", label: "Servizi" },
  { href: "/admin/seo", label: "SEO Pagine" },
];

async function checkAdminAuth(): Promise<boolean> {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === adminSecret;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await checkAdminAuth();

  // Redirect to login se non autenticato (ma non loopare sulla pagina di login stessa)
  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <html lang="it" className={inter.variable}>
      <head>
        <title>Admin | GE.CO.S.</title>
      </head>
      <body className="bg-gray-50 text-primary">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 bg-primary text-white flex flex-col">
            <div className="px-5 py-6 border-b border-primary-800">
              <span className="block text-xs font-bold tracking-widest text-secondary uppercase mb-1">
                ADMIN PANEL
              </span>
              <span className="block text-lg font-bold text-white leading-tight">
                GE.CO.S.
              </span>
            </div>

            <nav className="flex-1 py-4">
              <ul className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center px-5 py-3 text-sm font-medium text-white/80 hover:bg-primary-800 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="px-5 py-4 border-t border-primary-800">
              <Link
                href="/"
                className="block text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                ← Vai al sito
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
