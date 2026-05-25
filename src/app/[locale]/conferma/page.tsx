import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Partner from "@/components/Partner";

export const metadata: Metadata = {
  title: "Richiesta inviata",
  robots: { index: false },
};

export default async function ConfermaPage() {
  const t = await getTranslations("conferma");
  const tp = await getTranslations("home.partner");

  return (
    <>
      <Header />
      <main>
        <section className="py-24 bg-white">
          <div className="container-boxed">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {t("title")}
            </h1>
            <div className="mt-6 max-w-2xl space-y-4">
              <p className="text-base text-primary/80">{t("text1")}</p>
              <p className="text-sm text-primary/70">{t("text2")}</p>
            </div>
            <div className="mt-8">
              <Link href="/it" className="btn-outline px-8 py-4">
                {t("cta")}
              </Link>
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
