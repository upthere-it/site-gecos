"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { key: "home", href: "/it" },
  { key: "chiSiamo", href: "/it/chi-siamo" },
  { key: "servizi", href: "/it/servizi" },
  { key: "certificazioni", href: "/it/certificazioni" },
  { key: "faqs", href: "/it/faqs" },
  { key: "contatti", href: "/it/contatti" },
];

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/it") return pathname === "/it" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container-boxed flex items-center justify-between h-[134px]">
          {/* Logo */}
          <Link href="/it" className="flex-shrink-0">
            <Image
              src="/assets/logo-gecos.png"
              alt="GE.CO.S. S.r.l."
              width={171}
              height={54}
              priority
              className="h-[54px] w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            <ul className="flex items-center gap-4 xl:gap-6">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={`text-sm xl:text-base font-medium text-primary transition-opacity hover:opacity-70 ${
                      isActive(href) ? "font-bold" : ""
                    }`}
                  >
                    {t(key as "home")}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="tel:069107142"
              className="btn-accent px-5 py-3 text-sm font-bold"
            >
              {t("chiama")}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Apri menu"
          >
            <span className="block w-6 h-0.5 bg-primary" />
            <span className="block w-6 h-0.5 bg-primary" />
            <span className="block w-6 h-0.5 bg-primary" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <Link href="/it" onClick={() => setMenuOpen(false)}>
              <Image
                src="/assets/logo-gecos.png"
                alt="GE.CO.S. S.r.l."
                width={120}
                height={38}
                className="h-[38px] w-auto"
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-primary leading-none"
              aria-label="Chiudi menu"
            >
              ×
            </button>
          </div>
          <nav className="flex-1">
            <ul>
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key} className="border-b border-gray-200">
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-4 text-lg font-bold uppercase text-primary tracking-wide"
                  >
                    {t(key as "home")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
