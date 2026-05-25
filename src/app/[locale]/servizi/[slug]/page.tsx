import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Occhiello from "@/components/Occhiello";
import BoxAiuto from "@/components/BoxAiuto";
import Partner from "@/components/Partner";

const SERVIZIO_SLUGS = [
  "manutenzione-aree-verdi",
  "gestione-aree-boschive",
  "arredo-urbano",
  "servizi-cimiteriali",
];

export function generateStaticParams() {
  return SERVIZIO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("servizi");
  const index = SERVIZIO_SLUGS.indexOf(slug);
  if (index === -1) return { title: "Servizio" };
  const key = `servizio${index + 1}` as "servizio1";
  return {
    title: t(`${key}.title`),
    description: t(`${key}.subtitle`),
  };
}

export default async function ServizioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = SERVIZIO_SLUGS.indexOf(slug);
  if (index === -1) notFound();

  const n = index + 1;
  const t = await getTranslations("servizi");
  const th = await getTranslations("home");
  const tp = await getTranslations("home.partner");

  const key = `servizio${n}` as "servizio1" | "servizio2" | "servizio3" | "servizio4";

  const altriServizi = [1, 2, 3, 4]
    .filter((x) => x !== n)
    .slice(0, 2)
    .map((x) => {
      const k = `servizio${x}` as "servizio1";
      return {
        x,
        label: t(`${k}.label`),
        title: t(`${k}.title`),
        href: `/it/servizi/${t(`${k}.slug`)}`,
      };
    });

  return (
    <>
      <Header />
      <main>
        {/* ── Hero card ── */}
        <section className="relative h-[315px] overflow-hidden">
          <Image
            src={`/assets/photos/servizio-${n}.jpg`}
            alt={t(`${key}.title`)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="absolute inset-0 flex flex-col justify-end pb-10 container-boxed">
            <Occhiello label={t(`${key}.label`)} className="mb-4" />
            <h1 className="text-3xl md:text-[40px] font-bold text-white leading-tight">
              {t(`${key}.title`)}
            </h1>
          </div>
        </section>

        {/* ── Contenuto servizio ── */}
        <section className="py-16 bg-white">
          <div className="container-boxed">
            <div className="max-w-3xl">
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                {t(`${key}.subtitle`)}
              </h2>
              <p className="text-[15px] font-bold text-primary leading-relaxed mt-6">
                {t(`${key}.detail1Title`)}
              </p>
              <p className="text-[14px] text-primary/80 leading-relaxed mt-2">
                {t(`${key}.detail1Text`)}
              </p>
              <p className="text-[15px] font-bold text-primary leading-relaxed mt-6">
                {t(`${key}.detail2Title`)}
              </p>
              <p className="text-[14px] text-primary/80 leading-relaxed mt-2">
                {t(`${key}.detail2Text`)}
              </p>
            </div>

            {/* Photo */}
            <div className="mt-12 relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src={`/assets/photos/servizio-hero-${n}.jpg`}
                alt={t(`${key}.title`)}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1152px"
              />
            </div>

            {/* Altri servizi */}
            {altriServizi.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8">
                  {t("scopriDiPiu")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {altriServizi.map(({ x, label, title, href }) => (
                    <Link
                      key={x}
                      href={href}
                      className="relative aspect-[571/315] overflow-hidden block group"
                    >
                      <Image
                        src={`/assets/photos/servizio-${x}.jpg`}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 571px"
                      />
                      <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/70 transition-colors" />
                      <div className="absolute inset-0 flex flex-col justify-end p-[30px]">
                        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.15em]">
                          {label}
                        </span>
                        <span className="text-white text-2xl md:text-[28px] font-bold mt-2 leading-tight">
                          {title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
