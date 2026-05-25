import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Occhiello from "@/components/Occhiello";
import SectionTitle from "@/components/SectionTitle";
import CardServizi from "@/components/CardServizi";
import BoxAiuto from "@/components/BoxAiuto";
import FaqAccordion from "@/components/FaqAccordion";
import Partner from "@/components/Partner";

export const metadata: Metadata = {
  title: "Servizi",
  description:
    "Scopri i servizi di manutenzione del verde, gestione boschiva, arredo urbano e servizi cimiteriali di GE.CO.S. S.r.l.",
};

export default async function ServiziPage() {
  const t = await getTranslations("servizi");
  const th = await getTranslations("home");
  const tf = await getTranslations("faqs");
  const tp = await getTranslations("home.partner");

  const faqItems = (tf.raw("items") as { question: string; answer: string }[]).slice(0, 3);

  const serviziCards = [1, 2, 3, 4].map((n) => {
    const key = `servizio${n}` as "servizio1" | "servizio2" | "servizio3" | "servizio4";
    return {
      n,
      imageSrc: `/assets/photos/servizio-${n}.jpg`,
      imageAlt: t(`${key}.title`),
      label: t(`${key}.label`),
      title: t(`${key}.title`),
      subtitle: t(`${key}.subtitle`),
      detail1Title: t(`${key}.detail1Title`),
      detail1Text: t(`${key}.detail1Text`),
      detail2Title: t(`${key}.detail2Title`),
      detail2Text: t(`${key}.detail2Text`),
      linkHref: `/it/servizi/${t(`${key}.slug`)}`,
      linkText: t("scopriDiPiu"),
    };
  });

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative h-[469px] overflow-hidden">
          <Image
            src="/assets/photos/servizio-1.jpg"
            alt="Servizi GE.CO.S."
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

        {/* ── Lista servizi ── */}
        <section className="py-16 bg-white">
          <div className="container-boxed">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {t("title")}
              </h2>
              <p className="mt-2 text-base text-primary/80 max-w-3xl">
                {t("subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviziCards.map((card) => (
                <CardServizi
                  key={card.n}
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  label={card.label}
                  title={card.title}
                  subtitle={card.subtitle}
                  detail1Title={card.detail1Title}
                  detail1Text={card.detail1Text}
                  detail2Title={card.detail2Title}
                  detail2Text={card.detail2Text}
                  linkHref={card.linkHref}
                  linkText={card.linkText}
                />
              ))}
            </div>
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
