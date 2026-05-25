import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const NAV_LINKS = [
  { key: "home", href: "/it" },
  { key: "chiSiamo", href: "/it/chi-siamo" },
  { key: "servizi", href: "/it/servizi" },
  { key: "certificazioni", href: "/it/certificazioni" },
  { key: "faqs", href: "/it/faqs" },
  { key: "contatti", href: "/it/contatti" },
];

const EMAILS = [
  "info@gecospomezia.it",
  "ufficiotecnico@gecospomezia.it",
  "amministrazione@gecospomezia.it",
  "sgi@gecospomezia.it",
  "gecos@pec.it",
];

const PHONES = ["069107142", "0691603098"];

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-0">
      <div className="container-boxed">
        {/* Top row: logo + tagline */}
        <div className="flex items-center gap-6 mb-10">
          <Image
            src="/assets/logo-gecos.png"
            alt="GE.CO.S. S.r.l."
            width={171}
            height={54}
            className="h-[54px] w-auto"
          />
          <div className="w-px h-10 bg-gray-300" />
          <span className="text-base text-primary font-medium">
            {t("tagline")}
          </span>
        </div>

        {/* Main grid: addresses | emails | phone + whistleblowing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Addresses + social */}
          <div className="space-y-5">
            <div>
              <p className="font-bold text-sm text-primary">{t("sedeOperativa")}</p>
              <p className="text-sm text-primary/80 mt-0.5">
                Via Monte d&apos;Oro n. 30 - Cap 00071
                <br />
                Pomezia (RM)
              </p>
            </div>
            <div>
              <p className="font-bold text-sm text-primary">{t("sedeLegale")}</p>
              <p className="text-sm text-primary/80 mt-0.5">
                Via Anchise n. 9 - Cap 00071
                <br />
                Pomezia (RM)
              </p>
            </div>
            <div>
              <p className="font-bold text-sm text-primary mb-2">
                {t("profiliSocial")}
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"
                  aria-label="Instagram"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    photo_camera
                  </span>
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"
                  aria-label="Facebook"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    thumb_up
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Emails */}
          <div>
            <p className="font-bold text-sm text-primary mb-3">{t("email")}</p>
            <ul className="space-y-2">
              {EMAILS.map((email) => (
                <li key={email} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    mail
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-primary underline hover:no-underline"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Phone + whistleblowing */}
          <div className="space-y-6">
            <div>
              <p className="font-bold text-sm text-primary mb-3">
                {t("telefono")}
              </p>
              <ul className="space-y-2">
                {PHONES.map((phone) => (
                  <li key={phone} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      call
                    </span>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm text-primary underline hover:no-underline"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px] text-yellow-600">
                  info
                </span>
                <span className="font-bold text-sm text-yellow-600 uppercase tracking-wider">
                  {t("whistleblowing")}
                </span>
              </div>
              <a
                href="#"
                className="text-sm text-primary underline hover:no-underline"
              >
                {t("scaricaModulo")}
              </a>
            </div>
          </div>
        </div>

        {/* Nav links row */}
        <nav className="border-t border-gray-200 py-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-sm font-bold uppercase text-primary underline hover:no-underline tracking-wider"
                >
                  {tn(key as "home")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4">
        <div className="container-boxed flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-xs text-primary/70">{t("copyright")}</p>
          <div className="flex gap-4">
            <Link
              href="/it/privacy-policy"
              className="text-xs text-primary underline hover:no-underline"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="#"
              className="text-xs text-primary underline hover:no-underline"
            >
              {t("whistleblowingLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
