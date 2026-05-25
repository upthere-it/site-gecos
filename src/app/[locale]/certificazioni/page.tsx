import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Occhiello from "@/components/Occhiello";
import SectionTitle from "@/components/SectionTitle";
import BoxAiuto from "@/components/BoxAiuto";
import FaqAccordion from "@/components/FaqAccordion";
import Partner from "@/components/Partner";

export const metadata: Metadata = {
  title: "Certificazioni",
  description:
    "GE.CO.S. S.r.l. – certificata ISO 9001:2015, EMAS e UNI/PDR 125:2022. Qualità, sostenibilità e parità di genere.",
};

export default async function CertificazioniPage() {
  const t = await getTranslations("certificazioni");
  const th = await getTranslations("home");
  const tf = await getTranslations("faqs");
  const tp = await getTranslations("home.partner");

  const faqItems = (tf.raw("items") as { question: string; answer: string }[]).slice(0, 3);

  const certs = [
    {
      n: 1,
      label: t("cert1.label"),
      title: t("cert1.title"),
      text: t("cert1.text"),
      body: t("cert1.body"),
    },
    {
      n: 2,
      label: t("cert2.label"),
      title: t("cert2.title"),
      text: t("cert2.text"),
      body: t("cert2.body"),
    },
    {
      n: 3,
      label: t("cert3.label"),
      title: t("cert3.title"),
      text: t("cert3.text"),
      body: t("cert3.body"),
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative h-[469px] overflow-hidden">
          <Image
            src="/assets/photos/chi-siamo.jpg"
            alt="Certificazioni GE.CO.S."
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
          </div>
        </section>

        {/* ── Certificazioni ── */}
        <section className="py-16 bg-white">
          <div className="container-boxed space-y-16">
            {certs.map(({ n, label, title, text, body }) => (
              <div
                key={n}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={`/assets/certs/cert-${n}.jpg`}
                    alt={`Certificazione ${title}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 576px"
                  />
                </div>
                <div>
                  <Occhiello label={label} className="mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2">
                    {title}
                  </h2>
                  <p className="mt-4 text-sm md:text-base text-primary/80 leading-relaxed">
                    {text}
                  </p>
                  <p className="mt-4 text-sm text-primary/70 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Box Aiuto ── */}
        <BoxAiuto
          title={th("boxAiuto.title")}
          subtitle={th("boxAiuto.subtitle")}
          cta={th("boxAiuto.cta")}
        />

        {/* ── FAQ Sezione ── */}
        <section className="py-16 bg-white">
          <div className="container-boxed">
            <SectionTitle
              occhiello={th("faqs.occhiello")}
              title={th("faqs.title")}
              subtitle={th("faqs.subtitle")}
              centered
            />
            <div className="mt-10 max-w-3xl mx-auto">
              <FaqAccordion items={faqItems} />
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
