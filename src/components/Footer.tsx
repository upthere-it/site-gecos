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
    <footer className="bg-white pt-12">
      <div className="container-boxed">
        {/* Top row: logo + divider + tagline */}
        <div className="flex items-center gap-6 mb-12">
          <Image
            src="/assets/logo-gecos.png"
            alt="GE.CO.S. S.r.l."
            width={171}
            height={54}
            className="h-[54px] w-[171px]"
          />
          <div className="w-px h-[42px] bg-[#D9D9D9]" />
          <span className="text-base text-primary font-normal">
            {t("tagline")}
          </span>
        </div>

        {/* Main grid: addresses+social | emails | phone + whistleblowing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Col 1: addresses + social */}
          <div>
            <div className="mb-5">
              <p className="font-bold text-sm text-primary leading-6">
                {t("sedeOperativa")}
              </p>
              <p className="text-sm text-primary leading-6">
                Via Monte d&apos;Oro n. 30 - Cap 00071
                <br />
                Pomezia (RM)
              </p>
            </div>
            <div className="mb-6">
              <p className="font-bold text-sm text-primary leading-6">
                {t("sedeLegale")}
              </p>
              <p className="text-sm text-primary leading-6">
                Via Anchise n. 9 - Cap 00071
                <br />
                Pomezia (RM)
              </p>
            </div>
            <div>
              <p className="font-bold text-sm text-primary mb-3 leading-6">
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

          {/* Col 2: emails */}
          <div>
            <p className="font-bold text-sm text-primary mb-4 tracking-[0.04em] leading-6">
              {t("email")}
            </p>
            <ul className="space-y-3">
              {EMAILS.map((email) => (
                <li key={email} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    mail
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-primary underline hover:no-underline leading-6"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: phone + whistleblowing */}
          <div>
            <p className="font-bold text-sm text-primary mb-4 tracking-[0.04em] leading-6">
              {t("telefono")}
            </p>
            <ul className="space-y-3 mb-8">
              {PHONES.map((phone) => (
                <li key={phone} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    call
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="text-sm text-primary underline hover:no-underline leading-6"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-[#C99700]">
                  info
                </span>
                <span className="font-bold text-sm text-[#C99700] uppercase tracking-[0.04em] leading-6">
                  {t("whistleblowing")}
                </span>
              </div>
              <a
                href="#"
                className="text-sm text-primary underline hover:no-underline leading-6"
              >
                {t("scaricaModulo")}
              </a>
            </div>
          </div>
        </div>

        {/* Nav links row */}
        <nav className="py-6">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-3">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-sm font-bold uppercase text-primary underline hover:no-underline tracking-[0.04em]"
                >
                  {tn(key as "home")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E5E5] py-5 mt-8">
        <div className="container-boxed flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-xs text-primary">{t("copyright")}</p>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/it/privacy-policy"
              className="text-primary underline hover:no-underline"
            >
              {t("privacyPolicy")}
            </Link>
            <span className="text-[#D9D9D9]">|</span>
            <Link
              href="#"
              className="text-primary underline hover:no-underline"
            >
              {t("whistleblowingLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
