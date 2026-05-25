import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Occhiello from "@/components/Occhiello";
import Partner from "@/components/Partner";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta GE.CO.S. S.r.l. per informazioni sui nostri servizi o per richiedere un preventivo. Siamo a Pomezia (RM).",
};

const EMAILS = [
  "info@gecospomezia.it",
  "ufficiotecnico@gecospomezia.it",
  "amministrazione@gecospomezia.it",
  "sgi@gecospomezia.it",
  "gecos@pec.it",
];

const PHONES = ["069107142", "0691603098"];

export default async function ContattiPage() {
  const t = await getTranslations("contatti");
  const tp = await getTranslations("home.partner");

  return (
    <>
      <Header />
      <main>
        <section className="pt-12 pb-16 bg-white">
          <div className="container-boxed">
            <Occhiello label={t("occhiello")} className="mb-4" />
            <h1 className="text-3xl md:text-[40px] font-bold text-primary leading-tight mt-2">
              {t("title")}
            </h1>
            <p className="mt-3 text-base md:text-[17px] text-primary/80 max-w-3xl">
              {t("subtitle")}
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16">
              {/* Colonna sinistra: info contatti */}
              <div className="space-y-7">
                <div>
                  <p className="font-bold text-[15px] text-primary">
                    {t("sedeOperativa")}
                  </p>
                  <p className="text-[14px] text-primary/80 mt-1 leading-relaxed">
                    Via Monte d&apos;Oro n. 30 - Cap 00071
                    <br />
                    Pomezia (RM)
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[15px] text-primary">
                    {t("sedeLegale")}
                  </p>
                  <p className="text-[14px] text-primary/80 mt-1 leading-relaxed">
                    Via Anchise n. 9 - Cap 00071
                    <br />
                    Pomezia (RM)
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[15px] text-primary mb-3">
                    {t("profiliSocial")}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                      aria-label="Instagram"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        photo_camera
                      </span>
                    </a>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                      aria-label="Facebook"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        thumb_up
                      </span>
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-[13px] tracking-wider text-primary mb-2">
                    {t("telefono")}
                  </p>
                  <ul className="space-y-2">
                    {PHONES.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          call
                        </span>
                        <a
                          href={`tel:${p}`}
                          className="text-[14px] text-primary underline hover:no-underline"
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-[13px] tracking-wider text-primary mb-2">
                    {t("email")}
                  </p>
                  <ul className="space-y-2">
                    {EMAILS.map((e) => (
                      <li key={e} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          mail
                        </span>
                        <a
                          href={`mailto:${e}`}
                          className="text-[14px] text-primary underline hover:no-underline break-all"
                        >
                          {e}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Colonna destra: form */}
              <div>
                <ContactForm />
              </div>
            </div>

            {/* Mappa */}
            <div className="mt-12 relative w-full aspect-[1152/381] overflow-hidden bg-gray-100">
              <Image
                src="/assets/photos/map-pomezia.jpg"
                alt={t("mapTitle")}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1152px"
              />
            </div>
          </div>
        </section>

        {/* ── Partner ── */}
        <Partner
          occhiello={tp("occhiello")}
          title={tp("title")}
          subtitle={tp("subtitle")}
        />
      </main>
      <Footer />
    </>
  );
}
