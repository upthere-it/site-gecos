import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Occhiello from "@/components/Occhiello";
import BoxDati from "@/components/BoxDati";
import BoxAiuto from "@/components/BoxAiuto";
import Partner from "@/components/Partner";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "GE.CO.S. S.r.l. – oltre 20 anni di esperienza nella gestione e manutenzione del verde urbano e rurale a Pomezia (RM).",
};

export default async function ChiSiamoPage() {
  const t = await getTranslations("chiSiamo");
  const th = await getTranslations("home");
  const tf = await getTranslations("faqs");
  const tp = await getTranslations("home.partner");

  const faqItems = (tf.raw("items") as { question: string; answer: string }[]).slice(0, 3);

  const stats: [
    { value: string; label: string; variant: "dark" },
    { value: string; label: string; variant: "dark" },
    { value: string; label: string; variant: "dark" },
  ] = [
    { value: t("numeri.n1"), label: t("numeri.label1"), variant: "dark" },
    { value: t("numeri.n2"), label: t("numeri.label2"), variant: "dark" },
    { value: t("numeri.n3"), label: t("numeri.label3"), variant: "dark" },
  ];

  const dropdownItems = [
    { question: t("dropdown1Title"), answer: t("dropdown1Text") },
    { question: t("dropdown2Title"), answer: t("dropdown2Text") },
    { question: t("dropdown3Title"), answer: t("dropdown3Text") },
  ];

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative h-[469px] overflow-hidden">
          <Image
            src="/assets/photos/chi-siamo.jpg"
            alt="Chi siamo GE.CO.S."
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="absolute inset-0 flex flex-col justify-end pb-12 container-boxed">
            <Occhiello label={t("hero.occhiello")} className="mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {t("hero.title")}{" "}
              <span className="text-accent">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-3 text-base text-white/80 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className={`block h-0.5 w-6 ${i === 0 ? "bg-accent" : "bg-accent/40"}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Contenuto principale ── */}
        <section className="py-16 bg-white">
          <div className="container-boxed">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {t("sezione1.title")}
            </h2>
            <p className="mt-3 text-base text-primary/80 max-w-3xl">
              {t("sezione1.subtitle")}
            </p>

            <div className="mt-8">
              <h3 className="text-lg md:text-xl font-bold text-primary">
                {t("sezione1.bodyTitle")}
              </h3>
              <p className="mt-2 text-sm md:text-base text-primary/80 max-w-3xl">
                {t("sezione1.bodyText")}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8">
              <BoxDati stats={stats} />
            </div>

            {/* Photo */}
            <div className="mt-6 relative w-full aspect-[1152/479] overflow-hidden bg-gray-100">
              <Image
                src="/assets/photos/chi-siamo.jpg"
                alt="Il team GE.CO.S. al lavoro"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1152px"
              />
            </div>

            {/* Dropdown / Valori */}
            <div className="mt-12">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">
                {t("dropdownTitle")}
              </h3>
              <FaqAccordion items={dropdownItems} />
            </div>
          </div>
        </section>

        {/* ── Box Aiuto ── */}
        <BoxAiuto
          title={th("boxAiuto.title")}
          subtitle={th("boxAiuto.subtitle")}
          cta={th("boxAiuto.cta")}
        />

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
