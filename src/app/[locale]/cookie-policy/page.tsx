import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy di GE.CO.S. S.r.l. – informazioni sull'utilizzo dei cookie e gestione del consenso tramite CookieFirst.",
  robots: "noindex,nofollow",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="max-w-[1140px] mx-auto px-6 py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
          Cookie Policy
        </h1>

        <div className="prose prose-green max-w-none space-y-6 text-primary/80 text-sm md:text-base leading-relaxed">
          <p className="font-semibold">Consenso all&apos;utilizzo di cookies.</p>

          <p>
            Per il corretto funzionamento del nostro sito web utilizziamo
            cookies. Per ottenere il vostro valido consenso all&apos;utilizzo e
            alla memorizzazione di cookies nel browser che utilizzate per
            accedere al nostro sito web e per documentarlo correttamente,
            utilizziamo una piattaforma di gestione del consenso: CookieFirst.
            Questa tecnologia è fornita da Digital Data Solutions BV, Plantage
            Middenlaan 42a, 1018 DH, Amsterdam, Paesi Bassi. Sito web:{" "}
            <a
              href="https://cookiefirst.com"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://cookiefirst.com
            </a>{" "}
            indicato come CookieFirst.
          </p>

          <p>
            Quando si accede al nostro sito web, viene stabilita una connessione
            con il server di CookieFirst per darci la possibilità di ottenere un
            consenso valido da parte dell&apos;utente all&apos;uso di determinati
            cookies. CookieFirst memorizza quindi un cookie nel browser
            dell&apos;utente per poter attivare solo quei cookies a cui
            l&apos;utente ha dato il proprio consenso e per poterlo documentare
            adeguatamente. I dati elaborati vengono memorizzati fino alla
            scadenza del periodo di conservazione predefinito o fino alla
            richiesta di cancellazione dei dati da parte dell&apos;utente. In
            deroga a quanto sopra, possono essere applicati alcuni periodi di
            conservazione obbligatori per legge.
          </p>

          <p>
            CookieFirst viene utilizzato per ottenere il consenso legalmente
            richiesto per l&apos;utilizzo di cookies. La base giuridica è
            l&apos;articolo 6, paragrafo 1, lettera c), del Regolamento generale
            sulla protezione dei dati (GDPR).
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            Accordo sul trattamento dei dati
          </h2>

          <p>
            Abbiamo stipulato un accordo per l&apos;elaborazione dei dati con
            CookieFirst. Si tratta di un contratto richiesto dalla legge sulla
            protezione dei dati, che garantisce che i dati dei visitatori del
            nostro sito web vengano elaborati solo in conformità alle nostre
            istruzioni e nel rispetto del GDPR.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">
            File di log del server
          </h2>

          <p>
            Il nostro sito web e CookieFirst raccolgono e memorizzano
            automaticamente informazioni nei cosiddetti file di log del server,
            che il vostro browser ci trasmette automaticamente. Vengono
            raccolti i seguenti dati:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Lo stato del vostro consenso o la revoca del consenso</li>
            <li>Il vostro indirizzo IP anonimo</li>
            <li>Informazioni sul vostro browser</li>
            <li>Informazioni sul vostro dispositivo</li>
            <li>
              La data e l&apos;ora in cui avete visitato il nostro sito web
            </li>
            <li>
              L&apos;url della pagina web in cui l&apos;utente ha salvato o
              aggiornato le preferenze di consenso
            </li>
            <li>
              La posizione approssimativa dell&apos;utente che ha salvato le
              preferenze di consenso
            </li>
            <li>
              Un identificatore univoco universale (UUID) del visitatore del
              sito web che ha cliccato sul banner cookie
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
