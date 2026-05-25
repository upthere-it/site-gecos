import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GE.CO.S. S.r.l. – Gestione Costruzioni Servizi",
    template: "%s | GE.CO.S. S.r.l.",
  },
  description:
    "GE.CO.S. S.r.l. – Gestione e manutenzione del verde urbano e rurale a Pomezia (RM). Certificata ISO 9001, EMAS e UNI/PDR 125:2022.",
  metadataBase: new URL("https://gecospomezia.it"),
  openGraph: {
    title: "GE.CO.S. S.r.l. – Gestione Costruzioni Servizi",
    description:
      "Gestione e manutenzione del verde urbano e rurale. Qualità certificata e oltre 20 anni di esperienza.",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/assets/photos/hero-bg.jpg",
        width: 1440,
        height: 717,
        alt: "GE.CO.S. S.r.l. – Gestione e manutenzione del verde",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GE.CO.S. S.r.l.",
  alternateName: "Gestione Costruzioni Servizi",
  url: "https://gecospomezia.it",
  logo: "https://gecospomezia.it/assets/logo-gecos.png",
  image: "https://gecospomezia.it/assets/photos/hero-bg.jpg",
  description:
    "GE.CO.S. S.r.l. – Gestione e manutenzione del verde urbano e rurale a Pomezia (RM). Certificata ISO 9001, EMAS e UNI/PDR 125:2022.",
  telephone: "+390691071421",
  email: "info@gecospomezia.it",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Monte d'Oro n. 30",
    postalCode: "00071",
    addressLocality: "Pomezia",
    addressRegion: "RM",
    addressCountry: "IT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.6727,
    longitude: 12.5002,
  },
  sameAs: [
    "https://www.instagram.com",
    "https://www.facebook.com",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "it")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
