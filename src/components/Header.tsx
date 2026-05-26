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
              className="h-[54px] w-[171px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-[60px] xl:gap-[97px]">
            <ul className="flex items-center gap-[28px] xl:gap-[40px]">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={`text-base leading-6 text-primary transition-opacity hover:opacity-70 ${
                      isActive(href) ? "font-bold" : "font-medium"
                    }`}
                  >
                    {t(key as "home")}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="tel:069107142"
              className="group btn-accent no-btn-icon min-w-[165px] h-[52px]"
            >
              <span className="group-hover:hidden">{t("chiama")}</span>
              <span className="hidden group-hover:inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base leading-none">call</span>
                <span className="text-xs font-bold tracking-[0.04em]">06 910 7142</span>
              </span>
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
        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col lg:hidden">
          <div className="flex items-center justify-between bg-white px-5 h-[64px] flex-shrink-0">
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
              className="text-primary leading-none p-2 -mr-2"
              aria-label="Chiudi menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul>
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key} className="border-b border-gray-100">
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-[18px] text-base font-bold uppercase text-primary tracking-[0.04em]"
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
